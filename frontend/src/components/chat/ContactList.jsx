import React, { useState, useEffect } from 'react';
import { List, Avatar, Input, Typography, Spin, Empty, Divider, Tabs } from 'antd';
import { SearchOutlined, UserOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Text } = Typography;
const { TabPane } = Tabs;

const ContactList = ({ onSelect }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/chat/partners');
            setContacts(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load contacts');
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <SafetyOutlined style={{ color: '#ff4d4f' }} />;
            case 'instructor': return <TeamOutlined style={{ color: '#00d1b2' }} />;
            default: return <UserOutlined style={{ color: '#8892b0' }} />;
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 20 }}><Spin /></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#0a192f' }}>
            <div style={{ padding: 16 }}>
                <Input
                    prefix={<SearchOutlined style={{ color: '#8892b0' }} />}
                    placeholder="Find a contact..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        background: 'rgba(17, 34, 64, 0.6)',
                        border: '1px solid rgba(0, 209, 178, 0.2)',
                        color: '#ccd6f6',
                        borderRadius: 12
                    }}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {filteredContacts.length === 0 ? (
                    <Empty description={<span style={{ color: '#8892b0' }}>No contacts found</span>} />
                ) : (
                    <List
                        dataSource={filteredContacts}
                        renderItem={contact => (
                            <List.Item
                                onClick={() => onSelect(contact)}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid rgba(0, 209, 178, 0.05)',
                                    transition: '0.3s'
                                }}
                                className="chat-list-item"
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={contact.avatar} style={{ border: '1px solid rgba(0, 209, 178, 0.2)' }} />}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Text strong style={{ color: '#ccd6f6' }}>{contact.name}</Text>
                                            {getRoleIcon(contact.role)}
                                        </div>
                                    }
                                    description={<Text style={{ color: '#8892b0', fontSize: 12 }}>{contact.email}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default ContactList;
