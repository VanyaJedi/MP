import React, { useEffect} from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons'
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux'
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import { getChats, getActiveChatId } from '../../reducers/data/selectors';
import { getChatUsersFetchingStatus } from '../../reducers/fetching/selectors';
import { getMobileMessengerState } from '../../reducers/app/selectors';
import { Operation as DataOperation } from '../../reducers/data/data';
import { ActionCreator as ActionCreatorData } from '../../reducers/data/data';
import Loading from '../loading/loading';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { AppDispatch } from '../../reducers/store';
import hubConnection from '../../signalR';

import './chats.scss';

const Chats: React.FunctionComponent = () => { 

  const dispatch: AppDispatch = useDispatch();

  const chatEntity = useSelector(getChats);
  const activeChat = useSelector(getActiveChatId);
  const chatsIds = chatEntity.allIds;
  const chats = chatEntity.byId;

  const isMobileMessagesAreaOpen = useSelector(getMobileMessengerState);
  const isFetching = useSelector(getChatUsersFetchingStatus);

  const isMobile = useMediaQuery(mediaQueries.mobile);
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  useEffect(() => {
    dispatch(DataOperation.getChats());
    hubConnection.on('AddContact', (res: any) => {
      console.log(1);
      console.log(JSON.parse(res))
    });
  }, [dispatch])

  if ((isMobile || isTablet) && isMobileMessagesAreaOpen) return null;

  if (isFetching) {
    return (
      <aside className="chats scroll"> 
        <Loading />
      </aside>)
  }

  return (
    <aside className="chats scroll"> 

      {isDesktop && <h2 className="chats__title">Dialogues</h2>}
      <ul className="chats__list">
        {chatsIds.map((chatItem) => (
          <li 
            key={chatItem} 
            className={`chats__item ${activeChat === chatItem ? 'chats__item--active' : ''}`}
            onClick={() => {
              !isDesktop && dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
              dispatch(ActionCreatorData.setActiveChat(chatItem));
            }}
          >
            <Avatar className="chats__avatar"  size="large" src={chats[chatItem].avatar} icon={<UserOutlined />}/>
            <div className="chats__item-info">
              <h4 className="chats__name">{chats[chatItem].name}</h4>
              <span className="chats__content" >{chats[chatItem].lastMessageText}</span>
              <span className="chats__datetime" >{moment(chats[chatItem].lastMessageDateTime).format('HH:MM')}</span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );

};

export default Chats;