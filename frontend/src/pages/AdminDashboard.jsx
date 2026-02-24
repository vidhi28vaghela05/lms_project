import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Statistic, Typography, Tag, Space, Avatar, Tabs, Button, Modal, Form, Input, Select, Popconfirm, message, Switch } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    UserOutlined, GlobalOutlined, AppstoreOutlined, SafetyOutlined, PlusOutlined,
    WalletOutlined,
    IdcardOutlined,
    QrcodeOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [skills, setSkills] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStudents: 0,
        totalCourses: 0,
        totalInstructors: 0,
        todayIncome: 0,
        monthIncome: 0,
        totalRevenue: 0,
        totalPayable: 0
    });
    const [payouts, setPayouts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [settings, setSettings] = useState([]);
    const [pendingInstructors, setPendingInstructors] = useState([]);
    const [pendingCourses, setPendingCourses] = useState([]);
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [activeTab, setActiveTab] = useState('1');

    const [skillForm] = Form.useForm();
    const [payoutForm] = Form.useForm();
    const [categoryForm] = Form.useForm();
    const [userForm] = Form.useForm();

    const fetchData = async () => {
        try {
            const userRes = await api.get('/admin/users');
            setUsers(userRes.data);
            const courseRes = await api.get('/courses');
            setCourses(courseRes.data);
            const skillRes = await api.get('/skills');
            setSkills(skillRes.data);
            const statsRes = await api.get('/admin/analytics');
            setStats(statsRes.data);
            const payoutRes = await api.get('/admin/payouts');
            setPayouts(payoutRes.data);
            const reviewRes = await api.get('/admin/reviews');
            setReviews(reviewRes.data);
            const catRes = await api.get('/admin/categories');
            setCategories(catRes.data);
            const settingRes = await api.get('/admin/settings');
            setSettings(settingRes.data);
            const pendingPayRes = await api.get('/admin/payments/pending');
            setPendingPayments(pendingPayRes.data);

            setPendingInstructors(userRes.data.filter(u => u.role === 'instructor' && u.status === 'pending'));
            setPendingCourses(courseRes.data.filter(c => !c.isApproved || (c.updateRequest && c.updateRequest.status === 'pending')));
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    useEffect(() => {
        fetchData();
        // Set active tab based on path
        if (location.pathname === '/manage-users') setActiveTab('8');
        else if (location.pathname === '/system-stats') setActiveTab('9');
        else setActiveTab('1');
    }, [location.pathname]);

    const handleSkillSave = async (values) => {
        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill._id}`, values);
                message.success('Skill updated');
            } else {
                await api.post('/skills', values);
                message.success('Skill created');
            }
            setIsSkillModalOpen(false);
            fetchData();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Operation failed';
            message.error(errorMsg);
        }
    };


    const approveInstructor = async (userId) => {
        try {
            await api.post('/admin/approve-instructor', { userId, status: 'approved' });
            message.success('Instructor approved');
            fetchData();
        } catch (error) {
            message.error('Approval failed');
        }
    };

    const deleteSkill = async (id) => {
        try {
            await api.delete(`/skills/${id}`);
            message.success('Skill deleted');
            fetchData();
        } catch (error) {
            message.error('Delete failed');
        }
    };

    const approveCourse = async (courseId) => {
        try {
            await api.post(`/admin/approve-course/${courseId}`);
            message.success('Course approved');
            fetchData();
        } catch (error) {
            message.error('Approval failed');
        }
    };

    const handleUserSave = async (values) => {
        try {
            await api.put(`/admin/users/${editingUser._id}`, values);
            message.success('User updated');
            setIsUserModalOpen(false);
            fetchData();
        } catch (error) {
            message.error('Update failed');
        }
    };

    const toggleUserStatus = async (id) => {
        try {
            await api.patch(`/admin/users/${id}/toggle-status`);
            message.success('Status updated');
            fetchData();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleUpdate = async (courseId, action) => {
        try {
            await api.post('/admin/course-update', { courseId, action });
            message.success(`Update request ${action}ed`);
            fetchData();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const userColumns = [
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: '#457b9d' }}>{record.name[0]}</Avatar>
                    <Text strong>{record.name}</Text>
                </Space>
            )
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color={role === 'admin' ? 'red' : role === 'instructor' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Switch
                    checked={record.isActive}
                    onChange={() => toggleUserStatus(record._id)}
                    checkedChildren="Active"
                    unCheckedChildren="Inactive"
                />
            )
        }
    ];

    const skillColumns = [
        { title: 'Skill Name', dataIndex: 'skillName', key: 'skillName' },
        { title: 'Level', dataIndex: 'difficultyLevel', key: 'level' },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingSkill(record); skillForm.setFieldsValue(record); setIsSkillModalOpen(true); }} />
                    <Popconfirm title="Delete Skill?" onConfirm={() => deleteSkill(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 32 }}>
                <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>System Overview</Title>
                <Text style={{ color: '#8892b0' }}>Global administrative control and system health monitoring.</Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={4}>
                    <Card className="glass-card" bordered={false} style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.6)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Students</span>} value={stats.totalStudents} prefix={<UserOutlined style={{ color: '#00d1b2' }} />} valueStyle={{ color: '#ccd6f6' }} />
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="glass-card" bordered={false} style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.6)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Instructors</span>} value={stats.totalInstructors} prefix={<SafetyOutlined style={{ color: '#00d1b2' }} />} valueStyle={{ color: '#ccd6f6' }} />
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card className="glass-card" bordered={false} style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.6)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Courses</span>} value={stats.totalCourses} prefix={<AppstoreOutlined style={{ color: '#00d1b2' }} />} valueStyle={{ color: '#ccd6f6' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.7)', border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Total Revenue</span>} value={stats.totalRevenue} prefix="$" valueStyle={{ color: '#00d1b2', fontWeight: 700, textShadow: '0 0 10px rgba(0, 209, 178, 0.3)' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.7)', border: '1px solid rgba(230, 57, 70, 0.2)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Instructor Payables</span>} value={stats.totalPayable} prefix="$" valueStyle={{ color: '#ff4d4f', fontWeight: 700 }} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.6)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Today's Commission</span>} value={stats.todayIncome} prefix="$" valueStyle={{ color: '#00d1b2' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16, background: 'rgba(17, 34, 64, 0.6)' }}>
                        <Statistic title={<span style={{ color: '#8892b0' }}>Monthly Commission</span>} value={stats.monthIncome} prefix="$" valueStyle={{ color: '#00d1b2' }} />
                    </Card>
                </Col>
            </Row>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    if (key === '8') navigate('/manage-users');
                    else if (key === '9') navigate('/system-stats');
                    else if (key === '1') navigate('/dashboard');
                }}
                className="custom-tabs"
                style={{ color: '#ccd6f6' }}
            >
                <TabPane tab={<span style={{ color: activeTab === '1' ? '#00d1b2' : '#8892b0' }}>Instructors Vetting</span>} key="1">
                    <Card title={<span style={{ color: '#ccd6f6' }}>Pending Instructor Approvals</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table
                            className="custom-dark-table"
                            dataSource={pendingInstructors}
                            columns={[
                                ...userColumns.map(col => ({
                                    ...col,
                                    title: <span style={{ color: '#8892b0' }}>{col.title}</span>
                                })),
                                {
                                    title: <span style={{ color: '#8892b0' }}>Bio/Request</span>,
                                    dataIndex: 'registrationDescription',
                                    key: 'bio',
                                    ellipsis: true,
                                    render: (t) => <span style={{ color: '#8892b0' }}>{t}</span>
                                },
                                {
                                    title: <span style={{ color: '#8892b0' }}>Actions</span>,
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Space>
                                            <Button type="primary" style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }} onClick={() => approveInstructor(record._id)}>Approve</Button>
                                            <Button danger style={{ background: 'transparent', border: '1px solid #e63946', color: '#e63946' }} onClick={() => api.post('/admin/approve-instructor', { userId: record._id, status: 'rejected' }).then(fetchData)}>Reject</Button>
                                        </Space>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '3' ? '#00d1b2' : '#8892b0' }}>Payment Audit</span>} key="3">
                    <Card title={<span style={{ color: '#ccd6f6' }}>UPI Manual Verification Queue</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table
                            dataSource={pendingPayments}
                            columns={[
                                { title: <span style={{ color: '#8892b0' }}>Student</span>, dataIndex: ['userId', 'name'], render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Course</span>, dataIndex: ['courseId', 'title'], render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Transaction ID</span>, dataIndex: 'transactionId', render: (t) => <Tag color="cyan">{t}</Tag> },
                                { title: <span style={{ color: '#8892b0' }}>Amount</span>, dataIndex: 'amount', render: (a) => <span style={{ color: '#00d1b2' }}>${a}</span> },
                                {
                                    title: <span style={{ color: '#8892b0' }}>Actions</span>,
                                    render: (_, record) => (
                                        <Button
                                            type="primary"
                                            size="small"
                                            style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }}
                                            onClick={async () => {
                                                await api.post('/admin/confirm-payment', { paymentId: record._id });
                                                message.success('Payment verified & Enrollment activated');
                                                fetchData();
                                            }}
                                        >
                                            Confirm Receipt
                                        </Button>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '2' ? '#00d1b2' : '#8892b0' }}>Course Approvals</span>} key="2">
                    <Card title={<span style={{ color: '#ccd6f6' }}>New Courses & Update Requests</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table dataSource={pendingCourses} className="custom-dark-table" columns={[
                            { title: <span style={{ color: '#8892b0' }}>Title</span>, dataIndex: 'title', key: 'title', render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                            { title: <span style={{ color: '#8892b0' }}>Instructor</span>, dataIndex: ['instructorId', 'name'], key: 'instructor', render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                            {
                                title: <span style={{ color: '#8892b0' }}>Type</span>,
                                key: 'type',
                                render: (_, record) => !record.isApproved ? <Tag color="orange">NEW COURSE</Tag> : <Tag color="purple">UPDATE REQ</Tag>
                            },
                            {
                                title: <span style={{ color: '#8892b0' }}>Actions</span>,
                                key: 'actions',
                                render: (_, record) => (
                                    <Space>
                                        {!record.isApproved ? (
                                            <Button type="primary" size="small" style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }} onClick={() => approveCourse(record._id)}>Approve New</Button>
                                        ) : (
                                            <>
                                                <Button type="primary" size="small" style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }} onClick={() => handleUpdate(record._id, 'approve')}>Approve Update</Button>
                                                <Button danger size="small" style={{ background: 'transparent', border: '1px solid #e63946', color: '#e63946' }} onClick={() => handleUpdate(record._id, 'reject')}>Reject Update</Button>
                                            </>
                                        )}
                                    </Space>
                                )
                            }
                        ]} rowKey="_id" />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '4' ? '#00d1b2' : '#8892b0' }}>Financial Payouts</span>} key="4">
                    <Card title={<span style={{ color: '#ccd6f6' }}>Instructor Payout Management</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table
                            dataSource={users.filter(u => u.role === 'instructor')}
                            columns={[
                                { title: <span style={{ color: '#8892b0' }}>Instructor</span>, dataIndex: 'name', render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                { title: <span style={{ color: '#8892b0' }}>UPI ID</span>, dataIndex: 'upiId', render: (t) => <span style={{ color: '#8892b0' }}>{t}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Payable Amount</span>, dataIndex: 'payableAmount', render: (val) => <Text strong style={{ color: '#e63946' }}>${val}</Text> },
                                {
                                    title: <span style={{ color: '#8892b0' }}>Actions</span>,
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Button
                                            type="primary"
                                            disabled={record.payableAmount <= 0}
                                            icon={<QrcodeOutlined />}
                                            style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}
                                            onClick={() => { setSelectedInstructor(record); payoutForm.setFieldsValue({ instructorId: record._id, amount: record.payableAmount }); setIsPayoutModalOpen(true); }}
                                        >
                                            Generate Payout
                                        </Button>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '5' ? '#00d1b2' : '#8892b0' }}>Platform History</span>} key="5">
                    <Card title={<span style={{ color: '#ccd6f6' }}>Recent Instructor Payouts</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table
                            dataSource={payouts}
                            columns={[
                                { title: <span style={{ color: '#8892b0' }}>Date</span>, dataIndex: 'payoutDate', render: (d) => <span style={{ color: '#ccd6f6' }}>{new Date(d).toLocaleDateString()}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Instructor</span>, dataIndex: ['instructorId', 'name'], render: (t) => <span style={{ color: '#ccd6f6' }}>{t}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Amount</span>, dataIndex: 'amount', render: (a) => <span style={{ color: '#00d1b2' }}>${a}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Ref</span>, dataIndex: 'transactionRef', render: (r) => <span style={{ color: '#8892b0' }}>{r}</span> },
                                { title: <span style={{ color: '#8892b0' }}>Status</span>, dataIndex: 'status', render: (s) => <Tag color="cyan">{s.toUpperCase()}</Tag> }
                            ]}
                        />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '8' ? '#00d1b2' : '#8892b0' }}>User Management</span>} key="8">
                    <Card title={<span style={{ color: '#ccd6f6' }}>All Platform Users</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Table
                            dataSource={users}
                            columns={[
                                ...userColumns.map(col => ({
                                    ...col,
                                    title: <span style={{ color: '#8892b0' }}>{col.title}</span>,
                                    render: col.render || ((t) => <span style={{ color: '#ccd6f6' }}>{t}</span>)
                                })),
                                {
                                    title: <span style={{ color: '#8892b0' }}>Actions</span>,
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Space>
                                            <Button
                                                icon={<EditOutlined style={{ color: '#00d1b2' }} />}
                                                style={{ background: 'transparent', border: '1px solid rgba(0, 209, 178, 0.3)' }}
                                                onClick={() => {
                                                    setEditingUser(record);
                                                    userForm.setFieldsValue(record);
                                                    setIsUserModalOpen(true);
                                                }}
                                            />
                                            <Popconfirm title="Delete this user?" onConfirm={async () => {
                                                await api.delete(`/admin/users/${record._id}`);
                                                message.success('User deleted');
                                                fetchData();
                                            }}>
                                                <Button danger icon={<DeleteOutlined />} type="text" />
                                            </Popconfirm>
                                        </Space>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab={<span style={{ color: activeTab === '9' ? '#00d1b2' : '#8892b0' }}>System Settings</span>} key="9">
                    <Card title={<span style={{ color: '#ccd6f6' }}>Global Configuration</span>} className="glass-card" style={{ background: 'rgba(17, 34, 64, 0.7)' }}>
                        <Form
                            layout="vertical"
                            initialValues={{
                                commission: settings.find(s => s.key === 'commission')?.value || 30,
                                stripe_key: 'sk_test_••••••••'
                            }}
                            onFinish={async (values) => {
                                await api.post('/admin/settings', { key: 'commission', value: values.commission });
                                message.success('Settings updated');
                                fetchData();
                            }}
                        >
                            <Form.Item name="commission" label={<span style={{ color: '#8892b0' }}>Platform Commission (%)</span>} help={<span style={{ color: '#555' }}>Share of revenue taken by the platform.</span>}>
                                <Input type="number" suffix="%" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#fff' }} />
                            </Form.Item>
                            <Form.Item name="stripe_key" label={<span style={{ color: '#8892b0' }}>Stripe Private Key</span>} help={<span style={{ color: '#555' }}>Read-only for security here. Update in .env</span>}>
                                <Input.Password disabled style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(0, 209, 178, 0.05)', color: '#8892b0' }} />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}>Save Changes</Button>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>

            {/* Payout Modal */}
            <Modal
                title={<span style={{ color: '#112240' }}>Payout for ${selectedInstructor?.name}</span>}
                open={isPayoutModalOpen}
                onCancel={() => setIsPayoutModalOpen(false)}
                footer={null}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Card style={{ background: 'rgba(10, 25, 47, 0.05)', border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Text type="secondary">Scan to pay via UPI</Text><br />
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${selectedInstructor?.upiId}&pn=${selectedInstructor?.name}&am=${selectedInstructor?.payableAmount}`}
                            alt="UPI QR"
                            style={{ margin: '20px auto', display: 'block', border: '3px solid #00d1b2', borderRadius: 8 }}
                        />
                        <Title level={4} style={{ color: '#112240' }}>Amount: ${selectedInstructor?.payableAmount}</Title>
                        <Text code style={{ background: 'rgba(0, 209, 178, 0.05)' }}>{selectedInstructor?.upiId}</Text>
                    </Card>
                </div>
                <Form form={payoutForm} layout="vertical" onFinish={async (values) => {
                    await api.post('/admin/process-payout', values);
                    message.success('Payout log successful');
                    setIsPayoutModalOpen(false);
                    fetchData();
                }}>
                    <Form.Item name="instructorId" hidden><Input /></Form.Item>
                    <Form.Item name="amount" hidden><Input /></Form.Item>
                    <Form.Item name="transactionRef" label="Transaction Reference (Internal ID)" rules={[{ required: true }]}>
                        <Input placeholder="Enter ref from your payment app" />
                    </Form.Item>
                    <Button type="primary" block htmlType="submit" style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}>Confirm Payout Processed</Button>
                </Form>
            </Modal>

            <Modal title={editingSkill ? "Edit Skill" : "Add Skill"} open={isSkillModalOpen} onCancel={() => setIsSkillModalOpen(false)} onOk={() => skillForm.submit()}>
                <Form form={skillForm} onFinish={handleSkillSave} layout="vertical">
                    <Form.Item name="skillName" label="Skill Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="difficultyLevel" label="Level" initialValue="beginner">
                        <Select>
                            <Select.Option value="beginner">Beginner</Select.Option>
                            <Select.Option value="intermediate">Intermediate</Select.Option>
                            <Select.Option value="advanced">Advanced</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Edit User"
                open={isUserModalOpen}
                onCancel={() => setIsUserModalOpen(false)}
                onOk={() => userForm.submit()}
            >
                <Form form={userForm} onFinish={handleUserSave} layout="vertical">
                    <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                        <Input icon={<UserOutlined />} />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="role" label="System Role">
                        <Select>
                            <Select.Option value="student">Student</Select.Option>
                            <Select.Option value="instructor">Instructor</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
