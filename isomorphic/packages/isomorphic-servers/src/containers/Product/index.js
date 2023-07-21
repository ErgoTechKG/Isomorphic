import React, { useState, useEffect } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Table, Modal, Button } from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import ProductForm from './Form';
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const clickEdit = (recordId) => {
    setIsModalOpen(true);
    let selectedRecord = data.find(i => {return i.id === recordId})
    setRecord(selectedRecord);
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(`${jwtConfig.fetchUrlSecret}financialTransactions`, axiosConfig); // Replace with your actual API endpoint
    //     setData(response.data);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    // fetchData();
  }, [isModalOpen]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'From',
      dataIndex: 'userFrom',
      key: 'userFrom',
      render: (record) => {
        return record.name
      }
    },
    {
      title: 'To',
      dataIndex: 'userTo',
      key: 'userTo',
      render: (record) => {
        return record.name
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAdd = () => {
    setRecord(null)
    setIsModalOpen(true);
  };
  return (
    <LayoutContentWrapper style={{ height: '100vh' }}>
      <LayoutContent>
        <Button type="primary" onClick={handleAdd} >Add New Product</Button>
        <Modal title="Create New Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <ProductForm setIsModalOpen={setIsModalOpen} record={record}></ProductForm>
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
