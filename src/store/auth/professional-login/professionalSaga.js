import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
  PROFESSIONAL_LOGIN_USER,
  PROFESSIONAL_LOGOUT_USER,
  PROFESSIONAL_SOCIAL_LOGIN,
} from "./professionalActionTypes";
import {
  professionalApiError,
  loginProfessionalSuccess,
  logoutProfessionalSuccess,
} from "./professionalActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginProfessionalUser({ payload: { user, history } }) {
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
      if (role === "Professional") {
        yield put(loginProfessionalSuccess(data, role));
        history("/professional-dashboard");
        // Perform any necessary action after successful login

        // Store the value of 'role' in local storage
        localStorage.setItem("authRole", role);
      } else if (
        role === "Basic" ||
        role === "SuperAdministrator" ||
        role === "Administrator" ||
        role === "Moderator"
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
    yield put(professionalApiError(error));
  }
}

function* logoutProfessionalUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authRole");

    yield put(logoutProfessionalSuccess(undefined, undefined));
    console.log("Logout successful");
    history("/professional-dashboard-login");
    console.log("Logout successful");
  } catch (error) {
    yield put(professionalApiError(error));
  }
}

function* socialLoginProfessional({ payload: { type, history } }) {
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
      yield put(loginProfessionalSuccess(response));
      if (response) {
        history("/professional-dashboard-login");
      }
    }
  } catch (error) {
    yield put(professionalApiError(error));
  }
}

function* internalAuthSaga() {
  yield takeEvery(PROFESSIONAL_LOGIN_USER, loginProfessionalUser);
  yield takeLatest(PROFESSIONAL_SOCIAL_LOGIN, socialLoginProfessional);
  yield takeEvery(PROFESSIONAL_LOGOUT_USER, logoutProfessionalUser);
}

export default internalAuthSaga;
