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
import Navbar from '../components/Navbar';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const AboutUs = () => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#e63946',
                    borderRadius: 12,
                },
            }}
        >
            <Layout style={{ background: '#fff' }}>
                <Navbar />

                <Content style={{ marginTop: 80 }}>
                    {/* ============ ABOUT SECTION ============ */}
                    <section style={{ padding: '100px 50px', background: '#fff' }}>
                        <Row gutter={[60, 60]} align="middle" style={{ maxWidth: 1200, margin: '0 auto' }}>
                            <Col xs={24} md={12}>
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #1d3557, #457b9d)',
                                        borderRadius: '20px',
                                        height: '400px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                        fontSize: '100px'
                                    }}
                                >
                                    🚀
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <Tag color="blue">ABOUT US</Tag>
                                <Title level={2} style={{ marginTop: 16 }}>
                                    The Future of Online Learning
                                </Title>
                                <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 24 }}>
                                    LMS 3.0 is built on the conviction that education should be accessible, personalized, and engaging. We combine cutting-edge AI technology with proven pedagogical methods to create the most effective learning experience.
                                </Paragraph>
                                <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 32 }}>
                                    Our mission is to empower learners worldwide to master in-demand skills, accelerate their careers, and achieve their dreams.
                                </Paragraph>

                                <Space direction="vertical" style={{ width: '100%', fontSize: '16px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>Trusted by 10K+ learners worldwide</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>50+ experienced instructors</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>Industry-recognized certificates</Text>
                                    </div>
                                </Space>

                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => window.location.href = '/register'}
                                    style={{
                                        marginTop: 40,
                                        height: 50,
                                        padding: '0 40px',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        background: '#e63946'
                                    }}
                                >
                                    Join Our Learning Community
                                </Button>
                            </Col>
                        </Row>
                    </section>
                </Content>

                <Footer style={{ padding: '60px 50px 40px', background: '#1d3557', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#fff' }}>LMS<span style={{ color: '#e63946' }}>3.0</span></Title>
                    <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
                        © 2026 LMS 3.0. All rights reserved.
                    </Text>
                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default AboutUs;
