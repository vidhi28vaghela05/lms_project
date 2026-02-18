import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, List, Tag, Button, Space } from 'antd';
import { Radar } from '@ant-design/plots';
import { BookOutlined, RocketOutlined, FireOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { Title, Text } = Typography;

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recRes = await api.get('/enrollments/recommendations');
                setRecommendations(recRes.data);
                const enrRes = await api.get('/enrollments/my-enrollments');
                setEnrollments(enrRes.data);
            } catch (error) {
                console.error('Error fetching student data', error);
            }
        };
        fetchData();
    }, []);

    const radarData = [
        { name: 'Coding', star: 80 },
        { name: 'Design', star: 60 },
        { name: 'Math', star: 70 },
        { name: 'Logic', star: 90 },
        { name: 'Soft Skills', star: 50 },
    ];

    const radarConfig = {
        data: radarData,
        xField: 'name',
        yField: 'star',
        meta: { star: { alias: 'Score', min: 0, max: 100 } },
        xAxis: { line: null, tickLine: null },
        area: { style: { fillOpacity: 0.2, fill: '#1d3557' } },
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/enrollments/${courseId}`);
            message.success('Enrolled successfully!');
            // Refresh enrollments
            const enrRes = await api.get('/enrollments/my-enrollments');
            setEnrollments(enrRes.data);
        } catch (error) {
            message.error('Enrollment failed');
        }
    };

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ color: '#1d3557', marginBottom: 8 }}>My Learning Journey</Title>
                <Text type="secondary">Track your progress and discover new skills.</Text>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<Space><FireOutlined style={{ color: '#e63946' }} />Skill Analysis</Space>}
                        style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <Radar {...radarConfig} height={350} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card
                        title="Overall Stats"
                        style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}
                    >
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <Progress type="dashboard" percent={65} strokeColor="#1d3557" strokeWidth={10} />
                            <div style={{ marginTop: 32 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic title="Completed" value={3} prefix={<BookOutlined />} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="Avg Score" value={78} suffix="%" />
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                <Col xs={24} md={12}>
                    <Card
                        title={<Space><RocketOutlined style={{ color: '#457b9d' }} />AI Recommendations</Space>}
                        style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <List
                            dataSource={recommendations}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[<Button type="primary" size="small" ghost onClick={() => handleEnroll(item._id)}>Enroll</Button>]}
                                >
                                    <List.Item.Meta
                                        title={<Text strong>{item.title}</Text>}
                                        description={item.description}
                                    />
                                    <Tag color="blue">{item.level?.toUpperCase() || 'BEGINNER'}</Tag>
                                </List.Item>
                            )}
                        />
                        {recommendations.length === 0 && (
                            <div style={{ textAlign: 'center', padding: 20 }}>
                                <Text type="secondary">No suggestions yet. Explore the course list!</Text>
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card
                        title="My Courses"
                        style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <List
                            dataSource={enrollments}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button type="link" icon={<PlayCircleOutlined />} onClick={() => navigate(`/lessons/${item.courseId?._id}`)}>Learn</Button>,
                                        <Button type="link" onClick={() => navigate(`/quiz/${item.courseId?._id}`)}>Quiz</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<Text strong>{item.courseId?.title}</Text>}
                                        description={`Progress: ${item.progressPercentage}%`}
                                    />
                                    <div style={{ width: 80 }}>
                                        <Progress percent={item.progressPercentage} size="small" strokeColor="#1d3557" />
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

import { message } from 'antd';

export default StudentDashboard;
