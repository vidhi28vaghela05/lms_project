import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await api.post('/auth/forgot-password', values);
            message.success('Password reset link sent to your email');
        } catch (error) {
            message.error(error.response?.data?.message || 'Request failed');
        } finally {
            setLoading(false);
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
            <Card className="glass-card" style={{ width: '100%', maxWidth: 400, borderRadius: 24 }}>
                <Title level={2} style={{ textAlign: 'center', color: '#1d3557' }}>Forgot Password</Title>
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
                    Enter your email to receive recovery instructions
                </Text>

                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 45, borderRadius: 12 }}>
                        Send Reset Link
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <Link to="/login" style={{ color: '#1d3557' }}>
                        <ArrowLeftOutlined /> Back to Portal
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
