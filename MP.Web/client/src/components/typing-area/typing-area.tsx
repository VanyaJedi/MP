import React, { useRef } from 'react';
import { useDispatch } from 'react-redux'
import { Button, Input, Form } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import hubConnection from '../../signalR';
import { getActiveChatId } from '../../reducers/messenger/selectors';
import { getUser } from '../../reducers/user/selectors';
import { ActionCreator as ActionCreatorMessenger } from '../../reducers/messenger/messenger';
import { MessageStatus } from '../../constants'; 
import { useSelector } from 'react-redux'
import { Message } from '../../types/interfaces';
import { uniqueId } from '../../utils/common';

import './typing-area.scss';
import { MessageDto } from '../../types/dto';



const { TextArea } = Input;

interface Props {
  scrollDown: () => void;
}

const TypingArea: React.FunctionComponent<Props>  = ({ scrollDown }: Props) => { 

  const dispatch = useDispatch();

  const user = useSelector(getUser);

  const [form] = Form.useForm();
  const typingAreaRef = useRef<HTMLDivElement>(null);
  const activeChat = useSelector(getActiveChatId);

  const onSubmitHandler = (values: any) => {
    const messageText = values.message;
    const tempId = uniqueId();
    if (messageText && activeChat && user) {

      const message: Message = {
        tempId,
        userId: user.id,
        chatId: activeChat as number,
        content: messageText,
        status: MessageStatus.SENDING
      }

      dispatch(ActionCreatorMessenger.addMessage(message));
      scrollDown();

      hubConnection.invoke('Send', messageText, activeChat)
        .then((res) => {
          const messageItem: MessageDto = JSON.parse(res);
          const parsedMessage = {
            messageId: messageItem.MessageId,
            userId: messageItem.UserId,
            chatId: messageItem.ChatRoomId,
            content: messageItem.MessageText,
            dateTime: messageItem.DateTime,
            status: MessageStatus.SUCCESS,
          }
          dispatch(ActionCreatorMessenger.modifyMessage(tempId, parsedMessage));
        })
        .catch((err) => {
          message.status = MessageStatus.FAIL;
          dispatch(ActionCreatorMessenger.modifyMessage(tempId, message));
        })
    }
  }

  return (
    <Form
      form={form}
      onFinish={onSubmitHandler} 
      className="typing-area scroll"
      initialValues={{ message: "" }}
    >
      <Form.Item
        className="typing-area__form-item"
        name="message"
      >
        <TextArea
          className="scroll"
          ref={typingAreaRef} 
          autoSize={{ minRows:2, maxRows: 8 }}
          placeholder="Text message here..."
        ></TextArea>  
      </Form.Item>
      
      <Button 
        className="typing-area__send-btn" 
        type="primary" 
        icon={<SendOutlined/>} 
        size="large"
        htmlType="submit"
        disabled={form.getFieldValue("message") === ""}
      />
    </Form>
  );

};

export default TypingArea;