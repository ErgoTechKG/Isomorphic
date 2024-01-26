import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {Input, Button, Select, Space, Form, DatePicker} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(props.record);
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}finance`,
          axiosConfig
        ); // Replace with your actual API endpoint
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = () => {
    //TODO: Handle SELECT events
  };

  const onFinish = async (data) => {
    const newFinance = {
      ...data,
      incomeUSD: parseFloat(data.incomeUSD),
      incomeSOM: parseFloat(data.incomeSOM),
      expensesUSD: parseFloat(data.expensesUSD),
      expensesSOM: parseFloat(data.expensesSOM),
    };

    if (props.record) {
      // Editing an existing record (PUT request)
      const response = await axios.put(
        `${jwtConfig.fetchUrlSecret}finance?id=${props.record.id}`,
        newFinance,
        axiosConfig
      );
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    } else {
      // Creating a new record (POST request)
      const response = await axios.post(
        `${jwtConfig.fetchUrlSecret}finance`,
        newFinance,
        axiosConfig
      );
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    }
  };
  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Space style={{ width: "100%" }} direction="vertical">
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          {...layout}
        >
          <Form.Item
            name="date"
            label="Date"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="incomeUSD"
            label="Income (USD)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Income USD" />
          </Form.Item>
          <Form.Item
            name="incomeSOM"
            label="Income (SOM)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Income SOM" />
          </Form.Item>
          <Form.Item
            name="expensesUSD"
            label="Expenses (USD)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Expenses USD" />
          </Form.Item>
          <Form.Item
            name="expensesSOM"
            label="Expenses (SOM)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Expenses SOM" />
          </Form.Item>
          <Form.Item
            name="note"
            label="Note"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Note" />
          </Form.Item>
          <Form.Item
            name="cat"
            label="Category"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Category"
              onChange={handleChange}
              options={[
                {
                  label: "INIT",
                  value: "INIT",
                },
                {
                  label: "CARGO",
                  value: "CARGO",
                },
                {
                  label: "OPERATION",
                  value: "OPERATION",
                },
                {
                  label: "LOADER",
                  value: "LOADER",
                },
                {
                  label: "SALES",
                  value: "SALES",
                },
                {
                  label: "TAX",
                  value: "TAX",
                },
                {
                  label: "INVESTMENT",
                  value: "INVESTMENT",
                },
                {
                  label: "OTHER",
                  value: "OTHER",
                },
                {
                  label: "TRANSFER",
                  value: "TRANSFER",
                },
                {
                  label: "SALARY",
                  value: "SALARY",
                },
                {
                  label: "RENT",
                  value: "RENT",
                },
                {
                  label: "PORTER",
                  value: "PORTER",
                },
              ]}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default MyComponent;
