import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  BASIC_LOGIN_USER,
  BASIC_LOGOUT_USER,
  BASIC_SOCIAL_LOGIN,
} from "./basicActionTypes";
import {
  basicApiError,
  loginBasicSuccess,
  logoutBasicSuccess,
} from "./basicActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginBasicUser({ payload: { user, history } }) {
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
      console.log("Role:", role); //Shows the value of role in the browser
      if (role === "Basic") {
        yield put(loginBasicSuccess(data, role));
        history("/basic-dashboard");

        // Store the value of 'role' in local storage
        localStorage.setItem("authRole", role);
      } else if (
        role === "SuperAdministrator" ||
        role === "Administrator" ||
        role === "Moderator" ||
        role === "Professional"
      ) {
        throw new Error(
          "Unauthorized access. User does not have the required role."
        );
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Authorization Error:", error);
    yield put(basicApiError(error));
  }
}

function* logoutBasicUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");

    yield put(logoutBasicSuccess(undefined, undefined));

    history("/basic-dashboard-login");
    console.log("Logout successful");
  } catch (error) {
    yield put(basicApiError(error));
  }
}

function* socialLoginBasic({ payload: { type, history } }) {
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
      yield put(loginBasicSuccess(response));
      if (response) {
        history("/basic-dashboard-login");
      }
    }
  } catch (error) {
    yield put(basicApiError(error));
  }
}

function* basicAuthSaga() {
  yield takeEvery(BASIC_LOGIN_USER, loginBasicUser);
  yield takeLatest(BASIC_SOCIAL_LOGIN, socialLoginBasic);
  yield takeEvery(BASIC_LOGOUT_USER, logoutBasicUser);
}

export default basicAuthSaga;
