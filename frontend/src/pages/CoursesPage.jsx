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

                <Content style={{ marginTop: 80 }}>
                    <div style={{ padding: '40px 50px', background: '#f8f9fa' }}>
                        <Row gutter={40}>
                            {/* Filter Sidebar */}
                            <Col xs={24} lg={6}>
                                <Card className="glass-card" style={{ borderRadius: 20, position: 'sticky', top: 100 }}>
                                    <Title level={4}><FilterOutlined /> Filters</Title>
                                    <div style={{ marginBottom: 24 }}>
                                        <Text strong>Search</Text>
                                        <Input
                                            prefix={<SearchOutlined />}
                                            placeholder="Keyword..."
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                            style={{ marginTop: 8 }}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 24 }}>
                                        <Text strong>Level</Text>
                                        <Checkbox.Group
                                            options={['beginner', 'intermediate', 'advanced']}
                                            style={{ display: 'flex', flexDirection: 'column', marginTop: 8 }}
                                            onChange={(vals) => setFilters({ ...filters, level: vals })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 24 }}>
                                        <Text strong>Price Range</Text>
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
                            <Col xs={24} lg={18}>
                                <div style={{ marginBottom: 32 }}>
                                    <Title level={2}>Quantum Learning Repository</Title>
                                    <Text type="secondary">Access elite cognitive modules curated by the collective.</Text>
                                </div>

                                <Row gutter={[24, 24]}>
                                    {courses.map((course) => (
                                        <Col xs={24} md={12} xl={8} key={course._id}>
                                            <Card
                                                bordered={false}
                                                hoverable
                                                className="glass-card course-card"
                                                style={{ borderRadius: 20, overflow: 'hidden' }}
                                                cover={
                                                    <div style={{ height: 160, background: 'linear-gradient(135deg, #1d3557, #457b9d)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {course.thumbnail ? (
                                                            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        ) : (
                                                            <BookOutlined style={{ fontSize: 48, color: '#fff' }} />
                                                        )}
                                                        {course.isPopular && (
                                                            <Tag color="error" style={{ position: 'absolute', top: 12, right: 12 }}>POPULAR</Tag>
                                                        )}
                                                        <Button
                                                            shape="circle"
                                                            icon={<HeartOutlined />}
                                                            style={{ position: 'absolute', bottom: 12, right: 12 }}
                                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(course._id); }}
                                                        />
                                                    </div>
                                                }
                                            >
                                                <Title level={5} ellipsis={{ rows: 2 }}>{course.title}</Title>
                                                <Space direction="vertical" style={{ width: '100%' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Text size="small" type="secondary">by {course.instructorId?.name}</Text>
                                                        <Tag color="blue">{course.level.toUpperCase()}</Tag>
                                                    </div>
                                                    <Rate disabled value={course.averageRating} style={{ fontSize: 12 }} />
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                                        <Text strong style={{ fontSize: 18, color: '#e63946' }}>${course.price}</Text>
                                                        <Button type="primary" onClick={() => navigate(`/checkout/${course._id}`)}>Enroll Now</Button>
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

                <Footer style={{ padding: '60px 50px 40px', background: '#1d3557', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#fff' }}>LMS<span style={{ color: '#e63946' }}>3.0</span></Title>
                    <Text style={{ color: 'rgba(255,255,255,0.4)' }}>
                        © 2026 LMS 3.0. All rights reserved.
                    </Text>
                </Footer>
            </Layout>
        </ConfigProvider>
    );
};

export default CoursesPage;
