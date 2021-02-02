import React, { useCallback } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import { Operation as UserOperation } from '../../reducers/user/user';
import { getErrorMessage, getSuccessMessage, getFetchingStatus } from '../../reducers/app/selectors';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { Alert } from 'antd';
import { AppDispatch } from '../../reducers/store';
import { AuthData } from '../../types/interfaces';
import Login from './login';
import Reset from './reset';
import Register from './register';


const Auth = () => {
  const [formType, setFormType] = useState('login');

  const dispatch: AppDispatch = useDispatch();
  const history = useHistory();

  const errorMessage = useSelector(getErrorMessage);
  const successMessage = useSelector(getSuccessMessage);
  const isFetching = useSelector(getFetchingStatus);

  const onLoginSubmit = useCallback((values: AuthData) => {
    dispatch(UserOperation.login(values))
    .then((isSuccess: boolean)=>{
      if(isSuccess) {
        history.push(Routes.ROOT);  
      }
    });
  }, []);

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
  }, []);


  const onResetSubmit = useCallback((values: any) => {
    const resetData = {
      email: values.resetEmail,
      password: values.resetPassword
    }

    dispatch(UserOperation.resetPassword(resetData))
    .then(()=>{
      setFormType('login');
    });
  }, []);

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
      {errorMessage && 
        <Alert 
          message={errorMessage} 
          type="error" 
          banner
          closable
          onClose={()=>{
            dispatch(ActionCreatorApp.setMessageError(null))
          }}
        />}

      {successMessage && 
        <Alert 
          message={successMessage} 
          type="success" 
          banner
          closable
          onClose={()=>{
            dispatch(ActionCreatorApp.setMessageSuccess(null));
            setFormType('login');
          }}
        />}
      <h1 className="auth__title"><Link to={Routes.ROOT}>MetaPotato</Link></h1>
      <div className="auth__container">
        {renderForm()}
      </div>
      
    </div>
  );    

}

export default Auth;