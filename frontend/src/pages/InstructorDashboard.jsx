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
    const [stats, setStats] = useState({ totalEnrollments: 0, avgScore: 0, completionRate: 0 });
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
                await api.put(`/courses/${editingCourse._id}`, values);
                message.success('Course updated');
            } else {
                await api.post('/courses', values);
                message.success('Course created');
            }
            setIsModalOpen(false);
            setEditingCourse(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error('Operation failed');
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
                    <Button icon={<EditOutlined />} onClick={() => { setEditingCourse(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
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
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="glass-card">
                        <Statistic title="Total Enrollments" value={stats.totalEnrollments} prefix={<PlusOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="glass-card">
                        <Statistic title="Completion Rate" value={stats.completionRate} suffix="%" />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card bordered={false} className="glass-card">
                        <Statistic title="Avg Score" value={stats.avgScore} suffix="%" />
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
                    <Card title="Detailed Analytics" style={{ borderRadius: 16 }}>
                        <Table dataSource={performance} columns={[
                            { title: 'Student', dataIndex: ['studentId', 'name'], key: 'name' },
                            { title: 'Course', dataIndex: ['courseId', 'title'], key: 'course' },
                            { title: 'Progress', dataIndex: 'progressPercentage', key: 'progress', render: (p) => <Progress percent={p} size="small" /> },
                            {
                                title: 'Score', dataIndex: 'performanceScore', key: 'score', render: (s) => (
                                    <Tag color={s >= 80 ? 'green' : s >= 50 ? 'orange' : 'red'}>{s}%</Tag>
                                )
                            }
                        ]} />
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
        </div>
    );
};

export default InstructorDashboard;
