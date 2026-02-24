import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await api.post(`/auth/reset-password/${token}`, { password: values.password });
            message.success('Password updated successfully');
            navigate('/login');
        } catch (error) {
            message.error(error.response?.data?.message || 'Reset failed');
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
                <Title level={2} style={{ textAlign: 'center', color: '#00d1b2', marginBottom: 8 }}>Credential Reset</Title>
                <Text style={{ display: 'block', textAlign: 'center', marginBottom: 32, color: '#8892b0' }}>
                    Define your new neural security credentials.
                </Text>

                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Security protocol requires 6+ characters' }]}>
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#00d1b2' }} />}
                            placeholder="New Passkey"
                            style={{ background: 'rgba(10, 25, 47, 0.5)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#ccd6f6', borderRadius: 8 }}
                        />
                    </Form.Item>
                    <Form.Item name="confirm" dependencies={['password']} rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('Credentials mismatch'));
                            },
                        }),
                    ]}>
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#00d1b2' }} />}
                            placeholder="Confirm New Passkey"
                            style={{ background: 'rgba(10, 25, 47, 0.5)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#ccd6f6', borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        icon={<RocketOutlined />}
                        style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, height: 50, borderRadius: 12, marginTop: 16 }}
                    >
                        Update Security Key
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
