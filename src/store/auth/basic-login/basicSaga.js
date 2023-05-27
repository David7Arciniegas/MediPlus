import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { BASIC_LOGIN_USER, BASIC_LOGOUT_USER, BASIC_SOCIAL_LOGIN } from "./basicActionTypes";
import { BasicApiError, loginBasicSuccess, logoutBasicSuccess } from "./basicActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeLogin, postJwtLogin } from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginBasicUser({ payload: { user, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.loginUser, user.email, user.password);
      yield put(loginBasicSuccess(response));
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginBasicSuccess(response));
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginBasicSuccess(response));
    }
    history("/dashboard");
  } catch (error) {
    yield put(BasicApiError(error));
  }
}

function* logoutBasicUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutBasicSuccess(response));
    }
    history("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLoginBasic({ payload: { type, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      const response = yield call(fireBaseBackend.socialLoginUser, type);
      if (response) {
        history("/dashboard");
      } else {
        history("/login");
      }
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginBasicSuccess(response));
      if (response) {
        history("/dashboard");
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* basicAuthSaga() {
  yield takeEvery(BASIC_LOGIN_USER, loginBasicUser);
  yield takeLatest(BASIC_SOCIAL_LOGIN, socialLoginBasic);
  yield takeEvery(BASIC_LOGOUT_USER, logoutBasicUser);
}

export default basicAuthSaga;
