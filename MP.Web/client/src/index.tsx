import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import { ActionCreator as ActionCreatorApp } from './reducers/app/app';
import { Operation as UserOperation } from './reducers/user/user';
import store from "./reducers/store";
import { User } from './types/interfaces';
import { start }  from './signalR';
import { generateCSSVarForCorrectMobileHeight } from './utils/common';

import './global.scss';
import './app.less';

generateCSSVarForCorrectMobileHeight();
window.addEventListener('resize', () => {
    generateCSSVarForCorrectMobileHeight();
});

store.dispatch(UserOperation.checkAuth())
  .then((user: User) => {
    if (user) {
      return start();
    }
  })
  .then(() => {
    store.dispatch(ActionCreatorApp.setHubConnectionState(true));
  })
  .catch(()=>{
    store.dispatch(ActionCreatorApp.setHubConnectionState(false));
  })


ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode> 
  </Provider>, 
  
    document.getElementById('root')
);
