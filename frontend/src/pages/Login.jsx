import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const onFinish = async (values) => {
        try {
            const { data } = await api.post('/auth/login', values);
            login(data);
            message.success('Welcome to the LMS Ecosystem');
            navigate('/dashboard');
        } catch (error) {
            message.error(error.response?.data?.message || 'Authentication failed');
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
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 24,
                    padding: '24px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={1} style={{ margin: 0, color: '#1d3557', fontSize: 32 }}>LMS</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>Autonomous Learning Protocol</Text>
                </div>

                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Enter your institutional email' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Password is required' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block icon={<ArrowRightOutlined />}>
                            Access Dashboard
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Text type="secondary">New Participant? </Text>
                        <Link to="/register" style={{ fontWeight: 600, color: '#e63946' }}>Initialize Identity</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
