import React, { useState, useEffect } from 'react';
import { Button, Space, Layout, Menu, Avatar, Dropdown, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoutOutlined, DashboardOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { key: 'home', label: 'Home', onClick: () => navigate('/') },
        { key: 'courses', label: 'Courses', onClick: () => navigate('/courses') },
        { key: 'about', label: 'About', onClick: () => navigate('/about') },
        { key: 'contact', label: 'Contact', onClick: () => navigate('/contact') }
    ];

    const userMenuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => {
                logout();
                navigate('/');
            }
        }
    ];

    const isHomePage = location.pathname === '/';
    const navbarBg = '#1d3557';
    const logoColor = '#fff';

    return (
        <Header
            style={{
                position: 'fixed',
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: navbarBg,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                padding: '0 50px',
                height: scrolled ? '64px' : '80px',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/')}
            >
                <Title
                    level={3}
                    style={{
                        color: '#fff',
                        margin: 0,
                        fontWeight: 800,
                        letterSpacing: '-1px'
                    }}
                >
                    LMS<span style={{ color: '#e63946' }}>3.0</span>
                </Title>
            </div>

            {/* Navigation Menu - Show on all pages */}
            <Menu
                mode="horizontal"
                disabledOverflow
                items={navItems}
                style={{
                    background: 'transparent',
                    border: 'none',
                    minWidth: '400px',
                    justifyContent: 'center',
                    color: '#fff',
                    flex: 1
                }}
                theme="dark"
            />

            <Space size="middle">
                {user ? (
                    /* Logged In: Show User Avatar */
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Avatar
                            style={{
                                backgroundColor: '#e63946',
                                cursor: 'pointer',
                                fontWeight: 700
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                    </Dropdown>
                ) : (
                    /* Not Logged In: Show Login/Signup Buttons */
                    <>
                        <Button
                            type="text"
                            style={{ color: '#fff', fontWeight: 600 }}
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                background: '#e63946',
                                border: 'none',
                                height: '40px',
                                padding: '0 25px',
                                fontWeight: 700
                            }}
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </Button>
                    </>
                )}
            </Space>

            <style>{`
                .ant-menu-dark .ant-menu-item {
                    color: rgba(255,255,255,0.85) !important;
                    font-weight: 500;
                }
                .ant-menu-dark .ant-menu-item-selected {
                    color: #e63946 !important;
                    background: transparent !important;
                }
                .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover::after {
                    border-bottom-color: #e63946 !important;
                }
            `}</style>
        </Header>
    );
};

export default Navbar;
