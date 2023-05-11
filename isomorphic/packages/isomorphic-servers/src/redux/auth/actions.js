const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (username, password, token = false) => ({
    type: actions.LOGIN_REQUEST,
    payload: { username, password, token },
  }),
  logout: () => ({
    type: actions.LOGOUT,
  }),
};
export default actions;
