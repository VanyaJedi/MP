import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { Button, Spin } from 'antd';
import { LeftOutlined, CheckOutlined, WarningOutlined, LoadingOutlined  } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { getActiveChatId, getActiveChatMessages, getMessagesFetchingStatus, getChats, getMessages, getUsers } from '../../reducers/messenger/selectors';
import { getUser } from '../../reducers/user/selectors';
import { getMobileMessengerState, getHubConnectionState } from '../../reducers/app/selectors';
import ProfileLink from '../profile-link/profile-link';
import Loading from '../loading/loading';
import moment from 'moment';
import useMediaQuery from '../../hooks/useMediaQuery';
import { mediaQueries } from '../../constants';
import { ActionCreator as ActionCreatorApp } from '../../reducers/app/app';
import { ActionCreator as ActionCreatorMessenger } from '../../reducers/messenger/messenger';
import { Operation as MessengerOperation } from '../../reducers/messenger/messenger';
import TypingArea from '../typing-area/typing-area';
import hubConnection from '../../signalR';
import { MessageStatus } from '../../constants';

import './messages.scss';
import { MessageDto } from '../../types/dto';
import { Chat } from '../../types/interfaces';


/*const getTimeDiffInMinutes = (start: Date, end: Date) => {
  const startDate = moment(start); 
  const endDate = moment(end);
  const duration = moment.duration(startDate.diff(endDate));
  const mins = duration.asMinutes();
  return mins;
} */

const Messages: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const messageListRef = useRef<HTMLUListElement>(null);

  const user = useSelector(getUser);
  const chatEntity = useSelector(getChats);
  const messageEntity = useSelector(getMessages);
  const userEntity = useSelector(getUsers);
  const activeChat = useSelector(getActiveChatId);
  const activeMessagesIds = useSelector(getActiveChatMessages);
  const isMobileMessagesAreaOpen = useSelector(getMobileMessengerState);
  const isHubConnected = useSelector(getHubConnectionState);
  const isFetching = useSelector(getMessagesFetchingStatus);

  const isTablet = useMediaQuery(mediaQueries.tablet);
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
      hubConnection.on('Send', (message) => {
        const messageItem: MessageDto = JSON.parse(message);
          const parsedMessage = {
            messageId: messageItem.MessageId,
            userId: messageItem.UserId,
            chatId: messageItem.ChatRoomId,
            content: messageItem.MessageText,
            dateTime: messageItem.DateTime,
            status: MessageStatus.SUCCESS,
          }
          dispatch(ActionCreatorMessenger.addMessage(parsedMessage));
      });
    }
  
  }, [activeChat, isHubConnected, dispatch, scrollDown]);


  const renderChatName = (chatItem: Chat) => {
    if(chatItem.isGroup) {
      return <h3>{chatItem.name}</h3>
    }

    const userId = chatItem.users[0].id;
    const user = userEntity.byId[userId];
    return <ProfileLink user={user} />
  }

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
              size={isTablet ? 'middle': 'small'}
            />}
            {activeChat && renderChatName(chatEntity.byId[activeChat])}
        </header>
        <ul ref={messageListRef} className="messages__list scroll">
          {activeChat && activeMessagesIds.map((messageId: number, index, arr ) => {
            const message = messages[messageId];
            const previousSenderId = arr[index - 1] && messages[arr[index - 1]].userId;
            const isPreviousSenderSame = previousSenderId ? message.userId === previousSenderId: false;
            const isMineMessage = user?.id === message.userId;
            
            return (<li key={`message-${index}`} className={`messages__item ${isMineMessage ? 'messages__item--mine' : 'messages__item--not-mine'}`}>
              {!isMineMessage && !isPreviousSenderSame &&  <ProfileLink user={userEntity.byId[message.userId]} onlyImg={true} />}
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