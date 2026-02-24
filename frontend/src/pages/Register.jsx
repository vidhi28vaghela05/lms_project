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
    const [captcha, setCaptcha] = React.useState({ data: '', token: '' });
    const { login } = useAuth();

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
            const response = await api.post('/auth/register', submissionData);

            // Auto login after registration
            login(response.data);
            message.success('Account initialized successfully!');
            navigate('/dashboard');
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Initialization failed';
            message.error(errorMessage);
            fetchCaptcha(); // Refresh captcha on error
            form.setFieldsValue({ captcha: '' });
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
                    maxWidth: 480,
                    borderRadius: 24,
                    padding: '24px'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2} className="glow-text" style={{ margin: 0 }}>Initialize Identity</Title>
                    <Text style={{ color: '#8892b0' }}>Join the LMS Autonomous Network</Text>
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
                            <Option value="admin">System Administrator</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
                        {({ getFieldValue }) =>
                            getFieldValue('role') === 'instructor' ? (
                                <>
                                    <Form.Item
                                        name="registrationDescription"
                                        label="Professional Background"
                                        rules={[{ required: true, message: 'Please describe your expertise' }]}
                                    >
                                        <Input.TextArea placeholder="Describe your teaching experience and skills..." rows={4} />
                                    </Form.Item>
                                    <Form.Item
                                        name="upiId"
                                        label="Payment ID (UPI)"
                                        rules={[{ required: true, message: 'UPI ID required for payouts' }]}
                                    >
                                        <Input placeholder="e.g. yourname@okaxis" />
                                    </Form.Item>
                                </>
                            ) : null
                        }
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

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            icon={<RocketOutlined />}
                            loading={loading}
                            className="pulse-glow"
                        >
                            Initialize
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text style={{ color: '#8892b0' }}>Already Enlisted? </Text>
                        <Link to="/login" style={{ fontWeight: 600, color: '#00d1b2' }}>Access Portal</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
