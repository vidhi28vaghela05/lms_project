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
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/student/my-courses');
                const enrollments = data || [];
                setCourses(enrollments);

                const completed = enrollments.filter(e => e.progressPercentage >= 100).length;
                const inProgress = enrollments.length - completed;
                const totalScore = enrollments.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0);
                const avgScore = enrollments.length > 0 ? Math.round(totalScore / enrollments.length) : 0;

                setStats({ completed, inProgress, avgScore });

                const wishRes = await api.get('/student/wishlist');
                setWishlist(wishRes.data);

                const recRes = await api.get('/student/recommendations');
                setRecommendations(recRes.data);
            } catch (error) {
                console.error('Failed to fetch student dashboard data', error);
            } finally {
                setLoading(false);
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
                            onClick={async () => {
                                try {
                                    const response = await api.get(`/student/certificate/${record.courseId._id}`, {
                                        responseType: 'blob'
                                    });
                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.setAttribute('download', `Certificate-${record.courseId.title}.pdf`);
                                    document.body.appendChild(link);
                                    link.click();
                                } catch (err) {
                                    message.error('Certificate retrieval failed');
                                }
                            }}
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
                    <Row gutter={[24, 24]}>
                        {courses.length > 0 ? (
                            courses.map((enrollment) => (
                                <Col xs={24} md={8} key={enrollment._id}>
                                    <Card
                                        hoverable
                                        className="glass-card"
                                        cover={
                                            <div style={{ height: 140, background: 'linear-gradient(135deg, #1d3557, #457b9d)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {enrollment.courseId?.thumbnail ? (
                                                    <img src={enrollment.courseId.thumbnail} alt={enrollment.courseId.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <BookOutlined style={{ fontSize: 40, color: '#fff' }} />
                                                )}
                                            </div>
                                        }
                                        actions={[
                                            <Button type="link" onClick={() => navigate(`/lessons/${enrollment.courseId?._id}`)}>Resume</Button>,
                                            enrollment.progressPercentage >= 100 && (
                                                <Button type="link" onClick={() => navigate(`/certificate/${enrollment.courseId?._id}`)}>Certificate</Button>
                                            )
                                        ]}
                                    >
                                        <Card.Meta
                                            title={enrollment.courseId?.title}
                                            description={
                                                <div>
                                                    <Progress percent={enrollment.progressPercentage || 0} size="small" />
                                                    <Tag color={enrollment.progressPercentage >= 100 ? 'green' : 'blue'} style={{ marginTop: 8 }}>
                                                        {enrollment.progressPercentage >= 100 ? 'COMPLETED' : 'IN PROGRESS'}
                                                    </Tag>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Text type="secondary">No active missions found. Teleport to the repository to begin.</Text><br />
                                    <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/courses')}>Browse Repository</Button>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </TabPane>
                <TabPane tab="Recommended for You" key="3">
                    <Row gutter={[24, 24]}>
                        {recommendations.map((course) => (
                            <Col xs={24} md={8} key={course._id}>
                                <Card
                                    hoverable
                                    className="glass-card"
                                    cover={
                                        <div style={{ height: 140, background: 'linear-gradient(135deg, #e63946, #1d3557)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <BookOutlined style={{ fontSize: 40, color: '#fff' }} />
                                            )}
                                        </div>
                                    }
                                    onClick={() => navigate(`/courses`)}
                                >
                                    <Card.Meta
                                        title={course.title}
                                        description={
                                            <div>
                                                <Text type="secondary">{course.level.toUpperCase()}</Text><br />
                                                <Text strong color="#e63946">${course.price || 0}</Text>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
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
