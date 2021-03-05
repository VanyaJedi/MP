import React, { useRef, useState, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Button, Input, Form } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import hubConnection from '../../signalR';
import { getActiveChatId } from '../../reducers/data/selectors';
import { getUser } from '../../reducers/user/selectors';
import { ActionCreator as ActionCreatorData } from '../../reducers/data/data';
import { MessageStatus } from '../../constants'; 
import { useSelector } from 'react-redux'
import { Message } from '../../types/interfaces';
import { uniqueId } from '../../utils/common';
import { MessageDto } from '../../types/dto';

import './typing-area.scss';


const { TextArea } = Input;

interface Props {
  scrollDown: () => void;
}

const TypingArea: React.FunctionComponent<Props>  = ({ scrollDown }: Props) => { 

  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const [form] = Form.useForm();


  const [isEmptyArea, setStateArea] = useState<boolean>(true);

  const typingAreaRef = useRef<HTMLDivElement>(null);
  const activeChat = useSelector(getActiveChatId);

  useLayoutEffect(() => {
    const message = form.getFieldValue("message");
    setStateArea(!message);
  }, [form])

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

      dispatch(ActionCreatorData.addMessage(message));
      form.resetFields();
      form.getFieldInstance("message").resizableTextArea.textArea.focus();
      setStateArea(true);
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
          dispatch(ActionCreatorData.modifyMessage(tempId, parsedMessage));
        })
        .catch((err) => {
          message.status = MessageStatus.FAIL;
          dispatch(ActionCreatorData.modifyMessage(tempId, message));
        })
    }
  }


  return (
    <Form
      form={form}
      name="typearea"
      onFinish={onSubmitHandler}
      onValuesChange={(values) => {
        const messageText = values.message;
        setStateArea(!messageText);
      }}
      onKeyDown={(e) => {
        const isEnter = (e.key === 'Enter');
            if (isEnter) {
                e.preventDefault();
                form.submit();
            }
      }}
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
          autoSize={{ minRows:1, maxRows: 8 }}
          placeholder="Text message here..."
        ></TextArea>  
      </Form.Item>
      
      <Button 
        className="typing-area__send-btn" 
        type="primary" 
        icon={<SendOutlined/>} 
        size="large"
        htmlType="submit"
        disabled={isEmptyArea}
      />
    </Form>
  );

};

export default TypingArea;