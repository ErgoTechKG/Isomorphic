import React from 'react';
import { useState } from "react";
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@iso/components/uielements/input';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import IntlMessages from '@iso/components/utility/intlMessages';
import FirebaseLoginForm from '@iso/containers/FirebaseForm/FirebaseForm';
import authAction from '../../../redux/auth/actions';
import appAction from '@iso/redux/app/actions';
import Auth0 from '@iso/containers/Authentication/Auth0/Auth0';
import {
  signInWithGoogle,
  signInWithFacebook,
} from '@iso/lib/firebase/firebase.authentication.util';
import SignInStyleWrapper from './SignIn.styles';
import { Spin } from 'antd';
const { login } = authAction;
const { clearMenu } = appAction;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const loading = useSelector((state) => state.Loading.loading);
  console.log('loading', loading);

  const [password, setPassword] = useState("");
  let history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.Auth.idToken);

  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  React.useEffect(() => {
    if (isLoggedIn) {
      setRedirectToReferrer(true);
    }
  }, [isLoggedIn]);


  function handleLogin(e, token = false) {
    e.preventDefault();
    
      
      if (token) {
        dispatch(login(token));
      } else {
        dispatch(login(email, password));
      }
      dispatch(clearMenu());
      history.push('/dashboard');

    

  }
  let { from } = location.state || { from: { pathname: '/dashboard' } };

  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }
  return (<Spin 
  spinning={loading}
  >
    <SignInStyleWrapper className="isoSignInPage">
       
      <div className="isoLoginContentWrapper">
        <div className="isoLoginContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <IntlMessages id="page.signInTitle" />
            </Link>
          </div>
          <div className="isoSignInForm">
            <form>
              <div className="isoInputWrapper">
                <Input
                  size="large"
                  placeholder="Email"
                  autoComplete="true"
                  onChange={e => {
                    setEmail(e.target.value)
                  }}
                />
              </div>

              <div className="isoInputWrapper">
                <Input
                  size="large"
                  type="password"
                  placeholder="Password"
                  autoComplete="false"
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                />
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={handleLogin}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>

              <p className="isoHelperText">
                <IntlMessages id="page.signInPreview" />
              </p>
            </form>
            <div className="isoInputWrapper isoOtherLogin">
              <Button
                onClick={signInWithFacebook}
                type="primary"
                className="btnFacebook"
              >
                <IntlMessages id="page.signInFacebook" />
              </Button>
              <Button
                onClick={signInWithGoogle}
                type="primary"
                className="btnGooglePlus"
              >
                <IntlMessages id="page.signInGooglePlus" />
              </Button>

              <Button
                onClick={() => {
                  Auth0.login();
                }}
                type="primary"
                className="btnAuthZero"
              >
                <IntlMessages id="page.signInAuth0" />
              </Button>

              <FirebaseLoginForm
                history={history}
                login={(token) => dispatch(login(token))}
              />
            </div>
            <div className="isoCenterComponent isoHelperWrapper">
              <Link to="/forgotpassword" className="isoForgotPass">
                <IntlMessages id="page.signInForgotPass" />
              </Link>
              <Link to="/signup">
                <IntlMessages id="page.signInCreateAccount" />
              </Link>
            </div>
          </div>
        </div>
      </div>
     
    </SignInStyleWrapper>
    </Spin>
  );
}
