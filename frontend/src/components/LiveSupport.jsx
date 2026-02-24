import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Input, List, Space, Typography, Badge } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const { Text } = Typography;
const socket = io(window.location.origin); // Using current origin for single-port setup

const LiveSupport = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [unread, setUnread] = useState(0);
    const [conversationId, setConversationId] = useState(null);
    const scrollRef = useRef();
    const isOpenRef = useRef(false);

    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        if (!user || !user._id) return;

        let mounted = true;

        const initSupportConversation = async () => {
            try {
                socket.emit('register', user._id);

                // Find an admin to act as Collective Support
                const { data: partners } = await api.get('/chat/partners');
                const adminPartner = partners.find(p => p.role === 'admin' && p._id !== user._id) || partners[0];
                if (!adminPartner) {
                    console.warn('No support partner available for Collective Support');
                    return;
                }

                const { data: conversation } = await api.post('/chat/conversation', {
                    participantId: adminPartner._id,
                });

                if (!mounted) return;

                setConversationId(conversation._id);

                // Join the conversation room and load history
                socket.emit('joinConversation', conversation._id);
                socket.emit('markAsRead', { conversationId: conversation._id, userId: user._id });

                const { data: messages } = await api.get(`/chat/messages/${conversation._id}`);
                if (!mounted) return;
                setChat(messages);

                const handleMessage = (msg) => {
                    if (msg.conversationId !== conversation._id) return;
                    setChat(prev => [...prev, msg]);
                    if (!isOpenRef.current) {
                        setUnread(u => u + 1);
                    } else {
                        socket.emit('markAsRead', { conversationId: conversation._id, userId: user._id });
                    }
                };

                socket.on('receiveMessage', handleMessage);

                return () => {
                    socket.off('receiveMessage', handleMessage);
                };
            } catch (error) {
                console.error('Failed to initialize Collective Support:', error);
            }
        };

        const cleanupPromise = initSupportConversation();

        return () => {
            mounted = false;
        };
    }, [user]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    const sendMessage = () => {
        if (!message.trim() || !user?._id || !conversationId) return;

        const msgData = {
            conversationId,
            senderId: user._id,
            text: message,
            messageType: 'text',
        };

        socket.emit('sendMessage', msgData);
        setMessage('');
    };

    if (!user) return null;

    return (
        <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
            {isOpen ? (
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space><Badge status="processing" color="#00d1b2" /><Text strong style={{ color: '#fff' }}>Collective Support</Text></Space>
                            <Button type="text" icon={<CloseOutlined style={{ color: '#8892b0' }} />} onClick={() => setIsOpen(false)} />
                        </div>
                    }
                    className="glass-card fade-in"
                    style={{
                        width: 350,
                        borderRadius: 20,
                        boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: 500,
                        border: '1px solid rgba(0, 209, 178, 0.2)'
                    }}
                    bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: 16,
                        background: 'rgba(10, 25, 47, 0.4)',
                        minHeight: '300px'
                    }}>
                        <List
                            dataSource={chat}
                            renderItem={msg => {
                                const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                                const text = msg.message || msg.text || '';
                                return (
                                    <div style={{ textAlign: isMe ? 'right' : 'left', marginBottom: 12 }}>
                                        <Space direction="vertical" size={0}>
                                            <div style={{
                                                background: isMe ? 'rgba(0, 209, 178, 0.15)' : 'rgba(17, 34, 64, 0.8)',
                                                color: '#fff',
                                                padding: '8px 12px',
                                                borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                                border: `1px solid ${isMe ? 'rgba(0, 209, 178, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                                maxWidth: 250
                                            }}>
                                                {text}
                                            </div>
                                            <Text style={{ fontSize: 10, color: '#8892b0', marginTop: 4, display: 'block' }}>
                                                {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </Space>
                                    </div>
                                );
                            }}
                        />
                        <div ref={scrollRef} />
                    </div>
                    <div style={{ padding: 16, background: 'rgba(17, 34, 64, 0.9)', borderTop: '1px solid rgba(0, 209, 178, 0.1)' }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Transmit message..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onPressEnter={sendMessage}
                                style={{ background: 'rgba(10, 25, 47, 0.5)', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#fff' }}
                            />
                            <Button
                                type="primary"
                                icon={<SendOutlined />}
                                onClick={sendMessage}
                                style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }}
                            />
                        </Space.Compact>
                    </div>
                </Card>
            ) : (
                <Badge count={unread} color="#00d1b2">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<MessageOutlined style={{ fontSize: 24 }} />}
                        style={{
                            width: 60,
                            height: 60,
                            background: '#00d1b2',
                            border: 'none',
                            color: '#0a192f',
                            boxShadow: '0 10px 30px rgba(0, 209, 178, 0.3)'
                        }}
                        className="pulse-glow"
                        onClick={() => { setIsOpen(true); setUnread(0); }}
                    />
                </Badge>
            )}
        </div>
    );
};

export default LiveSupport;
