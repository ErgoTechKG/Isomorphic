import React, {useState} from "react";
import {Input, Button,  Space,  Form,  message} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";

const MyComponent = (props) => {
  const [form] = Form.useForm();
  const [record, setRecord] = useState(props.record);
  const [messageApi] = message.useMessage();
  const { Search } = Input;
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
    const amount = parseFloat(values.amount);
    const cost = parseFloat(values.cost);
    const newRoll = {...values, amount, cost}
    if (props.record && props.record.id) {
      const response = await axios
        .put(
          `${jwtConfig.fetchUrlSecret}roll?id=${props.record.id}`,
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
          `${jwtConfig.fetchUrlSecret}roll`,
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

  const onGenerateCode = async (value) => {
    if (value) {
      const response = await axios
        .post(
          `${jwtConfig.fetchUrlSecret}roll/generateCodeValidation`,
          { value: value },
          axiosConfig
        )
        .catch(function (error) {
          console.log(error);
        });
      if (response && response.data && response.status === 200) {
        messageApi.open({
          type: "success",
          content: "Your Kent code is available",
        });

        //props.setIsModalOpen(false);
      }
    } else {
      const response = await axios
        .get(`${jwtConfig.fetchUrlSecret}roll/generateCode`, axiosConfig)
        .catch(function (error) {
          console.log(error);
        });
      console.log("response", response);
      if (response && response.data && response.status === 200) {
        console.log(response.data);
        form.setFieldsValue({ kentCode: response.data });
        //fill the generate value to the form
        //props.setIsModalOpen(false);
      }
    }
  };

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
            name="rbg"
            label="rbg"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Rbg"/>
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
            name="kentCode"
            label="KentCode"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Search
              placeholder="auto generate a kent code"
              onSearch={onGenerateCode}
            />
          </Form.Item>
          <Form.Item
            name="cost"
            label="Cost"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="Cost"/>
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