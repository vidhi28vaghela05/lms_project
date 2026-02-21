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
    const [displayCode, setDisplayCode] = React.useState(location.state?.verificationCode);
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
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            setLoading(false);
            message.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const resendOTP = async () => {
        try {
            setResending(true);
            const response = await api.post('/auth/resend-otp', { email });
            setDisplayCode(response.data.verificationCode);
            message.success('New verification code generated and displayed.');
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
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            padding: '20px'
        }}>
            <Card className="glass-card" style={{ width: '100%', maxWidth: 400, borderRadius: 24, textAlign: 'center' }}>
                <Title level={2} style={{ color: '#1d3557' }}>Verify Identity</Title>
                <Text type="secondary">Verification required for {email}</Text>

                {displayCode && (
                    <div style={{
                        marginTop: 20,
                        padding: '16px',
                        background: 'rgba(230, 57, 70, 0.1)',
                        border: '2px dashed #e63946',
                        borderRadius: 12
                    }}>
                        <Text strong style={{ color: '#e63946', fontSize: 16 }}>Verification CAPTCHA Code:</Text>
                        <div style={{ fontSize: 32, fontWeight: 'bold', letterSpacing: 8, color: '#1d3557', marginTop: 8 }}>
                            {displayCode}
                        </div>
                    </div>
                )}

                <Form onFinish={onFinish} layout="vertical" size="large" style={{ marginTop: 24 }}>
                    <Form.Item name="code" rules={[{ required: true, len: 6, message: '6-digit code required' }]}>
                        <Input prefix={<SafetyOutlined />} placeholder="Verification Code" style={{ letterSpacing: 4, textAlign: 'center', fontSize: 20 }} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 45, borderRadius: 12 }}>
                        Verify & Access
                    </Button>
                </Form>

                <div style={{ marginTop: 20 }}>
                    <Button type="link" onClick={resendOTP} loading={resending} icon={<SendOutlined />}>
                        Resend Code
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default OTPVerification;
