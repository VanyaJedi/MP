import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import { Input, Button } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, LoginOutlined } from '@ant-design/icons';
import ProfileLink from '../profile-link/profile-link';
import MobileHeader from './mobileHeader';
import TabletHeader from './tabletHeader';
import DropMenu from './drop-menu';
import { getProfileMenuState } from '../../reducers/app/selectors';
import { getUser } from '../../reducers/user/selectors';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { Link } from 'react-router-dom';
import { Routes } from '../../constants';
import Nav from '../nav/nav';

import './styles/header.scss';

const { Search } = Input;


const Header: React.FunctionComponent = () => {

  const dispatch = useDispatch();

  const user = useSelector(getUser);


  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);

  const isDropMenuOpen = useSelector(getProfileMenuState);
  const toggleProfileMenuHandler = useCallback(() => {
    dispatch(ActionCreatorApp.toggleProfileMenu(!isDropMenuOpen))
  }, [isDropMenuOpen, dispatch]);
  

  if (isMobile) {
    return (
      <header className="header">
        {isDropMenuOpen ? 
          <DropMenu>
            <ProfileLink user={user} />
          </DropMenu> : 
        null}
        <div className="header__wrapper wrapper">
          <MobileHeader 
            isDropMenuOpen={isDropMenuOpen}
            toggleProfileMenuHandler={toggleProfileMenuHandler}
            user={user}
          />
        </div>
      </header>)
  } else if (isTablet) {
    return (<header className="header">
       {isDropMenuOpen ? 
          <DropMenu >
            <ProfileLink user={user} />
          </DropMenu> : 
        null}
      <div className="header__wrapper wrapper">
        <TabletHeader 
          isDropMenuOpen={isDropMenuOpen} 
          toggleProfileMenuHandler={toggleProfileMenuHandler}
          user={user}
        />
      </div>
    </header>);
  }

  return (
    <header className="header">
        {isDropMenuOpen ? <DropMenu /> : null}
      <div className="header__wrapper wrapper">
        <div className="header__left">
          {
            user ?
            <>
              <div className="header__profile">
                <ProfileLink user={user} />
                <Button 
                  className="header__arrrowBtn" 
                  type="primary" 
                  shape="circle" 
                  icon={isDropMenuOpen ? <CaretUpOutlined /> : <CaretDownOutlined />} 
                  onClick={toggleProfileMenuHandler} 
                  size="small"
                />
              </div>
               <Nav />
            </> :
            <Link to={Routes.AUTH}>
              <Button 
                type="primary" 
                shape="circle"
                icon={<LoginOutlined />}
              />
            </Link>
          }
           
        </div>
        <h1 className="header__title">MetaPotato</h1>
        <div className="header__right">
          <Search placeholder="search" style={{width: 350}} enterButton={false}/>
        </div>
      </div>
    </header>
  );

}

export default Header;