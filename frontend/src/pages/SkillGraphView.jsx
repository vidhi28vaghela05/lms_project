import React, { useEffect, useState } from 'react';
import { Card, Typography, message, Spin } from 'antd';
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
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2}>The Skill Graph</Title>
                <Text type="secondary">Visualize how skills connect and build upon each other.</Text>
            </div>

            <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: 400 }}>
                {skills.map(skill => (
                    <Card.Grid key={skill._id} style={{ width: '33.33%', textAlign: 'center' }}>
                        <Title level={5}>{skill.skillName}</Title>
                        <Text type="secondary">{skill.difficultyLevel.toUpperCase()}</Text>
                        <div style={{ marginTop: 10 }}>
                            {skill.prerequisites?.length > 0 ? (
                                <Text size="small">Prereqs: {skill.prerequisites.map(p => p.skillName).join(', ')}</Text>
                            ) : (
                                <Text size="small" type="success">Entry Level</Text>
                            )}
                        </div>
                    </Card.Grid>
                ))}
            </Card>
        </div>
    );
};

export default SkillGraphView;
