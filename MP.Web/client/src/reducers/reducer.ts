  
import { combineReducers } from 'redux';
import {reducer as app} from './app/app';
import {reducer as user} from './user/user';
import {reducer as messenger} from './messenger/messenger';
import NameSpace from './name-spaces'

const rootReducer = combineReducers({
  [NameSpace.APP]: app,
  [NameSpace.USER]: user,
  [NameSpace.MESSENGER]: messenger,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;