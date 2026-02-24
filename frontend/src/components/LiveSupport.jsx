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
        if (user && user._id) {
            socket.emit('register', user._id);
            const handleMessage = (msg) => {
                setChat(prev => [...prev, msg]);
                if (!isOpen) setUnread(u => u + 1);
            };
            socket.on('receiveMessage', handleMessage);
            return () => socket.off('receiveMessage', handleMessage);
        }
    }, [user, isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    const sendMessage = () => {
        if (!message.trim() || !user?._id) return;
        const msgData = {
            senderId: user._id,
            receiverId: 'admin_id_placeholder', // Still a placeholder, but backend now handles it safely
            text: message,
            createdAt: new Date()
        };
        // socket.emit('sendMessage', msgData); // Temporarily commented out until real admin ID exists to avoid backend log spam
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
                            renderItem={msg => (
                                <div style={{ textAlign: msg.senderId === user._id ? 'right' : 'left', marginBottom: 12 }}>
                                    <Space direction="vertical" size={0}>
                                        <div style={{
                                            background: msg.senderId === user._id ? 'rgba(0, 209, 178, 0.15)' : 'rgba(17, 34, 64, 0.8)',
                                            color: '#fff',
                                            padding: '8px 12px',
                                            borderRadius: '12px 12px 0 12px',
                                            border: `1px solid ${msg.senderId === user._id ? 'rgba(0, 209, 178, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                            maxWidth: 250
                                        }}>
                                            {msg.text}
                                        </div>
                                        <Text style={{ fontSize: 10, color: '#8892b0', marginTop: 4, display: 'block' }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </Space>
                                </div>
                            )}
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
