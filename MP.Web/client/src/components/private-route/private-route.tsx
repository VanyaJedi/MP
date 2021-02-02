import * as React from 'react';
import {Route, Redirect, RouteProps} from 'react-router-dom';
import { Routes } from '../../constants';
import { User } from '../../types/interfaces';

type Props = RouteProps & {
  user: User | null;
  render: () => React.ReactNode;
}

const PrivateRoute = ({render, path, exact, user}: Props) => {
  return <Route
    path={path}
    exact={exact}
    render={
      () => {
        return user ? render() : <Redirect to={Routes.AUTH}/>;
      }
    }
  />;
};

export default PrivateRoute;