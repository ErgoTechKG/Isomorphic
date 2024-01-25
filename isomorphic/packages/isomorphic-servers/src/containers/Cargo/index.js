import React, { useState, useEffect } from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import { Table, Modal, Button, Checkbox, Spin} from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import FinancialTransactionForm from './Form';
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
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}cargo/all`, axiosConfig); // Replace with your actual API endpoint
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
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'dateSent',
      dataIndex: 'dateSent',
      key: 'dateSent',
      render: (record) => {
        return moment(record).format('L'); 
      },
    },
    {
      title: 'dateArrived',
      dataIndex: 'dateArrived',
      key: 'dateArrived',
    },
    {
      title: 'valueCargo',
      dataIndex: 'valueCargo',
      key: 'valueCargo',
    },
    {
      title: 'logisticFee',
      dataIndex: 'logisticFee',
      key: 'logisticFee',
    },
    {
      title: 'isFullyRecieved',
      sorter: (a, b) => a.isFullyRecieved - b.isFullyRecieved,
      render: (record) => <Checkbox defaultChecked={record.isFullyRecieved} onChange={(e) => onChange(e, record)}></Checkbox>,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => <Button id={record.id} onClick={() => clickEdit(record.id)}>Edit</Button>,
    },
  ];


  const onChange = async (e, record) => {
    console.log(`checked = ${e.target.checked}`);
    try {
      setLoading(true);
      console.log(e.target.checked, record)
      record.isFullyRecieved = e.target.checked;
      const response = await axios.put(`${jwtConfig.fetchUrlSecret}cargo`, record, axiosConfig); // Replace with your actual API endpoint
      console.log('response', response)
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

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
    <Spin spinning={loading}>
    <LayoutContentWrapper>
      <LayoutContent>
        <Button type="primary" onClick={handleAdd} >Add new</Button>
        <Modal title="Financial Transaction Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <FinancialTransactionForm setIsModalOpen={setIsModalOpen} record={record}></FinancialTransactionForm>
        </Modal>
        <Table
          columns={columns}
          scroll={{ x: "max-content"}}
          rowKey={(record) => record.id}
          expandable={{
            expandedRowRender,
            rowExpandable,
          }}
          dataSource={data}
        />
      </LayoutContent>
    </LayoutContentWrapper>
    </Spin>
  );
};

export default MyComponent;
