import React, { useState, useEffect } from 'react';
import { List, Avatar, Badge, Input, Typography, Spin, Empty } from 'antd';
import { SearchOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ChatRoom from './ChatRoom';
import { io } from 'socket.io-client';

const { Text } = Typography;

const ChatDashboard = ({ onUnreadChange, onClose, isPage }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConv, setSelectedConv] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(window.location.origin);
        setSocket(newSocket);

        newSocket.emit('register', user._id);

        newSocket.on('conversationUpdate', (updatedConv) => {
            setConversations(prev => {
                const index = prev.findIndex(c => c._id === updatedConv._id);
                if (index > -1) {
                    const newConvs = [...prev];
                    newConvs[index] = updatedConv;
                    return newConvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                }
                return [updatedConv, ...prev];
            });
        });

        return () => newSocket.close();
    }, [user._id]);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const totalUnread = conversations.reduce((acc, conv) => {
            const myUnread = conv.unreadCounts?.find(u => u.user === user._id || u.user?._id === user._id);
            return acc + (myUnread?.count || 0);
        }, 0);
        onUnreadChange(totalUnread);
    }, [conversations, user._id, onUnreadChange]);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/chat/conversations');
            setConversations(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load conversations');
            setLoading(false);
        }
    };

    if (selectedConv) {
        return <ChatRoom conversation={selectedConv} socket={socket} onBack={() => setSelectedConv(null)} isPage={isPage} />;
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 16 }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#8892b0' }} />}
                    placeholder="Search conversations..."
                    style={{
                        background: 'rgba(17, 34, 64, 0.6)',
                        border: '1px solid rgba(0, 209, 178, 0.2)',
                        color: '#ccd6f6',
                        borderRadius: 12
                    }}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
                ) : conversations.length === 0 ? (
                    <Empty description={<span style={{ color: '#8892b0' }}>No conversations yet</span>} />
                ) : (
                    <List
                        dataSource={conversations}
                        renderItem={conv => {
                            const otherParticipant = conv.participants.find(p => p._id !== user._id);
                            const myUnread = conv.unreadCounts?.find(u => u.user === user._id || u.user?._id === user._id);

                            return (
                                <List.Item
                                    onClick={() => setSelectedConv(conv)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        borderBottom: '1px solid rgba(0, 209, 178, 0.05)'
                                    }}
                                    className="chat-list-item"
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Badge count={myUnread?.count} offset={[-2, 32]}>
                                                <Avatar
                                                    src={conv.isGroup ? null : otherParticipant?.avatar}
                                                    icon={conv.isGroup ? <UsergroupAddOutlined /> : null}
                                                    style={{ background: '#112240', border: '1px solid rgba(0, 209, 178, 0.2)' }}
                                                />
                                            </Badge>
                                        }
                                        title={
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Text strong style={{ color: '#ccd6f6' }}>{conv.isGroup ? conv.groupName : otherParticipant?.name}</Text>
                                                <Text style={{ fontSize: 11, color: '#8892b0' }}>
                                                    {conv.lastMessage && new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                                                </Text>
                                            </div>
                                        }
                                        description={
                                            <Text ellipsis style={{ color: '#8892b0', fontSize: 13, width: '90%' }}>
                                                {conv.lastMessage?.message || 'Started a new conversation'}
                                            </Text>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ChatDashboard;
