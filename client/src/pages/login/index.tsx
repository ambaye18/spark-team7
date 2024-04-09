import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, message } from 'antd';

const Login = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onFormFinish = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success('Login successful!');
        router.push('/main');
      } else {
        message.error(data.message || 'Login failed!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={onFormFinish} className="login-form">
        <div className="login-title">Login</div>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Log In
          </Button>
        </Form.Item>
        <a href="/">Back to Home</a>
      </Form>
    </div>
  );
};

export default Login;
