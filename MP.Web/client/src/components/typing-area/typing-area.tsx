import React, { FormEvent, useRef } from 'react';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import hubConnection from '../../signalR';
import { getActiveChatId } from '../../reducers/messenger/selectors';
import { useSelector } from 'react-redux'
import './typing-area.scss';


const TypingArea: React.FunctionComponent = () => { 
  
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const activeChat = useSelector(getActiveChatId);

  const onSubmitHandler = (evt: FormEvent) => {
    evt.preventDefault();
    const messageText = typingAreaRef.current?.innerText;
    hubConnection.invoke('Send', messageText, activeChat)
  }

  return (
    <form onSubmit={onSubmitHandler} className="typing-area scroll">
      <div ref={typingAreaRef} className="typing-area__text" contentEditable="true"></div>
      <Button 
        className="typing-area__send-btn" 
        type="primary" 
        icon={<SendOutlined/>} 
        size="large"
        htmlType="submit"
      />
    </form>
  );

};

export default TypingArea;