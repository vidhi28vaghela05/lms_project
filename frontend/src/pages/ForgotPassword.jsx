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
            background: '#0a192f',
            padding: '20px'
        }}>
            <Card
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 24,
                    background: 'rgba(17, 34, 64, 0.7)',
                    border: '1px solid rgba(0, 209, 178, 0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <Title level={2} style={{ textAlign: 'center', color: '#00d1b2', marginBottom: 8 }}>Recovery Portal</Title>
                <Text style={{ display: 'block', textAlign: 'center', marginBottom: 32, color: '#8892b0' }}>
                    Initiate neural credential retrieval sequence.
                </Text>

                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
                        <Input
                            prefix={<MailOutlined style={{ color: '#00d1b2' }} />}
                            placeholder="Neural Identifier (Email)"
                            style={{ background: 'rgba(10, 25, 47, 0.5)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#ccd6f6', borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, height: 50, borderRadius: 12, marginTop: 16 }}
                    >
                        Transmit Recovery Link
                    </Button>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Link to="/login" style={{ color: '#00d1b2', fontWeight: 600 }}>
                        <ArrowLeftOutlined /> Back to Main Terminal
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
