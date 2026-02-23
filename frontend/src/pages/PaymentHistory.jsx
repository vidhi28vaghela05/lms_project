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
                message.error('Neural billing link interrupted');
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
            title: 'Module Acquired',
            dataIndex: 'courseId',
            key: 'course',
            render: (course) => course?.title || 'Unknown Course'
        },
        {
            title: 'Protocol',
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
            render: (amount) => <Text strong>${amount}</Text>
        },
        {
            title: 'Sync Status',
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
                    Offline
                </Button>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Title level={2}>Billing Artifacts</Title>
            <Text type="secondary">Review your transaction logs and acquisition history.</Text>

            <Card style={{ marginTop: 32, borderRadius: 16, overflow: 'hidden' }}>
                <Table
                    dataSource={payments}
                    columns={columns}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 8 }}
                />
            </Card>
        </div>
    );
};

export default PaymentHistory;
