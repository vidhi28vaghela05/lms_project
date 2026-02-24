import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, Typography, message, Space, Button } from 'antd';
import { DownloadOutlined, CreditCardOutlined, QrcodeOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/payments/history');
                setPayments(res.data);
            } catch (error) {
                message.error('Billing history synchronization failed');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Course Name',
            dataIndex: 'courseId',
            key: 'course',
            render: (course) => course?.title || 'Unknown Course'
        },
        {
            title: 'Payment Method',
            dataIndex: 'method',
            key: 'method',
            render: (method) => (
                <Space>
                    {method === 'stripe' ? <CreditCardOutlined /> : <QrcodeOutlined />}
                    <Text uppercase>{method}</Text>
                </Space>
            )
        },
        {
            title: 'Credits Transferred',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <Text strong style={{ color: '#00d1b2' }}>${amount}</Text>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'completed' ? 'success' : 'warning'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Invoice',
            key: 'action',
            render: () => (
                <Button size="small" icon={<DownloadOutlined />} disabled>
                    N/A
                </Button>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 24px', background: 'transparent' }} className="fade-in">
            <div style={{ marginBottom: 40 }}>
                <Title level={2} className="glow-text" style={{ marginBottom: 8 }}>Financial Logs</Title>
                <Text style={{ color: '#8892b0', fontSize: '16px' }}>Review your encrypted transaction logs and course acquisition history.</Text>
            </div>

            <Card
                className="glass-card"
                style={{
                    marginTop: 32,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 209, 178, 0.1)'
                }}
            >
                <Table
                    className="custom-dark-table"
                    dataSource={payments}
                    columns={columns}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                    style={{ background: 'transparent' }}
                />
            </Card>
        </div>
    );
};

export default PaymentHistory;
