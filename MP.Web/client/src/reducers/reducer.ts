  
import { combineReducers } from 'redux';
import {reducer as app} from './app/app';
import {reducer as user} from './user/user';
import {reducer as data} from './data/data';
import {reducer as fetching} from './fetching/fetching';
import NameSpace from './name-spaces'

const rootReducer = combineReducers({
  [NameSpace.APP]: app,
  [NameSpace.USER]: user,
  [NameSpace.DATA]: data,
  [NameSpace.FETCHING]: fetching,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;