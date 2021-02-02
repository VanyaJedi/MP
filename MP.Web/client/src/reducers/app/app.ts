import { Reducer, AnyAction } from 'redux';
import { extend } from '../../utils/common';

interface State {
  isHubConnected: boolean,
  isInitialFetching: boolean,
  isProfileMenuOpen: boolean,
  isMobileMessagesAreaOpen: boolean,
  errorMessage: string | null,
  successMessage: string | null,
  isFetching: boolean
}

const initialState: State = {
  isHubConnected: false,
  isInitialFetching: false,
  isProfileMenuOpen: false,
  isMobileMessagesAreaOpen: false,
  errorMessage: null,
  successMessage: null,
  isFetching: false
};


const ActionType = {
  SET_HUB_CONNECTION_STATE: `SET_HUB_CONNECTION_STATE`,
  SHOW_INITIAL_FETCHING: `SHOW_INITIAL_FETCHING`,
  SHOW_PROFILE_MENU: `SHOW_PROFILE_MENU`,
  CHANGE_MOBILE_MESSAGES_AREA_STATE: `CHANGE_MOBILE_MESSAGES_AREA_STATE`,
  SET_ERROR_MESSAGE: 'SET_ERROR_MESSAGE',
  SET_SUCCESS_MESSAGE: 'SET_SUCCESS_MESSAGE',
  SET_FETCHING_STATUS: 'SET_FETCHING_STATUS'
};


const ActionCreator = {
  setHubConnectionState: (state: boolean) => ({
    type: ActionType.SET_HUB_CONNECTION_STATE,
    payload: state
  }),
  setInitialFetchingStatus: (state: boolean) => ({
    type: ActionType.SHOW_INITIAL_FETCHING,
    payload: state
  }),
  toggleProfileMenu: (state: boolean) => ({
    type: ActionType.SHOW_PROFILE_MENU,
    payload: state
  }),
  changeMobileMessagesAreaState: (state: boolean) => ({
    type: ActionType.CHANGE_MOBILE_MESSAGES_AREA_STATE,
    payload: state
  }),
  setMessageError: (message: string | null) => ({
    type: ActionType.SET_ERROR_MESSAGE,
    payload: message
  }),
  setMessageSuccess: (message: string | null) => ({
    type: ActionType.SET_SUCCESS_MESSAGE,
    payload: message
  }),
  setFetchingStatus: (state: boolean) => ({
    type: ActionType.SET_FETCHING_STATUS,
    payload: state
  }),
};

const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.SET_HUB_CONNECTION_STATE:
    return extend(state, {isHubConnected: action.payload});
  case ActionType.SHOW_INITIAL_FETCHING:
    return extend(state, {isInitialFetching: action.payload});
  case ActionType.SHOW_PROFILE_MENU:
    return extend(state, {isProfileMenuOpen: action.payload});
  case ActionType.CHANGE_MOBILE_MESSAGES_AREA_STATE:
    return extend(state, {isMobileMessagesAreaOpen: action.payload});
  case ActionType.SET_ERROR_MESSAGE:
    return extend(state, {errorMessage: action.payload});
  case ActionType.SET_SUCCESS_MESSAGE:
    return extend(state, {successMessage: action.payload});
  case ActionType.SET_FETCHING_STATUS:
    return extend(state, {isFetching: action.payload});
  default:
    return state;
  }
};


export {reducer, ActionType, ActionCreator};