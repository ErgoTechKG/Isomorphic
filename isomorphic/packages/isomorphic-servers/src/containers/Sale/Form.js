import React from "react";
import {Input, Button, Select, Space, InputNumber, Form, DatePicker} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";

const MyComponent = (props) => {

  const [form] = Form.useForm();
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

  const onFinish = async (values) => {
    // Convert incomeUSD and expenseUSD to Float or set them to null if they're not valid numbers
    const priceUSD = parseFloat(values.priceUSD);
    const amount = parseFloat(values.amount);
    const newSale = {...values, priceUSD, amount}
    if (props.record && props.record.id) {
      const response = await axios
        .put(
          `${jwtConfig.fetchUrlSecret}sale?id=${props.record.id}`,
          newSale,
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
          `${jwtConfig.fetchUrlSecret}sale`,
          newSale,
          axiosConfig
        )
        .catch(function (error) {
          console.log(error);
        });
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    }
  }

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Space style={{width: "100%"}} direction="vertical">
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
            <DatePicker/>
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
            <Input placeholder="Note"/>
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
            <Input placeholder="Amount"/>
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Unit"/>
          </Form.Item>
          <Form.Item
            name="priceUSD"
            label="Price (USD)"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Price (USD)"/>
          </Form.Item>
          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Payment Method"/>
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
            <Input placeholder="Status"/>
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

