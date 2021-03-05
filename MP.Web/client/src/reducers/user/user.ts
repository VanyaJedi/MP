import { extend } from '../../utils/common';
import { User, AuthData, regData } from '../../types/interfaces';
import { AxiosInstance } from 'axios';
import { AnyAction, Dispatch, Reducer } from 'redux';
import { createUser } from '../../adapters/user'; 
import { ActionCreator as ActionCreatorApp } from '../app/app';
import { ActionCreator as ActionCreatorData } from '../data/data';
import { ActionCreator as ActionCreatorFetching } from '../fetching/fetching';
import { getUsers } from '../data/selectors';
import { RootState } from '../reducer';

interface State {
  user: User | null;
}

const initialState: State = {
  user: null
};


const ActionType = {
  SET_USER: `SET_USER`,
};


const ActionCreator = {
  setUser: (user: User | null) => ({
    type: ActionType.SET_USER,
    payload: user
  }),
};

const Operation = {
  checkAuth: () => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance): Promise<User | null> => {
    dispatch(ActionCreatorFetching.setInitFetching(true));
    return api.get(`/user/getuser`)
      .then((res) => {
        const user: User | null = createUser(res.data);
        dispatch(ActionCreator.setUser(user));
        dispatch(ActionCreatorData.addUser(user));
        return user;
      })
      .catch(() => {
        return null;
      })
      .finally(() => {
        dispatch(ActionCreatorFetching.setInitFetching(false));
      });
  },

  registration: (regData: regData) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {

    dispatch(ActionCreatorFetching.setAuthFetching(true));

    return api.post(`/user/registration`, {
      Email: regData.email,
      UserName: regData.username,
      Password: regData.password
    }).then(() => {
      dispatch(ActionCreatorApp.setMessageSuccess("Registration is succesfully done, please confirm email and login then"));
      return true;
    }).catch(() => {
      dispatch(ActionCreatorApp.setMessageError("Registration failed, please try again"));
      return false;
    })
    .finally(()=>{
      dispatch(ActionCreatorFetching.setAuthFetching(false));
    })
  },

  login: (authData: AuthData) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreatorFetching.setAuthFetching(true));
    return api.post(`/user/login`, {
      Email: authData.email,
      Password: authData.password,
      RememberMe: authData.rememberMe
    })
      .then((res) => {
        const user: User | null = createUser(res.data);
        dispatch(ActionCreator.setUser(user));
        dispatch(ActionCreatorData.addUser(user));
        return true;
      })
      .catch((error) => {
        console.log(error.message);
        dispatch(ActionCreatorApp.setMessageError('error'));
        return false;
      })
      .finally(()=>{
        dispatch(ActionCreatorFetching.setAuthFetching(false));
      })
  },

  resetPassword: (authData: AuthData) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreatorFetching.setAuthFetching(true));
    return api.post(`/user/forgotpassword`, {
      Email: authData.email,
      Password: authData.password,
    })
    .then((res) => {
      dispatch(ActionCreatorApp.setMessageSuccess("Link has been sent to mentioned email"));
      return true;
    })
    .catch((error) => {
      dispatch(ActionCreatorApp.setMessageError(error.response.data));
      return false;
    })
    .finally(()=>{
      dispatch(ActionCreatorFetching.setAuthFetching(false));
    })
  },

  logOut: () => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    return api.get('user/logout')
      .then(()=>{
        dispatch(ActionCreator.setUser(null));
        return true;
      })
      .catch((error) => {
        dispatch(ActionCreatorApp.setMessageError(error.response.data));
        return false;
      })
  },

  setPhoto: (image: string) => (dispatch: Dispatch, getState: () => RootState, api: AxiosInstance) => {
    dispatch(ActionCreatorFetching.setAvatarLoading(true));
    return api.post('user/setphoto', {
      Photo: image
    })
      .then((res) => {
        const user: User | null = createUser(res.data);
        dispatch(ActionCreator.setUser(user));
        if (user) {
          dispatch(ActionCreatorData.modifyUser(user))
        }
      })
      .catch((error) => {
        return false;
      })
      .finally(() => {
        dispatch(ActionCreatorFetching.setAvatarLoading(false));
      })
  }
};

const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.SET_USER:
    return extend(state, {user: action.payload});
  default:
    return state;
  }
};


export {reducer, Operation, ActionType, ActionCreator};