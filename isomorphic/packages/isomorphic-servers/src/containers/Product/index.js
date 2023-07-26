import React, { useState, useEffect } from "react";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import { Table, Modal, Button, Card, Col, Row, List, Image } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import ProductForm from "./Form";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}product/all`,
          axiosConfig
        ); // Replace with your actual API endpoint
        console.log('response.data', response.data)
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, []);

  const columns = [
    {
      title: "Kent Code",
      dataIndex: "codeKent",
      key: "codeKent",
    },
    {
      title: "Kent Code(Old)",
      dataIndex: "codeKent0",
      key: "codeKent0",
    },
    {
      title: "China Code",
      dataIndex: "codeChina",
      key: "codeChina",
    },
    {
      title: "Russian Name",
      dataIndex: "nameRussian",
      key: "nameRussian",
    },
    {
      title: "width",
      dataIndex: "width",
      key: "width",
    },
    {
      title: "gram",
      dataIndex: "gram",
      key: "gram",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (record) => (
        <Button id={record.id} onClick={() => clickEdit(record.id)}>
          Edit
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Price" bordered={false}>
            {record.codeKent}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Market Price" bordered={false}>
            {record.price}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={record.imageURL}
        renderItem={(item) =>{

          // Construct the image URL using the fileId variable
          const imageUrl = `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${item}`;
        
          return (
          <List.Item>
              <Image
                width={200}
                src={imageUrl}
              />
          </List.Item>
        )}}
      />
    </>
  );

  const rowExpandable = (record) => record.name !== "Not Expandable";
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
          Add New Product
        </Button>
        <Modal
          title="Create New Product"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <ProductForm
            setIsModalOpen={setIsModalOpen}
            record={record}
          ></ProductForm>
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
