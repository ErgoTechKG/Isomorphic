import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, Button, Select, Space, InputNumber, Form } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  //const [record, setRecord] = useState(props.record);
  const Auth = useSelector((state) => state.Auth);
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

  useEffect(() => {
    if (props.record) {
      form.setFieldsValue({
        id: props.record.id,
        name: props.record.name,
        staff: props.record.staff,
      });
    } else {
      form.resetFields();
    }
  }, [props.record]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}client`,
          axiosConfig
        ); // Replace with your actual API endpoint
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = () => {
    //TODO: Handle SELECT events
  };

  const onFinish = async (values) => {
    const newFinancialTransaction = { ...values, ...Auth };

    if (props.record && props.record.id) {
      const response = await axios
        .put(
          `${jwtConfig.fetchUrlSecret}client?id=${props.record.id}`,
          newFinancialTransaction,
          axiosConfig
        )
        .catch(function (error) {
          console.log(error);
        });
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    } else {
      const response = await axios
        .post(
          `${jwtConfig.fetchUrlSecret}client`,
          newFinancialTransaction,
          axiosConfig
        )
        .catch(function (error) {
          console.log(error);
        });
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
        <Form form={form} name="control-hooks" onFinish={onFinish} {...layout}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="staff"
            label="Staff"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Staff" />
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
