import { AnyAction, combineReducers } from 'redux';
import { extend } from '../../utils/common';

interface FetchingAction {
  [key: string]: (state: boolean) => {
    type: string,
    payload: boolean
  }
}

const FetchingType = {
  'INIT': {
    name: 'isInitFetching',
    type: 'setInitFetching'
  },
  'CHAT_USERS': {
    name: 'isChatUsersFetching',
    type: 'setChatUsersFetching'
  },
  'MESSAGES': {
    name: 'isMessagesFetching',
    type: 'setMessagesFetching'
  },
  'AUTH': {
    name: 'isAuthFetching',
    type: 'setAuthFetching'
  }
}

const createActionCreators = () => {
  const res = {} as FetchingAction;
  for (const [key, value] of Object.entries(FetchingType)) {
    res[value.type] = (state: boolean) => ({
      type: key,
      payload: state
    })
  }
  return res;
}

const ActionCreator = createActionCreators();


const createFetchingReducerWithNamedType = (fetchingType: keyof typeof FetchingType) => {
  return (state = false, action: AnyAction) => {
    switch (action.type) {
      case `FETCHING_${fetchingType}`:
        const stateProperty = FetchingType[fetchingType].name;
        return extend(state, { [stateProperty]: action.payload});
      default:
        return state
    }
  }
}


const reducer = combineReducers({
  isInitFetching: createFetchingReducerWithNamedType('INIT'),
  isChatUserFetching: createFetchingReducerWithNamedType('CHAT_USERS'),
  isMessagesFetching: createFetchingReducerWithNamedType('MESSAGES'),
  isAuthFetching: createFetchingReducerWithNamedType('AUTH'),
})

export { reducer, ActionCreator };