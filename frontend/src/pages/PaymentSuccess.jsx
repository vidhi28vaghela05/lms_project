import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div style={{ padding: '100px 24px', textAlign: 'center', background: 'transparent' }}>
            <Card
                className="glass-card"
                style={{
                    maxWidth: 600,
                    margin: '0 auto',
                    borderRadius: 24,
                    background: 'rgba(17, 34, 64, 0.7)',
                    border: '1px solid rgba(0, 209, 178, 0.1)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    padding: '40px 24px'
                }}
            >
                <Result
                    status="success"
                    title={<span style={{ color: '#00d1b2', fontSize: '32px', fontWeight: 800 }}>TRANSACTION AUTHORIZED</span>}
                    subTitle={<span style={{ color: '#8892b0', fontSize: '18px' }}>Nexus key generated successfully. Neural Identifier: {sessionId?.slice(-8).toUpperCase()}</span>}
                    extra={[
                        <Button
                            type="primary"
                            key="console"
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 700, height: 50, borderRadius: 12, padding: '0 40px' }}
                        >
                            Access Learning Core
                        </Button>,
                        <Button
                            key="courses"
                            size="large"
                            onClick={() => navigate('/courses')}
                            style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#ccd6f6', border: '1px solid rgba(0, 209, 178, 0.2)', height: 50, borderRadius: 12, padding: '0 40px' }}
                        >
                            View Repository
                        </Button>
                    ]}
                />
            </Card>
        </div>
    );
};

export default PaymentSuccess;
