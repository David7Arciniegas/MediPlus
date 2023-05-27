import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./internalActionTypes";
import { internalApiError, loginInternalSuccess, logoutInternalSuccess } from "./internalActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeLogin, postJwtLogin } from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginInternalUser({ payload: { user, history } }) {
  try {
    let response = null;
    const authMethod = import.meta.env.VITE_APP_DEFAULTAUTH;

    if (authMethod === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = yield call(fireBaseBackend.loginUser, user.email, user.password);
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
      if (role === "SuperAdministrator") {
        yield put(loginInternalSuccess(data, role));
        // Perform any necessary action after successful login

        // Store the value of 'role' in local storage
        localStorage.setItem("authRole", role);
      } else if (role === "Basic") {
        throw new Error("Unauthorized access. User does not have the required role.");
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

    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutInternalSuccess(response));
    }
    // Perform any necessary action after successful logout
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
        // Perform any necessary action after successful social login
      } else {
        // Perform any necessary action if social login fails
      }
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginInternalSuccess(response));
      if (response) {
        // Perform any necessary action after successful login
      }
    }
  } catch (error) {
    yield put(internalApiError(error));
  }
}

function* internalAuthSaga() {
  yield takeEvery(LOGIN_USER, loginInternalUser);
  yield takeLatest(SOCIAL_LOGIN, socialLoginInternal);
  yield takeEvery(LOGOUT_USER, logoutInternalUser);
}

export default internalAuthSaga;
