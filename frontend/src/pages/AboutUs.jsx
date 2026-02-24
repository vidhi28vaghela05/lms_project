import React from 'react';
import {
    Typography,
    Row,
    Col,
    Layout,
    Tag,
    ConfigProvider,
    Space,
    Divider,
    Button
} from 'antd';
import {
    CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AboutUs = () => {
    const navigate = useNavigate();
    return (
        <Layout style={{ background: 'transparent' }}>
            <Navbar />

            <Content style={{ marginTop: 80 }}>
                {/* ============ ABOUT SECTION ============ */}
                <section style={{ padding: '100px 50px', background: 'radial-gradient(circle at top right, rgba(0, 209, 178, 0.05), transparent), #0a192f' }}>
                    <Row gutter={[60, 60]} align="middle" style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Col xs={24} md={12}>
                            <div
                                style={{
                                    background: 'rgba(17, 34, 64, 0.6)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(0, 209, 178, 0.1)',
                                    borderRadius: '24px',
                                    height: '400px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#00d1b2',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                                    fontSize: '100px'
                                }}
                            >
                                🚀
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>ABOUT US</Tag>
                            <Title level={2} style={{ marginTop: 16, color: '#fff' }}>
                                The Future of Online Learning
                            </Title>
                            <Paragraph style={{ fontSize: '18px', color: '#8892b0', marginBottom: 24 }}>
                                LMS 3.0 is built on the conviction that education should be accessible, personalized, and engaging. We combine cutting-edge AI technology with proven pedagogical methods to create the most effective learning experience.
                            </Paragraph>
                            <Paragraph style={{ fontSize: '18px', color: '#8892b0', marginBottom: 32 }}>
                                Our mission is to empower learners worldwide to master in-demand skills, accelerate their careers, and achieve their dreams.
                            </Paragraph>

                            <Space direction="vertical" style={{ width: '100%', fontSize: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <CheckCircleOutlined style={{ color: '#00d1b2', fontSize: 20 }} />
                                    <Text style={{ color: '#ccd6f6' }}>Trusted by 10K+ learners worldwide</Text>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <CheckCircleOutlined style={{ color: '#00d1b2', fontSize: 20 }} />
                                    <Text style={{ color: '#ccd6f6' }}>50+ experienced instructors</Text>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <CheckCircleOutlined style={{ color: '#00d1b2', fontSize: 20 }} />
                                    <Text style={{ color: '#ccd6f6' }}>Industry-recognized certificates</Text>
                                </div>
                            </Space>

                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                                style={{
                                    marginTop: 40,
                                    height: 55,
                                    padding: '0 45px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: '#00d1b2',
                                    border: 'none',
                                    color: '#0a192f',
                                    boxShadow: '0 4px 14px 0 rgba(0, 209, 178, 0.3)'
                                }}
                            >
                                Join Our Learning Community
                            </Button>
                        </Col>
                    </Row>
                </section>
            </Content>

            <Footer style={{ padding: '60px 50px 40px', background: '#0a192f', borderTop: '1px solid rgba(0, 209, 178, 0.1)', color: '#8892b0', textAlign: 'center' }}>
                <Title level={3} style={{ color: '#fff' }}>LMS<span style={{ color: '#00d1b2' }}>3.0</span></Title>
                <Text style={{ color: '#8892b0' }}>
                    © 2026 LMS 3.0. All rights reserved.
                </Text>
            </Footer>
        </Layout>
    );
};

export default AboutUs;
