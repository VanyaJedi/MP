import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Operation as DataOperation } from '../../reducers/data/data';
import { getProfileFetchingStatus } from '../../reducers/fetching/selectors';
import { getUsers } from '../../reducers/data/selectors';
import Loading from '../loading/loading';

import './profile.scss';

const Profile: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const users = useSelector(getUsers);
  const isFetching = useSelector(getProfileFetchingStatus);

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
    isFetching ? <Loading /> : 
    <div>{id}</div>
  );

};

export default Profile;