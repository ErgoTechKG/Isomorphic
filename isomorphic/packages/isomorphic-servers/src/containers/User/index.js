import React, { useState, useEffect } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Table, Modal, Button } from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import UserForm from './UserForm';
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const clickEdit = (userId) => {
    setIsModalOpen(true);
    console.log('data',data )
    let user = data.find( user => user.id === userId)
    console.log('user', user)
    setUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => <Button id={record.id} onClick={() => clickEdit(record.id)}>Edit</Button>,
    },
  ];

  const expandedRowRender = (record) => (
    <p style={{ margin: 0 }}>{record.description}</p>
  );

  const rowExpandable = (record) => record.name !== 'Not Expandable';

  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent>
        <Modal title="Basic Modal" open={isModalOpen} footer={null}>
          <UserForm setIsModalOpen={setIsModalOpen} user={user}></UserForm>
        </Modal>
        <Table
          columns={columns}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender,
            rowExpandable,
          }}
          dataSource={data}
        />
      </LayoutContent>
    </LayoutContentWrapper>
  );
};

export default MyComponent;
