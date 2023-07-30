import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { createBrowserHistory } from 'history';

import { getToken, clearToken } from '@iso/lib/helpers/utility';
import AuthHelper from '../../library/helpers/authHelper'
import actions from './actions';
import actionsLoading from '../loading/actions';
import { message } from 'antd';

const history = createBrowserHistory();

export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*({ payload }) {
    const { token } = payload;
    yield put({type:actionsLoading.SET_LOADING, payload:true})
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token: token,
        profile: 'Profile',
      });
    } else {
      const { email, password } = payload;
      const { error, token } = yield call(AuthHelper.login, { email, password });
      if (!error) {
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: token,
          profile: 'Profile',
        });
      } else {
        yield put({ type: actions.LOGIN_ERROR });
      }
    }
    yield put({type:actionsLoading.SET_LOADING, payload:false})
  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {
    message.error('Invalid email or password');
  });
}


export function* signupRequest() {
  yield takeEvery('SIGNUP_REQUEST', function*({ payload }) {
    const {password, name, email} = payload;
    const { error, token } = yield call(AuthHelper.signup, { password, name, email});
    if (!error) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token: token,
        profile: 'Profile',
      });
    } else {
      yield put({ type: actions.LOGIN_ERROR });
    }
  });
}

export function* signupSuccess() {
  yield takeEvery(actions.SIGNUP_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
  });
}

export function* signupError() {
  yield takeEvery(actions.SIGNUP_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    yield clearToken();
    history.push('/');
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken().get('idToken');
    if (token) {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        profile: 'Profile',
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(signupRequest),
    fork(signupSuccess),
    fork(signupError),
    fork(logout),
  ]);
}
