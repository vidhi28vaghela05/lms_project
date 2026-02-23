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
            message.success('Neural profile updated');
        } catch (error) {
            message.error('Profile sync failed');
        }
    };

    const onChangePassword = async (values) => {
        try {
            await api.put('/auth/change-password', values);
            message.success('Authentication key modified successfully');
            passForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Password update failed');
        }
    };

    if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>Synchronizing Profile...</div>;

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <Title level={2}>Account Settings</Title>
            <Text type="secondary">Manage your identity and security protocols.</Text>

            <Row gutter={32} style={{ marginTop: 32 }}>
                <Col xs={24} md={16}>
                    <Card style={{ borderRadius: 16 }}>
                        <Title level={4}>Basic Information</Title>
                        <Divider />
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onUpdateProfile}
                        >
                            <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                                <Input prefix={<UserOutlined />} />
                            </Form.Item>
                            <Form.Item name="email" label="Email Address">
                                <Input disabled />
                            </Form.Item>
                            <Form.Item name="bio" label="Bio / Professional Summary">
                                <Input.TextArea rows={4} placeholder="Brief description of your skills and goals..." />
                            </Form.Item>
                            <Form.Item name="upiId" label="UPI ID (for potential rewards/payouts)">
                                <Input placeholder="username@bank" />
                            </Form.Item>
                            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                                Update Profile
                            </Button>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card style={{ borderRadius: 16, marginBottom: 24, textAlign: 'center' }}>
                        <Avatar size={100} icon={<UserOutlined />} style={{ backgroundColor: '#1d3557' }} />
                        <Title level={5} style={{ marginTop: 16 }}>{user?.name}</Title>
                        <Tag color="blue">{user?.role?.toUpperCase()}</Tag>
                    </Card>

                    <Card style={{ borderRadius: 16 }}>
                        <Title level={4}>Security</Title>
                        <Divider />
                        <Form
                            form={passForm}
                            layout="vertical"
                            onFinish={onChangePassword}
                        >
                            <Form.Item name="currentPassword" label="Current Pass" rules={[{ required: true }]}>
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                            <Form.Item name="newPassword" label="New Pass" rules={[{ required: true, min: 6 }]}>
                                <Input.Password prefix={<LockOutlined />} />
                            </Form.Item>
                            <Button danger block htmlType="submit">
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
