import { Reducer, AnyAction } from 'redux';
import { ReduxEntity, User } from '../../types/interfaces';
import { extend } from '../../utils/common';


interface State {
  contacts: ReduxEntity<User> | null;
}

const initialState: State = {
 contacts: null
};


const ActionType = {
 MODIFY_CONTACTS: 'MODIFY_CONTACTS'
};


const ActionCreator = {
  modifyContacts: (state: boolean) => ({
    type: ActionType.MODIFY_CONTACTS,
    payload: state
  })
};

const reducer: Reducer<State, AnyAction> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
  case ActionType.MODIFY_CONTACTS:
    return extend(state, {contacts: action.payload});
  default:
    return state;
  }
};


export {reducer, ActionType, ActionCreator};