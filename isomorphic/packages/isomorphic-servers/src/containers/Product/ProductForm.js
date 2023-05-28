import React, { useState, useEffect } from "react";
import { Input, Button, Form, Upload, Select, message } from "antd";
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
    
    values.uploadUrl = values.upload.map(i => i.response.fileId)
    console.log('values', values);
    //TODO: what to do after clicking save button
  };

  const onReset = () => {
    form.resetFields();
  };

  const uploadProps = {
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
        
      }
      if (info.file.status === 'done') {
        const aprops = form.getFieldsValue()
        console.log('aprops', aprops)
        //form.setFieldValue('file', info.response.fileId)
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      console.log('info', info);
    },
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const fileList = [];

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
        <Form.Item label="Upload"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
        >
          <Upload action={jwtConfig.uploadUrl} 
          listType="picture-card" name='file'
          {...uploadProps}
          >
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
