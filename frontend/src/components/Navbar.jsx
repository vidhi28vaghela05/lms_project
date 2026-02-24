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
    const navbarBg = scrolled ? 'rgba(10, 25, 47, 0.85)' : 'transparent';
    const logoColor = '#00d1b2';

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
                backdropFilter: 'blur(15px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: '0 50px',
                height: scrolled ? '70px' : '90px',
                borderBottom: scrolled ? '1px solid rgba(0, 209, 178, 0.1)' : 'none',
                boxShadow: scrolled ? '0 10px 30px -10px rgba(2, 12, 27, 0.7)' : 'none'
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
                    LMS<span style={{ color: '#00d1b2', textShadow: '0 0 10px rgba(0, 209, 178, 0.3)' }}>3.0</span>
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
                    color: '#8892b0',
                    flex: 1
                }}
                theme="dark"
            />

            <Space size="large">
                {user ? (
                    /* Logged In: Show User Avatar */
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Avatar
                            style={{
                                backgroundColor: 'rgba(0, 209, 178, 0.1)',
                                border: '1px solid #00d1b2',
                                color: '#00d1b2',
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
                            style={{ color: '#ccd6f6', fontWeight: 600 }}
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </Button>
                        <Button
                            type="primary"
                            style={{
                                background: '#00d1b2',
                                border: 'none',
                                height: '45px',
                                padding: '0 30px',
                                borderRadius: '8px',
                                color: '#0a192f',
                                fontWeight: 700,
                                boxShadow: '0 4px 14px 0 rgba(0, 209, 178, 0.3)'
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
                    color: #8892b0 !important;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .ant-menu-dark .ant-menu-item:hover {
                    color: #00d1b2 !important;
                }
                .ant-menu-dark .ant-menu-item-selected {
                    color: #00d1b2 !important;
                    background: transparent !important;
                }
                .ant-menu-dark.ant-menu-horizontal > .ant-menu-item-selected::after {
                    border-bottom-color: #00d1b2 !important;
                    border-bottom-width: 2px !important;
                }
                .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover::after {
                    border-bottom-color: #00d1b2 !important;
                }
            `}</style>
        </Header>
    );
};

export default Navbar;
