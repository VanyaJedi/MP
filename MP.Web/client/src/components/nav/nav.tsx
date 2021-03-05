import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { navigationItems } from '../../constants';
import { Button } from 'antd';
import './nav.scss';

const Nav: React.FunctionComponent = () => { 
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    return history.listen((location, action)=>{
      dispatch(ActionCreatorApp.toggleProfileMenu(false));
    })
 },[history, dispatch]) 
  
  return (
     <ul className="header__nav nav list">
       {
        navigationItems.map((item) => (
          <li key={item.id} className="nav__item center">
            <Link to={item.route} className="nav__item-link">
              <Button 
                shape="circle" 
                type="primary" 
                className={`btn btn--${item.color}`} 
                htmlType="button"
                icon={<item.icon className="nav__item-svg" />}
              />
              </Link>
          </li>
        ))
       }
       
     </ul>
  );

};

export default Nav;