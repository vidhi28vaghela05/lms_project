import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, message, Space, Divider, Row, Col, Avatar, Tag } from 'antd';
import { UserOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [form] = Form.useForm();
    const [passForm] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setUser(res.data);
                form.setFieldsValue(res.data);
            } catch (error) {
                message.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [form]);

    const onUpdateProfile = async (values) => {
        try {
            const res = await api.put('/auth/profile', values);
            setUser(res.data);
            message.success('Profile updated successfully');
        } catch (error) {
            message.error('Profile update failed');
        }
    };

    const onChangePassword = async (values) => {
        try {
            await api.put('/auth/change-password', values);
            message.success('Password changed successfully');
            passForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Password update failed');
        }
    };

    if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>Synchronizing Profile...</div>;

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 40 }}>
                <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>Neural Profile Settings</Title>
                <Text style={{ color: '#8892b0' }}>Manage your biometric information and neural link security.</Text>
            </div>

            <Row gutter={[32, 32]}>
                <Col xs={24} md={16}>
                    <Card
                        className="glass-card"
                        style={{
                            borderRadius: 16,
                            border: '1px solid rgba(0, 209, 178, 0.1)'
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 24, color: '#fff' }}>Base Identity Data</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onUpdateProfile}
                        >
                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined style={{ color: '#00d1b2' }} />} />
                            </Form.Item>
                            <Form.Item name="email" label="Neural Identifier">
                                <Input disabled style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#8892b0' }} />
                            </Form.Item>
                            <Form.Item name="bio" label="Neural Bio / Career Log">
                                <Input.TextArea rows={4} placeholder="Protocol history and cognitive specializations..." />
                            </Form.Item>
                            <Form.Item name="upiId" label="Financial Interface (UPI ID)">
                                <Input placeholder="identifier@ledger" />
                            </Form.Item>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                htmlType="submit"
                                style={{
                                    height: '45px',
                                    borderRadius: '8px',
                                    padding: '0 24px'
                                }}
                            >
                                Update Profile
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card
                        className="glass-card"
                        style={{
                            borderRadius: 16,
                            marginBottom: 32,
                            textAlign: 'center',
                            border: '1px solid rgba(0, 209, 178, 0.1)'
                        }}
                    >
                        <Avatar
                            size={100}
                            icon={<UserOutlined />}
                            style={{
                                backgroundColor: 'rgba(0, 209, 178, 0.1)',
                                color: '#00d1b2',
                                border: '2px solid #00d1b2'
                            }}
                        />
                        <Title level={4} style={{ marginTop: 24, color: '#fff', marginBottom: 8 }}>{user?.name}</Title>
                        <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>{user?.role?.toUpperCase()}</Tag>
                    </Card>

                    <Card
                        className="glass-card"
                        style={{
                            borderRadius: 16,
                            border: '1px solid rgba(0, 209, 178, 0.1)'
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 24, color: '#fff' }}>Neural Passkeys</Title>
                        <Form
                            form={passForm}
                            layout="vertical"
                            onFinish={onChangePassword}
                        >
                            <Form.Item name="currentPassword" label="Active Passkey" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined style={{ color: '#00d1b2' }} />} />
                            </Form.Item>
                            <Form.Item name="newPassword" label="New Neural Link" rules={[{ required: true, min: 6 }]}>
                                <Input.Password prefix={<LockOutlined style={{ color: '#00d1b2' }} />} />
                            </Form.Item>
                            <Button
                                danger
                                block
                                htmlType="submit"
                                style={{
                                    height: '45px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    marginTop: 8
                                }}
                            >
                                Change Password
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProfilePage;
