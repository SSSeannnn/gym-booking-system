import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, DatePicker, message } from 'antd';
import api from '../../utils/axios';

const { Option } = Select;

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'instructor' | 'admin';
  planId: 'none' | 'weekly' | 'monthly' | 'yearly';
}

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(userId);

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${userId}`);
      console.log('User data response:', response.data);
      const userData = response.data.data;
      form.setFieldsValue({
        ...userData,
        planId: userData.planId,
      });
    } catch (error) {
      message.error('Failed to fetch user data');
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      setLoading(true);
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
        planId: values.planId
      };

      if (isEditMode) {
        await api.put(`/users/${userId}`, userData);
        message.success('User updated successfully');
      } else {
        await api.post('/users', userData);
        message.success('User created successfully');
      }
      navigate('/admin/users');
    } catch (error) {
      message.error(isEditMode ? 'Failed to update user' : 'Failed to create user');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit User' : 'Create New User'}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          role: 'customer',
          planId: 'none',
        }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please input a valid email!' },
          ]}
        >
          <Input />
        </Form.Item>

        {!isEditMode && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input password!' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role!' }]}
        >
          <Select>
            <Option value="customer">Customer</Option>
            <Option value="instructor">Instructor</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="planId"
          label="Membership Plan"
          rules={[{ required: true, message: 'Please select a membership plan' }]}
        >
          <Select>
            <Select.Option value="none">None</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
            <Select.Option value="monthly">Monthly</Select.Option>
            <Select.Option value="yearly">Yearly</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => navigate('/admin/users')}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm; 