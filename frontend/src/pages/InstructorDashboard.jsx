import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, Card, Table, Statistic, Typography, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Progress, Tabs, Avatar, Tag, List, Divider } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar } from '@ant-design/plots';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    VideoCameraOutlined,
    QuestionCircleOutlined,
    DashboardOutlined,
    BookOutlined,
    TeamOutlined,
    DollarOutlined,
    MessageOutlined,
    UserOutlined,
    LockOutlined,
    SendOutlined,
    QrcodeOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import api from '../services/api';
import LessonManager from '../components/LessonManager';
import QuizManager from '../components/QuizManager';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InstructorDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Map routes to tab keys
    const tabMapping = {
        '/dashboard': 'dashboard',
        '/analytics': 'dashboard',
        '/manage-courses': 'courses',
        '/student-progress': 'students',
        '/instructor-earnings': 'earnings',
        '/instructor-support': 'support',
        '/instructor-profile': 'profile'
    };

    // Map tab keys back to routes for navigation
    const routeMapping = {
        'dashboard': '/dashboard',
        'courses': '/manage-courses',
        'students': '/student-progress',
        'earnings': '/instructor-earnings',
        'support': '/instructor-support',
        'profile': '/instructor-profile'
    };

    const activeTab = tabMapping[location.pathname] || 'dashboard';

    const [performance, setPerformance] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        avgScore: 0,
        completionRate: 0,
        payableAmount: 0,
        totalEarnings: 0,
        status: 'approved'
    });
    const [payouts, setPayouts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userData, setUserData] = useState(null);

    // Modals
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [editingCourse, setEditingCourse] = useState(null);
    const [activeCourseId, setActiveCourseId] = useState(null);

    const [courseForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const scrollRef = useRef(null);

    const fetchData = async () => {
        try {
            const [perfRes, courseRes, statsRes, payoutRes, reviewRes, msgRes, profileRes] = await Promise.all([
                api.get('/instructor/performance'),
                api.get('/courses'),
                api.get('/instructor/stats'),
                api.get('/instructor/payouts'),
                api.get('/instructor/reviews'),
                api.get('/instructor/messages'),
                api.get('/auth/me')
            ]);

            setPerformance(perfRes.data);
            setCourses(courseRes.data.filter(c => c.instructorId?._id === profileRes.data._id || c.instructorId === profileRes.data._id));
            setStats(statsRes.data);
            setPayouts(payoutRes.data);
            setReviews(reviewRes.data);
            setMessages(msgRes.data);
            setUserData(profileRes.data);
            profileForm.setFieldsValue(profileRes.data);
        } catch (error) {
            console.error('Error fetching instructor data', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(async () => {
            const msgRes = await api.get('/instructor/messages');
            setMessages(msgRes.data);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleCreateOrUpdate = async (values) => {
        try {
            if (editingCourse) {
                await api.put(`/courses/${editingCourse._id}`, values);
                message.success('Course updated');
            } else {
                await api.post('/courses', values);
                message.success('Course submitted for approval');
            }
            setIsCourseModalOpen(false);
            setEditingCourse(null);
            courseForm.resetFields();
            fetchData();
        } catch (error) {
            message.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const submitUpdateRequest = async (values) => {
        try {
            await api.post('/instructor/update-request', {
                courseId: activeCourseId,
                description: values.description,
                pendingData: values
            });
            message.success('Update request submitted to admin');
            setIsUpdateModalOpen(false);
            updateForm.resetFields();
        } catch (error) {
            message.error('Submission failed');
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await api.post('/instructor/messages', { message: newMessage });
            setNewMessage('');
            const msgRes = await api.get('/instructor/messages');
            setMessages(msgRes.data);
        } catch (error) {
            message.error('Message failed');
        }
    };

    const handleProfileUpdate = async (values) => {
        try {
            await api.put('/instructor/update-profile', values);
            message.success('Profile updated');
            fetchData();
        } catch (error) {
            message.error('Update failed');
        }
    };

    const handlePasswordChange = async (values) => {
        try {
            await api.put('/instructor/change-password', values);
            message.success('Password updated');
            setIsPasswordModalOpen(false);
            passwordForm.resetFields();
        } catch (error) {
            message.error(error.response?.data?.message || 'Change failed');
        }
    };

    const courseColumns = [
        { title: 'Course Title', dataIndex: 'title', key: 'title', render: (t) => <Text strong>{t}</Text> },
        { title: 'Price', dataIndex: 'price', render: (p) => `$${p}` },
        { title: 'Status', dataIndex: 'isApproved', render: (a) => a ? <Tag color="green">Approved</Tag> : <Tag color="orange">Pending</Tag> },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingCourse(record); courseForm.setFieldsValue(record); setIsCourseModalOpen(true); }} />
                    <Button icon={<VideoCameraOutlined />} onClick={() => { setActiveCourseId(record._id); setIsLessonModalOpen(true); }} />
                    <Button icon={<QuestionCircleOutlined />} onClick={() => { setActiveCourseId(record._id); setIsQuizModalOpen(true); }} />
                    <Button icon={<PlusOutlined />} onClick={() => { setActiveCourseId(record._id); setIsUpdateModalOpen(true); }}>Req Update</Button>
                </Space>
            )
        },
    ];

    return (
        <div style={{ background: 'transparent', minHeight: '100vh', padding: '24px' }} className="fade-in">
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col span={24}>
                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 16,
                                background: 'rgba(17, 34, 64, 0.7)',
                                border: '1px solid rgba(0, 209, 178, 0.1)',
                                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>Welcome back, {userData?.name}!</Title>
                                    <Text style={{ color: '#8892b0' }}>Manage your content, students, and track your revenue growth.</Text>
                                </div>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />}
                                    className="pulse-glow"
                                    style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}
                                    onClick={() => { setEditingCourse(null); courseForm.resetFields(); setIsCourseModalOpen(true); }}
                                >
                                    Create New Course
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Tabs
                    type="card"
                    className="instructor-tabs"
                    activeKey={activeTab}
                    onChange={(key) => navigate(routeMapping[key])}
                    style={{ color: '#ccd6f6' }}
                >
                    <TabPane tab={<span style={{ color: activeTab === 'dashboard' ? '#00d1b2' : '#8892b0' }}><DashboardOutlined /> Dashboard</span>} key="dashboard">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={6}>
                                <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.6)' }}><Statistic title={<span style={{ color: '#8892b0' }}>Enrolled Students</span>} value={stats.totalEnrollments} prefix={<TeamOutlined style={{ color: '#00d1b2' }} />} valueStyle={{ color: '#ccd6f6' }} /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.6)' }}><Statistic title={<span style={{ color: '#8892b0' }}>Course Completion</span>} value={stats.completionRate} suffix="%" valueStyle={{ color: '#00d1b2' }} /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.6)' }}><Statistic title={<span style={{ color: '#8892b0' }}>Avg Performance</span>} value={stats.avgScore} suffix="/100" valueStyle={{ color: '#00d1b2' }} /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.6)' }}><Statistic title={<span style={{ color: '#8892b0' }}>Account Status</span>} value={stats.status?.toUpperCase()} valueStyle={{ color: stats.status === 'approved' ? '#00d1b2' : '#faad14' }} /></Card>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                            <Col xs={24} lg={16}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Student Performance Growth</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    {performance.length > 0 ? (
                                        <Bar
                                            data={performance.map(p => ({
                                                name: p.studentId?.name || 'Unknown',
                                                score: p.performanceScore,
                                                course: p.courseId?.title
                                            }))}
                                            xField="score"
                                            yField="name"
                                            seriesField="course"
                                            height={350}
                                            theme="dark"
                                            color={['#00d1b2', '#009688', '#004d40']}
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: 40 }}><Text style={{ color: '#8892b0' }}>No enrollment data available yet.</Text></div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Recent Reviews</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    <List
                                        dataSource={reviews.slice(0, 5)}
                                        renderItem={item => (
                                            <List.Item style={{ borderColor: 'rgba(0, 209, 178, 0.1)' }}>
                                                <List.Item.Meta
                                                    title={<Text style={{ color: '#ccd6f6', fontWeight: 600 }}>{item.userId?.name} <Tag color="gold">{item.rating} ★</Tag></Text>}
                                                    description={<Paragraph ellipsis={{ rows: 2 }} style={{ color: '#8892b0', margin: 0 }}>{item.comment}</Paragraph>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab={<span style={{ color: activeTab === 'courses' ? '#00d1b2' : '#8892b0' }}><BookOutlined /> My Courses</span>} key="courses">
                        <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                            <Table
                                className="custom-dark-table"
                                dataSource={courses}
                                columns={courseColumns.map(col => ({
                                    ...col,
                                    title: <span style={{ color: '#8892b0' }}>{col.title}</span>
                                }))}
                                rowKey="_id"
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span style={{ color: activeTab === 'students' ? '#00d1b2' : '#8892b0' }}><TeamOutlined /> Student Progress</span>} key="students">
                        <Card className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                            <Table
                                className="custom-dark-table"
                                dataSource={performance}
                                columns={[
                                    { title: <span style={{ color: '#8892b0' }}>Student</span>, dataIndex: ['studentId', 'name'], render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                    { title: <span style={{ color: '#8892b0' }}>Course</span>, dataIndex: ['courseId', 'title'], render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                    { title: <span style={{ color: '#8892b0' }}>Progress</span>, dataIndex: 'progressPercentage', render: (v) => <Progress percent={v} size="small" strokeColor="#00d1b2" trailColor="rgba(255, 255, 255, 0.1)" /> },
                                    { title: <span style={{ color: '#8892b0' }}>Score</span>, dataIndex: 'performanceScore', render: (s) => <span style={{ color: '#00d1b2', fontWeight: 600 }}>{s}</span> }
                                ]}
                                rowKey="_id"
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span style={{ color: activeTab === 'earnings' ? '#00d1b2' : '#8892b0' }}><DollarOutlined /> Earnings</span>} key="earnings">
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Payable Balance</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    <Statistic
                                        value={stats.payableAmount}
                                        prefix="$"
                                        precision={2}
                                        valueStyle={{ color: '#00d1b2', fontSize: 32, fontWeight: 700 }}
                                    />
                                    <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)' }} />
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        disabled={stats.payableAmount <= 0}
                                        icon={<QrcodeOutlined />}
                                        style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}
                                        onClick={() => Modal.info({
                                            title: <span style={{ color: '#112240' }}>Payout QR Code</span>,
                                            content: (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Text type="secondary">Admin will scan this to pay your balance.</Text>
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${userData?.upiId}&pn=${userData?.name}&am=${stats.payableAmount}`}
                                                        alt="QR"
                                                        style={{ marginTop: 20, border: '4px solid #00d1b2', borderRadius: 8 }}
                                                    />
                                                    <Title level={4} style={{ marginTop: 15, color: '#00d1b2' }}>${stats.payableAmount}</Title>
                                                </div>
                                            )
                                        })}
                                    >
                                        Generate UPI Payout Snap
                                    </Button>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Lifetime Earnings (70%)</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    <Statistic value={stats.totalEarnings || 0} prefix="$" precision={2} valueStyle={{ color: '#ccd6f6' }} />
                                    <Text style={{ color: '#8892b0' }}>Platform takes 30% commission.</Text>
                                </Card>
                            </Col>
                        </Row>
                        <Card title={<span style={{ color: '#ccd6f6' }}>Payout History</span>} style={{ marginTop: 24, borderRadius: 16, background: 'rgba(17, 34, 64, 0.7)', border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                            <Table
                                className="custom-dark-table"
                                dataSource={payouts}
                                columns={[
                                    { title: <span style={{ color: '#8892b0' }}>Date</span>, dataIndex: 'payoutDate', render: d => <span style={{ color: '#ccd6f6' }}>{new Date(d).toLocaleDateString()}</span> },
                                    { title: <span style={{ color: '#8892b0' }}>Amount</span>, dataIndex: 'amount', render: a => <span style={{ color: '#00d1b2' }}>${a}</span> },
                                    { title: <span style={{ color: '#8892b0' }}>Ref</span>, dataIndex: 'transactionRef', render: (r) => <span style={{ color: '#8892b0' }}>{r}</span> },
                                    { title: <span style={{ color: '#8892b0' }}>Status</span>, dataIndex: 'status', render: s => <Tag color="cyan">{s.toUpperCase()}</Tag> }
                                ]}
                                rowKey="_id"
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span style={{ color: activeTab === 'support' ? '#00d1b2' : '#8892b0' }}><MessageOutlined /> Support</span>} key="support">
                        <Card title={<span style={{ color: '#ccd6f6' }}>Admin Chat Support</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                            <div
                                ref={scrollRef}
                                style={{ height: 400, overflowY: 'auto', marginBottom: 16, padding: 16, background: 'rgba(10, 25, 47, 0.6)', borderRadius: 12, border: '1px solid rgba(0, 209, 178, 0.1)' }}
                            >
                                {messages.map((m, idx) => (
                                    <div key={idx} style={{ textAlign: m.sender?._id === userData?._id ? 'right' : 'left', marginBottom: 16 }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '10px 18px',
                                            borderRadius: 20,
                                            background: m.sender?._id === userData?._id ? '#00d1b2' : 'rgba(17, 34, 64, 0.8)',
                                            color: m.sender?._id === userData?._id ? '#0a192f' : '#ccd6f6',
                                            maxWidth: '75%',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            border: m.sender?._id === userData?._id ? 'none' : '1px solid rgba(0, 209, 178, 0.2)'
                                        }}>
                                            <Text strong style={{ display: 'block', fontSize: 10, color: m.sender?._id === userData?._id ? '#0a192f' : '#00d1b2', opacity: 0.8, marginBottom: 4 }}>
                                                {m.sender?.role?.toUpperCase()}
                                            </Text>
                                            <span style={{ fontWeight: 500 }}>{m.message}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Space align="center" style={{ width: '100%', display: 'flex' }}>
                                <Input
                                    size="large"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#fff' }}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onPressEnter={handleSendMessage}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SendOutlined />}
                                    style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }}
                                    onClick={handleSendMessage}
                                />
                            </Space>
                        </Card>
                    </TabPane>

                    <TabPane tab={<span style={{ color: activeTab === 'profile' ? '#00d1b2' : '#8892b0' }}><UserOutlined /> Profile</span>} key="profile">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Account Information</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    <Form form={profileForm} layout="vertical" onFinish={handleProfileUpdate}>
                                        <Form.Item name="name" label={<span style={{ color: '#8892b0' }}>Full Name</span>}><Input style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 209, 178, 0.1)', color: '#fff' }} /></Form.Item>
                                        <Form.Item name="email" label={<span style={{ color: '#8892b0' }}>Email</span>}><Input disabled style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(0, 209, 178, 0.05)', color: '#8892B0' }} /></Form.Item>
                                        <Form.Item name="upiId" label={<span style={{ color: '#8892b0' }}>UPI ID (for payments)</span>}><Input placeholder="user@bank" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 209, 178, 0.1)', color: '#fff' }} /></Form.Item>
                                        <Form.Item name="registrationDescription" label={<span style={{ color: '#8892b0' }}>Professional Bio</span>}><Input.TextArea rows={4} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 209, 178, 0.1)', color: '#fff' }} /></Form.Item>
                                        <Button type="primary" htmlType="submit" style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}>Save Profile</Button>
                                    </Form>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title={<span style={{ color: '#ccd6f6' }}>Security</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                                    <Text style={{ color: '#8892b0' }}>Keep your account secure by updating your password regularly.</Text>
                                    <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)' }} />
                                    <Button icon={<LockOutlined />} style={{ color: '#00d1b2', border: '1px solid rgba(0, 209, 178, 0.3)', background: 'transparent' }} onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </div>

            {/* Modals */}
            <Modal title={editingCourse ? "Edit Course" : "New Course"} open={isCourseModalOpen} onCancel={() => setIsCourseModalOpen(false)} onOk={() => courseForm.submit()}>
                <Form form={courseForm} onFinish={handleCreateOrUpdate} layout="vertical">
                    <Form.Item name="title" label="Course Title" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea /></Form.Item>
                    <Form.Item name="price" label="Price ($)"><Input type="number" /></Form.Item>
                    <Form.Item name="level" label="Level"><Select options={[{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }]} /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Update Request" open={isUpdateModalOpen} onCancel={() => setIsUpdateModalOpen(false)} onOk={() => updateForm.submit()}>
                <Form form={updateForm} onFinish={submitUpdateRequest} layout="vertical">
                    <Form.Item name="description" label="Nature of Update" rules={[{ required: true }]}><Input.TextArea rows={4} placeholder="E.g. Adding new lecture, updating quiz content..." /></Form.Item>
                </Form>
            </Modal>

            <Modal title="Change Password" open={isPasswordModalOpen} onCancel={() => setIsPasswordModalOpen(false)} onOk={() => passwordForm.submit()}>
                <Form form={passwordForm} onFinish={handlePasswordChange} layout="vertical">
                    <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}><Input.Password /></Form.Item>
                    <Form.Item name="newPassword" label="New Password" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>
                </Form>
            </Modal>

            <LessonManager courseId={activeCourseId} visible={isLessonModalOpen} onCancel={() => setIsLessonModalOpen(false)} />
            <QuizManager courseId={activeCourseId} visible={isQuizModalOpen} onCancel={() => setIsQuizModalOpen(false)} />
        </div>
    );
};

export default InstructorDashboard;
