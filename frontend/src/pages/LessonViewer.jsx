import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlayCircleOutlined, CheckCircleOutlined, ArrowRightOutlined, StarOutlined } from '@ant-design/icons';
import { Layout, List, Typography, Card, Space, Spin, Button, message, Rate, Input, Divider } from 'antd';
import api from '../services/api';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const LessonViewer = () => {
    const { courseId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [review, setReview] = useState({ rating: 0, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

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
        <Layout style={{ background: '#0a192f', minHeight: 'calc(100vh - 80px)' }}>
            <Sider width={320} style={{ background: 'rgba(17, 34, 64, 0.8)', borderRight: '1px solid rgba(0, 209, 178, 0.1)', overflow: 'auto' }}>
                <div style={{ padding: '24px 16px', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }}>
                    <Title level={4} style={{ color: '#00d1b2', margin: 0 }}>Course Content</Title>
                </div>
                <List
                    dataSource={lessons}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => setCurrentLesson(item)}
                            style={{
                                cursor: 'pointer',
                                background: currentLesson?._id === item._id ? 'rgba(0, 209, 178, 0.1)' : 'transparent',
                                borderBottom: '1px solid rgba(0, 209, 178, 0.05)',
                                padding: '16px',
                                borderLeft: currentLesson?._id === item._id ? '4px solid #00d1b2' : 'none',
                                transition: 'all 0.3s'
                            }}
                        >
                            <Space>
                                {completedLessons.includes(item._id) ?
                                    <CheckCircleOutlined style={{ color: '#00d1b2' }} /> :
                                    <PlayCircleOutlined style={{ color: '#8892b0' }} />
                                }
                                <Text style={{ color: currentLesson?._id === item._id ? '#00d1b2' : '#ccd6f6', fontWeight: currentLesson?._id === item._id ? 600 : 400 }}>{item.title}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </Sider>
            <Content style={{ padding: '40px', background: 'radial-gradient(circle at top right, rgba(0, 209, 178, 0.03), transparent)' }}>
                {currentLesson ? (
                    <div style={{ maxWidth: 1000, margin: '0 auto' }} className="fade-in">
                        <div style={{ marginBottom: 32 }}>
                            <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>{currentLesson.title}</Title>
                            <Space>
                                <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>Module Core</Tag>
                                <Text style={{ color: '#8892b0' }}>Quantum Synchronization in Progress</Text>
                            </Space>
                        </div>

                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0, 209, 178, 0.1)' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={currentLesson.videoUrl?.replace('watch?v=', 'embed/')}
                                title="Lesson Video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>

                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 16,
                                background: 'rgba(17, 34, 64, 0.6)',
                                border: '1px solid rgba(0, 209, 178, 0.1)',
                                marginBottom: 40
                            }}
                        >
                            <Title level={4} style={{ color: '#ccd6f6', marginBottom: 16 }}>Module Briefing</Title>
                            <Paragraph style={{ color: '#8892b0', fontSize: '16px', lineHeight: '1.8' }}>{currentLesson.content}</Paragraph>
                        </Card>

                        <div style={{
                            padding: '24px',
                            background: 'rgba(17, 34, 64, 0.4)',
                            borderRadius: 16,
                            border: '1px solid rgba(0, 209, 178, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 48
                        }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CheckCircleOutlined />}
                                className={completedLessons.includes(currentLesson._id) ? "" : "pulse-glow"}
                                style={{
                                    background: completedLessons.includes(currentLesson._id) ? 'rgba(0, 209, 178, 0.1)' : '#00d1b2',
                                    border: completedLessons.includes(currentLesson._id) ? '1px solid #00d1b2' : 'none',
                                    color: completedLessons.includes(currentLesson._id) ? '#00d1b2' : '#0a192f',
                                    fontWeight: 700
                                }}
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
                                        message.success('Progression Synced');
                                    } catch (error) {
                                        message.error('Sync error');
                                    }
                                }}
                            >
                                {completedLessons.includes(currentLesson._id) ? "Module Mastered" : "Initialize Completion"}
                            </Button>

                            <Space size="middle">
                                <Button
                                    ghost
                                    size="large"
                                    style={{ color: '#00d1b2', borderColor: '#00d1b2' }}
                                    onClick={() => navigate(`/quiz/${courseId}`, { state: { lessonId: currentLesson._id } })}
                                >
                                    Attempt Evaluation
                                </Button>
                                <Button
                                    type="default"
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#ccd6f6', border: '1px solid rgba(0, 209, 178, 0.2)' }}
                                    onClick={() => {
                                        const nextIdx = lessons.findIndex(l => l._id === currentLesson._id) + 1;
                                        if (nextIdx < lessons.length) setCurrentLesson(lessons[nextIdx]);
                                    }}
                                >
                                    Next Module
                                </Button>
                            </Space>
                        </div>

                        <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)', margin: '48px 0' }} />

                        <Card
                            className="glass-card"
                            style={{
                                borderRadius: 20,
                                background: 'rgba(17, 34, 64, 0.6)',
                                border: '1px solid rgba(0, 209, 178, 0.1)'
                            }}
                        >
                            <Title level={4} style={{ color: '#fff' }}><StarOutlined style={{ color: '#00d1b2' }} /> Rate this Course</Title>
                            <Text style={{ color: '#8892b0' }}>Share your cognitive feedback with the collective.</Text>
                            <div style={{ marginTop: 24 }}>
                                <Rate
                                    value={review.rating}
                                    onChange={(val) => setReview({ ...review, rating: val })}
                                    style={{ color: '#00d1b2', fontSize: 28 }}
                                />
                                <Input.TextArea
                                    placeholder="Quantify your experience..."
                                    value={review.comment}
                                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                    style={{
                                        marginTop: 20,
                                        borderRadius: 12,
                                        background: 'rgba(10, 25, 47, 0.5)',
                                        border: '1px solid rgba(0, 209, 178, 0.2)',
                                        color: '#ccd6f6',
                                        padding: '12px'
                                    }}
                                    rows={4}
                                />
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{ marginTop: 20, background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}
                                    loading={submittingReview}
                                    onClick={async () => {
                                        if (review.rating === 0) return message.warning('Indicate precision level (rating)');
                                        setSubmittingReview(true);
                                        try {
                                            await api.post('/student/review', {
                                                courseId,
                                                rating: review.rating,
                                                comment: review.comment
                                            });
                                            message.success('Neural feedback transmitted');
                                            setReview({ rating: 0, comment: '' });
                                        } catch (err) {
                                            message.error('Transmission failed');
                                        } finally {
                                            setSubmittingReview(false);
                                        }
                                    }}
                                >
                                    Transmit Review
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: 100 }}>
                        <Title level={3} style={{ color: '#8892b0' }}>Select a module to initiate data stream.</Title>
                    </div>
                )}
            </Content>
        </Layout>
    );
};

export default LessonViewer;
