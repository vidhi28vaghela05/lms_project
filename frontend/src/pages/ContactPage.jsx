import React from 'react';
import {
    Typography,
    Layout,
    Tag,
    ConfigProvider,
    Space,
    Button
} from 'antd';
import {
    PhoneOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const ContactPage = () => {
    return (
        <Layout style={{ background: 'transparent' }}>
            <Navbar />

            <Content style={{ marginTop: 80 }}>
                {/* ============ CONTACT SECTION ============ */}
                <section id="contact" style={{ padding: '100px 50px', background: 'radial-gradient(circle at top right, rgba(0, 209, 178, 0.05), transparent), #0a192f', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                        <PhoneOutlined style={{ fontSize: 64, color: '#00d1b2', marginBottom: 32, opacity: 0.8, filter: 'drop-shadow(0 0 10px rgba(0, 209, 178, 0.3))' }} />
                        <Title level={2} style={{ color: '#fff', fontSize: '36px' }}>Get in Touch</Title>
                        <Paragraph style={{ fontSize: '20px', color: '#8892b0', marginBottom: 40 }}>
                            Have questions? Our support team is here to help. Reach out to us anytime.
                        </Paragraph>
                        <Space size="large">
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    height: 55,
                                    padding: '0 45px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: '#00d1b2',
                                    border: 'none',
                                    color: '#0a192f',
                                    boxShadow: '0 4px 14px 0 rgba(0, 209, 178, 0.3)'
                                }}
                                href="mailto:support@lms3.com"
                            >
                                📧 Email Us
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                style={{
                                    height: 55,
                                    padding: '0 45px',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(0, 209, 178, 0.2)',
                                    color: '#ccd6f6'
                                }}
                                onClick={() => alert('Chat support starting soon! Support team is available 24/7 via email.')}
                            >
                                💬 Chat Support
                            </Button>
                        </Space>
                    </div>
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

export default ContactPage;
