import React from 'react';
import {
    Button,
    Typography,
    Row,
    Col,
    Card,
    Space,
    Layout,
    Tag,
    theme as antdTheme,
    Collapse,
    Rate,
    Avatar,
    Divider
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRightOutlined,
    RocketOutlined,
    BookOutlined,
    TeamOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    StarFilled,
    BarChartOutlined,
    SecurityScanOutlined,
    ThunderboltOutlined,
    LinkedinOutlined,
    GithubOutlined,
    TwitterOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const LandingPage = () => {
    const navigate = useNavigate();
    const { token } = antdTheme.useToken();

    const stats = [
        { label: '10K+', desc: 'Active Learners' },
        { label: '500+', desc: 'Courses' },
        { label: '50+', desc: 'Expert Instructors' },
        { label: '95%', desc: 'Success Rate' }
    ];

    const features = [
        {
            icon: <RocketOutlined />,
            title: 'Neural Acceleration',
            desc: 'High-speed cognitive modules designed for rapid skill acquisition and professional evolution.'
        },
        {
            icon: <BookOutlined />,
            title: 'Elite Repository',
            desc: 'Access a curated collection of advanced learning protocols verified by industry leaders.'
        },
        {
            icon: <TeamOutlined />,
            title: 'Collective Intelligence',
            desc: 'Connect with a global network of elite learners and synchronize your progress.'
        }
    ];

    const testimonials = [
        {
            rating: 5,
            text: "The transition to LMS 3.0 has completely synchronized my career path. The neural interface is seamless.",
            emoji: "👤",
            name: "Alex Rivera",
            role: "Senior Protocol Engineer"
        },
        {
            rating: 5,
            text: "Highly optimized learning modules. I synchronized my React skills in record time.",
            emoji: "👤",
            name: "Sarah Chen",
            role: "Frontend Architect"
        },
        {
            rating: 5,
            text: "The best ROI for time spent. Every module is a high-frequency transmission of pure knowledge.",
            emoji: "👤",
            name: "Marcus Thorne",
            role: "Security Analyst"
        }
    ];

    const pricingPlans = [
        {
            name: 'Initiate',
            desc: 'Basic access to the collective repository.',
            price: 'Free',
            features: [
                'Access to Free Modules',
                'Standard Sync Speed',
                'Community Support'
            ],
            btnType: 'default'
        },
        {
            name: 'Elite',
            desc: 'Optimized for career transformation.',
            price: '$49/mo',
            features: [
                'Unlimited Repository Access',
                'Neural Analytics',
                'Priority Support Link',
                'Certificates of Evolution'
            ],
            btnType: 'primary',
            badge: 'MOST POPULAR'
        },
        {
            name: 'Nexus',
            desc: 'Full synchronization for teams.',
            price: '$199/mo',
            features: [
                'Team Management Console',
                'Dedicated Support Channel',
                'Custom Protocol Integration',
                'White-label Transmission'
            ],
            btnType: 'default'
        }
    ];

    const faqs = [
        {
            key: '1',
            label: <Text style={{ color: '#ccd6f6', fontWeight: 600 }}>What is Neural Learning?</Text>,
            children: <Paragraph style={{ color: '#8892b0' }}>Neural learning is our optimized protocol for translating information into long-term professional skills using high-frequency modules.</Paragraph>
        },
        {
            key: '2',
            label: <Text style={{ color: '#ccd6f6', fontWeight: 600 }}>How do I synchronize my certificates?</Text>,
            children: <Paragraph style={{ color: '#8892b0' }}>Certificates are automatically synchronized to your profile once a module reached 100% completion in your repository.</Paragraph>
        }
    ];

    return (
        <Layout style={{ background: '#0a192f', overflow: 'hidden' }}>
            <Navbar />

            <Content>
                {/* ============ HERO SECTION ============ */}
                <section
                    id="home"
                    style={{
                        background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
                        padding: '160px 24px 100px',
                        textAlign: 'center',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        borderBottom: '1px solid rgba(0, 209, 178, 0.1)'
                    }}
                >
                    {/* Abstract Soft Glows */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-10%',
                            right: '-10%',
                            width: '500px',
                            height: '500px',
                            background: 'rgba(0, 209, 178, 0.05)',
                            borderRadius: '50%',
                            filter: 'blur(80px)',
                            animation: 'float 6s infinite ease-in-out'
                        }}
                    />

                    <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }} className="fade-in">
                        <Tag color="cyan" style={{ padding: '8px 16px', fontSize: '14px', marginBottom: 24, borderRadius: '20px', fontWeight: 600, background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>
                            ✨ TRANSMISSION RECEIVED: LMS 3.0
                        </Tag>

                        <Title
                            level={1}
                            style={{
                                color: '#fff',
                                fontSize: 'clamp(40px, 8vw, 72px)',
                                marginBottom: 24,
                                lineHeight: 1.2,
                                fontWeight: 800
                            }}
                        >
                            Sync Your <span className="glow-text">Mind</span> with{' '}
                            <span className="glow-text">Elite Intelligence</span>
                        </Title>

                        <Paragraph
                            style={{
                                color: '#8892b0',
                                fontSize: '20px',
                                marginBottom: 48,
                                maxWidth: '700px',
                                margin: '0 auto 48px',
                                lineHeight: 1.6
                            }}
                        >
                            Access the neural frequency for high-performance learning. Expert-led modules synchronized directly to your dashboard. Join the collective evolution.
                        </Paragraph>

                        <Space size="large" wrap justify="center">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                                className="pulse-glow"
                                style={{
                                    height: 55,
                                    padding: '0 40px',
                                    fontSize: 16,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: '#00d1b2',
                                    border: 'none',
                                    color: '#0a192f',
                                    boxShadow: '0 8px 20px rgba(0, 209, 178, 0.3)'
                                }}
                            >
                                Initalize Learning <ArrowRightOutlined />
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                onClick={() => navigate('/courses')}
                                style={{
                                    height: 55,
                                    padding: '0 40px',
                                    fontSize: 16,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(0, 209, 178, 0.3)',
                                    color: '#00d1b2'
                                }}
                            >
                                Browse Modules
                            </Button>
                        </Space>
                    </div>
                </section>

                {/* ============ STATS SECTION ============ */}
                <section style={{ padding: '80px 24px', background: '#112240', borderBottom: '1px solid rgba(0, 209, 178, 0.1)' }}>
                    <Row gutter={[40, 40]} style={{ maxWidth: 1200, margin: '0 auto' }} className="fade-in">
                        {stats.map((stat, idx) => (
                            <Col xs={24} sm={12} md={6} key={idx}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="glow-text" style={{ fontSize: '48px', fontWeight: 800, marginBottom: 8, color: '#00d1b2' }}>
                                        {stat.label}
                                    </div>
                                    <Text style={{ fontSize: '16px', color: '#8892b0' }}>
                                        {stat.desc}
                                    </Text>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* ============ FEATURES SECTION ============ */}
                <section id="features" style={{ padding: '100px 24px', background: '#0a192f' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 1200, margin: '0 auto' }}>
                        <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)', fontWeight: 600 }}>SYSTEM CAPABILITIES</Tag>
                        <Title level={2} style={{ marginTop: 16, marginBottom: 24, color: '#fff' }}>
                            Advanced Cognitive Enhancements
                        </Title>
                        <Paragraph style={{ fontSize: '18px', color: '#8892b0', maxWidth: 600, margin: '0 auto' }}>
                            Our platform utilizes cutting-edge neural protocols and high-frequency learning modules to accelerate your evolution.
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                        {features.map((feature, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card
                                    bordered={false}
                                    className="glass-card"
                                    style={{ height: '100%', padding: '20px' }}
                                >
                                    <div
                                        className="float-element"
                                        style={{
                                            fontSize: 48,
                                            color: '#00d1b2',
                                            marginBottom: 24,
                                            background: 'rgba(0, 209, 178, 0.1)',
                                            width: '80px',
                                            height: '80px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(0, 209, 178, 0.2)'
                                        }}
                                    >
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ color: '#fff' }}>{feature.title}</Title>
                                    <Text style={{ color: '#8892b0' }}>{feature.desc}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* ============ TESTIMONIALS SECTION ============ */}
                <section style={{ padding: '100px 24px', background: '#112240' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <Tag color="cyan">SUCCESS STORIES</Tag>
                        <Title level={2} style={{ marginTop: 16, color: '#fff' }}>
                            What Our Users Say
                        </Title>
                    </div>

                    <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                        {testimonials.map((testimonial, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card
                                    bordered={false}
                                    className="glass-card"
                                    style={{ height: '100%', padding: '12px' }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <StarFilled key={i} style={{ color: '#00d1b2', fontSize: 16 }} />
                                            ))}
                                        </div>
                                        <Paragraph style={{ fontSize: '16px', color: '#ccd6f6', marginBottom: 0, fontStyle: 'italic' }}>
                                            "{testimonial.text}"
                                        </Paragraph>
                                        <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)', margin: '16px 0' }} />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Avatar style={{ backgroundColor: 'rgba(0, 209, 178, 0.2)', color: '#00d1b2', border: '1px solid rgba(0, 209, 178, 0.3)' }} size={40}>
                                                {testimonial.emoji}
                                            </Avatar>
                                            <div>
                                                <Text strong style={{ color: '#fff' }}>{testimonial.name}</Text>
                                                <br />
                                                <Text style={{ fontSize: '12px', color: '#8892b0' }}>
                                                    {testimonial.role}
                                                </Text>
                                            </div>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* ============ PRICING SECTION ============ */}
                <section id="pricing" style={{ padding: '100px 24px', background: '#0a192f' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <Tag color="cyan">PRICING PLANS</Tag>
                        <Title level={2} style={{ marginTop: 16, color: '#fff' }}>
                            Choose Your Plan
                        </Title>
                        <Paragraph style={{ fontSize: '18px', color: '#8892b0' }}>
                            Flexible pricing options for every stage of your learning journey
                        </Paragraph>
                    </div>

                    <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
                        {pricingPlans.map((plan, idx) => (
                            <Col xs={24} md={8} key={idx}>
                                <Card
                                    bordered={plan.btnType === 'primary'}
                                    className="glass-card"
                                    style={{
                                        padding: '20px',
                                        height: '100%',
                                        position: 'relative',
                                        transform: plan.btnType === 'primary' ? 'scale(1.05)' : 'scale(1)',
                                        borderColor: plan.btnType === 'primary' ? '#00d1b2' : 'rgba(0, 209, 178, 0.1)',
                                        zIndex: plan.btnType === 'primary' ? 2 : 1,
                                        boxShadow: plan.btnType === 'primary' ? '0 20px 40px rgba(0, 209, 178, 0.15)' : 'none'
                                    }}
                                >
                                    {plan.badge && (
                                        <Tag color="cyan" style={{ position: 'absolute', top: -12, right: 24, padding: '4px 12px', borderRadius: '10px' }}>
                                            {plan.badge}
                                        </Tag>
                                    )}

                                    <Title level={3} style={{ color: '#fff' }}>{plan.name}</Title>
                                    <Text style={{ color: '#8892b0' }}>{plan.desc}</Text>

                                    <div style={{ margin: '32px 0' }}>
                                        <div style={{ fontSize: '42px', fontWeight: 800, color: '#00d1b2' }}>
                                            {plan.price}
                                        </div>
                                    </div>

                                    <Space direction="vertical" style={{ width: '100%', marginBottom: 32 }}>
                                        {plan.features.map((feature, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <CheckCircleOutlined style={{ color: '#00d1b2', marginTop: 4 }} />
                                                <Text style={{ color: '#ccd6f6' }}>{feature}</Text>
                                            </div>
                                        ))}
                                    </Space>

                                    <Button
                                        type={plan.btnType}
                                        size="large"
                                        block
                                        onClick={() => navigate('/register')}
                                        style={{
                                            height: 50,
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            background: plan.btnType === 'primary' ? '#00d1b2' : 'transparent',
                                            borderColor: '#00d1b2',
                                            color: plan.btnType === 'primary' ? '#0a192f' : '#00d1b2'
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </section>

                {/* ============ FAQ SECTION ============ */}
                <section style={{ padding: '100px 24px', background: '#112240' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>FREQUENTLY ASKED</Tag>
                        <Title level={2} style={{ marginTop: 16, color: '#fff' }}>
                            Common Questions
                        </Title>
                    </div>

                    <Collapse
                        items={faqs}
                        defaultActiveKey={['1']}
                        style={{
                            maxWidth: 900,
                            margin: '0 auto',
                            background: 'rgba(10, 25, 47, 0.4)',
                            border: '1px solid rgba(0, 209, 178, 0.1)',
                            borderRadius: '12px'
                        }}
                    />
                </section>

                {/* ============ CTA SECTION ============ */}
                <section
                    style={{
                        padding: '100px 24px',
                        background: 'radial-gradient(circle at center, #112240 0%, #0a192f 100%)',
                        textAlign: 'center',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        borderTop: '1px solid rgba(0, 209, 178, 0.1)'
                    }}
                >
                    <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
                            Ready to Transform Your Career?
                        </Title>
                        <Paragraph style={{ fontSize: '18px', color: '#8892b0', marginBottom: 32 }}>
                            Join thousands of successful learners. Start learning today with free courses in a cutting-edge environment.
                        </Paragraph>
                        <Space size="large" wrap justify="center">
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/register')}
                                style={{
                                    height: 55,
                                    padding: '0 40px',
                                    fontSize: 16,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    boxShadow: '0 8px 20px rgba(0, 209, 178, 0.3)'
                                }}
                            >
                                Sign Up Free <ArrowRightOutlined />
                            </Button>
                            <Button
                                type="default"
                                size="large"
                                onClick={() => navigate('/login')}
                                style={{
                                    height: 55,
                                    padding: '0 40px',
                                    fontSize: 16,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(0, 209, 178, 0.3)',
                                    color: '#00d1b2'
                                }}
                            >
                                Sign In
                            </Button>
                        </Space>
                    </div>
                </section>
            </Content>

            {/* ============ FOOTER ============ */}
            <Footer style={{ padding: '80px 24px 40px', background: '#0a192f', color: '#8892b0', borderTop: '1px solid rgba(0, 209, 178, 0.1)' }}>
                <Row gutter={[40, 40]} style={{ maxWidth: 1200, margin: '0 auto 40px', textAlign: 'left' }}>
                    <Col xs={24} md={6}>
                        <Title level={3} style={{ color: '#fff', marginBottom: 24 }}>
                            LMS<span style={{ color: '#00d1b2' }}>3.0</span>
                        </Title>
                        <Paragraph style={{ color: '#8892b0', marginBottom: 24 }}>
                            Transforming education through intelligent, personalized learning experiences in a state-of-the-art environment.
                        </Paragraph>
                        <Space size="middle">
                            <a href="#" style={{ color: '#00d1b2', fontSize: 20 }}><LinkedinOutlined /></a>
                            <a href="#" style={{ color: '#00d1b2', fontSize: 20 }}><GithubOutlined /></a>
                            <a href="#" style={{ color: '#00d1b2', fontSize: 20 }}><TwitterOutlined /></a>
                        </Space>
                    </Col>

                    <Col xs={12} md={6}>
                        <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Product</Title>
                        <Space direction="vertical" size={8} style={{ display: 'flex' }}>
                            <a href="#features" style={{ color: '#8892b0' }}>Features</a>
                            <a href="#courses" style={{ color: '#8892b0' }}>Courses</a>
                            <a href="#pricing" style={{ color: '#8892b0' }}>Pricing</a>
                            <a href="#" style={{ color: '#8892b0' }}>FAQ</a>
                        </Space>
                    </Col>

                    <Col xs={12} md={6}>
                        <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Company</Title>
                        <Space direction="vertical" size={8} style={{ display: 'flex' }}>
                            <a href="#" style={{ color: '#8892b0' }}>About Us</a>
                            <a href="#" style={{ color: '#8892b0' }}>Blog</a>
                            <a href="#" style={{ color: '#8892b0' }}>Careers</a>
                            <a href="#" style={{ color: '#8892b0' }}>Contact</a>
                        </Space>
                    </Col>

                    <Col xs={24} md={6}>
                        <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Legal</Title>
                        <Space direction="vertical" size={8} style={{ display: 'flex' }}>
                            <a href="#" style={{ color: '#8892b0' }}>Privacy Policy</a>
                            <a href="#" style={{ color: '#8892b0' }}>Terms of Service</a>
                            <a href="#" style={{ color: '#8892b0' }}>Cookie Policy</a>
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(0, 209, 178, 0.1)' }} />

                <div style={{ textAlign: 'center', paddingTop: 20 }}>
                    <Text style={{ color: '#465a75', fontSize: '12px' }}>
                        © 2026 LMS 3.0. All rights reserved. | Syncing the future of humanity.
                    </Text>
                </div>
            </Footer>

        </Layout>
    );
};

export default LandingPage;
