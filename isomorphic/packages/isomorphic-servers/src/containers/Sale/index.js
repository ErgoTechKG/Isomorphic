import React, { useState, useEffect, useRef } from "react";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import { Table, Modal, Button, Input, Space } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import FinancialTransactionForm from "./Form";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}sale/all`,
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
    },
    {
      title: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (record) => {
        return moment(record.date).format("MM/DD/YYYY");
      },
    },
    {
      title: "clientId",
      dataIndex: "clientId",
      key: "clientId",
      ...getColumnSearchProps("clientIdx"),
    },
    {
      title: "note",
      dataIndex: "note",
      key: "note",
      ...getColumnSearchProps("note"),
    },
    {
      title: "amount",
      dataIndex: "amount",
      key: "amount",
      ...getColumnSearchProps("amount"),
    },
    {
      title: "unit",
      dataIndex: "unit",
      key: "unit",
      ...getColumnSearchProps("unit"),
    },
    {
      title: "priceUSD",
      dataIndex: "priceUSD",
      key: "priceUSD",
      ...getColumnSearchProps("priceUSD"),
    },
    {
      title: "paymentMethod",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
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
    <p style={{ margin: 0 }}>
      {record.note != null || record.note !== ""
        ? record.note
        : "No description"}
    </p>
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
          Add new image
        </Button>
        <Modal
          title="Financial Transaction Form"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <FinancialTransactionForm
            setIsModalOpen={setIsModalOpen}
            record={record}
          ></FinancialTransactionForm>
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
