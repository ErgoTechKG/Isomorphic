import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, Button, Upload, Space, InputNumber, Form, message } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";

const { Search } = Input;

const MyComponent = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
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
    console.log("values", values);

    if (values.upload)
      values.imageURL = values.upload.map((i) => i.response.fileId);

    const { upload, ...rest } = values;

    console.log("rest", rest);

    const response = await axios
      .post(`${jwtConfig.fetchUrlSecret}product`, rest, axiosConfig)
      .catch(function (error) {
        console.log(error);
      });
    if (response && response.data && response.status === 200) {
      props.setIsModalOpen(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const onGenerateCode = async (value) => {
    if (value) {
      console.log({ value: value });
      const response = await axios
        .post(
          `${jwtConfig.fetchUrlSecret}product/generateCodeValidation`,
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
        .get(`${jwtConfig.fetchUrlSecret}product/generateCode`, axiosConfig)
        .catch(function (error) {
          console.log(error);
        });
      console.log("response", response);
      if (response && response.data && response.status === 200) {
        console.log(response.data);
        form.setFieldsValue({ codeKent: response.data });
        //fill the generate value to the form
        //props.setIsModalOpen(false);
      }
    }
  };

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
      {contextHolder}
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

          <Form.Item
            label="Upload"
            name="upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              action={jwtConfig.uploadUrl}
              listType="picture-card"
              name="file"
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
