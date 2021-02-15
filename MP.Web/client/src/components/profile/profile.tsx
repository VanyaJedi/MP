import React from 'react';
import { useHistory } from 'react-router-dom';


import './profile.scss';

const Profile: React.FunctionComponent = () => { 
  const history = useHistory();
  const regEx = history.location.pathname.match(/^\/profile\/([^/]+)/);
  let id;
  
  if (regEx) {
    id = regEx[1];
  }

  return (
   <div>{id}</div>
  );

};

export default Profile;