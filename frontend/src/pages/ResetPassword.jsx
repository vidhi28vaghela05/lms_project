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
            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
            padding: '20px'
        }}>
            <Card className="glass-card" style={{ width: '100%', maxWidth: 400, borderRadius: 24 }}>
                <Title level={2} style={{ textAlign: 'center', color: '#1d3557' }}>Reset Password</Title>
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
                    Define your new security credentials
                </Text>

                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Security protocol requires 6+ characters' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="New Password" />
                    </Form.Item>
                    <Form.Item name="confirm" dependencies={['password']} rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block loading={loading} icon={<RocketOutlined />} style={{ height: 45, borderRadius: 12 }}>
                        Update Password
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
