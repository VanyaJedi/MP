import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import { ActionCreator as ActionCreatorApp } from './reducers/app/app';
import { Operation as UserOperation } from './reducers/user/user';
import store from "./reducers/store";
import { User } from './types/interfaces';
import  hubConnection, { start }  from './signalR';

import './global.scss';
import './app.less';

store.dispatch(UserOperation.checkAuth())
  .then((user: User | null) => {
    if (user) {
      return start();
    }
  })
  .then(() => {
    store.dispatch(ActionCreatorApp.setHubConnectionState(true));
    hubConnection.on('Send', (message, username) => {
      console.log(message, username);
    });
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
