import React, { useState, useEffect } from "react";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import { Table, Modal, Button } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import ClientForm from "./ClientForm";
const MyComponent = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const clickEdit = (recordId) => {
    setIsModalOpen(true);
    let selectedRecord = data.find((i) => {
      return i.id === recordId;
    });
    setRecord(selectedRecord);
  };

  const handleDeleteClient = async (recordId) => {
    try {
      const response = await axios.delete(
        `${jwtConfig.fetchUrlSecret}client?id=${recordId}`,
        axiosConfig
      ); // Replace with your actual API endpoint
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}client/all`,
          axiosConfig
        ); // Replace with your actual API endpoint
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [isModalOpen]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Staff",
      dataIndex: "staff",
      key: "staff",
      sorter: (a, b) => a.staff.localeCompare(b.staff),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (record) => (
        <div>
          <Button id={record.id} onClick={() => clickEdit(record.id)}>
            Edit
          </Button>
          <Button id={record.id} onClick={() => handleDeleteClient(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  //   const expandedRowRender = (record) => (
  //     <p style={{ margin: 0 }}>
  //       {record.description != null || "" ? record.description : "No description"}
  //     </p>
  //   );

  //   const rowExpandable = (record) => record.name !== "Not Expandable";
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
        <Button type="primary" onClick={handleAdd}>
          Add new
        </Button>
        <Modal
          title="Financial Transaction Form"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <ClientForm
            setIsModalOpen={setIsModalOpen}
            record={record}
          ></ClientForm>
        </Modal>
        <Table
          columns={columns}
          //   rowKey={(record) => record.id}
          //   expandable={{
          //     expandedRowRender,
          //     rowExpandable,
          //   }}
          dataSource={data}
        />
      </LayoutContent>
    </LayoutContentWrapper>
  );
};

export default MyComponent;
