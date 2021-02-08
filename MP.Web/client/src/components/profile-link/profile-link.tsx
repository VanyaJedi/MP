import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../../types/interfaces';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';

import './profile-link.scss';


interface Props {
  user?: User | null | undefined;
  styleName?: string;
  onlyImg?: boolean;
}

const ProfileLink: React.FunctionComponent<Props> = ({ user, styleName, onlyImg = false }: Props) => { 
  
  return (
    <Link to={`${Routes.PROFILE}/${user?.id}`} className={`profile-link ${styleName}`}>
      <Avatar className="profile-link__img" icon={<UserOutlined />} />
      {!onlyImg && <span>{user && user.name}</span>}
    </Link>
  );

};

export default ProfileLink;