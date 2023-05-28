import React, { useState, useEffect } from "react";
import { Input, Button, Form, Upload, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import jwtConfig from "@iso/config/jwt.config";

const MyComponent = (props) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  const onFinish = async (values) => {
    console.log('values', values);
    //TODO: what to do after clicking save button
  };

  const onReset = () => {
    form.resetFields();
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <div>
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
          name="description"
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
           <Input placeholder="Description" />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action={jwtConfig.uploadUrl} 
          listType="picture-card" name='file'>
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>
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

    </div>
  );
};

export default MyComponent;
