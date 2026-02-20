import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    // If already logged in, redirect to dashboard
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            await api.post('/auth/register', values);
            message.success('Identity Initialized Successfully');
            navigate('/login');
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Initialization failed';
            message.error(errorMessage);
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
                    maxWidth: 480,
                    borderRadius: 24,
                    padding: '24px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} style={{ margin: 0, color: '#1d3557' }}>Initialize Identity</Title>
                    <Text type="secondary">Join the LMS Autonomous Network</Text>
                </div>

                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    disabled={loading}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Official name required' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email Address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, min: 6, message: 'Security protocol requires 6+ characters' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item
                        name="role"
                        initialValue="student"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select Designation">
                            <Option value="student">Student Participant</Option>
                            <Option value="instructor">Lead Instructor</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<RocketOutlined />}
                            loading={loading}
                        >
                            Initialize
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text type="secondary">Already Enlisted? </Text>
                        <Link to="/login" style={{ fontWeight: 600, color: '#1d3557' }}>Access Portal</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
