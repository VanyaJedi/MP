import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { Provider } from 'react-redux';
import { ActionCreator as ActionCreatorApp } from './reducers/app/app';
import { Operation as UserOperation } from './reducers/user/user';
import store from "./reducers/store";
import hubConnection from './signalR';

import './global.scss';
import './app.less';

store.dispatch(UserOperation.checkAuth());


async function start() {
  try {
      await hubConnection.start();
      console.log("SignalR Connected.");
      store.dispatch(ActionCreatorApp.setHubConnectionState(true));
  } catch (err) {
      console.log(err);
      store.dispatch(ActionCreatorApp.setHubConnectionState(false));
      setTimeout(start, 5000);
  }
};

hubConnection.onclose(start);

start();


ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode> 
  </Provider>, 
  
    document.getElementById('root')
);
