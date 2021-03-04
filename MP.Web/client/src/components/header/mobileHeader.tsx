import React from 'react';
import { Button  } from 'antd';
import { MenuFoldOutlined,  SearchOutlined, CloseOutlined, LoginOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { User } from '../../types/interfaces';
import { Routes } from '../../constants';
import Nav from '../nav/nav';
import Logo from '../logo/logo';

interface Props {
  toggleProfileMenuHandler: () => void;
  isDropMenuOpen: boolean;
  user: User | null;
}

const MobileHeader: React.FunctionComponent<Props> = ({ toggleProfileMenuHandler, isDropMenuOpen, user }: Props) => {
  
  return (
    <>
      <div className="header__left">
        {
          user ?
          <Button 
            type="primary" 
            shape="circle"
            icon={isDropMenuOpen ? <CloseOutlined />: <MenuFoldOutlined />} 
            onClick={toggleProfileMenuHandler} 
            size="middle"
          />:
          <Link to={Routes.AUTH}>
            <Button 
              type="primary" 
              shape="circle"
              icon={<LoginOutlined />}
            />
          </Link>
        }
        
      </div>
      <Logo />
      <div className="header__right">
        <Button type="primary" shape="circle" icon={<SearchOutlined />} size="middle"/>
      </div>
      {user && <Nav />}
    </>
  );  
   
  
}

export default MobileHeader;