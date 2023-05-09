import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import ecommerceSaga from '@iso/redux/ecommerce/saga';

export default function* rootSaga(getState) {
  yield all([authSagas(), ecommerceSaga()]);
}
