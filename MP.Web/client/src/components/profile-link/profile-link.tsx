import React from 'react';
import { Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import defaultAvatar from '../../assets/images/default-avatar.png';
import { User } from '../../types/interfaces';

import './profile-link.scss';

interface Props {
  user?: User | null | undefined;
  styleName?: string;
}

const ProfileLink: React.FunctionComponent<Props> = ({ user, styleName }: Props) => { 
  
  return (
    <div className={`profile-link ${styleName}`}>
      <Avatar className="profile-link__img" icon={<UserOutlined />} />
      <span>{user && user.name}</span>
    </div>
  );

};

export default ProfileLink;