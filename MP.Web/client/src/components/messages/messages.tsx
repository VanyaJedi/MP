import React, { useRef, useEffect } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux'
import { getActiveChatId, getActiveChatMessages, getMessagesFetchingStatus } from '../../reducers/messenger/selectors';
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

import './messages.scss';

const Messages: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const messageListRef = useRef<HTMLUListElement>(null);

  const activeChat = useSelector(getActiveChatId);
  const chatMessages = useSelector(getActiveChatMessages);
  const isMobileMessagesAreaOpen = useSelector(getMobileMessengerState);
  const isHubConnected = useSelector(getHubConnectionState);
  const isFetching = useSelector(getMessagesFetchingStatus);

  const isDesktop = useMediaQuery(mediaQueries.desktop);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
    if (activeChat) {
      dispatch(MessengerOperation.updateMessages(activeChat));
    }
    if (isHubConnected && activeChat) {
      hubConnection.invoke('JoinGroup', activeChat.toString());
      hubConnection.on('send', (message, username) => {
        console.log(message, username);
      })
    }
  
  }, [activeChat, isHubConnected, dispatch]);

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
          <h3 className="messages__chatname">{chatMessages && chatMessages.chatName}</h3>
        </header>
        <ul ref={messageListRef} className="messages__list scroll">
          {chatMessages && chatMessages.messages.map((message, index, arr ) => {
            const previousSenderId = arr[index-1] &&  arr[index-1].user!.id;
            const isPreviousSenderSame = previousSenderId ? message.user!.id === previousSenderId: false;
            return (<li key={`message-${index}`} className={`messages__item ${message.isMine ? 'messages__item--mine' : 'messages__item--not-mine'}`}>
              {!message.isMine && !isPreviousSenderSame && <ProfileLink user={message.user} />}
              <div className="messages__inner">
                <span>{message.content}</span>
                <span className="messages__datetime">{moment(message.dateTime).format('HH:MM')}</span>
              </div>
            </li>)
          })
          }
        </ul>
        <TypingArea />
      </section>
    )

  }

  return renderMessagesArea();

};

export default Messages;