import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import {Input, Button, Select, Space, InputNumber, Form, DatePicker} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {

  const [form] = Form.useForm();
  //const [record, setRecord] = useState(props.record);
  const Auth = useSelector((state) => state.Auth);
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

  // useEffect(() => {
  //   if(props.record){
  //     form.setFieldsValue({
  //       date: props.record.date,
  //       incomeUSD:parseFloat( props.record.incomeUSD),
  //       incomeSOM: parseFloat(props.record.incomeSOM),
  //       expenseUSD: parseFloat(props.record.expenseUSD),
  //       expenseSOM: parseFloat(props.record.expenseSOM),
  //       note: props.record.note,
  //       action: props.record.action
  //     })
  //   }
  //   else{
  //     form.resetFields()
  //   }
  // }, [props.record]);



  const handleChange = (e) => {
    console.log(e);
  };

  const onFinish = async (values) => {
    // Convert incomeUSD and expenseUSD to Float or set them to null if they're not valid numbers
    const incomeUSD = parseFloat(values.incomeUSD);
    const incomeSOM = parseFloat(values.incomeSOM);
    const expensesUSD = parseFloat(values.expensesUSD);
    const expensesSOM = parseFloat(values.expensesSOM);
    const newFinance = { ...values, incomeUSD,incomeSOM, expensesUSD, expensesSOM, ...Auth };

    const response = await axios.post(`${jwtConfig.fetchUrlSecret}finance`, newFinance, axiosConfig).catch(function (error) {
      console.log(error);
    });

    if (response && response.data && response.status === 200) {
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
