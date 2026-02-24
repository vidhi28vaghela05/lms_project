import React, { useEffect, useState } from 'react';
import { Card, Typography, message, Spin, Row, Col, Tag } from 'antd';
import { G2 } from '@ant-design/plots';
import api from '../services/api';

const { Title, Text } = Typography;

const SkillGraphView = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await api.get('/skills');
                setSkills(res.data);
            } catch (error) {
                message.error('Failed to load skill graph');
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Simplified representation using a tree layout if data permits, 
    // or a custom G2-based chart. For now, we'll use a friendly list view 
    // as a robust fallback while keeping it high-end.

    if (loading) return <div style={{ textAlign: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>The Neural Matrix</Title>
                <Text style={{ color: '#8892b0', fontSize: '18px' }}>Visualize the cognitive dependencies and skill synchronization map.</Text>
            </div>

            <Card
                className="glass-card"
                style={{
                    borderRadius: 24,
                    background: 'rgba(17, 34, 64, 0.4)',
                    border: '1px solid rgba(0, 209, 178, 0.1)',
                    minHeight: 400,
                    overflow: 'hidden'
                }}
            >
                <Row gutter={[0, 0]}>
                    {skills.map(skill => (
                        <Col key={skill._id} xs={24} sm={12} md={8}>
                            <Card.Grid
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    padding: '40px 24px',
                                    border: '1px solid rgba(0, 209, 178, 0.05)',
                                    background: 'transparent',
                                    transition: 'all 0.3s'
                                }}
                                hoverable={false}
                                className="skill-grid-item"
                            >
                                <Title level={4} style={{ color: '#ccd6f6', margin: 0 }}>{skill.skillName}</Title>
                                <Tag color="cyan" style={{ marginTop: 12, background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>
                                    {skill.difficultyLevel.toUpperCase()}
                                </Tag>
                                <div style={{ marginTop: 24 }}>
                                    {skill.prerequisites?.length > 0 ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <Text style={{ color: '#8892b0', fontSize: '12px' }}>PREREQUISITES</Text>
                                            <Text style={{ color: '#00d1b2' }}>{skill.prerequisites.map(p => p.skillName).join(', ')}</Text>
                                        </div>
                                    ) : (
                                        <Text style={{ color: '#52c41a', fontSize: '12px', fontWeight: 600 }}>ENTRY LEVEL NODE</Text>
                                    )}
                                </div>
                            </Card.Grid>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
};

export default SkillGraphView;
