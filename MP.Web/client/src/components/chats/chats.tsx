import React, { useEffect} from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux'
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import defaultAvatar from '../../assets/images/default-avatar.png';
import { Chat } from '../../types/interfaces';
import { getChats, getUsersFetchingStatus } from '../../reducers/messenger/selectors';
import { getMobileMessengerState } from '../../reducers/app/selectors';
import { Operation as MessengerOperation } from '../../reducers/messenger/messenger';
import { ActionCreator as ActionCreatorMessenger } from '../../reducers/messenger/messenger';
import Loading from '../loading/loading';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { AppDispatch } from '../../reducers/store';

import './chats.scss';

const Chats: React.FunctionComponent = () => { 

  const dispatch: AppDispatch = useDispatch();
  const chatsList = useSelector(getChats);
  const isMobileMessagesAreaOpen = useSelector(getMobileMessengerState);
  const isFetching = useSelector(getUsersFetchingStatus);

  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  useEffect(() => {
    dispatch(MessengerOperation.getChats());
  }, [])

  if ((isMobile || isTablet) && isMobileMessagesAreaOpen) return null;

  if (isFetching) {
    return <Loading />
  }

  return (
    <aside className="chats scroll"> 
      {isDesktop && <h2 className="chats__title">Dialogues</h2>}
      <ul className="chats__list">
        {chatsList.map((chatItem: Chat) => (
          <li 
            key={chatItem.id} 
            className="chats__item"
            onClick={() => {
              !isDesktop && dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
              dispatch(ActionCreatorMessenger.setActiveChat(chatItem.id));
            }}
          >
            <img src={defaultAvatar} className="chats__avatar" alt="avatar" />
            <div className="chats__item-info">
              <h4 className="chats__name">{chatItem.name}</h4>
              <span className="chats__content" >{chatItem.lastMessageText}</span>
              <span className="chats__datetime" >{moment(chatItem.lastMessageDateTime).format('HH:MM')}</span>
            </div>
          </li>
        ))}
      </ul>)
    </aside>
  );

};

export default Chats;