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
        <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                    <Col span={24}>
                        <Card style={{ borderRadius: 16, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <Title level={2}>Welcome back, {userData?.name}!</Title>
                                    <Text type="secondary">Manage your content, students, and track your revenue growth.</Text>
                                </div>
                                <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => { setEditingCourse(null); courseForm.resetFields(); setIsCourseModalOpen(true); }}>
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
                >
                    <TabPane tab={<span><DashboardOutlined />Dashboard</span>} key="dashboard">
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={6}>
                                <Card className="stat-card"><Statistic title="Enrolled Students" value={stats.totalEnrollments} prefix={<TeamOutlined />} /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="stat-card"><Statistic title="Course Completion" value={stats.completionRate} suffix="%" /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="stat-card"><Statistic title="Avg Performance" value={stats.avgScore} suffix="/100" /></Card>
                            </Col>
                            <Col xs={24} sm={6}>
                                <Card className="stat-card"><Statistic title="Account Status" value={stats.status?.toUpperCase()} valueStyle={{ color: stats.status === 'approved' ? '#3f8600' : '#faad14' }} /></Card>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                            <Col xs={24} lg={16}>
                                <Card title="Student Performance Growth" style={{ borderRadius: 16 }}>
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
                                        />
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: 40 }}><Text type="secondary">No enrollment data available yet.</Text></div>
                                    )}
                                </Card>
                            </Col>
                            <Col xs={24} lg={8}>
                                <Card title="Recent Reviews" style={{ borderRadius: 16 }}>
                                    <List
                                        dataSource={reviews.slice(0, 5)}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    title={<Text strong>{item.userId?.name} <Tag color="gold">{item.rating} ★</Tag></Text>}
                                                    description={<Paragraph ellipsis={{ rows: 2 }}>{item.comment}</Paragraph>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab={<span><BookOutlined />My Courses</span>} key="courses">
                        <Card style={{ borderRadius: 16 }}>
                            <Table dataSource={courses} columns={courseColumns} rowKey="_id" />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><TeamOutlined />Student Progress</span>} key="students">
                        <Card style={{ borderRadius: 16 }}>
                            <Table
                                dataSource={performance}
                                columns={[
                                    { title: 'Student', dataIndex: ['studentId', 'name'] },
                                    { title: 'Course', dataIndex: ['courseId', 'title'] },
                                    { title: 'Progress', dataIndex: 'progressPercentage', render: (v) => <Progress percent={v} size="small" /> },
                                    { title: 'Score', dataIndex: 'performanceScore' }
                                ]}
                                rowKey="_id"
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><DollarOutlined />Earnings</span>} key="earnings">
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Card title="Payable Balance" className="stat-card">
                                    <Statistic
                                        value={stats.payableAmount}
                                        prefix="$"
                                        precision={2}
                                        valueStyle={{ color: '#e63946', fontSize: 32 }}
                                    />
                                    <Divider />
                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        disabled={stats.payableAmount <= 0}
                                        icon={<QrcodeOutlined />}
                                        onClick={() => Modal.info({
                                            title: 'Payout QR Code',
                                            content: (
                                                <div style={{ textAlign: 'center' }}>
                                                    <Text type="secondary">Admin will scan this to pay your balance.</Text>
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${userData?.upiId}&pn=${userData?.name}&am=${stats.payableAmount}`}
                                                        alt="QR"
                                                        style={{ marginTop: 20 }}
                                                    />
                                                    <Title level={4} style={{ marginTop: 10 }}>${stats.payableAmount}</Title>
                                                </div>
                                            )
                                        })}
                                    >
                                        Payable Snapshot (UPI)
                                    </Button>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Lifetime Earnings (70%)" className="stat-card">
                                    <Statistic value={stats.totalEarnings || 0} prefix="$" precision={2} />
                                    <Text type="secondary">Platform takes 30% commission.</Text>
                                </Card>
                            </Col>
                        </Row>
                        <Card title="Payout History" style={{ marginTop: 24, borderRadius: 16 }}>
                            <Table
                                dataSource={payouts}
                                columns={[
                                    { title: 'Date', dataIndex: 'payoutDate', render: d => new Date(d).toLocaleDateString() },
                                    { title: 'Amount', dataIndex: 'amount', render: a => `$${a}` },
                                    { title: 'Ref', dataIndex: 'transactionRef' },
                                    { title: 'Status', dataIndex: 'status', render: s => <Tag color="green">{s.toUpperCase()}</Tag> }
                                ]}
                                rowKey="_id"
                            />
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><MessageOutlined />Support</span>} key="support">
                        <Card title="Admin Chat Support" style={{ borderRadius: 16 }}>
                            <div
                                ref={scrollRef}
                                style={{ height: 400, overflowY: 'auto', marginBottom: 16, padding: 16, background: '#f1f1f1', borderRadius: 8 }}
                            >
                                {messages.map((m, idx) => (
                                    <div key={idx} style={{ textAlign: m.sender?._id === userData?._id ? 'right' : 'left', marginBottom: 16 }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '8px 16px',
                                            borderRadius: 16,
                                            background: m.sender?._id === userData?._id ? '#1d3557' : '#fff',
                                            color: m.sender?._id === userData?._id ? '#fff' : '#000',
                                            maxWidth: '70%',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                        }}>
                                            <Text strong style={{ display: 'block', fontSize: 10, color: m.sender?._id === userData?._id ? '#a8dadc' : '#457b9d' }}>
                                                {m.sender?.role?.toUpperCase()}
                                            </Text>
                                            {m.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Space align="center" style={{ width: '100%' }}>
                                <Input
                                    size="large"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onPressEnter={handleSendMessage}
                                />
                                <Button type="primary" size="large" icon={<SendOutlined />} onClick={handleSendMessage} />
                            </Space>
                        </Card>
                    </TabPane>

                    <TabPane tab={<span><UserOutlined />Profile</span>} key="profile">
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title="Account Information" style={{ borderRadius: 16 }}>
                                    <Form form={profileForm} layout="vertical" onFinish={handleProfileUpdate}>
                                        <Form.Item name="name" label="Full Name"><Input /></Form.Item>
                                        <Form.Item name="email" label="Email"><Input disabled /></Form.Item>
                                        <Form.Item name="upiId" label="UPI ID (for payments)"><Input placeholder="user@bank" /></Form.Item>
                                        <Form.Item name="registrationDescription" label="Professional Bio"><Input.TextArea rows={4} /></Form.Item>
                                        <Button type="primary" htmlType="submit">Save Profile</Button>
                                    </Form>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card title="Security" style={{ borderRadius: 16 }}>
                                    <Text>Keep your account secure by updating your password regularly.</Text>
                                    <Divider />
                                    <Button icon={<LockOutlined />} onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
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
