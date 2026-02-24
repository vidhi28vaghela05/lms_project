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
        <div style={{ maxWidth: 1000, margin: '0 auto', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <Title level={1} className="glow-text" style={{ marginBottom: 8 }}>
                    <BookOutlined style={{ marginRight: 16 }} />
                    Neural Repository
                </Title>
                <Text style={{ color: '#8892b0', fontSize: '18px' }}>Access your enrolled neural modules and active learning synchronizations.</Text>
            </div>

            {enrollments.length > 0 ? (
                <List
                    grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3 }}
                    dataSource={enrollments}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                className="glass-card"
                                hoverable
                                cover={
                                    <div style={{
                                        height: 160,
                                        background: 'rgba(17, 34, 64, 0.5)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#00d1b2',
                                        fontSize: 48,
                                        borderBottom: '1px solid rgba(0, 209, 178, 0.1)'
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
                                        style={{
                                            height: '45px',
                                            borderRadius: '0 0 12px 12px',
                                            background: '#00d1b2',
                                            border: 'none',
                                            color: '#0a192f'
                                        }}
                                    >
                                        Resume Session
                                    </Button>
                                ]}
                                style={{
                                    border: '1px solid rgba(0, 209, 178, 0.1)',
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <Card.Meta
                                    title={<Text style={{ fontSize: 20, color: '#fff', fontWeight: 600 }}>{item.courseId?.title}</Text>}
                                    description={
                                        <div style={{ marginTop: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                                <Text style={{ color: '#8892b0' }}>Sync Progress</Text>
                                                <Text style={{ color: '#00d1b2', fontWeight: 600 }}>{item.progressPercentage}%</Text>
                                            </div>
                                            <Progress
                                                percent={item.progressPercentage}
                                                strokeColor="#00d1b2"
                                                trailColor="rgba(255,255,255,0.05)"
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
                <Card
                    className="glass-card"
                    style={{
                        borderRadius: 16,
                        textAlign: 'center',
                        padding: '60px 0',
                        border: '1px solid rgba(0, 209, 178, 0.1)'
                    }}
                >
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span style={{ color: '#8892b0', fontSize: '16px' }}>No neural links detected.</span>}
                    >
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            style={{
                                height: '50px',
                                padding: '0 32px',
                                borderRadius: '12px',
                                marginTop: '24px',
                                background: '#00d1b2',
                                border: 'none',
                                color: '#0a192f'
                            }}
                        >
                            Explore Modules
                        </Button>
                    </Empty>
                </Card>
            )}
        </div>
    );
};

export default MyCourses;
