import React, { useState, useEffect, useRef } from 'react';
import { List, Avatar, Input, Button, Typography, Space, Tooltip, Upload, message } from 'antd';
import {
    SendOutlined,
    ArrowLeftOutlined,
    PaperClipOutlined,
    CheckOutlined,
    CheckCircleFilled
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { Text, Title } = Typography;

const ChatRoom = ({ conversation, socket, onBack, isPage }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const scrollRef = useRef();

    useEffect(() => {
        fetchMessages();
        socket.emit('joinConversation', conversation._id);
        socket.emit('markAsRead', { conversationId: conversation._id, userId: user._id });

        socket.on('receiveMessage', (msg) => {
            if (msg.conversationId === conversation._id) {
                setMessages(prev => [...prev, msg]);
                socket.emit('markAsRead', { conversationId: conversation._id, userId: user._id });
            }
        });

        socket.on('userTyping', (data) => {
            if (data.conversationId === conversation._id && data.userId !== user._id) {
                setTypingUser(data.userName);
            }
        });

        socket.on('userStoppedTyping', (data) => {
            if (data.conversationId === conversation._id) {
                setTypingUser(null);
            }
        });

        socket.on('messagesRead', (data) => {
            if (data.conversationId === conversation._id) {
                setMessages(prev => prev.map(m => m.sender === data.userId || m.sender?._id === data.userId ? m : { ...m, status: 'read' }));
            }
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('userTyping');
            socket.off('userStoppedTyping');
            socket.off('messagesRead');
        };
    }, [conversation._id, socket, user._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typingUser]);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/chat/messages/${conversation._id}`);
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages');
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const messageData = {
            conversationId: conversation._id,
            senderId: user._id,
            text: inputValue,
            messageType: 'text'
        };

        socket.emit('sendMessage', messageData);
        socket.emit('stopTyping', { conversationId: conversation._id, userId: user._id });
        setInputValue('');
    };

    const handleTyping = (e) => {
        setInputValue(e.target.value);
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { conversationId: conversation._id, userId: user._id, userName: user.name });
            setTimeout(() => {
                setIsTyping(false);
                socket.emit('stopTyping', { conversationId: conversation._id, userId: user._id });
            }, 3000);
        }
    };

    const handleUpload = (info) => {
        const { status, originFileObj, name } = info.file;
        if (status === 'done' || status === 'uploading') {
            // In a real app, you'd upload to S3/Cloudinary and get a URL
            // Here we'll simulate it with a dummy URL after a short delay
            const reader = new FileReader();
            reader.onload = (e) => {
                const messageData = {
                    conversationId: conversation._id,
                    senderId: user._id,
                    message: `Sent a ${info.file.type.startsWith('image/') ? 'image' : 'file'}`,
                    messageType: info.file.type.startsWith('image/') ? 'image' : 'file',
                    fileUrl: e.target.result, // Base64 for demo purposes
                    fileName: name
                };
                socket.emit('sendMessage', messageData);
            };
            reader.readAsDataURL(originFileObj);
            message.success(`${name} file prepared for transmission.`);
        }
    };

    const otherParticipant = conversation.participants.find(p => p._id !== user._id);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0a192f' }}>
            <div style={{ padding: '12px 16px', background: '#112240', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }}>
                {!isPage && <Button ghost icon={<ArrowLeftOutlined />} onClick={onBack} style={{ border: 'none', color: '#00d1b2', marginRight: 12 }} />}
                <Avatar src={conversation.isGroup ? null : otherParticipant?.avatar} style={{ marginRight: 12 }} />
                <div>
                    <Title level={5} style={{ color: '#ccd6f6', margin: 0, fontSize: 16 }}>
                        {conversation.isGroup ? conversation.groupName : otherParticipant?.name}
                    </Title>
                    <Text style={{ fontSize: 12, color: typingUser ? '#00d1b2' : '#8892b0' }}>
                        {typingUser ? `${typingUser} is typing...` : otherParticipant?.role}
                    </Text>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <List
                    dataSource={messages}
                    renderItem={msg => {
                        const isMe = msg.sender === user._id || msg.sender?._id === user._id;
                        return (
                            <div style={{
                                textAlign: isMe ? 'right' : 'left',
                                marginBottom: 12,
                                display: 'flex',
                                justifyContent: isMe ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    background: isMe ? '#00d1b2' : '#112240',
                                    padding: '8px 12px',
                                    borderRadius: isMe ? '12px 12px 0 12px' : '12px 12px 12px 0',
                                    color: isMe ? '#0a192f' : '#ccd6f6',
                                    position: 'relative',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}>
                                    {conversation.isGroup && !isMe && (
                                        <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 4, color: '#00d1b2' }}>
                                            {msg.sender?.name}
                                        </div>
                                    )}
                                    {msg.messageType === 'image' ? (
                                        <img src={msg.fileUrl} alt="sent" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 8 }} />
                                    ) : msg.messageType === 'file' ? (
                                        <div style={{ background: 'rgba(0,0,0,0.1)', padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center' }}>
                                            <PaperClipOutlined style={{ marginRight: 8 }} />
                                            <a href={msg.fileUrl} target="_blank" rel="noreferrer" style={{ color: isMe ? '#0a192f' : '#00d1b2' }}>{msg.fileName}</a>
                                        </div>
                                    ) : (
                                        <Text style={{ color: isMe ? '#0a192f' : '#ccd6f6' }}>{msg.message}</Text>
                                    )}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        fontSize: 9,
                                        marginTop: 4,
                                        color: isMe ? 'rgba(10, 25, 47, 0.6)' : '#8892b0'
                                    }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && (
                                            <span style={{ marginLeft: 4 }}>
                                                {msg.status === 'read' ? (
                                                    <CheckCircleFilled style={{ color: '#004d40' }} />
                                                ) : msg.status === 'delivered' ? (
                                                    <><CheckOutlined style={{ position: 'relative', left: 3 }} /><CheckOutlined /></>
                                                ) : (
                                                    <CheckOutlined />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                />
                <div ref={scrollRef} />
            </div>

            <div style={{ padding: 16, background: '#112240' }}>
                <Space.Compact style={{ width: '100%' }}>
                    <Upload
                        showUploadList={false}
                        customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                        onChange={handleUpload}
                    >
                        <Tooltip title="Attach file">
                            <Button icon={<PaperClipOutlined />} style={{ background: 'transparent', border: '1px solid rgba(0, 209, 178, 0.2)', color: '#00d1b2' }} />
                        </Tooltip>
                    </Upload>
                    <Input
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={handleTyping}
                        onPressEnter={handleSend}
                        style={{
                            background: 'rgba(10, 25, 47, 0.6)',
                            border: '1px solid rgba(0, 209, 178, 0.2)',
                            color: '#ccd6f6'
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        style={{ background: '#00d1b2', border: 'none', color: '#0a192f' }}
                    />
                </Space.Compact>
            </div>
        </div>
    );
};

export default ChatRoom;
