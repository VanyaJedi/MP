import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Operation as DataOperation } from '../../reducers/data/data';
import { getUsers } from '../../reducers/data/selectors';

import './profile.scss';

const Profile: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const users = useSelector(getUsers);

  const history = useHistory();
  const regEx = history.location.pathname.match(/^\/profile\/([^/]+)/);
  let id;
  
  if (regEx) {
    id = regEx[1];
  }

  if (!id) {
    return <div>There is no such user</div>
  }

  const user = users.byId[id];

  if (!user) {
    dispatch(DataOperation.getUserById(id));
  }

  



  return (
   <div>{id}</div>
  );

};

export default Profile;