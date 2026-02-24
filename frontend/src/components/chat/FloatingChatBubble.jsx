import React, { useState } from 'react';
import { Badge, Button, Drawer } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import ChatDashboard from './ChatDashboard';

const FloatingChatBubble = () => {
    const [open, setOpen] = useState(false);
    const [unreadTotal, setUnreadTotal] = useState(0);

    return (
        <>
            <div style={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                <Badge count={unreadTotal} overflowCount={99}>
                    <Button
                        type="primary"
                        shape="circle"
                        icon={open ? <CloseOutlined /> : <MessageOutlined />}
                        size="large"
                        onClick={() => setOpen(!open)}
                        style={{
                            width: 60,
                            height: 60,
                            fontSize: 24,
                            boxShadow: '0 4px 15px rgba(0, 209, 178, 0.4)',
                            background: '#00d1b2',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="pulse-glow"
                    />
                </Badge>
            </div>

            <Drawer
                title={<span style={{ color: '#00d1b2' }}>LMS Messaging Terminal</span>}
                placement="right"
                onClose={() => setOpen(false)}
                open={open}
                width={450}
                styles={{
                    body: { padding: 0, background: '#0a192f' },
                    header: { background: '#112240', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }
                }}
                closeIcon={<CloseOutlined style={{ color: '#8892b0' }} />}
            >
                <ChatDashboard onUnreadChange={setUnreadTotal} onClose={() => setOpen(false)} />
            </Drawer>
        </>
    );
};

export default FloatingChatBubble;
