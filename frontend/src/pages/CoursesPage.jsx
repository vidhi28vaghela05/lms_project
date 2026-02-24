import React from 'react';
import {
    Typography,
    Row,
    Col,
    Layout,
    Tag,
    ConfigProvider,
    Card,
    Space,
    Rate,
    Button,
    Input,
    Checkbox,
    Slider,
    message
} from 'antd';
import {
    BookOutlined,
    SearchOutlined,
    HeartOutlined,
    HeartFilled,
    FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const CoursesPage = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filters, setFilters] = React.useState({
        keyword: '',
        level: [],
        minPrice: 0,
        maxPrice: 1000
    });

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/courses', { params: filters });
            setCourses(response.data);
        } catch (error) {
            message.error('Failed to bridge course data');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCourses();
    }, [filters]);

    const toggleWishlist = async (courseId) => {
        try {
            await api.post('/student/wishlist/toggle', { courseId });
            message.success('Wishlist synchronization complete');
        } catch (error) {
            message.error('Signal lost during wishlist sync');
        }
    };

    return (
        <Layout style={{ background: 'transparent' }}>
            <Navbar />

            <Content style={{ marginTop: 80 }}>
                <div style={{ padding: '40px 50px', background: 'transparent', minHeight: 'calc(100vh - 80px)' }}>
                    <Row gutter={40}>
                        {/* Filter Sidebar */}
                        <Col xs={24} lg={6}>
                            <Card
                                className="glass-card"
                                style={{
                                    borderRadius: 16,
                                    position: 'sticky',
                                    top: 100,
                                    border: '1px solid rgba(0, 209, 178, 0.1)'
                                }}
                            >
                                <Title level={4} style={{ color: '#00d1b2' }}><FilterOutlined /> Protocols</Title>
                                <div style={{ marginBottom: 24 }}>
                                    <Text strong style={{ color: '#ccd6f6' }}>Neural Search</Text>
                                    <Input
                                        prefix={<SearchOutlined style={{ color: '#00d1b2' }} />}
                                        placeholder="Search courses..."
                                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        style={{
                                            marginTop: 8,
                                            background: 'rgba(10, 25, 47, 0.4)',
                                            border: '1px solid rgba(0, 209, 178, 0.2)',
                                            color: '#ccd6f6',
                                            borderRadius: 8
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <Text strong style={{ color: '#ccd6f6' }}>Module Level</Text>
                                    <Checkbox.Group
                                        options={['beginner', 'intermediate', 'advanced']}
                                        style={{ display: 'flex', flexDirection: 'column', marginTop: 8, color: '#8892b0' }}
                                        onChange={(vals) => setFilters({ ...filters, level: vals })}
                                        className="custom-checkbox-group"
                                    />
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <Text strong style={{ color: '#ccd6f6' }}>Credit Range</Text>
                                    <Slider
                                        range
                                        defaultValue={[0, 1000]}
                                        max={1000}
                                        onAfterChange={(val) => setFilters({ ...filters, minPrice: val[0], maxPrice: val[1] })}
                                        style={{ marginTop: 24 }}
                                    />
                                </div>
                            </Card>
                        </Col>

                        {/* Course Grid */}
                        <Col xs={24} lg={18} className="fade-in">
                            <div style={{ marginBottom: 32 }}>
                                <Title level={2} className="glow-text" style={{ margin: 0 }}>Portal Repository</Title>
                                <Text style={{ color: '#8892b0' }}>Access elite neural modules curated for your professional evolution.</Text>
                            </div>

                            <Row gutter={[24, 24]}>
                                {courses.map((course) => (
                                    <Col xs={24} md={12} xl={8} key={course._id}>
                                        <Card
                                            bordered={false}
                                            hoverable
                                            className="glass-card"
                                            style={{
                                                borderRadius: 16,
                                                overflow: 'hidden',
                                                border: '1px solid rgba(0, 209, 178, 0.1)'
                                            }}
                                            cover={
                                                <div style={{ height: 160, background: 'rgba(17, 34, 64, 0.5)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                                    ) : (
                                                        <BookOutlined style={{ fontSize: 48, color: '#00d1b2', opacity: 0.3 }} />
                                                    )}
                                                    {course.isPopular && (
                                                        <Tag color="cyan" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0, 209, 178, 0.2)', border: '1px solid rgba(0, 209, 178, 0.3)' }}>HOT</Tag>
                                                    )}
                                                    <Button
                                                        shape="circle"
                                                        icon={<HeartOutlined />}
                                                        style={{
                                                            position: 'absolute',
                                                            bottom: 12,
                                                            right: 12,
                                                            background: 'rgba(10, 25, 47, 0.8)',
                                                            border: 'none',
                                                            color: '#00d1b2'
                                                        }}
                                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(course._id); }}
                                                    />
                                                </div>
                                            }
                                        >
                                            <Title level={5} ellipsis={{ rows: 2 }} style={{ color: '#fff' }}>{course.title}</Title>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Text size="small" style={{ color: '#8892b0' }}>by {course.instructorId?.name}</Text>
                                                    <Tag color="cyan" style={{ background: 'rgba(0, 209, 178, 0.1)', border: '1px solid rgba(0, 209, 178, 0.2)' }}>{course.level.toUpperCase()}</Tag>
                                                </div>
                                                <Rate disabled value={course.averageRating} style={{ fontSize: 12, color: '#fadb14' }} />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                                    <Text strong style={{ fontSize: 18, color: '#00d1b2' }}>${course.price}</Text>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => navigate(`/checkout/${course._id}`)}
                                                    >
                                                        Enroll Now
                                                    </Button>
                                                </div>
                                            </Space>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Content>

            <Footer style={{ padding: '60px 50px 40px', background: '#0a192f', borderTop: '1px solid rgba(0, 209, 178, 0.1)', color: '#8892b0', textAlign: 'center' }}>
                <Title level={3} style={{ color: '#fff' }}>LMS<span style={{ color: '#00d1b2' }}>3.0</span></Title>
                <Text style={{ color: '#8892b0' }}>
                    © 2026 LMS 3.0. All rights reserved. | Access Authorized.
                </Text>
            </Footer>
        </Layout>
    );
};

export default CoursesPage;
