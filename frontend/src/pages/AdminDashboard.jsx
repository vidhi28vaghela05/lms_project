import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Statistic, Typography, Tag, Space, Avatar, Tabs, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd';
import { UserOutlined, GlobalOutlined, AppstoreOutlined, SafetyOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [skills, setSkills] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, engagementRate: 0 });
    const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [skillForm] = Form.useForm();

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
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            message.error('Operation failed');
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
                <Col xs={12} sm={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic title="Courses" value={stats.totalCourses} prefix={<AppstoreOutlined />} />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Statistic title="Engagement" value={stats.engagementRate} suffix="%" prefix={<GlobalOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1">
                <TabPane tab="Users" key="1">
                    <Card title="User Management" style={{ borderRadius: 16 }}>
                        <Table dataSource={users} columns={userColumns} rowKey="_id" />
                    </Card>
                </TabPane>
                <TabPane tab="Courses" key="2">
                    <Card title="Universal Course Management" style={{ borderRadius: 16 }}>
                        <Table dataSource={courses} columns={[
                            { title: 'Title', dataIndex: 'title', key: 'title' },
                            { title: 'Instructor', dataIndex: ['instructorId', 'name'], key: 'instructor' },
                            { title: 'Status', dataIndex: 'status', key: 'status' },
                            {
                                title: 'Actions', key: 'actions', render: (_, record) => (
                                    <Popconfirm title="Delete Course?" onConfirm={() => deleteCourse(record._id)}>
                                        <Button icon={<DeleteOutlined />} danger size="small" />
                                    </Popconfirm>
                                )
                            }
                        ]} rowKey="_id" />
                    </Card>
                </TabPane>
                <TabPane tab="Skill Graph" key="3">
                    <Card
                        title="Skill Management"
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingSkill(null); skillForm.resetFields(); setIsSkillModalOpen(true); }}>Add Skill</Button>}
                        style={{ borderRadius: 16 }}
                    >
                        <Table dataSource={skills} columns={skillColumns} rowKey="_id" />
                    </Card>
                </TabPane>
            </Tabs>

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
        </div>
    );
};

export default AdminDashboard;
