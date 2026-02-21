import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Statistic, Typography, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Progress, Tabs } from 'antd';
import { Bar } from '@ant-design/plots';
import { EditOutlined, DeleteOutlined, PlusOutlined, VideoCameraOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import api from '../services/api';
import LessonManager from '../components/LessonManager';
import QuizManager from '../components/QuizManager';

const { Title } = Typography;
const { TabPane } = Tabs;

const InstructorDashboard = () => {
    const [performance, setPerformance] = useState([]);
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        avgScore: 0,
        completionRate: 0,
        payableAmount: 0,
        status: 'approved'
    });
    const [payouts, setPayouts] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateForm] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [activeCourseId, setActiveCourseId] = useState(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const perfRes = await api.get('/instructor/student-performance');
            setPerformance(perfRes.data);
            const courseRes = await api.get('/courses');
            setCourses(courseRes.data.filter(c => c.instructorId?._id === localStorage.getItem('_id') || c.instructorId === localStorage.getItem('_id')));
            const statsRes = await api.get('/instructor/stats');
            setStats(statsRes.data);
            const payoutRes = await api.get('/instructor/payout-history');
            setPayouts(payoutRes.data);
        } catch (error) {
            console.error('Error fetching instructor data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async (values) => {
        try {
            if (editingCourse) {
                // If course is already published and instructor is editing, it might need approval
                // For now, let's assume direct update if instructor is approved
                await api.put(`/courses/${editingCourse._id}`, values);
                message.success('Course updated');
            } else {
                await api.post('/courses', values);
                message.success('Course submitted for approval');
            }
            setIsModalOpen(false);
            setEditingCourse(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const submitUpdateRequest = async (values) => {
        try {
            await api.post('/instructor/course-update', {
                courseId: activeCourseId,
                description: values.description,
                pendingData: values // In real app, you'd send specific changes
            });
            message.success('Update request submitted to admin');
            setIsUpdateModalOpen(false);
            updateForm.resetFields();
        } catch (error) {
            message.error('Submission failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/courses/${id}`);
            message.success('Course deleted');
            fetchData();
        } catch (error) {
            message.error('Delete failed');
        }
    };

    const courseColumns = [
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Level', dataIndex: 'level', key: 'level' },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingCourse(record); form.setFieldsValue(record); setIsModalOpen(true); }} tooltip="Edit Basic Info" />
                    <Button type="dashed" onClick={() => { setActiveCourseId(record._id); setIsUpdateModalOpen(true); }}>Req Update</Button>
                    <Button icon={<VideoCameraOutlined />} onClick={() => { setActiveCourseId(record._id); setIsLessonModalOpen(true); }} />
                    <Button icon={<QuestionCircleOutlined />} onClick={() => { setActiveCourseId(record._id); setIsQuizModalOpen(true); }} />
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div style={{ padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2}>Instructor Dashboard</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCourse(null); form.resetFields(); setIsModalOpen(true); }}>
                    New Course
                </Button>
            </div>

            <Row gutter={24} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ background: '#f0faff' }}>
                        <Statistic title="Total Students" value={stats.totalEnrollments} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card" style={{ background: '#f6ffed' }}>
                        <Statistic title="My Earnings (70%)" value={stats.payableAmount} prefix="$" precision={2} valueStyle={{ color: '#3f8600' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card">
                        <Statistic title="Module Completion" value={stats.completionRate} suffix="%" />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card bordered={false} className="glass-card">
                        <Statistic title="Account Status" value={stats.status?.toUpperCase()} valueStyle={{ fontSize: 16, color: stats.status === 'approved' ? 'green' : 'orange' }} />
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1" className="main-tabs">
                <TabPane tab="My Courses" key="1">
                    <Card title="Manage Course Content" style={{ borderRadius: 16 }}>
                        <Table dataSource={courses} columns={courseColumns} rowKey="_id" />
                    </Card>
                </TabPane>
                <TabPane tab="Student Performance" key="2">
                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <Card title="Performance Analytics" style={{ borderRadius: 16 }}>
                                <Bar
                                    data={performance.map(p => ({
                                        name: p.studentId?.name || 'Unknown',
                                        score: p.performanceScore
                                    }))}
                                    xField="name"
                                    yField="score"
                                    seriesField="name"
                                    legend={false}
                                    height={300}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title="Recent Activity" style={{ borderRadius: 16 }}>
                                <Table
                                    dataSource={performance.slice(0, 5)}
                                    columns={[
                                        { title: 'Student', dataIndex: ['studentId', 'name'] },
                                        { title: 'Score', dataIndex: 'performanceScore' }
                                    ]}
                                    pagination={false}
                                    size="small"
                                />
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="Payout History" key="3">
                    <Card title="Revenue Distribution History" style={{ borderRadius: 16 }}>
                        <Table
                            dataSource={payouts}
                            columns={[
                                { title: 'Date', dataIndex: 'createdAt', render: d => new Date(d).toLocaleDateString() },
                                { title: 'Amount', dataIndex: 'amount', render: a => `$${a}` },
                                { title: 'Status', dataIndex: 'status', render: s => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s.toUpperCase()}</Tag> },
                                { title: 'Transaction ID', dataIndex: 'transactionId' }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
            </Tabs>

            <Modal title={editingCourse ? "Edit Course" : "Create New Course"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} onFinish={handleCreateOrUpdate} layout="vertical">
                    <Form.Item name="title" label="Course Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="level" label="Level" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="beginner">Beginner</Select.Option>
                            <Select.Option value="intermediate">Intermediate</Select.Option>
                            <Select.Option value="advanced">Advanced</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="price" label="Course Price ($)" rules={[{ required: true }]}>
                        <Input type="number" prefix="$" />
                    </Form.Item>
                    <Form.Item name="thumbnail" label="Thumbnail URL">
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>
                    <Form.Item name="status" label="Status" initialValue="published">
                        <Select>
                            <Select.Option value="published">Published</Select.Option>
                            <Select.Option value="draft">Draft</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <LessonManager
                courseId={activeCourseId}
                visible={isLessonModalOpen}
                onCancel={() => setIsLessonModalOpen(false)}
            />

            <QuizManager
                courseId={activeCourseId}
                visible={isQuizModalOpen}
                onCancel={() => setIsQuizModalOpen(false)}
            />

            <Modal
                title="Submit Course Update Request"
                open={isUpdateModalOpen}
                onCancel={() => setIsUpdateModalOpen(false)}
                onOk={() => updateForm.submit()}
            >
                <Form form={updateForm} onFinish={submitUpdateRequest} layout="vertical">
                    <Form.Item name="description" label="What's changing?" rules={[{ required: true }]}>
                        <Input.TextArea placeholder="Describe the updates to lessons, content or quizzes..." rows={4} />
                    </Form.Item>
                    <Text type="secondary">Note: Significant changes require administrative review before going live.</Text>
                </Form>
            </Modal>
        </div>
    );
};

export default InstructorDashboard;
