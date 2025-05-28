import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Select, Button, DatePicker, message } from 'antd';
import api from '../../utils/axios';

const { Option } = Select;

interface UserFormData {
  username: string;
  email: string;
  password?: string;
  role: 'customer' | 'instructor' | 'admin';
  membership: {
    type: 'none' | 'monthly' | 'yearly';
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'expired' | 'cancelled';
  };
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
        membership: {
          ...userData.membership,
          startDate: userData.membership.startDate ? new Date(userData.membership.startDate) : null,
          endDate: userData.membership.endDate ? new Date(userData.membership.endDate) : null,
        },
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
      const submitData = {
        ...values,
        membership: {
          ...values.membership,
          startDate: values.membership.startDate.toISOString(),
          endDate: values.membership.endDate?.toISOString(),
        },
      };

      if (isEditMode) {
        await api.put(`/users/${userId}`, submitData);
        message.success('User updated successfully');
      } else {
        await api.post('/users', submitData);
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
          membership: {
            type: 'none',
            status: 'active',
          },
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

        <Form.Item label="Membership" required>
          <Form.Item
            name={['membership', 'type']}
            rules={[{ required: true, message: 'Please select membership type!' }]}
          >
            <Select>
              <Option value="none">None</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="yearly">Yearly</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name={['membership', 'startDate']}
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name={['membership', 'endDate']}>
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name={['membership', 'status']}
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="expired">Expired</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
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