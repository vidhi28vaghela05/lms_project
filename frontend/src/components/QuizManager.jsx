import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../services/api';

const QuizManager = ({ courseId, visible, onCancel }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [form] = Form.useForm();

    const fetchQuizzes = async () => {
        try {
            const res = await api.get(`/quizzes/course/${courseId}`);
            setQuizzes(res.data);
        } catch (error) {
            message.error('Failed to load quizzes');
        }
    };

    useEffect(() => {
        if (visible && courseId) fetchQuizzes();
    }, [visible, courseId]);

    const handleSave = async (values) => {
        try {
            if (editingQuiz) {
                await api.put(`/quizzes/${editingQuiz._id}`, { ...values, courseId });
                message.success('Quiz updated');
            } else {
                await api.post('/quizzes', { ...values, courseId });
                message.success('Quiz added');
            }
            setIsModalOpen(false);
            setEditingQuiz(null);
            form.resetFields();
            fetchQuizzes();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/quizzes/${id}`);
            message.success('Quiz deleted');
            fetchQuizzes();
        } catch (error) {
            message.error('Delete failed');
        }
    };

    const columns = [
        { title: 'Question', dataIndex: 'question', key: 'question' },
        { title: 'Correct Answer', dataIndex: 'correctAnswer', key: 'correctAnswer' },
        {
            title: 'Actions', key: 'actions', render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => { setEditingQuiz(record); form.setFieldsValue(record); setIsModalOpen(true); }} />
                    <Popconfirm title="Delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Modal title="Manage Quizzes" open={visible} onCancel={onCancel} width={800} footer={null}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingQuiz(null); form.resetFields(); setIsModalOpen(true); }} style={{ marginBottom: 16 }}>
                Add Quiz Question
            </Button>
            <Table dataSource={quizzes} columns={columns} rowKey="_id" pagination={false} />

            <Modal title={editingQuiz ? "Edit Quiz" : "Add Quiz"} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
                <Form form={form} onFinish={handleSave} layout="vertical">
                    <Form.Item name="question" label="Question" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="options" label="Options (comma separated)" rules={[{ required: true }]}>
                        <Input placeholder="Option 1, Option 2, Option 3, Option 4" />
                    </Form.Item>
                    <Form.Item name="correctAnswer" label="Correct Answer" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};

export default QuizManager;
