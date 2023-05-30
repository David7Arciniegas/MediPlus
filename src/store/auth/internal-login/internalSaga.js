import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { INTERNAL_LOGIN_USER, INTERNAL_LOGOUT_USER, INTERNAL_SOCIAL_LOGIN } from "./internalActionTypes";
import {
  internalApiError,
  loginInternalSuccess,
  logoutInternalSuccess,
} from "./internalActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginInternalUser({ payload: { user, history } }) {
  try {
    let response = null;
    const authMethod = import.meta.env.VITE_APP_DEFAULTAUTH;

    if (authMethod === "firebase") {
      response = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password
      );
      localStorage.setItem("authUser", JSON.stringify(response));
    } else if (authMethod === "jwt") {
      response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
    } else if (authMethod === "fake") {
      response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
    }

    if (response) {
      const { data, role } = response;
      console.log("Role:", role);
      if (
        role === "SuperAdministrator" ||
        role === "Administrator" ||
        role === "Moderator"
      ) {
        yield put(loginInternalSuccess(data, role));
        history("/internal-dashboard");

        // Store the value of 'role' in local storage
        localStorage.setItem("authRole", role);
      } else if (role === "Basic" || role === "Professional") {
        throw new Error(
          "Unauthorized access. User does not have the required role."
        );
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Authorization Error:", error);
    yield put(internalApiError(error));
  }
}

function* logoutInternalUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");

    yield put(logoutInternalSuccess(undefined, undefined));

    history("/internal-dashboard-login");
    console.log("Logout successful");
  } catch (error) {
    yield put(internalApiError(error));
  }
}

function* socialLoginInternal({ payload: { type, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, type);
      if (response) {
      } else {
        // Perform any necessary action if social login fails
      }
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginInternalSuccess(response));
      if (response) {
        history("/internal-dashboard-login");
      }
    }
  } catch (error) {
    yield put(internalApiError(error));
  }
}

function* internalAuthSaga() {
  yield takeEvery(INTERNAL_LOGIN_USER, loginInternalUser);
  yield takeLatest(INTERNAL_SOCIAL_LOGIN, socialLoginInternal);
  yield takeEvery(INTERNAL_LOGOUT_USER, logoutInternalUser);
}

export default internalAuthSaga;
