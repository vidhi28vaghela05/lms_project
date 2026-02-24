import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Divider, Space, Tag, message, Input, Modal, Alert } from 'antd';
import { CreditCardOutlined, QrcodeOutlined, SafetyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
    const [upiDetails, setUPIDetails] = useState({ transactionId: '' });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                setCourse(res.data);
            } catch (err) {
                message.error('System bypass failed: Course unreachable');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleStripeCheckout = async () => {
        try {
            const { data } = await api.post('/payments/create-checkout-session', { courseId });
            window.location.href = data.url;
        } catch (err) {
            message.error('Neural bridge to Stripe failed');
        }
    };

    const handleUPISubmission = async () => {
        if (!upiDetails.transactionId) return message.error('Transaction Identifier missing');
        try {
            await api.post('/payments/submit-upi', {
                courseId,
                transactionId: upiDetails.transactionId,
                proofImage: 'placeholder_for_demo'
            });
            message.success('UPI Data Transmitted: Awaiting Node Confirmation');
            setIsUPIModalOpen(false);
            navigate('/dashboard');
        } catch (err) {
            message.error('UPI protocol error');
        }
    };

    if (loading) return <div style={{ padding: 100, textAlign: 'center' }}>Synchronizing...</div>;

    return (
        <div style={{ maxWidth: 1000, margin: '100px auto', padding: '0 24px', background: 'transparent' }} className="fade-in">
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 32,
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ccd6f6',
                    border: '1px solid rgba(0, 209, 178, 0.2)',
                    borderRadius: '8px'
                }}
            >
                Abort Mission
            </Button>

            <Row gutter={40}>
                <Col xs={24} lg={14}>
                    <Title level={2} className="glow-text">Acquisition Terminal</Title>
                    <Text style={{ color: '#8892b0' }}>Authorize enrollment for neural enhancement module.</Text>

                    <Card
                        className="glass-card"
                        style={{
                            marginTop: 32,
                            borderRadius: 20,
                            background: 'rgba(17, 34, 64, 0.7)',
                            border: '1px solid rgba(0, 209, 178, 0.1)'
                        }}
                    >
                        <Title level={4} style={{ color: '#00d1b2' }}>Standard Protocol: Stripe</Title>
                        <Text style={{ color: '#8892b0' }}>Global credit/debit network via encrypted link.</Text>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<CreditCardOutlined />}
                            style={{
                                height: 60,
                                marginTop: 24,
                                borderRadius: 12,
                                background: '#00d1b2',
                                border: 'none',
                                color: '#0a192f',
                                fontWeight: 700
                            }}
                            onClick={handleStripeCheckout}
                        >
                            Authorize via Stripe
                        </Button>

                        <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)' }}><span style={{ color: '#8892b0' }}>OR</span></Divider>

                        <Title level={4} style={{ color: '#00d1b2' }}>Legacy Protocol: UPI Transfer</Title>
                        <Text style={{ color: '#8892b0' }}>Manual peer-to-peer verification (Requires admin audit).</Text>
                        <Button
                            block
                            size="large"
                            icon={<QrcodeOutlined />}
                            style={{
                                height: 60,
                                marginTop: 24,
                                borderRadius: 12,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(0, 209, 178, 0.3)',
                                color: '#ccd6f6',
                                fontWeight: 600
                            }}
                            onClick={() => setIsUPIModalOpen(true)}
                        >
                            Submit UPI Transaction
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card
                        className="glass-card"
                        style={{
                            borderRadius: 20,
                            background: 'rgba(17, 34, 64, 0.6)',
                            border: '1px solid rgba(0, 209, 178, 0.1)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}
                    >
                        <Title level={4} style={{ color: '#ccd6f6' }}>Manifest</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#8892b0' }}>{course.title}</Text>
                                <Text strong style={{ color: '#ccd6f6' }}>${course.price}</Text>
                            </div>
                            <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>{course.level.toUpperCase()}</Tag>
                            <Divider style={{ margin: '20px 0', borderColor: 'rgba(0, 209, 178, 0.1)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={3} style={{ margin: 0, color: '#fff' }}>Total Due</Title>
                                <Title level={2} style={{ margin: 0, color: '#00d1b2', fontWeight: 800 }}>${course.price}</Title>
                            </div>
                        </Space>
                        <Alert
                            message={<span style={{ fontWeight: 600 }}>Secure Transaction</span>}
                            description={<span style={{ fontSize: '12px', opacity: 0.8 }}>All transmissions are secured via AES-256 encryption.</span>}
                            type="info"
                            showIcon
                            icon={<SafetyOutlined style={{ color: '#00d1b2' }} />}
                            style={{
                                marginTop: 32,
                                background: 'rgba(0, 209, 178, 0.05)',
                                border: '1px solid rgba(0, 209, 178, 0.2)',
                                color: '#8892b0'
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title={<span style={{ color: '#112240' }}>UPI Manual Transmission</span>}
                open={isUPIModalOpen}
                onCancel={() => setIsUPIModalOpen(false)}
                footer={[
                    <Button key="back" onClick={() => setIsUPIModalOpen(false)}>Cancel</Button>,
                    <Button key="submit" type="primary" style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }} onClick={handleUPISubmission}>Transmit Protocol</Button>
                ]}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Text strong style={{ color: '#112240', fontSize: '16px' }}>Scan & Pay: instructor@upi</Text>
                    <br />
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=instructor@upi&pn=Instructor&am=${course.price}`}
                        alt="QR"
                        style={{ marginTop: 20, border: '4px solid #00d1b2', borderRadius: 12 }}
                    />
                </div>
                <Form layout="vertical">
                    <Form.Item label="Transaction ID / UTR" required>
                        <Input
                            placeholder="Enter 12-digit transaction ID"
                            onChange={(e) => setUPIDetails({ transactionId: e.target.value })}
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
