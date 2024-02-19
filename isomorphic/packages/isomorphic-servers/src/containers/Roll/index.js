import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import FinancialTransactionForm from "./Form";
import Highlighter from "react-highlight-words";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const originData = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const App = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      id: "",
      kentcode: "",
      amount: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const expandedRowRender = (record) => (
    <p style={{ margin: 0 }}>
      {record.note != null || record.note !== ""
        ? record.note
        : "No description"}
    </p>
  );

  const rowExpandable = (record) => record.name !== "Not Expandable";
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      editable: false,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "kentCode",
      dataIndex: "kentCode",
      editable: true,
    },
    {
      title: "codeChina",
      dataIndex: "codeChina",
      editable: true,
    },
    {
      title: "nameRussian",
      dataIndex: "nameRussian",
      editable: true,
    },
    {
      title: "nameChinese",
      dataIndex: "nameChinese",
      editable: true,
    },
    {
      title: "amount",
      dataIndex: "amount",
      editable: true,
    },
    {
      title: "unit",
      dataIndex: "unit",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rolls, products] = await Promise.all([
          axios.get(`${jwtConfig.fetchUrlSecret}roll/all`, axiosConfig),
          axios.get(`${jwtConfig.fetchUrlSecret}product/all`, axiosConfig),
        ]);

        // console.log("roll", rolls);
        // console.log("products", products);

        const updatedRolls = rolls.data.map((roll) => {
          const product = products.data.find(
            (product) => product.codeKent == roll.kentCode
          );
          if (product) {
            const updatedRoll = {
              ...roll,
              codeChina: product.codeChina,
              nameChinese: product.nameChinese,
              nameRussian: product.nameRussian,
            };
            return updatedRoll;
          }

          return roll;
        });

        setData(updatedRolls);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen]);

  //   const handleCancel = () => {
  //     setIsModalOpen(false);
  //   };

  //   const handleAdd = () => {
  //     // setRecord(null);
  //     setIsModalOpen(true);
  //   };

  return (
    <LayoutContentWrapper>
      <LayoutContent>
        {/* <Button type="primary" onClick={handleAdd}>
          Add new
        </Button>
        <Modal
          title="Financial Transaction Form"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <FinancialTransactionForm
            setIsModalOpen={setIsModalOpen}
            // record={record}
          ></FinancialTransactionForm>
        </Modal> */}
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
            // rowKey={(record) => record.id}
            // expandable={{
            //   expandedRowRender,
            //   rowExpandable,
            // }}
          />
        </Form>
      </LayoutContent>
    </LayoutContentWrapper>
  );
};
export default App;
