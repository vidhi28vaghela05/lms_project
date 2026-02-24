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
        <div style={{ padding: '0 20px', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 32 }}>
                <Title level={2} className="glow-text" style={{ margin: 0 }}>Learning Vector Core</Title>
                <Text style={{ color: '#8892b0' }}>Synchronizing your educational progression and active modules.</Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={8}>
                    <Card className="glass-card" style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <RiseOutlined style={{ fontSize: 32, color: '#00d1b2' }} />
                            <Title level={4} style={{ margin: 0, color: '#fff' }}>{stats.inProgress}</Title>
                            <Text style={{ color: '#8892b0' }}>Active Modules</Text>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-card" style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <CheckCircleOutlined style={{ fontSize: 32, color: '#00d1b2' }} />
                            <Title level={4} style={{ margin: 0, color: '#fff' }}>{stats.completed}</Title>
                            <Text style={{ color: '#8892b0' }}>Acquisitions Completed</Text>
                        </Space>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card className="glass-card" style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                            <TrophyOutlined style={{ fontSize: 32, color: '#00d1b2' }} />
                            <Title level={4} style={{ margin: 0, color: '#fff' }}>{stats.avgScore}%</Title>
                            <Text style={{ color: '#8892b0' }}>Sync Accuracy</Text>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
                <TabPane tab="My Courses" key="1">
                    <Row gutter={[24, 24]}>
                        {courses.length > 0 ? (
                            courses.map((enrollment) => (
                                <Col xs={24} md={8} key={enrollment._id}>
                                    <Card
                                        hoverable
                                        className="glass-card"
                                        style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}
                                        cover={
                                            <div style={{ height: 140, background: 'rgba(17, 34, 64, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {enrollment.courseId?.thumbnail ? (
                                                    <img src={enrollment.courseId.thumbnail} alt={enrollment.courseId.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                                ) : (
                                                    <BookOutlined style={{ fontSize: 40, color: '#00d1b2', opacity: 0.3 }} />
                                                )}
                                            </div>
                                        }
                                        actions={[
                                            <Button type="link" style={{ color: '#00d1b2' }} onClick={() => navigate(`/lessons/${enrollment.courseId?._id}`)}>Resume Session</Button>,
                                            enrollment.progressPercentage >= 100 && (
                                                <Button type="link" style={{ color: '#00d1b2' }} onClick={() => navigate(`/certificate/${enrollment.courseId?._id}`)}>Blueprint</Button>
                                            )
                                        ]}
                                    >
                                        <Card.Meta
                                            title={<span style={{ fontWeight: 600, color: '#fff' }}>{enrollment.courseId?.title}</span>}
                                            description={
                                                <div>
                                                    <Progress percent={enrollment.progressPercentage || 0} size="small" strokeColor="#00d1b2" trailColor="rgba(255,255,255,0.05)" />
                                                    <Tag color="cyan" style={{ marginTop: 8, background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>
                                                        {enrollment.progressPercentage >= 100 ? 'SUCCESS' : 'SYNCING'}
                                                    </Tag>
                                                </div>
                                            }
                                        />
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col span={24}>
                                <Card className="glass-card" style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <Text style={{ color: '#8892b0' }}>No active neural links found. Explore the library to begin synchronization.</Text><br />
                                    <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/courses')}>Browse Modules</Button>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </TabPane>
                <TabPane tab="Recommended" key="3">
                    <Row gutter={[24, 24]}>
                        {recommendations.map((course) => (
                            <Col xs={24} md={8} key={course._id}>
                                <Card
                                    hoverable
                                    className="glass-card"
                                    style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}
                                    cover={
                                        <div style={{ height: 140, background: 'rgba(17, 34, 64, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                                            ) : (
                                                <BookOutlined style={{ fontSize: 40, color: '#00d1b2', opacity: 0.4 }} />
                                            )}
                                        </div>
                                    }
                                    onClick={() => navigate(`/courses`)}
                                >
                                    <Card.Meta
                                        title={<span style={{ fontWeight: 600, color: '#fff' }}>{course.title}</span>}
                                        description={
                                            <div>
                                                <Text style={{ color: '#8892b0' }}>{course.level.toUpperCase()}</Text><br />
                                                <Text strong style={{ color: '#00d1b2' }}>${course.price || 0}</Text>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </TabPane>
                <TabPane tab="Wishlist" key="2">
                    <Card className="glass-card" style={{ border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Table
                            className="custom-dark-table"
                            dataSource={wishlist}
                            columns={[
                                { title: 'Module', dataIndex: 'title', render: (t) => <span style={{ fontWeight: 600, color: '#fff' }}>{t}</span> },
                                { title: 'Level', dataIndex: 'level', render: (l) => <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>{l.toUpperCase()}</Tag> },
                                {
                                    title: 'Status',
                                    render: (_, record) => <Button type="link" style={{ color: '#00d1b2' }} onClick={() => navigate('/courses')}>Begin Sync</Button>
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
