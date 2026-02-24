import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Radio, Button, Typography, Space, Progress, message, Result } from 'antd';
import api from '../services/api';

const { Title, Text } = Typography;

const QuizPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const lessonId = state?.lessonId;
    const [quizzes, setQuizzes] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get(`/quizzes/course/${courseId}`, {
                    params: { lessonId }
                });
                setQuizzes(res.data);
            } catch (error) {
                message.error('Failed to load quiz');
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, [courseId, lessonId]);

    const handleAnswer = (e) => {
        const newAnswers = [...answers];
        newAnswers[currentIdx] = e.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            const res = await api.post('/quizzes/submit', {
                answers,
                courseId,
                lessonId
            });
            setResult(res.data);
            if (res.data.passed) {
                message.success('Cognitive Lock Released: Access Granted');
            } else {
                message.warning('Interference Detected: Insufficient Precision');
            }
        } catch (error) {
            message.error('Signal Interrupted during submission');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (quizzes.length === 0) return <Result status="info" title="No quizzes available for this course." />;

    if (result) {
        return (
            <div style={{ padding: '60px 24px' }} className="fade-in">
                <Card
                    className="glass-card"
                    style={{
                        maxWidth: 600,
                        margin: '0 auto',
                        textAlign: 'center',
                        borderRadius: 24,
                        background: 'rgba(17, 34, 64, 0.7)',
                        border: '1px solid rgba(0, 209, 178, 0.1)',
                        padding: '40px 24px'
                    }}
                >
                    <Result
                        status={result.passed ? "success" : "warning"}
                        title={<span style={{ color: '#fff', fontSize: '32px' }}>Neural Sync: {result.percentage}%</span>}
                        subTitle={<span style={{ color: '#8892b0', fontSize: '18px' }}>{result.passed ? "Cognitive Lock Released: Access Granted" : "Interference Detected: Insufficient Precision"}</span>}
                        extra={[
                            <Button
                                type="primary"
                                key="dashboard"
                                size="large"
                                onClick={() => navigate('/dashboard')}
                                style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600, borderRadius: 12, height: 50, padding: '0 40px' }}
                            >
                                Return to Command Center
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    const currentQuiz = quizzes[currentIdx];

    return (
        <div style={{ maxWidth: 800, margin: '60px auto', padding: '0 24px' }} className="fade-in">
            <div style={{ marginBottom: 32 }}>
                <Title level={3} className="glow-text" style={{ marginBottom: 16 }}>Evaluation Sequence</Title>
                <Progress
                    percent={Math.round(((currentIdx + 1) / quizzes.length) * 100)}
                    strokeColor="#00d1b2"
                    trailColor="rgba(255, 255, 255, 0.05)"
                    strokeWidth={12}
                    showInfo={false}
                />
            </div>

            <Card
                className="glass-card"
                title={<Space><Text style={{ color: '#8892b0' }}>Fragment {currentIdx + 1} of {quizzes.length}</Text></Space>}
                style={{
                    marginTop: 20,
                    borderRadius: 20,
                    background: 'rgba(17, 34, 64, 0.6)',
                    border: '1px solid rgba(0, 209, 178, 0.1)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
            >
                <Title level={3} style={{ color: '#ccd6f6', marginBottom: 32, lineHeight: 1.5 }}>{currentQuiz.question}</Title>
                <Radio.Group onChange={handleAnswer} value={answers[currentIdx]} style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {currentQuiz.options.map((opt, i) => (
                            <Radio.Button
                                key={i}
                                value={opt}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    borderRadius: 12,
                                    height: 'auto',
                                    padding: '16px 24px',
                                    background: answers[currentIdx] === opt ? 'rgba(0, 209, 178, 0.1)' : 'rgba(10, 25, 47, 0.5)',
                                    border: answers[currentIdx] === opt ? '1px solid #00d1b2' : '1px solid rgba(0, 209, 178, 0.1)',
                                    color: answers[currentIdx] === opt ? '#00d1b2' : '#ccd6f6',
                                    fontSize: '16px',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {opt}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
                <div style={{ marginTop: 48, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        disabled={currentIdx === 0}
                        onClick={() => setCurrentIdx(currentIdx - 1)}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#ccd6f6', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8 }}
                    >
                        Previous Fragment
                    </Button>
                    {currentIdx === quizzes.length - 1 ? (
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={!answers[currentIdx]}
                            style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, borderRadius: 8, padding: '0 32px' }}
                        >
                            Finalize Evaluation
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => setCurrentIdx(currentIdx + 1)}
                            disabled={!answers[currentIdx]}
                            style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, borderRadius: 8, padding: '0 32px' }}
                        >
                            Next Fragment
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QuizPage;
