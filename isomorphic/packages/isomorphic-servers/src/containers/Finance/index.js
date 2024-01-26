import React, {useState, useEffect} from 'react';
import LayoutContentWrapper from '@iso/components/utility/layoutWrapper';
import LayoutContent from '@iso/components/utility/layoutContent';
import {Table, Modal, Button} from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
import moment from 'moment';
import FinanceForm from "./FinanceForm2";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const clickEdit = (recordId) => {
    setIsModalOpen(true);
    let selectedRecord = data.find(i => {
      return i.id === recordId
    })
    setRecord(selectedRecord);
  };

  useEffect(() => {
    const FetchData = async () => {
      try {
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}finance/all`,
          axiosConfig);
        setData(response.data);
      } catch (err) {
        console.log("Fetching data error: ", err);
      }
    }
    FetchData();
  }, [isModalOpen]);

  const clickDelete = async (value) => {
    console.log('delete ID', value)
    try {

      const response = await axios.delete(
        `${jwtConfig.fetchUrlSecret}finance?id=${value}`,
        axiosConfig
      ); // Replace with your actual API endpoint
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched (including error cases)
    }
  };

  const columns = [
    {
      title: 'id',
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
      title: 'incomeSOM',
      render: (record) => {
        return record.incomeSOM
      }
    },
    {
      title: 'expensesUSD',
      render: (record) => {
        return record.expensesUSD
      }
    },
    {
      title: 'expensesSom',
      render: (record) => {
        return record.expensesSOM
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) =>
        <>
          <Button id={record.id} onClick={() => clickEdit(record.id)}>Edit</Button>
          <Button id={record.id} onClick={() => clickDelete(record.id)}>Delete</Button>
        </>
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
    setRecord(null);
    setIsModalOpen(true);
  };
  return (
    <LayoutContentWrapper>
      <LayoutContent>
        <Button type="primary" onClick={handleAdd}>Add new</Button>
        <Modal title="Finance Form" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <FinanceForm setIsModalOpen={setIsModalOpen} record={record}></FinanceForm>
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
