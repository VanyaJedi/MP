import React from 'react';
import { useHistory } from 'react-router-dom';
import { MailOutlined, MessageOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Operation as DataOperation } from '../../reducers/data/data';
import { getProfileFetchingStatus } from '../../reducers/fetching/selectors';
import { ActionCreator as ActionCreatorData } from '../../reducers/data/data';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { AppDispatch } from '../../reducers/store';
import cutePotato from '../../assets/images/cute_potato.png';
import { getUser } from '../../reducers/user/selectors';
import { getChats, getUsers } from '../../reducers/data/selectors';
import hubConnection from '../../signalR';
import Loading from '../loading/loading';
import MyProfile from './myProfile';

import './profile.scss';
import { ChatDto } from '../../types/dto';

const Profile: React.FunctionComponent = () => {
  const dispatch: AppDispatch = useDispatch();

  const currentUser = useSelector(getUser);
  const users = useSelector(getUsers);
  const isFetching = useSelector(getProfileFetchingStatus);
  const chats = useSelector(getChats);

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
  let isMyProfile = false;
  if (!user) {
    dispatch(DataOperation.getUserById(id));
  }


  if (!isFetching && user) {
    isMyProfile = currentUser?.id === user.id;
  }

  const addChatHandler = () => {
    let chatId;
    for(let [id, value] of Object.entries(chats.byId)) {
      if (value.name === user?.name ) {
        chatId = parseInt(id);
        break;
      }
    }

    if (chatId) {
      dispatch(ActionCreatorData.setActiveChat(chatId));
      dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
      history.push('/messenger');
      return; 
    }
    
    if (user) {
      dispatch(DataOperation.addToContacts(user.name))
      .then((chat: ChatDto) => {
        const chatId = chat.ChatRoomId;
        dispatch(ActionCreatorData.setActiveChat(chatId));
        dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
        hubConnection.invoke('JoinGroup', chatId.toString());
        hubConnection.invoke('AddContact', chatId);
        history.push('/messenger');
      })
    }
    
  }


  return (
    isFetching ? <Loading /> : 
    isMyProfile ? <MyProfile user={user} /> : (
      <section className="profile">
        <div className="profile__user">
          {user && user.avatar ? <img src={user.avatar} className="profile__avatar" alt="avatar" /> : <img src={cutePotato} className="profile__avatar" alt="avatar" />}
          <div>
            <h1 className="profile__title">{user && user.name}</h1>
            <ul className="profile__user-info">
              <li>
                <MailOutlined /> {user && user.email}
              </li>
            </ul>  
          </div>
        </div>
        <ul className="profile__actions"> 
          <li>
            <button 
              onClick={addChatHandler} 
              type="button"
            >
              <MessageOutlined /> Написать сообщение
            </button>
          </li>
        </ul>
      </section>
    )
  );

};

export default Profile;