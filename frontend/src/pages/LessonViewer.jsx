import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, List, Typography, Card, Space, Spin, Button, message } from 'antd';
import { PlayCircleOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const LessonViewer = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await api.get(`/lessons/course/${courseId}`);
                setLessons(res.data);
                if (res.data.length > 0) setCurrentLesson(res.data[0]);

                // Fetch enrollment status and progress
                const enrollRes = await api.get('/student/my-courses');
                const enrollment = enrollRes.data.find(e => e.courseId._id === courseId);
                if (enrollment) {
                    setCompletedLessons(enrollment.completedLessons || []);
                }
            } catch (error) {
                message.error('Failed to load lessons');
            } finally {
                setLoading(false);
            }
        };
        fetchLessons();
    }, [courseId]);

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <Layout style={{ background: '#fff' }}>
            <Sider width={300} style={{ background: '#f0f2f5', overflow: 'auto' }}>
                <List
                    header={<div style={{ padding: '0 16px' }}><Title level={4}>Course Content</Title></div>}
                    dataSource={lessons}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => setCurrentLesson(item)}
                            style={{
                                cursor: 'pointer',
                                background: currentLesson?._id === item._id ? '#e6f7ff' : 'transparent',
                                padding: '12px 16px'
                            }}
                        >
                            <Space>
                                {completedLessons.includes(item._id) ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <PlayCircleOutlined />}
                                <Text strong={currentLesson?._id === item._id}>{item.title}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Sider>
            <Content style={{ padding: '24px 40px' }}>
                {currentLesson ? (
                    <div>
                        <Title level={2}>{currentLesson.title}</Title>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 24 }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                                src={currentLesson.videoUrl?.replace('watch?v=', 'embed/')}
                                title="Lesson Video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <Card style={{ borderRadius: 12 }}>
                            <Title level={4}>Lesson Content</Title>
                            <Paragraph>{currentLesson.content}</Paragraph>
                        </Card>
                        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                type={completedLessons.includes(currentLesson._id) ? "default" : "primary"}
                                icon={<CheckCircleOutlined />}
                                onClick={async () => {
                                    try {
                                        await api.post('/student/progress', {
                                            courseId,
                                            lessonId: currentLesson._id,
                                            completed: !completedLessons.includes(currentLesson._id)
                                        });
                                        setCompletedLessons(prev =>
                                            prev.includes(currentLesson._id)
                                                ? prev.filter(id => id !== currentLesson._id)
                                                : [...prev, currentLesson._id]
                                        );
                                        message.success('Pulse updated');
                                    } catch (error) {
                                        message.error('Progression sync failed');
                                    }
                                }}
                            >
                                {completedLessons.includes(currentLesson._id) ? "Lesson Mastered" : "Initialize Completion"}
                            </Button>

                            <Space>
                                <Button ghost type="primary" onClick={() => navigate(`/quiz/${courseId}`, { state: { lessonId: currentLesson._id } })}>
                                    Attempt Lesson Quiz
                                </Button>
                                <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => {
                                    const nextIdx = lessons.findIndex(l => l._id === currentLesson._id) + 1;
                                    if (nextIdx < lessons.length) setCurrentLesson(lessons[nextIdx]);
                                }}>
                                    Next Module
                                </Button>
                            </Space>
                        </div>
                    </div>
                ) : (
                    <Title level={4}>Select a lesson to start learning.</Title>
                )}
            </Content>
        </Layout>
    );
};

export default LessonViewer;
