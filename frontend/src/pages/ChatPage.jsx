import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Modal } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import ChatDashboard from '../components/chat/ChatDashboard';
import ContactList from '../components/chat/ContactList';
import api from '../services/api';

const { Title, Text } = Typography;

const ChatPage = () => {
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleStartChat = async (contact) => {
        try {
            await api.post('/chat/conversation', { participantId: contact._id });
            setIsNewChatModalOpen(false);
            setRefreshTrigger(prev => prev + 1); // Cause dashboard to re-fetch
        } catch (err) {
            console.error('Failed to start conversation');
        }
    };

    return (
        <div style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ color: '#ccd6f6', margin: 0 }}>Messaging Center</Title>
                    <Text style={{ color: '#8892b0' }}>Engage with instructors, students, and support.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsNewChatModalOpen(true)}
                    style={{ background: '#00d1b2', border: 'none', color: '#0a192f', fontWeight: 600 }}
                >
                    New Conversation
                </Button>
            </div>

            <Card
                className="glass-card"
                style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(17, 34, 64, 0.4)' }}
                bodyStyle={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column' }}
            >
                <ChatDashboard key={refreshTrigger} onUnreadChange={() => { }} isPage={true} />
            </Card>

            <Modal
                title={<span style={{ color: '#00d1b2' }}>Start New Conversation</span>}
                open={isNewChatModalOpen}
                onCancel={() => setIsNewChatModalOpen(false)}
                footer={null}
                width={400}
                styles={{
                    body: { padding: 0, background: '#0a192f' },
                    header: { background: '#112240', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }
                }}
            >
                <ContactList onSelect={handleStartChat} />
            </Modal>
        </div>
    );
};

export default ChatPage;
