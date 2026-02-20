import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Progress, Button, Empty, message, Spin } from 'antd';
import { PlayCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const MyCourses = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await api.get('/enrollments/my-enrollments');
                setEnrollments(res.data);
            } catch (error) {
                message.error('Failed to fetch enrolled courses');
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1d3557' }}>
                    <BookOutlined style={{ marginRight: 12 }} />
                    My Enrolled Courses
                </Title>
                <Text type="secondary">Continue where you left off and complete your learning goals.</Text>
            </div>

            {enrollments.length > 0 ? (
                <List
                    grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3 }}
                    dataSource={enrollments}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                hoverable
                                cover={
                                    <div style={{
                                        height: 160,
                                        background: 'linear-gradient(135deg, #457b9d 0%, #1d3557 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: 40
                                    }}>
                                        <BookOutlined />
                                    </div>
                                }
                                actions={[
                                    <Button
                                        type="primary"
                                        icon={<PlayCircleOutlined />}
                                        block
                                        onClick={() => navigate(`/lessons/${item.courseId?._id}`)}
                                        style={{ background: '#1d3557', border: 'none' }}
                                    >
                                        Resume Learning
                                    </Button>
                                ]}
                                style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                            >
                                <Card.Meta
                                    title={<Text strong style={{ fontSize: 18 }}>{item.courseId?.title}</Text>}
                                    description={
                                        <div style={{ marginTop: 12 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <Text type="secondary">Progress</Text>
                                                <Text strong>{item.progressPercentage}%</Text>
                                            </div>
                                            <Progress
                                                percent={item.progressPercentage}
                                                strokeColor={{ '0%': '#457b9d', '100%': '#1d3557' }}
                                                status="active"
                                            />
                                        </div>
                                    }
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Card style={{ borderRadius: 16, textAlign: 'center', padding: '40px 0' }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="You haven't enrolled in any courses yet."
                    >
                        <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
                            Explore Courses
                        </Button>
                    </Empty>
                </Card>
            )}
        </div>
    );
};

export default MyCourses;
