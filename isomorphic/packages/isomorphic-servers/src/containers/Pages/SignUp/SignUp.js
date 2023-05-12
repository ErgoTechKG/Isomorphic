import React from 'react';
import { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Input from '@iso/components/uielements/input';
import Checkbox from '@iso/components/uielements/checkbox';
import Button from '@iso/components/uielements/button';
import authAction from '../../../redux/auth/actions';
import appActions from '@iso/redux/app/actions';
import IntlMessages from '@iso/components/utility/intlMessages';
import SignUpStyleWrapper from './SignUp.styles';

const { signup } = authAction;
const { clearMenu } = appActions;

export default function SignUp() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    console.log('handlesignup', {username, password, name, email});
    dispatch(signup({username, password, name, email}));
    dispatch(clearMenu());
    history.push('/dashboard');
  };
  return (
    <SignUpStyleWrapper className="isoSignUpPage">
      <div className="isoSignUpContentWrapper">
        <div className="isoSignUpContent">
          <div className="isoLogoWrapper">
            <Link to="/dashboard">
              <IntlMessages id="page.signUpTitle" />
            </Link>
          </div>

          <div className="isoSignUpForm">
            <div className="isoInputWrapper isoLeftRightComponent">
              <Input size="large" placeholder="name" onChange={e => {setName(e.target.value)}}/>
            </div>

            <div className="isoInputWrapper">
              <Input size="large" placeholder="Username" onChange={e => {setUsername(e.target.value)}}/>
            </div>

            <div className="isoInputWrapper">
              <Input size="large" placeholder="Email" onChange={e => {setEmail(e.target.value)}}/>
            </div>

            <div className="isoInputWrapper">
              <Input size="large" type="password" placeholder="Password" onChange={e => {setPassword(e.target.value)}}/>
            </div>

            <div className="isoInputWrapper">
              <Input
                size="large"
                type="password"
                placeholder="Confirm Password"
              />
            </div>

            <div className="isoInputWrapper" style={{ marginBottom: '50px' }}>
              <Checkbox>
                <IntlMessages id="page.signUpTermsConditions" />
              </Checkbox>
            </div>

            <div className="isoInputWrapper">
              <Button type="primary" onClick={handleLogin}>
                <IntlMessages id="page.signUpButton" />
              </Button>
            </div>
            <div className="isoInputWrapper isoCenterComponent isoHelperWrapper">
              <Link to="/signin">
                <IntlMessages id="page.signUpAlreadyAccount" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SignUpStyleWrapper>
  );
}
