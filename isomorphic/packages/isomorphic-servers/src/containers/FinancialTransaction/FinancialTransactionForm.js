import React, { useState, useEffect } from "react";
import { Input, Button, Select, Space, InputNumber, Form } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {

  const [form] = Form.useForm();
  const [record, setRecord] = useState(props.record);
  const [userDropdownlistValue, setUserDropdownlistValue] = useState([]);
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
  // Effect hook
  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}users`,
          axiosConfig
        ); // Replace with your actual API endpoint
        const userDropdownlist = response.data.map((a) => ({
          value: a.id,
          label: a.name,
        }));
        setUserDropdownlistValue(userDropdownlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();

    const fetchData = async () => {
      try {
        //const response = await axios.get(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
        //setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();


  }, []);

  const handleChange = () => {
    //TODO: Handle SELECT events
  };


  const onFinish = (values) => {

    console.log(values);
    props.setIsModalOpen(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Space style={{ width: "100%" }} direction="vertical">
        <Form form={form} name="control-hooks" onFinish={onFinish} {...layout} initialValues={{}}>
          <Form.Item
            name="userFrom"
            label="Select From which User"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select From which User"
              options={userDropdownlistValue}
            />
          </Form.Item>
          <Form.Item
            name="userTo"
            label="Select To which User"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select To which User"
              options={userDropdownlistValue}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              placeholder="Description"
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              placeholder="Amount"
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Status"
              onChange={handleChange}
              options={[
                {
                  label: "PENDING",
                  value: "PENDING",
                },
                {
                  label: "PAID",
                  value: "PAID",
                },
                {
                  label: "SHIPPED",
                  value: "SHIPPED",
                },
                {
                  label: "DELIVERED",
                  value: "DELIVERED",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="order"
            label="Order"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              placeholder="Order"
              onChange={handleChange}
              options={[]}
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
