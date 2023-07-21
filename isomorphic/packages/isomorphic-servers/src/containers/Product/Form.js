import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, Button, Upload, Space, InputNumber, Form, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";

const { Search } = Input;

const MyComponent = (props) => {
  const [form] = Form.useForm();
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

  const onFinish = async (values) => {
    // const newFinancialTransaction = { ...values, ...Auth };
    // const response = await axios
    //   .post(
    //     `${jwtConfig.fetchUrlSecret}financialTransaction`,
    //     newFinancialTransaction,
    //     axiosConfig
    //   )
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // if (response && response.data && response.status === 200) {
    //   props.setIsModalOpen(false);
    // }
  };

  const onReset = () => {
    form.resetFields();
  };

  const onGenerateCode = (value) => console.log(value);


  const uploadProps = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      console.log("info", info);
    },
  };


  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  return (
    <div>
      <Space style={{ width: "100%" }} direction="vertical">
        <Form form={form} name="control-hooks" onFinish={onFinish} {...layout}>
          <Form.Item
            name="source"
            label="Source"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Description" />
          </Form.Item>

          <Form.Item
            name="codeKent"
            label="Code Kent"
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
            name="codeChina"
            label="Code China"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Code China" />
          </Form.Item>

          <Form.Item
            name="nameRussian"
            label="Russian Name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Russian Name" />
          </Form.Item>

          <Form.Item
            name="nameChinese"
            label="Chinese Name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Chinese Name" />
          </Form.Item>

          <Form.Item
            name="priceChinaKG"
            label="Price China in KG"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonBefore="¥" placeholder="Price China in KG" />
          </Form.Item>

          <Form.Item
            name="priceChinaMeter"
            label="Price China in Meter"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonBefore="¥" placeholder="Price China in KG" />
          </Form.Item>

          <Form.Item
            name="width"
            label="Width"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonAfter="cm" placeholder="width" />
          </Form.Item>

          <Form.Item
            name="gram"
            label="Gram"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonAfter="g" placeholder="Gram" />
          </Form.Item>

          <Form.Item
            name="marketPrice"
            label="Market Price"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonAfter="$/M" placeholder="Market Price" />
          </Form.Item>

          <Form.Item label="Upload" name="upload" valuePropName="fileList">
            <Upload
              action={jwtConfig.uploadUrl}
              listType="picture-card"
              name="file"
              getValueFromEvent={normFile}
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
      </Space>
    </div>
  );
};

export default MyComponent;
