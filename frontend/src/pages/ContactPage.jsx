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
                    {/* ============ CONTACT SECTION ============ */}
                    <section id="contact" style={{ padding: '100px 50px', background: '#f8f9fa', minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center' }}>
                        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                            <PhoneOutlined style={{ fontSize: 48, color: '#e63946', marginBottom: 24 }} />
                            <Title level={2}>Get in Touch</Title>
                            <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: 32 }}>
                                Have questions? Our support team is here to help. Reach out to us anytime.
                            </Paragraph>
                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        height: 50,
                                        padding: '0 40px',
                                        borderRadius: '12px',
                                        fontWeight: 700
                                    }}
                                    href="mailto:support@lms3.com"
                                >
                                    📧 Email Us
                                </Button>
                                <Button
                                    type="default"
                                    size="large"
                                    style={{
                                        height: 50,
                                        padding: '0 40px',
                                        borderRadius: '12px',
                                        fontWeight: 700
                                    }}
                                    onClick={() => alert('Chat support starting soon! Support team is available 24/7 via email.')}
                                >
                                    💬 Chat Support
                                </Button>
                            </Space>
                        </div>
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

export default ContactPage;
