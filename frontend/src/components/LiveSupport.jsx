import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Input, List, Avatar, Space, Typography, Badge } from 'antd';
import { MessageOutlined, CloseOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const { Text } = Typography;
const socket = io(window.location.origin); // Using current origin for single-port setup

const LiveSupport = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [unread, setUnread] = useState(0);
    const scrollRef = useRef();

    useEffect(() => {
        if (user) {
            socket.emit('register', user._id);
            socket.on('receiveMessage', (msg) => {
                setChat(prev => [...prev, msg]);
                if (!isOpen) setUnread(u => u + 1);
            });
        }
        return () => socket.off('receiveMessage');
    }, [user, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    const sendMessage = () => {
        if (!message.trim()) return;
        const msgData = {
            senderId: user._id,
            receiverId: 'admin_id_placeholder', // In a real app, this would be the admin/support agent
            text: message,
            createdAt: new Date()
        };
        socket.emit('sendMessage', msgData);
        setChat(prev => [...prev, msgData]);
        setMessage('');
    };

    if (!user) return null;

    return (
        <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
            {isOpen ? (
                <Card
                    title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space><Badge status="processing" /><Text strong>Collective Support</Text></Space>
                            <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />
                        </div>
                    }
                    className="glass-card"
                    style={{ width: 350, borderRadius: 20, boxShadow: '0 15px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: 500 }}
                    bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                    <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f8f9fa' }}>
                        <List
                            dataSource={chat}
                            renderItem={msg => (
                                <div style={{ textAlign: msg.senderId === user._id ? 'right' : 'left', marginBottom: 12 }}>
                                    <Space direction="vertical" size={0}>
                                        <div style={{
                                            background: msg.senderId === user._id ? '#e63946' : '#fff',
                                            color: msg.senderId === user._id ? '#fff' : '#333',
                                            padding: '8px 12px',
                                            borderRadius: 12,
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                            maxWidth: 250
                                        }}>
                                            {msg.text}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: 10 }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </Space>
                                </div>
                            )}
                        />
                        <div ref={scrollRef} />
                    </div>
                    <div style={{ padding: 16, background: '#fff' }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Transmit message..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                onPressEnter={sendMessage}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={sendMessage} />
                        </Space.Compact>
                    </div>
                </Card>
            ) : (
                <Badge count={unread}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<MessageOutlined style={{ fontSize: 24 }} />}
                        style={{ width: 60, height: 60, boxShadow: '0 10px 30px rgba(230, 57, 70, 0.3)' }}
                        onClick={() => { setIsOpen(true); setUnread(0); }}
                    />
                </Badge>
            )}
        </div>
    );
};

export default LiveSupport;
