import React, { useState, useEffect } from "react";
import {Button, Form, Input, InputNumber, Modal, Popconfirm, Table, Typography} from "antd";
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import RollForm from './Form';

const App = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);

  const handleDelete = () => {

  }

  const clickEdit = () => {

  }

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      editable: false,
    },
    {
      title: 'rbg',
      render: (record) => {
        return record.rbg
      }
    },
    {
      title: 'amount',
      render: (record) => {
        return record.amount
      }
    },
    {
      title: 'unit',
      render: (record) => {
        return record.unit
      }
    },
    {
      title: 'kentCode',
      render: (record) => {
        return record.kentCode
      }
    },
    {
      title: 'cargoId',
      render: (record) => {
        return record.cargoId
      }
    },
    {
      title: 'cost',
      render: (record) => {
        return record.cost
      }
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) =>
        <>
          <Button id={record.id} onClick={() => clickEdit(record.id)}>Edit</Button>
          <Button id={record.id} onClick={() => handleDelete(record.id)}>Delete</Button>
        </>,
    },
]

  const expandedRowRender = (record) => (
    <p style={{margin: 0}}>{record.note}</p>
  );

  const rowExpandable = (record) => record.name !== 'Not Expandable';
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAdd = () => {
    setRecord(null)
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}roll/all`, axiosConfig); // Replace with your actual API endpoint
        console.log('response', response)
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen]);

  return (
    <LayoutContentWrapper>
      <LayoutContent>
        <Button type="primary" onClick={handleAdd}>Add new</Button>
        <Modal title="Roll Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <RollForm setIsModalOpen={setIsModalOpen} record={record}></RollForm>
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
export default App;
