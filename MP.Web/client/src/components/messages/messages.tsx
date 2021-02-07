import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Button, Spin } from 'antd';
import { LeftOutlined, CheckOutlined, WarningOutlined, LoadingOutlined  } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { getActiveChatId, getActiveChatMessages, getMessagesFetchingStatus, getChats, getMessages } from '../../reducers/messenger/selectors';
import { getUser } from '../../reducers/user/selectors';
import { getMobileMessengerState, getHubConnectionState } from '../../reducers/app/selectors';
import defaultAvatar from '../../assets/images/default-avatar.png';
import ProfileLink from '../profile-link/profile-link';
import Loading from '../loading/loading';
import moment from 'moment';
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { Operation as MessengerOperation } from '../../reducers/messenger/messenger';
import TypingArea from '../typing-area/typing-area';
import hubConnection from '../../signalR';
import { MessageStatus } from '../../constants';

import './messages.scss';

const Messages: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const messageListRef = useRef<HTMLUListElement>(null);

  const user = useSelector(getUser);
  const chatEntity = useSelector(getChats);
  const messageEntity = useSelector(getMessages);
  const activeChat = useSelector(getActiveChatId);
  const activeMessagesIds = useSelector(getActiveChatMessages);
  const isMobileMessagesAreaOpen = useSelector(getMobileMessengerState);
  const isHubConnected = useSelector(getHubConnectionState);
  const isFetching = useSelector(getMessagesFetchingStatus);

  const isDesktop = useMediaQuery(mediaQueries.desktop);

  const messages = messageEntity.byId;

  const scrollDown = useCallback(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageListRef]);

  useLayoutEffect(() => {
    scrollDown();
  })  

  useEffect(() => {
    
    if (isHubConnected && activeChat) {

      dispatch(MessengerOperation.getMessages(activeChat as number));
      hubConnection.invoke('JoinGroup', activeChat.toString());
    }
  
  }, [activeChat, isHubConnected, dispatch, scrollDown]);

  const renderMessagesArea = () => {
    if (!isMobileMessagesAreaOpen && !isDesktop) return null;
    if (isFetching) {
      return (<section className="messenger__messages messages"> 
       <Loading />
      </section>)
    }
    return (
      <section className="messenger__messages messages"> 
        <header className="messages__header">
          {!isDesktop && <Button 
              className="messages__back-btn" 
              type="primary" 
              shape="circle" 
              icon={<LeftOutlined />} 
              onClick={() => { dispatch(ActionCreatorApp.changeMobileMessagesAreaState(false)) }} 
              size="small"
            />}
          <img className="messages__avatar avatar avatar--small" src={defaultAvatar} alt="avatar"/>
          <h3 className="messages__chatname">{activeChat && chatEntity.byId[activeChat].name}</h3>
        </header>
        <ul ref={messageListRef} className="messages__list scroll">
          {activeChat && activeMessagesIds.map((messageId: number, index, arr ) => {
            const message = messages[messageId];
            const previousSenderId = arr[index - 1] && messages[arr[index - 1]].userId;
            const isPreviousSenderSame = previousSenderId ? message.userId === previousSenderId: false;

            const isMineMessage = user?.id === message.userId;
            return (<li key={`message-${index}`} className={`messages__item ${isMineMessage ? 'messages__item--mine' : 'messages__item--not-mine'}`}>
              {!isMineMessage && !isPreviousSenderSame && <ProfileLink  />}
              <div className="messages__inner">
                <span>{message.content}</span>
                <span className="messages__datetime">{moment(message.dateTime).format('HH:MM')}</span>
                {isMineMessage && <div className="messages__status">
                  {message.status === MessageStatus.SENDING  && <Spin indicator={<LoadingOutlined spin />} />}
                  {message.status === MessageStatus.SUCCESS && <CheckOutlined />}
                  {message.status === MessageStatus.FAIL && <WarningOutlined />}
                </div>}
              </div>
            </li>)
          })
          }
        </ul>
        <TypingArea scrollDown={scrollDown} />
      </section>
    )

  }

  return renderMessagesArea();

};

export default Messages;