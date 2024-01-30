import React, { useState, useEffect } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Table, Modal, Button } from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import FinancialTransactionForm from './FinancialTransactionForm';
import moment from 'moment';
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
    const fetchData = async () => {
      try {
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}financialTransactions`, axiosConfig); // Replace with your actual API endpoint
        console.log('data', response.data)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isModalOpen]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (record) => {
        return moment(record.date).format('MM/DD/YYYY')
      }
    },
    {
      title: 'incomeUSD',
      render: (record) => {
        return record.incomeUSD
      }
    },
    {
      title: 'incomeSom',
      render: (record) => {
        return record.incomeSom
      }
    },
    {
      title: 'expenseUSD',
      render: (record) => {
        return record.expenseUSD
      }
    },
    {
      title: 'expenseSom',
      render: (record) => {
        return record.expenseSom
      }
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => <Button id={record.id} onClick={() => clickEdit(record.id)}>Edit</Button>,
    },
  ];

  const expandedRowRender = (record) => (
    <p style={{ margin: 0 }}>{record.note}</p>
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
    <LayoutContentWrapper>
      <LayoutContent>
        <Button type="primary" onClick={handleAdd} >Add new</Button>
        <Modal title="Financial Transaction Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <FinancialTransactionForm setIsModalOpen={setIsModalOpen} record={record}></FinancialTransactionForm>
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
