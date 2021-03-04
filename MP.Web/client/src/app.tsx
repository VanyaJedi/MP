import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter  } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { getUser } from './reducers/user/selectors';
import { getInitialFetchingStatus } from './reducers/fetching/selectors';
import PrivateRoute from './components/private-route/private-route';
import { Routes } from './constants';
import Loading from './components/loading/loading';


const StartPage = React.lazy(() => import('./pages/start/start'));
const AuthPage = React.lazy(() => import('./pages/auth/auth'));
const MessengerPage = React.lazy(() => import('./pages/messenger/messenger'));
const ProfilePage = React.lazy(() => import('./pages/profile/profile'));
const NotFoundPage = React.lazy(() => import('./pages/not-found/not-found'));

const App = () => {
  const user = useSelector(getUser);
  const isInitialFetching = useSelector(getInitialFetchingStatus);
  return (
    isInitialFetching ? <Loading /> :
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
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
    </Suspense>
  );
}

export default App;
