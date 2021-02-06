import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { dropMenuItems, LOG_OUT } from '../../constants';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { AppDispatch } from '../../reducers/store';
import { Operation as UserOperation } from '../../reducers/user/user';
import { LogoutOutlined } from '@ant-design/icons';
import { stop } from '../../signalR';
import './styles/drop-menu.scss';

const DropMenu: React.FunctionComponent = ({ children }) => {
  const dropMenuRef = useRef(null);
  const dispatch: AppDispatch = useDispatch();

  useOutsideClick(dropMenuRef, () => {dispatch(ActionCreatorApp.toggleProfileMenu(false))})

  return (
    <nav ref={dropMenuRef} className="drop-menu">
      {children}
      <ul className="drop-menu__list">
        {dropMenuItems.map((item) => (
          <li key={item.id}> <item.icon className="drop-menu__list-icon" />
            {item.name}
          </li>
        ))}
      </ul>
      <form
        className="drop-menu__logout"
        onSubmit={(evt) => {
          evt.preventDefault();
          dispatch(UserOperation.logOut())
          .then((isSuccess: boolean)=>{
            if (isSuccess)
            dispatch(ActionCreatorApp.toggleProfileMenu(false));
            return stop();
          })
          .then(()=>{
            dispatch(ActionCreatorApp.setHubConnectionState(false));
          })
        }}>
        <button type="submit">
          <LogoutOutlined className="drop-menu__list-icon" />
          Log out
        </button>
      </form>
    </nav>
  );  
   
  
}

export default DropMenu;