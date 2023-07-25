import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Input, Button, Select, Space, InputNumber, Form, DatePicker } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {

  const [form] = Form.useForm();
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
    if(props.record){
      form.setFieldsValue({
        description: props.record.description,
        userFrom: props.record.userFromId,
        userTo: props.record.userToId,
        amount: props.record.amount,
        status: props.record.status,
      })
    }
    else{
      form.resetFields()
    }
  }, [props.record]);


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
  }, []);



  const handleChange = () => {
    //TODO: Handle SELECT events
  };

  const onFinish = async (values) => {
    const newFinancialTransaction = {...values, ...Auth}
    const response = await axios.post(`${jwtConfig.fetchUrlSecret}financialTransaction`,newFinancialTransaction, axiosConfig).catch(function (error) {
      console.log(error)
    });
    if(response && response.data && response.status === 200) {
      props.setIsModalOpen(false);
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
            name="inkProduct"
            label="Product"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              placeholder="Select Product"
              options={userDropdownlistValue}
            />
          </Form.Item>
          <Form.Item
            name="inkProductCat"
            label="Select Catagary"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              placeholder="Select Catagary"
              options={userDropdownlistValue}
            />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber placeholder="Amount" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber placeholder="Amount" />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Select
              placeholder="unit"
              options={[
                {
                  label: "KG",
                  value: "KG",
                },
                {
                  label: "M",
                  value: "M",
                },
                {
                  label: "AD",
                  value: "AD",
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="orderDate"
            label="Order Date"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <DatePicker/>
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
