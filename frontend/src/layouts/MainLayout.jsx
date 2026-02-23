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
    const role = localStorage.getItem('role');

    const {
        token: { colorBgContainer, borderRadiusLG },
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
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: '#1d3557' }}
            >
                <div style={{
                    height: 64,
                    margin: '16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f1faee',
                    fontWeight: 900,
                    fontSize: collapsed ? 12 : 20,
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
                    style={{ background: '#1d3557', border: 'none' }}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16, width: 40, height: 40 }}
                    />
                    <Space size="large">
                        <Space>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1d3557' }} />
                            <Text strong style={{ color: '#1d3557' }}>{role?.toUpperCase()}</Text>
                        </Space>
                        <Button
                            type="primary"
                            danger
                            ghost
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            style={{ borderRadius: 6 }}
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
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
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
