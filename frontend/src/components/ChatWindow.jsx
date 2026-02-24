import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Space, Divider } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Text, Title } = Typography;

const ChatWindow = ({ receiverId, courseId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const endpoint = user.role === 'student' ? '/student/messages' : '/instructor/messages';
                const { data } = await api.get(endpoint);
                const filtered = data.filter(m =>
                    (m.sender?._id === receiverId || m.receiver?._id === receiverId) &&
                    (!courseId || m.courseId === courseId)
                );
                setMessages(filtered);
            } catch (err) {
                console.error('Failed to sync messages');
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling for demo, real uses socket
        return () => clearInterval(interval);
    }, [receiverId, courseId, user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        try {
            const endpoint = user.role === 'student' ? '/student/messages' : '/instructor/messages';
            await api.post(endpoint, {
                message: newMessage,
                receiverId,
                courseId
            });
            setNewMessage('');
        } catch (err) {
            console.error('Signal transmission failed');
        }
    };

    return (
        <Card
            className="glass-card chat-window"
            style={{
                height: 500,
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(17, 34, 64, 0.4)',
                border: '1px solid rgba(0, 209, 178, 0.1)'
            }}
            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
        >
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }}>
                <Title level={5} style={{ color: '#00d1b2', margin: 0 }}>Communication Terminal</Title>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                <List
                    dataSource={messages}
                    renderItem={(msg) => {
                        const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                        return (
                            <div style={{
                                textAlign: isMe ? 'right' : 'left',
                                marginBottom: 16,
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '80%',
                                    background: isMe ? 'rgba(0, 209, 178, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                    padding: '12px 16px',
                                    borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                    border: isMe ? '1px solid rgba(0, 209, 178, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    {msg.isSystemNotification && <RobotOutlined style={{ marginRight: 8, color: '#00d1b2' }} />}
                                    <Text style={{ color: isMe ? '#fff' : '#ccd6f6' }}>{msg.message}</Text>
                                    <div style={{ fontSize: 10, color: '#8892b0', marginTop: 4 }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />
                <div ref={scrollRef} />
            </div>

            <div style={{ padding: 24, borderTop: '1px solid rgba(0, 209, 178, 0.1)' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onPressEnter={handleSend}
                        style={{
                            background: 'rgba(10, 25, 47, 0.6)',
                            border: '1px solid rgba(0, 209, 178, 0.2)',
                            color: '#ccd6f6',
                            borderRadius: '8px 0 0 8px'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        style={{
                            background: '#00d1b2',
                            border: 'none',
                            color: '#0a192f',
                            borderRadius: '0 8px 8px 0'
                        }}
                    />
                </Space.Compact>
            </div>
        </Card>
    );
};

export default ChatWindow;
