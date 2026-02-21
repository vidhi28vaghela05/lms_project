import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Progress, Table, Tag, Space, Avatar, Button, Tabs } from 'antd';
import { BookOutlined, RiseOutlined, CheckCircleOutlined, TrophyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        completed: 0,
        inProgress: 0,
        avgScore: 0
    });
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/student/my-courses');
                setCourses(data || []);
                // For stats, we might need a separate call or calculate here
                const wishRes = await api.get('/student/wishlist');
                setWishlist(wishRes.data);
            } catch (error) {
                console.error('Failed to fetch student dashboard data', error);
            }
        };
        fetchDashboardData();
    }, []);

    const columns = [
        {
            title: 'Course',
            key: 'course',
            render: (_, record) => (
                <Space>
                    <BookOutlined style={{ color: '#457b9d' }} />
                    <Text strong>{record.title}</Text>
                </Space>
            )
        },
        {
            title: 'Progress',
            key: 'progress',
            render: (_, record) => (
                <Progress percent={record.progress || 0} size="small" status="active" />
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'completed' ? 'green' : 'blue'}>
                    {status ? status.toUpperCase() : 'IN PROGRESS'}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(`/lessons/${record.courseId._id}`)}
                    >
                        Resume
                    </Button>
                    {(record.progressPercentage >= 100) && (
                        <Button
                            type="primary"
                            size="small"
                            icon={<TrophyOutlined />}
                            onClick={() => api.get(`/student/certificate/${record.courseId._id}`).then(res => {
                                window.open(res.data.pdfUrl || '#', '_blank');
                            })}
                        >
                            Certificate
                        </Button>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '0 20px' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1d3557', margin: 0 }}>Learning Vector Core</Title>
                <Text type="secondary">Monitor your cognitive progression and mission status.</Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={8}>
                    <Card className="glass-card">
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <RiseOutlined style={{ fontSize: 32, color: '#457b9d' }} />
                            <Title level={4} style={{ margin: 0 }}>{stats.inProgress}</Title>
                            <Text type="secondary">Active Missions</Text>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-card">
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                            <Title level={4} style={{ margin: 0 }}>{stats.completed}</Title>
                            <Text type="secondary">Completed Protocols</Text>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-card">
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <TrophyOutlined style={{ fontSize: 32, color: '#fadb14' }} />
                            <Title level={4} style={{ margin: 0 }}>{stats.avgScore}%</Title>
                            <Text type="secondary">Average Precision</Text>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
                <TabPane tab="My Enlistments" key="1">
                    <Card className="glass-card">
                        <Table
                            columns={columns}
                            dataSource={courses}
                            rowKey="_id"
                            pagination={false}
                        />
                    </Card>
                </TabPane>
                <TabPane tab="Vanguard Wishlist" key="2">
                    <Card className="glass-card">
                        <Table
                            dataSource={wishlist}
                            columns={[
                                { title: 'Course', dataIndex: 'title' },
                                { title: 'Level', dataIndex: 'level' },
                                {
                                    title: 'Action',
                                    render: (_, record) => <Button onClick={() => navigate('/courses')}>View Details</Button>
                                }
                            ]}
                            rowKey="_id"
                        />
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default StudentDashboard;
