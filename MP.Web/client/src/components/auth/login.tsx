import React, { FC } from 'react';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthData } from '../../types/interfaces';
const { Text } = Typography;

interface Props {
  onSubmitHandler: (values: AuthData) => void,
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

const Login: FC<Props> = ({ onSubmitHandler, isFetching, setFormType }) => { 
  return (
    <>
      <Form 
        {...layout}
        initialValues={{ remember: false }}
        onFinish={onSubmitHandler}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined className="auth__prefix-icon" />} placeholder="username or email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password prefix={<LockOutlined className="auth__prefix-icon" />}  placeholder="password" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item className="auth__submit-btn">
          <Button type="primary" htmlType="submit" loading={isFetching}>
          Login
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => { setFormType('signin') }}>
        <Text strong underline>Register now</Text>
      </Button>  
      <Button style={{display: 'block'}}type="link" onClick={() => { setFormType('reset') }}>
        <Text strong underline>Reset password</Text>
      </Button>
    </>
  );
}

export default Login;