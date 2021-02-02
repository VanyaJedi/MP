import { createStore, applyMiddleware } from 'redux';
import reducer, { RootState } from './reducer';
import { createAPI } from '../api';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];;

const store = createStore<RootState, any, any, any>(
  reducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);
export type AppDispatch = typeof store.dispatch;

export default store;