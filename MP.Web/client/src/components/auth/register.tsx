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

const Register: FC<Props> = ({ onSubmitHandler, isFetching, setFormType }) => { 
  return (
    <>
      <Form 
        {...layout}
        onFinish={onSubmitHandler}
      >
        <Form.Item
          label="Email"
          name="regEmail"
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
          label="Username"
          name="regUsername"
          rules={[{ required: true, message: 'Please input your user name' }]}
        >
          <Input placeholder="username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="regPassword"
          rules={[{ required: true, message: 'Please input your password!', min: 5 }]}
        >
          <Input.Password placeholder="password" />
        </Form.Item>
        <Form.Item
          label="Repeat password"
          name="regRepeatPassword"
          rules={[
            { required: true, message: 'Please repeat your password!' },
            ({ getFieldValue }) => ({
              validator(rule, value) {
              if (!value || getFieldValue('regPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject('Passwords do not match!');
              },
            }),
          ]}
          dependencies={['regPassword']}
        >
          <Input.Password placeholder="repeat password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isFetching}>
          Sign up
          </Button>
        </Form.Item>
      </Form>
      <Button 
        type="link" 
        onClick={() => { setFormType('login') }} 
      ><Text strong underline>Back to login</Text></Button>  
    </>);
}

export default Register;