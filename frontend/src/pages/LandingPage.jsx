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
    ConfigProvider,
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

    const stats = [
        { label: '10K+', desc: 'Active Learners' },
        { label: '500+', desc: 'Courses' },
        { label: '50+', desc: 'Expert Instructors' },
        { label: '95%', desc: 'Success Rate' }
    ];

    const features = [
        {
            icon: <ThunderboltOutlined />,
            title: 'Intelligent Learning Paths',
            desc: 'AI-powered recommendations tailored to your learning style and pace.'
        },
        {
            icon: <BarChartOutlined />,
            title: 'Real-time Analytics',
            desc: 'Track your progress with detailed insights and performance metrics.'
        },
        {
            icon: <TeamOutlined />,
            title: 'Expert Instructors',
            desc: 'Learn from industry veterans with decades of experience.'
        },
        {
            icon: <GlobalOutlined />,
            title: 'Global Community',
            desc: 'Connect with learners and professionals worldwide.'
        },
        {
            icon: <SecurityScanOutlined />,
            title: 'Secure & Reliable',
            desc: 'Enterprise-grade security and 99.9% uptime guarantee.'
        },
        {
            icon: <RocketOutlined />,
            title: 'Interactive Content',
            desc: 'Quizzes, projects, and hands-on exercises for better retention.'
        }
    ];

    const courses = [
        {
            title: 'Advanced Web Development',
            instructor: 'Sarah Chen',
            students: '2.5K',
            rating: 4.9,
            price: 'Free',
            badge: 'Most Popular'
        },
        {
            title: 'Cloud Infrastructure Mastery',
            instructor: 'Alex Kumar',
            students: '1.8K',
            rating: 4.8,
            price: 'Free',
            badge: 'Trending'
        },
        {
            title: 'Full-Stack Development',
            instructor: 'Marcus Johnson',
            students: '3.2K',
            rating: 4.9,
            price: 'Free',
            badge: 'Bestseller'
        }
    ];

    const testimonials = [
        {
            name: 'Emily Rodriguez',
            role: 'Software Engineer @ Tech Corp',
            emoji: '🎓',
            text: 'LMS 3.0 transformed my career. The structured learning paths helped me master cloud technologies in just 3 months!',
            rating: 5
        },
        {
            name: 'David Park',
            role: 'Full-Stack Developer',
            emoji: '💻',
            text: 'The real-time analytics feature gives me instant feedback on my progress. Absolutely game-changing!',
            rating: 5
        },
        {
            name: 'Lisa Thompson',
            role: 'Instructor @ University',
            emoji: '👨‍🏫',
            text: 'As an instructor, I love how easy it is to manage courses and track student progress. Highly recommended!',
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: 'Starter',
            price: 'Free',
            desc: 'Perfect for beginners',
            features: ['Access to 50+ free courses', 'Community support', 'Progress tracking', 'Basic analytics'],
            btnType: 'default'
        },
        {
            name: 'Professional',
            price: '$19/month',
            desc: 'For serious learners',
            features: ['All Starter features', 'Access to all courses', 'Priority support', 'Advanced analytics', 'Certificates', 'Lifetime access'],
            btnType: 'primary',
            badge: 'POPULAR'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            desc: 'For organizations',
            features: ['All Professional features', 'Team management', 'Custom branding', 'Dedicated support', 'API access', 'SSO integration'],
            btnType: 'primary'
        }
    ];

    const faqs = [
        {
            key: '1',
            label: 'How do I get started?',
            children: (
                <Paragraph>
                    Simply click the "Sign Up" button, create an account, and browse our course catalog. You can start learning immediately with free courses or upgrade to access premium content.
                </Paragraph>
            )
        },
        {
            key: '2',
            label: 'Are certificates provided?',
            children: (
                <Paragraph>
                    Yes! Upon completing any course, you'll receive a verified certificate that you can share on your professional profiles like LinkedIn and GitHub.
                </Paragraph>
            )
        },
        {
            key: '3',
            label: 'Can I learn at my own pace?',
            children: (
                <Paragraph>
                    Absolutely! Our platform is designed for self-paced learning. Access courses anytime, anywhere, and progress at your own speed. There are no fixed schedules.
                </Paragraph>
            )
        },
        {
            key: '4',
            label: 'What if I need help?',
            children: (
                <Paragraph>
                    We offer 24/7 community support, mentor access, and detailed documentation. Premium members get priority support from our expert team.
                </Paragraph>
            )
        },
        {
            key: '5',
            label: 'Is there a refund policy?',
            children: (
                <Paragraph>
                    Yes, we offer a 30-day money-back guarantee on all premium plans. If you're not satisfied, we'll refund your subscription in full.
                </Paragraph>
            )
        },
        {
            key: '6',
            label: 'Can I cancel anytime?',
            children: (
                <Paragraph>
                    Yes, you can cancel your subscription anytime with no questions asked. Your access will continue until the end of your billing period.
                </Paragraph>
            )
        }
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#e63946',
                    borderRadius: 12,
                },
            }}
        >
            <Layout style={{ background: '#fff' }}>
                <Navbar />

                <Content>
                    {/* ============ HERO SECTION ============ */}
                    <section
                        id="home"
                        style={{
                            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
                            padding: '160px 50px 100px',
                            textAlign: 'center',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            marginTop: 80
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-10%',
                                right: '-10%',
                                width: '500px',
                                height: '500px',
                                background: 'rgba(230, 57, 70, 0.1)',
                                borderRadius: '50%',
                                filter: 'blur(100px)',
                                animation: 'float 6s infinite ease-in-out'
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-20%',
                                left: '10%',
                                width: '400px',
                                height: '400px',
                                background: 'rgba(69, 123, 157, 0.2)',
                                borderRadius: '50%',
                                filter: 'blur(80px)',
                                animation: 'float 8s infinite ease-in-out'
                            }}
                        />

                        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                            <Tag color="red" style={{ padding: '8px 16px', fontSize: '14px', marginBottom: 24 }}>
                                ✨ Welcome to LMS 3.0
                            </Tag>

                            <Title
                                level={1}
                                style={{
                                    color: 'white',
                                    fontSize: 'clamp(40px, 8vw, 72px)',
                                    marginBottom: 24,
                                    lineHeight: 1.2,
                                    fontWeight: 800
                                }}
                            >
                                Transform Your <span style={{ color: '#e63946' }}>Career</span> with{' '}
                                <span style={{ color: '#e63946' }}>Elite Learning</span>
                            </Title>

                            <Paragraph
                                style={{
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: '20px',
                                    marginBottom: 48,
                                    maxWidth: '700px',
                                    margin: '0 auto 48px'
                                }}
                            >
                                Unlock your potential with AI-powered learning, expert instructors, and a global community. Start your journey today.
                            </Paragraph>

                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    style={{
                                        height: 55,
                                        padding: '0 40px',
                                        fontSize: 16,
                                        background: '#e63946',
                                        borderColor: '#e63946',
                                        borderRadius: '30px',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 24px rgba(230, 57, 70, 0.3)'
                                    }}
                                >
                                    Start Learning Today <ArrowRightOutlined />
                                </Button>
                                <Button
                                    type="default"
                                    size="large"
                                    onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                                    style={{
                                        height: 55,
                                        padding: '0 40px',
                                        fontSize: 16,
                                        borderRadius: '30px',
                                        fontWeight: 700,
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        color: '#fff'
                                    }}
                                >
                                    Explore Courses
                                </Button>
                            </Space>
                        </div>
                    </section>

                    {/* ============ STATS SECTION ============ */}
                    <section style={{ padding: '80px 50px', background: '#f8f9fa' }}>
                        <Row gutter={[40, 40]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                            {stats.map((stat, idx) => (
                                <Col xs={24} sm={12} md={6} key={idx}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '48px', fontWeight: 800, color: '#e63946', marginBottom: 8 }}>
                                            {stat.label}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: '16px' }}>
                                            {stat.desc}
                                        </Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* ============ FEATURES SECTION ============ */}
                    <section id="features" style={{ padding: '100px 50px', background: '#fff' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 1200, margin: '0 auto' }}>
                            <Tag color="blue">POWERFUL FEATURES</Tag>
                            <Title level={2} style={{ marginTop: 16, marginBottom: 24 }}>
                                Everything You Need to Succeed
                            </Title>
                            <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: 600, margin: '0 auto' }}>
                                Our platform combines cutting-edge technology with proven learning methodologies to create the perfect learning experience.
                            </Paragraph>
                        </div>

                        <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                            {features.map((feature, idx) => (
                                <Col xs={24} md={8} key={idx}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            height: '100%',
                                            borderRadius: '20px',
                                            padding: '40px',
                                            background: '#fff',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-12px)';
                                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 48,
                                                color: '#e63946',
                                                marginBottom: 24,
                                                background: '#f5f5f5',
                                                width: '80px',
                                                height: '80px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '16px'
                                            }}
                                        >
                                            {feature.icon}
                                        </div>
                                        <Title level={4}>{feature.title}</Title>
                                        <Text type="secondary">{feature.desc}</Text>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* ============ COURSES SECTION ============ */}
                    <section id="courses" style={{ padding: '100px 50px', background: '#f8f9fa' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 1200, margin: '0 auto' }}>
                            <Tag color="error">POPULAR COURSES</Tag>
                            <Title level={2} style={{ marginTop: 16 }}>
                                Start with Our Best Courses
                            </Title>
                        </div>

                        <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                            {courses.map((course, idx) => (
                                <Col xs={24} md={8} key={idx}>
                                    <Card
                                        bordered={false}
                                        hoverable
                                        style={{
                                            borderRadius: '20px',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '200px',
                                                background: `linear-gradient(135deg, #e63946, #457b9d)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '60px',
                                                marginBottom: 20
                                            }}
                                        >
                                            <BookOutlined />
                                        </div>

                                        {course.badge && (
                                            <Tag color="error" style={{ position: 'absolute', top: 16, right: 16 }}>
                                                {course.badge}
                                            </Tag>
                                        )}

                                        <Title level={4} style={{ marginBottom: 8 }}>
                                            {course.title}
                                        </Title>

                                        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text type="secondary">by {course.instructor}</Text>
                                                <Rate disabled value={course.rating} style={{ fontSize: 14 }} />
                                            </div>
                                            <Text type="secondary">{course.students} students</Text>
                                        </Space>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: 16,
                                            borderTop: '1px solid #f0f0f0'
                                        }}>
                                            <Title level={4} style={{ margin: 0, color: '#e63946' }}>
                                                {course.price}
                                            </Title>
                                            <Button type="primary">Enroll</Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* ============ TESTIMONIALS SECTION ============ */}
                    <section style={{ padding: '100px 50px', background: '#fff' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <Tag color="cyan">SUCCESS STORIES</Tag>
                            <Title level={2} style={{ marginTop: 16 }}>
                                What Our Users Say
                            </Title>
                        </div>

                        <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                            {testimonials.map((testimonial, idx) => (
                                <Col xs={24} md={8} key={idx}>
                                    <Card
                                        bordered={false}
                                        style={{
                                            borderRadius: '20px',
                                            padding: '32px',
                                            boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                                            height: '100%'
                                        }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <StarFilled key={i} style={{ color: '#fadb14', fontSize: 16 }} />
                                                ))}
                                            </div>
                                            <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 0 }}>
                                                "{testimonial.text}"
                                            </Paragraph>
                                            <Divider style={{ margin: '16px 0' }} />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <Avatar style={{ backgroundColor: '#e63946', fontSize: 20 }} size={40}>
                                                    {testimonial.emoji}
                                                </Avatar>
                                                <div>
                                                    <Text strong>{testimonial.name}</Text>
                                                    <br />
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
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
                    <section id="pricing" style={{ padding: '100px 50px', background: '#f8f9fa' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <Tag color="magenta">PRICING PLANS</Tag>
                            <Title level={2} style={{ marginTop: 16 }}>
                                Choose Your Plan
                            </Title>
                            <Paragraph style={{ fontSize: '18px', color: '#666' }}>
                                Flexible pricing options for every stage of your learning journey
                            </Paragraph>
                        </div>

                        <Row gutter={[32, 32]} style={{ maxWidth: 1200, margin: '0 auto' }}>
                            {pricingPlans.map((plan, idx) => (
                                <Col xs={24} md={8} key={idx}>
                                    <Card
                                        bordered={plan.btnType === 'primary'}
                                        style={{
                                            borderRadius: '20px',
                                            padding: '40px 32px',
                                            height: '100%',
                                            position: 'relative',
                                            boxShadow: plan.btnType === 'primary' ? '0 8px 32px rgba(230, 57, 70, 0.2)' : '0 4px 16px rgba(0,0,0,0.05)',
                                            transform: plan.btnType === 'primary' ? 'scale(1.05)' : 'scale(1)',
                                            borderColor: plan.btnType === 'primary' ? '#e63946' : '#d9d9d9'
                                        }}
                                    >
                                        {plan.badge && (
                                            <Tag color="red" style={{ position: 'absolute', top: -12, right: 24, padding: '4px 12px' }}>
                                                {plan.badge}
                                            </Tag>
                                        )}

                                        <Title level={3}>{plan.name}</Title>
                                        <Text type="secondary">{plan.desc}</Text>

                                        <div style={{ margin: '32px 0' }}>
                                            <div style={{ fontSize: '42px', fontWeight: 800, color: '#e63946' }}>
                                                {plan.price}
                                            </div>
                                        </div>

                                        <Space direction="vertical" style={{ width: '100%', marginBottom: 32 }}>
                                            {plan.features.map((feature, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                    <CheckCircleOutlined style={{ color: '#e63946', marginTop: 4 }} />
                                                    <Text>{feature}</Text>
                                                </div>
                                            ))}
                                        </Space>

                                        <Button
                                            type={plan.btnType}
                                            size="large"
                                            block
                                            onClick={() => navigate('/register')}
                                            style={{ height: 50, borderRadius: '12px', fontWeight: 700 }}
                                        >
                                            Get Started
                                        </Button>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* ============ FAQ SECTION ============ */}
                    <section style={{ padding: '100px 50px', background: '#fff' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60 }}>
                            <Tag color="gold">FREQUENTLY ASKED</Tag>
                            <Title level={2} style={{ marginTop: 16 }}>
                                Common Questions
                            </Title>
                        </div>

                        <Collapse
                            items={faqs}
                            defaultActiveKey={['1']}
                            style={{ maxWidth: 900, margin: '0 auto', borderRadius: '12px' }}
                        />
                    </section>

                    {/* ============ CTA SECTION ============ */}
                    <section
                        style={{
                            padding: '80px 50px',
                            background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)',
                            textAlign: 'center',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-20%',
                                right: '-10%',
                                width: '500px',
                                height: '500px',
                                background: 'rgba(230, 57, 70, 0.1)',
                                borderRadius: '50%',
                                filter: 'blur(100px)'
                            }}
                        />

                        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                            <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
                                Ready to Transform Your Career?
                            </Title>
                            <Paragraph style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: 32 }}>
                                Join thousands of successful learners. Start learning today with free courses.
                            </Paragraph>
                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate('/register')}
                                    style={{
                                        height: 55,
                                        padding: '0 40px',
                                        fontSize: 16,
                                        background: '#e63946',
                                        borderRadius: '12px',
                                        fontWeight: 700
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
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        color: '#fff'
                                    }}
                                >
                                    Sign In
                                </Button>
                            </Space>
                        </div>
                    </section>

                    {/* ============ ABOUT SECTION ============ */}
                    <section style={{ padding: '100px 50px', background: '#fff' }}>
                        <Row gutter={[60, 60]} align="middle" style={{ maxWidth: 1200, margin: '0 auto' }}>
                            <Col xs={24} md={12}>
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #1d3557, #457b9d)',
                                        borderRadius: '20px',
                                        height: '400px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                                        fontSize: '100px'
                                    }}
                                >
                                    🚀
                                </div>
                            </Col>
                            <Col xs={24} md={12}>
                                <Tag color="blue">ABOUT US</Tag>
                                <Title level={2} style={{ marginTop: 16 }}>
                                    The Future of Online Learning
                                </Title>
                                <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 24 }}>
                                    LMS 3.0 is built on the conviction that education should be accessible, personalized, and engaging. We combine cutting-edge AI technology with proven pedagogical methods to create the most effective learning experience.
                                </Paragraph>
                                <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: 32 }}>
                                    Our mission is to empower learners worldwide to master in-demand skills, accelerate their careers, and achieve their dreams.
                                </Paragraph>

                                <Space direction="vertical" style={{ width: '100%', fontSize: '16px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>Trusted by 10K+ learners worldwide</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>50+ experienced instructors</Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <CheckCircleOutlined style={{ color: '#e63946', fontSize: 20 }} />
                                        <Text>Industry-recognized certificates</Text>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </section>

                    {/* ============ CONTACT SECTION ============ */}
                    <section id="contact" style={{ padding: '100px 50px', background: '#f8f9fa' }}>
                        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
                            <PhoneOutlined style={{ fontSize: 48, color: '#e63946', marginBottom: 24 }} />
                            <Title level={2}>Get in Touch</Title>
                            <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: 32 }}>
                                Have questions? Our support team is here to help. Reach out to us anytime.
                            </Paragraph>
                            <Space size="large">
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        height: 50,
                                        padding: '0 40px',
                                        borderRadius: '12px',
                                        fontWeight: 700
                                    }}
                                >
                                    📧 Email Us
                                </Button>
                                <Button
                                    type="default"
                                    size="large"
                                    style={{
                                        height: 50,
                                        padding: '0 40px',
                                        borderRadius: '12px',
                                        fontWeight: 700
                                    }}
                                >
                                    💬 Chat Support
                                </Button>
                            </Space>
                        </div>
                    </section>
                </Content>

                {/* ============ FOOTER ============ */}
                <Footer style={{ padding: '60px 50px 40px', background: '#1d3557', color: 'rgba(255,255,255,0.6)' }}>
                    <Row gutter={[40, 40]} style={{ maxWidth: 1200, margin: '0 auto 40px', textAlign: 'left' }}>
                        <Col xs={24} md={6}>
                            <Title level={3} style={{ color: '#fff', marginBottom: 24 }}>
                                LMS<span style={{ color: '#e63946' }}>3.0</span>
                            </Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
                                Transforming education through intelligent, personalized learning experiences.
                            </Paragraph>
                            <Space style={{ color: 'rgba(255,255,255,0.5)' }}>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <LinkedinOutlined style={{ fontSize: 20 }} />
                                </a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <GithubOutlined style={{ fontSize: 20 }} />
                                </a>
                                <a href="#" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <TwitterOutlined style={{ fontSize: 20 }} />
                                </a>
                            </Space>
                        </Col>

                        <Col xs={12} md={6}>
                            <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Product</Title>
                            <Space direction="vertical" size={8} style={{ display: 'flex', color: 'rgba(255,255,255,0.5)' }}>
                                <a href="#features" style={{ color: 'inherit' }}>Features</a>
                                <a href="#courses" style={{ color: 'inherit' }}>Courses</a>
                                <a href="#pricing" style={{ color: 'inherit' }}>Pricing</a>
                                <a href="#" style={{ color: 'inherit' }}>FAQ</a>
                            </Space>
                        </Col>

                        <Col xs={12} md={6}>
                            <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Company</Title>
                            <Space direction="vertical" size={8} style={{ display: 'flex', color: 'rgba(255,255,255,0.5)' }}>
                                <a href="#" style={{ color: 'inherit' }}>About Us</a>
                                <a href="#" style={{ color: 'inherit' }}>Blog</a>
                                <a href="#" style={{ color: 'inherit' }}>Careers</a>
                                <a href="#" style={{ color: 'inherit' }}>Contact</a>
                            </Space>
                        </Col>

                        <Col xs={24} md={6}>
                            <Title level={4} style={{ color: '#fff', fontSize: '16px' }}>Legal</Title>
                            <Space direction="vertical" size={8} style={{ display: 'flex', color: 'rgba(255,255,255,0.5)' }}>
                                <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
                                <a href="#" style={{ color: 'inherit' }}>Terms of Service</a>
                                <a href="#" style={{ color: 'inherit' }}>Cookie Policy</a>
                                <a href="#" style={{ color: 'inherit' }}>Security</a>
                            </Space>
                        </Col>
                    </Row>

                    <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', paddingTop: 20 }}>
                        <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
                            © 2026 LMS 3.0. All rights reserved. | Made with ❤️ for learners worldwide.
                        </Text>
                    </div>
                </Footer>

                <style>{`
                    @keyframes fadeInDown {
                        from { opacity: 0; transform: translateY(-30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    html {
                        scroll-behavior: smooth;
                    }
                    .ant-collapse {
                        background: transparent !important;
                    }
                    .ant-collapse-header {
                        font-weight: 600 !important;
                        font-size: 16px !important;
                    }
                `}</style>
            </Layout>
        </ConfigProvider>
    );
};

export default LandingPage;
