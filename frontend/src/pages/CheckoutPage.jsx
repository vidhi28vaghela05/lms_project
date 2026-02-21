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
        <div style={{ maxWidth: 1000, margin: '100px auto', padding: '0 24px' }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 32 }}>Abort Mission</Button>

            <Row gutter={40}>
                <Col xs={24} lg={14}>
                    <Title level={2}>Acquisition Terminal</Title>
                    <Text type="secondary">Authorize enrollment for neural enhancement module.</Text>

                    <Card style={{ marginTop: 32, borderRadius: 20 }}>
                        <Title level={4}>Standard Protocol: Stripe</Title>
                        <Text type="secondary">Global credit/debit network via encrypted link.</Text>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<CreditCardOutlined />}
                            style={{ height: 60, marginTop: 24, borderRadius: 12 }}
                            onClick={handleStripeCheckout}
                        >
                            Authorize via Stripe
                        </Button>

                        <Divider>OR</Divider>

                        <Title level={4}>Legacy Protocol: UPI Transfer</Title>
                        <Text type="secondary">Manual peer-to-peer verification (Requires admin audit).</Text>
                        <Button
                            block
                            icon={<QrcodeOutlined />}
                            style={{ height: 60, marginTop: 24, borderRadius: 12 }}
                            onClick={() => setIsUPIModalOpen(true)}
                        >
                            Submit UPI Transaction
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} lg={10}>
                    <Card style={{ borderRadius: 20, background: '#f8f9fa' }}>
                        <Title level={4}>Manifest</Title>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>{course.title}</Text>
                                <Text strong>${course.price}</Text>
                            </div>
                            <Tag color="blue">{course.level.toUpperCase()}</Tag>
                            <Divider style={{ margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Title level={3} style={{ margin: 0 }}>Total Due</Title>
                                <Title level={3} style={{ margin: 0, color: '#e63946' }}>${course.price}</Title>
                            </div>
                        </Space>
                        <Alert
                            message="Secure Transaction"
                            description="All transmissions are secured via AES-256 encryption."
                            type="info"
                            showIcon
                            icon={<SafetyOutlined />}
                            style={{ marginTop: 32 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal
                title="UPI Manual Transmission"
                open={isUPIModalOpen}
                onCancel={() => setIsUPIModalOpen(false)}
                onOk={handleUPISubmission}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Text strong>Scan & Pay: instructor@upi</Text>
                    <br />
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=instructor@upi&pn=Instructor&am=10" alt="QR" style={{ marginTop: 16 }} />
                </div>
                <Form layout="vertical">
                    <Form.Item label="Transaction ID / UTR" required>
                        <Input placeholder="Enter 12-digit transaction ID" onChange={(e) => setUPIDetails({ transactionId: e.target.value })} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CheckoutPage;
