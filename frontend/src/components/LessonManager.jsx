import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const LessonManager = ({ courseId, visible, onCancel }) => {
    const [lessons, setLessons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [form] = Form.useForm();

    const fetchLessons = async () => {
        try {
            const res = await api.get(`/lessons/course/${courseId}`);
            setLessons(res.data);
        } catch (error) {
            message.error('Failed to load lessons');
        }
    };

    useEffect(() => {
        if (visible && courseId) fetchLessons();
    }, [visible, courseId]);

    const handleSave = async (values) => {
        try {
            if (editingLesson) {
                await api.put(`/lessons/${editingLesson._id}`, { ...values, courseId });
                message.success('Lesson updated');
            } else {
                await api.post('/lessons', { ...values, courseId });
                message.success('Lesson added');
            }
            setIsModalOpen(false);
            setEditingLesson(null);
            form.resetFields();
            fetchLessons();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/lessons/${id}`);
            message.success('Lesson deleted');
            fetchLessons();
        } catch (error) {
            message.error('Delete failed');
        }
    };

    const columns = [
        { title: 'Order', dataIndex: 'order', key: 'order', width: 80 },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingLesson(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Modal title="Manage Lessons" open={visible} onCancel={onCancel} width={800} footer={null}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingLesson(null); form.resetFields(); setIsModalOpen(true); }} style={{ marginBottom: 16 }}>
                Add Lesson
            </Button>
            <Table dataSource={lessons} columns={columns} rowKey="_id" pagination={false} />

            <Modal title={editingLesson ? "Edit Lesson" : "Add Lesson"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item name="title" label="Lesson Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="videoUrl" label="Video URL (YouTube)">
                        <Input />
                    </Form.Item>
                    <Form.Item name="content" label="Content">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="order" label="Order" rules={[{ required: true }]}>
                        <InputNumber min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};

export default LessonManager;
