import React from 'react';
import { Button  } from 'antd';
import { CloseOutlined, MenuFoldOutlined, LoginOutlined } from '@ant-design/icons';
import { Input  } from 'antd';
import { Link } from 'react-router-dom';
import { User } from '../../types/interfaces';
import { Routes } from '../../constants';
import Nav from '../nav/nav';
import Logo from '../logo/logo';

const { Search } = Input;

interface Props {
  toggleProfileMenuHandler: () => void;
  isDropMenuOpen: boolean;
  user: User | null;
}

const TabletHeader: React.FunctionComponent<Props> = ({ toggleProfileMenuHandler, isDropMenuOpen, user }: Props) => {
  
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
        <Search placeholder="search" style={{width: 162}} enterButton={false}/>
      </div>
      {user && <Nav />}
    </>
  );  
   
  
}

export default TabletHeader;