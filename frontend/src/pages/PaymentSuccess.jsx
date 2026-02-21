import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Result, Button, Card } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div style={{ padding: '100px 24px', textAlign: 'center' }}>
            <Card style={{ maxWidth: 600, margin: '0 auto', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <Result
                    status="success"
                    title="Transaction Authorized"
                    subTitle={`Nexus key generated successfully. Session: ${sessionId?.slice(-8)}`}
                    extra={[
                        <Button type="primary" key="console" size="large" onClick={() => navigate('/dashboard')}>
                            Access Learning Core
                        </Button>,
                        <Button key="courses" size="large" onClick={() => navigate('/courses')}>
                            View Repository
                        </Button>
                    ]}
                />
            </Card>
        </div>
    );
};

export default PaymentSuccess;
