import React from "react";
import {Input, Button,  Space,  Form, DatePicker, Switch} from "antd";
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


  const handleChange = (e) => {
    console.log(e);
  };

  const onFinish = async (values) => {
    console.log(props.recordId);
    const feePackage = parseFloat(values.feePackage);
    const valueCargo = parseFloat(values.valueCargo);
    const logisticFee = parseFloat(values.logisticFee);
    const newRoll = {...values, feePackage, valueCargo, logisticFee}
    if (props.record && props.record.id) {
      const response = await axios
        .put(
          `${jwtConfig.fetchUrlSecret}cargo?id=${props.record.id}`,
          newRoll,
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
          `${jwtConfig.fetchUrlSecret}cargo`,
          newRoll,
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

  return(
    <>
      <Space style={{width: "100%"}} direction="vertical">
        <Form
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          {...layout}
        >
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Description"/>
          </Form.Item>
          <Form.Item
            name="dateArrived"
            label="Date Arrived"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="dateSent"
            label="Date Sent"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="feePackage"
            label="Fee Package"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Fee Package"/>
          </Form.Item>
          <Form.Item
            name="valueCargo"
            label="Value Cargo"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Value Cargo"/>
          </Form.Item>
          <Form.Item
            name="logisticFee"
            label="Logistic Fee"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Logistic Fee"/>
          </Form.Item>
          <Form.Item
            name="isFullyRecieved"
            label="Is Fully Received"
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName="checked"
          >
            <Switch >is Fully Received</Switch>
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
    </>
  )
}

export default MyComponent;