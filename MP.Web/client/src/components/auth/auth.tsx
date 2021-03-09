import React, { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import { Operation as UserOperation } from '../../reducers/user/user';
import { getAuthFetchingStatus } from '../../reducers/fetching/selectors';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import Logo from '../logo/logo';
import { message } from 'antd';
import { AppDispatch } from '../../reducers/store';
import { AuthData } from '../../types/interfaces';
import Login from './login';
import Reset from './reset';
import Register from './register';
import { start, stop } from '../../signalR';

const Auth = () => {
  const [formType, setFormType] = useState('login');

  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();

  const isFetching = useSelector(getAuthFetchingStatus);

  const onLoginSubmit = useCallback(async (values: AuthData) => {
    await stop();
    dispatch(UserOperation.login(values))
    .then(()=>{
      history.push(Routes.ROOT);
      return start()  
    })
    .then(() => {
      dispatch(ActionCreatorApp.setHubConnectionState(true))
    })
    .catch((error: string) => {
      message.error(error)
    })
  }, [dispatch, history]);

  const onRegisterSubmit = useCallback((values: any) => {
    const regData = {
      email: values.regEmail,
      username: values.regUsername,
      password: values.regPassword
    }
    dispatch(UserOperation.registration(regData))
    .then(()=>{
      setFormType('login');
    });
  }, [dispatch]);


  const onResetSubmit = useCallback((values: any) => {
    const resetData = {
      email: values.resetEmail,
      password: values.resetPassword
    }

    dispatch(UserOperation.resetPassword(resetData))
    .then(()=>{
      setFormType('login');
    });
  }, [dispatch]);

  const renderForm = () => {
    switch(formType) {
      case 'login':
        return( 
          <Login onSubmitHandler={onLoginSubmit} 
            isFetching={isFetching} 
            setFormType={setFormType} 
          />);
      case 'reset':
        return(
          <Reset onSubmitHandler={onResetSubmit} 
            isFetching={isFetching} 
            setFormType={setFormType} 
          />);
      default:
        return(
          <Register onSubmitHandler={onRegisterSubmit} 
            isFetching={isFetching} 
            setFormType={setFormType} 
          />);
  }
}

  return (
    <div className="auth">
      <Logo />
      <div className="auth__container">
        {renderForm()}
      </div>
      
    </div>
  );    

}

export default Auth;