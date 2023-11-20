import React, { useState, useEffect, useRef } from "react";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import {
  Table,
  Modal,
  Button,
  Card,
  Col,
  Row,
  List,
  Image,
  Spin,
  Input,
  Space,
} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import ProductForm from "./Form";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";
const MyComponent = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordID, setRecordID] = useState(null);
  const clickEdit = (value) => {
    setIsModalOpen(true);
    setRecordID(value);
  };

  const clickDelete = async (value) => {
    console.log('delete ID', value)
    try {

      const response = await axios.delete(
        `${jwtConfig.fetchUrlSecret}product?id=${value}`,
        axiosConfig
      ); // Replace with your actual API endpoint
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched (including error cases)
    }
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
        setLoading(true);
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}product/all`,
          axiosConfig
        ); // Replace with your actual API endpoint
        console.log('response.data', response.data)
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched (including error cases)
      }
    };

    fetchData();
  }, [isModalOpen]);

  const columns = [
    {
      title: "Kent Code",
      dataIndex: "codeKent",
      key: "codeKent",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.codeKent - b.codeKent,
      ...getColumnSearchProps("codeKent"),
    },
    {
      title: "Kent Code(Old)",
      dataIndex: "codeKent0",
      key: "codeKent0",
      ...getColumnSearchProps("codeKent0"),
    },
    {
      title: "China Code",
      dataIndex: "codeChina",
      key: "codeChina",
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.codeChina - b.codeChina,
      ...getColumnSearchProps("codeChina"),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      ...getColumnSearchProps("source"),
    },
    {
      title: "Russian Name",
      dataIndex: "nameRussian",
      key: "nameRussian",
      ...getColumnSearchProps("nameRussian"),
    },
    {
      title: "Chinese Name",
      dataIndex: "nameChinese",
      key: "nameChinese",
      ...getColumnSearchProps("nameChinese"),
    },
    {
      title: "English Name",
      dataIndex: "nameEnglish",
      key: "nameChinese",
      ...getColumnSearchProps("nameChinese"),
    },
    {
      title: "Price",
      dataIndex: "priceAtStock",
      sorter: (a, b) => (a.priceAtStock).toFixed(2) - b.priceAtStock.toFixed(2),
      render: (record) => {
        return record?record.toFixed(2):0
      },
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },

    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (record) => (
        <>
          <Button id={record.id} onClick={() => clickEdit(record.id)}>
            Edit
          </Button>

          <Button id={record.id} onClick={() => clickDelete(record.id)}>
            Delete
          </Button>
        </>
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
          <Card title="Stock Price" bordered={false}>
            ${record.priceAtStock ? record.priceAtStock.toFixed(2) : null}/Meter
          </Card>
        </Col>
        <Col span={8}>
          <Card title="vipPrice with 100% DownPayment" bordered={false}>
            ${record.vipPrice ? record.vipPrice.toFixed(2) : null}/Meter
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Width" bordered={false}>
            {record.width} cm
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Gram" bordered={false}>
           {record.gram} g
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Source" bordered={false}>
            {record.source}
          </Card>
        </Col>
      </Row>
      <List
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={record.imageURL}
        renderItem={(item) => {
          // Construct the image URL using the fileId variable
          const imageUrl = `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${item}`;

          return (
            <List.Item>
              <Image width={200} src={imageUrl} />
            </List.Item>
          );
        }}
      />
    </>
  );

  const rowExpandable = (record) => record.name !== "Not Expandable";
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleAdd = () => {
    console.log('handleAdd')
    setRecordID(null);
    setIsModalOpen(true);
  };
  return (
    <Spin spinning={loading}>
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
              isModalOpen={isModalOpen}
              recordID={recordID}
              setRecordID={setRecordID}
            ></ProductForm>
          </Modal>
          <Table
          scroll={{ x: "max-content" }}
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
    </Spin>
  );
};

export default MyComponent;
