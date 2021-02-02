import React, { FC } from 'react';
import { Form, Input, Button, Typography } from 'antd';
const { Text } = Typography;

interface Props {
  onSubmitHandler: (values: any) => void,
  isFetching: boolean,
  setFormType: (type: string) => void
}

const layout = {
  labelCol: {
   span: 8
  },
  wrapperCol: {
    span: 16 
  },
};

const Reset: FC<Props> = ({ onSubmitHandler, isFetching, setFormType }) => { 
  return (
    <>
      <Form 
        {...layout}
        initialValues={{ remember: false }}
        onFinish={onSubmitHandler}
      >
        <Form.Item
          label="email"
          name="resetEmail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            }, 
            { 
              required: true, 
              message: 'Please input your email' 
            }]}
        >
          <Input placeholder="email" />
        </Form.Item>
        <Form.Item
            label="Password"
            name="resetPassword"
            rules={[{ required: true, message: 'Please input your password!', min: 5 }]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
        <Form.Item
          label="Repeat password"
          name="resetRepeatPassword"
          rules={[
            { required: true, message: 'Please repeat your password!' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
              if (!value || getFieldValue('resetPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Passwords do not match!');
              },
            }),
          ]}
          dependencies={['resetRepeatPassword']}
        >
          <Input.Password placeholder="repeat password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isFetching}>
            Reset
          </Button>
        </Form.Item>
      </Form>
      <Button 
        type="link" 
        onClick={() => { setFormType('login') }} 
      ><Text strong underline>Back to login</Text></Button>  
    </>
  );
}

export default Reset;