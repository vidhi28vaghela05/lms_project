import React from 'react';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { MailOutlined, LockOutlined, ArrowRightOutlined } from '@ant-design/icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [captcha, setCaptcha] = React.useState({ data: '', token: '' });

    const fetchCaptcha = async () => {
        try {
            const response = await api.get('/auth/captcha');
            setCaptcha(response.data);
        } catch (error) {
            message.error('Failed to load captcha');
        }
    };

    React.useEffect(() => {
        fetchCaptcha();
    }, []);

    // If already logged in, redirect to dashboard
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const submissionData = {
                ...values,
                captchaToken: captcha.token
            };
            const { data } = await api.post('/auth/login', submissionData);

            if (!data.token || !data._id) {
                throw new Error('Invalid response from server');
            }

            if (data.role !== values.role) {
                setLoading(false);
                message.error(`Access Denied: You are not registered as a ${values.role}`);
                return;
            }

            login(data);
            form.resetFields();
            message.success('Welcome to the LMS Ecosystem');

            // Use setTimeout to ensure state updates complete before navigation
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } catch (error) {
            setLoading(false);
            const errData = error.response?.data;
            if (errData?.status) {
                message.info(errData.message);
            } else {
                message.error(errData?.message || 'Authentication failed');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at top right, rgba(0, 209, 178, 0.1), transparent), #0a192f',
            padding: '20px'
        }}>
            <Card
                className="glass-card fade-in"
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 24,
                    padding: '24px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={1} className="glow-text" style={{ margin: 0, fontSize: 32 }}>LMS</Title>
                    <Text style={{ fontSize: 16, color: '#8892b0' }}>Autonomous Learning Protocol</Text>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    disabled={loading}
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

                    <div style={{ marginBottom: 20 }}>
                        <div
                            dangerouslySetInnerHTML={{ __html: captcha.data }}
                            onClick={fetchCaptcha}
                            style={{ cursor: 'pointer', marginBottom: 8, textAlign: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, padding: '8px', border: '1px solid rgba(0, 209, 178, 0.1)' }}
                            title="Click to refresh captcha"
                        />
                        <Form.Item
                            name="captcha"
                            rules={[{ required: true, message: 'Please enter the code shown above' }]}
                        >
                            <Input placeholder="Enter Captcha Code" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="role"
                        initialValue="student"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select Portal">
                            <Select.Option value="student">Student Participant</Select.Option>
                            <Select.Option value="instructor">Lead Instructor</Select.Option>
                            <Select.Option value="admin">System Administrator</Select.Option>
                        </Select>
                    </Form.Item>

                    <div style={{ marginBottom: 24, textAlign: 'right' }}>
                        <Link to="/forgot-password" style={{ color: '#00d1b2', fontSize: 13 }}>Forgot Password?</Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<ArrowRightOutlined />}
                            loading={loading}
                            disabled={loading}
                            className="pulse-glow"
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'}
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Text style={{ color: '#8892b0' }}>New Participant? </Text>
                        <Link to="/register" style={{ fontWeight: 600, color: '#00d1b2' }}>Initialize Identity</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
