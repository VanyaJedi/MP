import React, { FormEvent, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { Button, Input, Form } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import hubConnection from '../../signalR';
import { getActiveChatId } from '../../reducers/messenger/selectors';
import { getUser } from '../../reducers/user/selectors';
import { ActionCreator as ActionCreatorMessenger } from '../../reducers/messenger/messenger';
import { useSelector } from 'react-redux'
import './typing-area.scss';


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
    console.log(messageText);

    if (messageText && activeChat && user) {
      dispatch(ActionCreatorMessenger.addMessage(messageText, activeChat, user.id));

      hubConnection.invoke('Send', messageText, activeChat)
      .then((res) => {
        scrollDown();
        console.log(res);
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