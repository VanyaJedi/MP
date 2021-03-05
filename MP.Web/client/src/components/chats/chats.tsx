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
import './chats.scss';

const avatarBgColors = ['linear-gradient(269.8deg, #FE49CF -0.46%, #FE58A2 28.61%, #FF6B65 67.45%)',
  'linear-gradient(90deg, #355EE1 0%, #8D6DF0 100%)',
  'linear-gradient(90deg, #3EDDAA 0%, #3BBCE8 100%)',
  'linear-gradient(90deg, #F7CF4B 0%, #FF856A 91.53%)',
  'linear-gradient(90deg, #FDAB6D 0%, #DE676C 91.53%)',
  'linear-gradient(90deg, #45C0E4 0%, #BF90FC 91.53%)'];

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
        {chatsIds.map((chatItem) => {
          const color = avatarBgColors[Math.floor(Math.random()*avatarBgColors.length)];
          return(
          <li 
            key={chatItem} 
            className={`chats__item ${activeChat === chatItem ? 'chats__item--active' : ''}`}
            onClick={() => {
              !isDesktop && dispatch(ActionCreatorApp.changeMobileMessagesAreaState(true));
              dispatch(ActionCreatorData.setActiveChat(chatItem));
            }}
          >
            <Avatar className="chats__avatar center" style={{background: color}} size="large" src={chats[chatItem].avatar} icon={<UserOutlined />}/>
            <div className="chats__item-info">
              <h4 className="chats__name">{chats[chatItem].name}</h4>
              <span className="chats__content" >{chats[chatItem].lastMessageText}</span>
              <span className="chats__datetime" >{moment(chats[chatItem].lastMessageDateTime).format('HH:MM')}</span>
            </div>
          </li>
        )})}
      </ul>
    </aside>
  );

};

export default Chats;