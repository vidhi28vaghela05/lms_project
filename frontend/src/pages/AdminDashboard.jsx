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
    const [pendingPayments, setPendingPayments] = useState([]);
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1d3557' }}>System Overview</Title>
                <Text type="secondary">Global administrative control and system health monitoring.</Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={4}>
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Statistic title="Students" value={stats.totalStudents} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Statistic title="Instructors" value={stats.totalInstructors} prefix={<SafetyOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={4}>
                    <Card bordered={false} style={{ borderRadius: 16 }}>
                        <Statistic title="Courses" value={stats.totalCourses} prefix={<AppstoreOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16 }}>
                        <Statistic title="Total Revenue" value={stats.totalRevenue} prefix="$" valueStyle={{ color: '#3f8600' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16, border: '1px solid #e63946' }}>
                        <Statistic title="Instructor Payables" value={stats.totalPayable} prefix="$" valueStyle={{ color: '#e63946' }} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16 }}>
                        <Statistic title="Today's Commission" value={stats.todayIncome} prefix="$" valueStyle={{ color: '#1d3557' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card bordered={false} className="glass-card" style={{ borderRadius: 16 }}>
                        <Statistic title="Monthly Commission" value={stats.monthIncome} prefix="$" valueStyle={{ color: '#457b9d' }} />
                    </Card>
                </Col>
            </Row>

            <Tabs
                activeKey={activeTab}
                onChange={(key) => {
                    setActiveTab(key);
                    // Sync URL if needed
                    if (key === '8') navigate('/manage-users');
                    else if (key === '9') navigate('/system-stats');
                    else if (key === '1') navigate('/dashboard');
                }}
                className="custom-tabs"
            >
                <TabPane tab="Instructors Vetting" key="1">
                    <Card title="Pending Instructor Approvals" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={pendingInstructors}
                            columns={[
                                ...userColumns,
                                {
                                    title: 'Bio/Request',
                                    dataIndex: 'registrationDescription',
                                    key: 'bio',
                                    ellipsis: true
                                },
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Space>
                                            <Button type="primary" onClick={() => approveInstructor(record._id)}>Approve</Button>
                                            <Button danger onClick={() => api.post('/admin/approve-instructor', { userId: record._id, status: 'rejected' }).then(fetchData)}>Reject</Button>
                                        </Space>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab="Course Approvals" key="2">
                    <Card title="New Courses & Update Requests" style={{ borderRadius: 16 }}>
                        <Table dataSource={pendingCourses} columns={[
                            { title: 'Title', dataIndex: 'title', key: 'title' },
                            { title: 'Instructor', dataIndex: ['instructorId', 'name'], key: 'instructor' },
                            {
                                title: 'Type',
                                key: 'type',
                                render: (_, record) => !record.isApproved ? <Tag color="orange">NEW COURSE</Tag> : <Tag color="purple">UPDATE REQ</Tag>
                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (_, record) => (
                                    <Space>
                                        {!record.isApproved ? (
                                            <Button type="primary" size="small" onClick={() => approveCourse(record._id)}>Approve New</Button>
                                        ) : (
                                            <>
                                                <Button type="primary" size="small" onClick={() => handleUpdate(record._id, 'approve')}>Approve Update</Button>
                                                <Button danger size="small" onClick={() => handleUpdate(record._id, 'reject')}>Reject Update</Button>
                                            </>
                                        )}
                                    </Space>
                                )
                            }
                        ]} rowKey="_id" />
                    </Card>
                </TabPane>
                <TabPane tab="Financial Payouts" key="4">
                    <Card title="Instructor Payout Management" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={users.filter(u => u.role === 'instructor')}
                            columns={[
                                { title: 'Instructor', dataIndex: 'name' },
                                { title: 'UPI ID', dataIndex: 'upiId' },
                                { title: 'Payable Amount', dataIndex: 'payableAmount', render: (val) => <Text strong style={{ color: '#e63946' }}>${val}</Text> },
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Button
                                            type="primary"
                                            disabled={record.payableAmount <= 0}
                                            icon={<QrcodeOutlined />}
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
                <TabPane tab="Platform History" key="5">
                    <Card title="Recent Instructor Payouts" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={payouts}
                            columns={[
                                { title: 'Date', dataIndex: 'payoutDate', render: (d) => new Date(d).toLocaleDateString() },
                                { title: 'Instructor', dataIndex: ['instructorId', 'name'] },
                                { title: 'Amount', dataIndex: 'amount', render: (a) => `$${a}` },
                                { title: 'Ref', dataIndex: 'transactionRef' },
                                { title: 'Status', dataIndex: 'status', render: (s) => <Tag color="green">{s.toUpperCase()}</Tag> }
                            ]}
                        />
                    </Card>
                </TabPane>
                <TabPane tab="Reviews Moderation" key="6">
                    <Card title="Global Review Feed" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={reviews}
                            columns={[
                                { title: 'User', dataIndex: ['userId', 'name'] },
                                { title: 'Course', dataIndex: ['courseId', 'title'] },
                                { title: 'Rating', dataIndex: 'rating', render: (r) => <Tag color="gold">{r} ★</Tag> },
                                { title: 'Comment', dataIndex: 'comment', ellipsis: true },
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Popconfirm title="Delete this review?" onConfirm={async () => {
                                            await api.delete(`/admin/review/${record._id}`);
                                            message.success('Review removed');
                                            fetchData();
                                        }}>
                                            <Button danger icon={<DeleteOutlined />} type="text" />
                                        </Popconfirm>
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab="Categories" key="7">
                    <Card
                        title="Course Categories"
                        extra={<Button type="primary" onClick={() => { categoryForm.resetFields(); setIsCategoryModalOpen(true); }}>Add Category</Button>}
                        style={{ borderRadius: 16 }}
                    >
                        <Table
                            dataSource={categories}
                            columns={[
                                { title: 'Name', dataIndex: 'name' },
                                { title: 'Description', dataIndex: 'description' },
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Button danger icon={<DeleteOutlined />} onClick={async () => {
                                            await api.delete(`/admin/categories/${record._id}`);
                                            message.success('Category deleted');
                                            fetchData();
                                        }} />
                                    )
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
                <TabPane tab="User Management" key="8">
                    <Card title="All Platform Users" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={users}
                            columns={[
                                ...userColumns,
                                {
                                    title: 'Actions',
                                    key: 'actions',
                                    render: (_, record) => (
                                        <Space>
                                            <Button
                                                icon={<EditOutlined />}
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
                <TabPane tab="System Settings" key="9">
                    <Card title="Global Configuration" style={{ borderRadius: 16 }}>
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
                            <Form.Item name="commission" label="Platform Commission (%)" help="Share of revenue taken by the platform.">
                                <Input type="number" suffix="%" />
                            </Form.Item>
                            <Form.Item name="stripe_key" label="Stripe Private Key" help="Read-only for security here. Update in .env">
                                <Input.Password disabled />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">Save Changes</Button>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>

            {/* Category Modal */}
            <Modal title="Add Category" open={isCategoryModalOpen} onCancel={() => setIsCategoryModalOpen(false)} onOk={() => categoryForm.submit()}>
                <Form form={categoryForm} onFinish={async (values) => {
                    await api.post('/admin/categories', values);
                    message.success('Category created');
                    setIsCategoryModalOpen(false);
                    fetchData();
                }} layout="vertical">
                    <Form.Item name="name" label="Category Name" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="description" label="Description"><Input.TextArea /></Form.Item>
                </Form>
            </Modal>

            {/* Payout Modal */}
            <Modal
                title={`Payout for ${selectedInstructor?.name}`}
                open={isPayoutModalOpen}
                onCancel={() => setIsPayoutModalOpen(false)}
                footer={null}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Card style={{ background: '#f8f9fa' }}>
                        <Text type="secondary">Scan to pay via UPI</Text><br />
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${selectedInstructor?.upiId}&pn=${selectedInstructor?.name}&am=${selectedInstructor?.payableAmount}`}
                            alt="UPI QR"
                            style={{ margin: '20px auto', display: 'block' }}
                        />
                        <Title level={4}>Amount: ${selectedInstructor?.payableAmount}</Title>
                        <Text code>{selectedInstructor?.upiId}</Text>
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
                    <Button type="primary" block htmlType="submit">Confirm Payout Processed</Button>
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
