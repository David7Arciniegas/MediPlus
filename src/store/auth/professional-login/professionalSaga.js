import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { PROFESSIONAL_LOGIN_USER, PROFESSIONAL_LOGOUT_USER, PROFESSIONAL_SOCIAL_LOGIN } from "./professionalActionTypes";
import { professionalApiError, loginProfessionalSuccess, logoutProfessionalSuccess } from "./professionalActions";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import { postFakeLogin, postJwtLogin } from "../../../helpers/fakebackend_helper";

const fireBaseBackend = getFirebaseBackend();

function* loginProfessionalUser({ payload: { user, history } }) {
  try {
    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.loginUser, user.email, user.password);
      yield put(loginProfessionalSuccess(response));
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginProfessionalSuccess(response));
    } else if (import.meta.env.VITE_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeLogin, {
        email: user.email,
        password: user.password,
      });
      localStorage.setItem("authUser", JSON.stringify(response));
      yield put(loginProfessionalSuccess(response));
    }
    history.push("/professional-dashboard");
  } catch (error) {
    yield put(professionalApiError(error));
  }
}

function* logoutProfessionalUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    if (import.meta.env.VITE_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutProfessionalSuccess(response));
    }
    history("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLoginProfessional({ payload: { type, history } }) {
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
      yield put(loginProfessionalSuccess(response));
      if (response) {
        history("/dashboard");
      }
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* professionalAuthSaga() {
  yield takeEvery(PROFESSIONAL_LOGIN_USER, loginProfessionalUser);
  yield takeLatest(PROFESSIONAL_SOCIAL_LOGIN, socialLoginProfessional);
  yield takeEvery(PROFESSIONAL_LOGOUT_USER, logoutProfessionalUser);
}

export default professionalAuthSaga;
