import React from 'react';
import { Form, Input, Button, Card, Select, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values) => {
        try {
            const { data } = await api.post('/auth/register', values);
            login(data);
            message.success('Registration successful! Welcome to the ecosystem.');
            navigate('/dashboard');
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed. Try again later.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            padding: '20px'
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: 480,
                    borderRadius: 20,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    border: 'none',
                    background: 'rgba(255, 255, 255, 0.95)'
                }}
                bodyStyle={{ padding: '40px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    <Title level={2} style={{ margin: 0, color: '#1d3557', fontWeight: 800 }}>Join the ecosystem</Title>
                    <Text type="secondary">Create your account to start learning or teaching.</Text>
                </div>

                <Form
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Your name is required!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Full Name"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Enter a valid email!' }]}
                    >
                        <Input
                            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Email Address"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="Password"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        initialValue="student"
                        rules={[{ required: true }]}
                    >
                        <Select style={{ borderRadius: 8 }}>
                            <Select.Option value="student">Student</Select.Option>
                            <Select.Option value="instructor">Instructor</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<RocketOutlined />}
                            style={{
                                height: 50,
                                borderRadius: 8,
                                background: '#e63946',
                                fontWeight: 600,
                                fontSize: 16,
                                border: 'none',
                                boxShadow: '0 4px 14px 0 rgba(230, 57, 70, 0.39)'
                            }}
                        >
                            Get Started
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Text type="secondary">Already have an account? </Text>
                        <Link to="/login" style={{ fontWeight: 600, color: '#1d3557' }}>Sign In</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
