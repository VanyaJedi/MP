import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { navigationItems } from '../../constants';

import './nav.scss';


const Nav: React.FunctionComponent = () => { 
  
  const location = useLocation();

  return (
     <ul className="header__nav nav list">
       {
        navigationItems.map((item) => (
          <li key={item.id} className={`nav__item center ${location.pathname === item.route ? "nav__item--active": ""}`}>
            <Link to={item.route} className="nav__item-link">
                <item.icon className="nav__item-svg" />
            </Link>
          </li>
        ))
       }
       
     </ul>
  );

};

export default Nav;