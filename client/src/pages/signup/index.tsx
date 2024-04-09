import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, message } from 'antd';
import styles from './Signup.module.css';
import Link from "next/link";

const Signup = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onFormFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5005/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Signup successful!");
        router.push("/login");
      } else {
        message.error(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      message.error("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={onFormFinish} className="signup-form">
        <div className="signup-title">Sign Up</div>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Sign Up
          </Button>
        </Form.Item>
        <Link href="/">Back to Home</Link>
      </Form>
    </div>
  );
};


export default Signup;
