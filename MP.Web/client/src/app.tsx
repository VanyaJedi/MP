import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getUser } from './reducers/user/selectors';
import { getInitialFetchingStatus } from './reducers/app/selectors';
import PrivateRoute from './components/private-route/private-route';
import AuthPage from './pages/auth/auth';
import MessengerPage from './pages/messenger/messenger';
import ProfilePage from './pages/profile/profile';
import { Routes } from './constants';
import StartPage from './pages/start/start';
import NotFoundPage from './pages/not-found/not-found';
import Loading from './components/loading/loading';

const App = () => {


  const user = useSelector(getUser);
  const isInitialFetching = useSelector(getInitialFetchingStatus);
  return (
    isInitialFetching ? <Loading /> :<BrowserRouter>
      <Switch>
        <Route path={Routes.ROOT} exact>
          <StartPage />
        </Route>
        <Route path={Routes.AUTH} exact>
          <AuthPage /> 
        </Route>
        <PrivateRoute
          user={user}
          path={Routes.MESSENGER} 
          exact
          render={() => <MessengerPage /> }
        />
        <PrivateRoute
          user={user}
          path={`${Routes.PROFILE}/:id`}
          exact
          render={() => {
            return <ProfilePage />
          }}
        />
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
