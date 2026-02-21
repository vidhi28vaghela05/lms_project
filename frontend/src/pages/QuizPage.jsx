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
            <Card style={{ maxWidth: 600, margin: '50px auto', textAlign: 'center', borderRadius: 16 }}>
                <Result
                    status={result.passed ? "success" : "warning"}
                    title={`Your Score: ${result.percentage}%`}
                    subTitle={result.passed ? "Next-level content unlocked!" : "Try again to unlock the next level."}
                    extra={[
                        <Button type="primary" key="dashboard" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    ]}
                />
            </Card>
        );
    }

    const currentQuiz = quizzes[currentIdx];

    return (
        <div style={{ maxWidth: 800, margin: '40px auto' }}>
            <Progress percent={Math.round(((currentIdx + 1) / quizzes.length) * 100)} showInfo={false} />
            <Card
                title={<Space><Text type="secondary">Question {currentIdx + 1} of {quizzes.length}</Text></Space>}
                style={{ marginTop: 20, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
                <Title level={4}>{currentQuiz.question}</Title>
                <Radio.Group onChange={handleAnswer} value={answers[currentIdx]} style={{ width: '100%', marginTop: 20 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {currentQuiz.options.map((opt, i) => (
                            <Radio.Button key={i} value={opt} style={{ width: '100%', textAlign: 'left', borderRadius: 8, height: 'auto', padding: '12px' }}>
                                {opt}
                            </Radio.Button>
                        ))}
                    </Space>
                </Radio.Group>
                <div style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between' }}>
                    <Button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>Previous</Button>
                    {currentIdx === quizzes.length - 1 ? (
                        <Button type="primary" onClick={handleSubmit} disabled={!answers[currentIdx]}>Submit Quiz</Button>
                    ) : (
                        <Button type="primary" onClick={() => setCurrentIdx(currentIdx + 1)} disabled={!answers[currentIdx]}>Next</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QuizPage;
