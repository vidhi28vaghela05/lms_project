import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Avatar, Space, Typography } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    BookOutlined,
    LineChartOutlined,
    LogoutOutlined,
    DashboardOutlined,
    WalletOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import LiveSupport from '../components/LiveSupport';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ children, onLogout }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const role = sessionStorage.getItem('role');

    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimary, colorBgBase },
    } = theme.useToken();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const getMenuItems = () => {
        const common = [
            { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' }
        ];

        if (role === 'student') {
            return [
                ...common,
                { key: '/my-courses', icon: <BookOutlined />, label: 'My Courses' },
                { key: '/skill-graph', icon: <LineChartOutlined />, label: 'Skill Graph' },
                { key: '/billing', icon: <WalletOutlined />, label: 'Billing & History' },
                { key: '/profile', icon: <IdcardOutlined />, label: 'My Profile' },
            ];
        } else if (role === 'instructor') {
            return [
                ...common,
                { key: '/manage-courses', icon: <BookOutlined />, label: 'Manage Courses' },
                { key: '/analytics', icon: <LineChartOutlined />, label: 'Analytics' },
            ];
        } else if (role === 'admin') {
            return [
                ...common,
                { key: '/manage-users', icon: <UserOutlined />, label: 'Manage Users' },
                { key: '/system-stats', icon: <LineChartOutlined />, label: 'System Stats' },
            ];
        }
        return common;
    };

    return (
        <Layout style={{ minHeight: '100vh', background: colorBgBase }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: 'rgba(10, 25, 47, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRight: `1px solid rgba(0, 209, 178, 0.1)`
                }}
            >
                <div style={{
                    height: 64,
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colorPrimary,
                    fontWeight: 900,
                    fontSize: collapsed ? 12 : 20,
                    textShadow: `0 0 10px ${colorPrimary}44`,
                    transition: 'all 0.3s'
                }}>
                    {collapsed ? 'LMS' : 'ECOSYSTEM'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={getMenuItems()}
                    onClick={({ key }) => navigate(key)}
                    style={{ background: 'transparent', border: 'none' }}
                />
            </Sider>
            <Layout style={{ background: colorBgBase }}>
                <Header style={{
                    padding: '0 24px',
                    background: 'rgba(17, 34, 64, 0.7)',
                    backdropFilter: 'blur(15px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid rgba(0, 209, 178, 0.1)`,
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16, width: 40, height: 40, color: colorPrimary }}
                    />
                    <Space size="large">
                        <Space>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: colorPrimary }} />
                            <Text strong style={{ color: '#e6f1ff' }}>{role?.toUpperCase()}</Text>
                        </Space>
                        <Button
                            type="primary"
                            danger
                            ghost
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ borderRadius: 6, borderColor: '#ff4d4f' }}
                        >
                            Sign Out
                        </Button>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px',
                        padding: 24,
                        minHeight: 280,
                        background: 'rgba(17, 34, 64, 0.4)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: borderRadiusLG,
                        border: `1px solid rgba(0, 209, 178, 0.1)`,
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                    }}
                >
                    {children}
                </Content>
            </Layout>
            <LiveSupport />
        </Layout>
    );
};

export default MainLayout;
