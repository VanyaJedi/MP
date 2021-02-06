import React, { useEffect} from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux'
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import defaultAvatar from '../../assets/images/default-avatar.png';
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

  const chatEntity = useSelector(getChats);
  const chatsIds = chatEntity.allIds;
  const chats = chatEntity.byId;

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
      {isDesktop && <h2 className="chats__ti tle">Dialogues</h2>}
      <ul className="chats__list">
        {chatsIds.map((chatItem) => (
          <li 
            key={chatItem} 
            className="chats__item"
            onClick={() => {
              !isDesktop && dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
              dispatch(ActionCreatorMessenger.setActiveChat(chatItem));
            }}
          >
            <img src={defaultAvatar} className="chats__avatar" alt="avatar" />
            <div className="chats__item-info">
              <h4 className="chats__name">{chats[chatItem].name}</h4>
              <span className="chats__content" >{chats[chatItem].lastMessageText}</span>
              <span className="chats__datetime" >{moment(chats[chatItem].lastMessageDateTime).format('HH:MM')}</span>
            </div>
          </li>
        ))}
      </ul>)
    </aside>
  );

};

export default Chats;