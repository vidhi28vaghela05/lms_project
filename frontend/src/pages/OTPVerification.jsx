import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { SafetyOutlined, SendOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const OTPVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = React.useState(false);
    const [resending, setResending] = React.useState(false);
    const email = location.state?.email;

    React.useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/verify-otp', { email, code: values.code });
            message.success('Account Verified Successfully');
            sessionStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setLoading(false);
            message.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const resendOTP = async () => {
        try {
            setResending(true);
            await api.post('/auth/resend-otp', { email });
            message.success('New OTP sent to your email');
        } catch (error) {
            message.error(error.response?.data?.message || 'Resend failed');
        } finally {
            setResending(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#0a192f',
            padding: '20px'
        }}>
            <Card
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 24,
                    textAlign: 'center',
                    background: 'rgba(17, 34, 64, 0.7)',
                    border: '1px solid rgba(0, 209, 178, 0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <Title level={2} style={{ color: '#00d1b2', marginBottom: 8 }}>Identity Verification</Title>
                <Text style={{ color: '#8892b0' }}>Fragment sent to {email}</Text>

                <Form onFinish={onFinish} layout="vertical" size="large" style={{ marginTop: 32 }}>
                    <Form.Item name="code" rules={[{ required: true, len: 6, message: '6-digit code required' }]}>
                        <Input
                            prefix={<SafetyOutlined style={{ color: '#00d1b2' }} />}
                            placeholder="Verification Code"
                            style={{
                                letterSpacing: 8,
                                textAlign: 'center',
                                fontSize: 24,
                                fontWeight: 700,
                                background: 'rgba(10, 25, 47, 0.5)',
                                border: '1px solid rgba(0, 209, 178, 0.2)',
                                color: '#00d1b2',
                                borderRadius: 12,
                                height: 60
                            }}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, height: 50, borderRadius: 12, marginTop: 16 }}
                    >
                        Verify & Synchronize
                    </Button>
                </Form>

                <div style={{ marginTop: 24 }}>
                    <Button
                        type="link"
                        onClick={resendOTP}
                        loading={resending}
                        icon={<SendOutlined />}
                        style={{ color: '#00d1b2', fontWeight: 600 }}
                    >
                        Request New Fragment
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OTPVerification;
