import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Form,
  Upload,
  Select,
  message,
  InputNumber,
  Space,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import axios from "axios";
import { useSelector } from "react-redux";

const MyComponent = (props) => {
  const { locale } = useSelector((state) => state.LanguageSwitcher.language);
  const [usageDropdownlist, setUsageDropdownlistValue] = useState([]);
  const [catagoryDropdownlist, setCatagoryDropdownlistValue] = useState([]);
  const [materialDropdownlist, setMaterialDropdownlistValue] = useState([]);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}usages`,
          axiosConfig
        ); // Replace with your actual API endpoint
        const usageDropdownlist = response.data.map((a) => {
          const languageName =
            {
              en: a.englishName,
              cn: a.chineseName,
              ru: a.russianName,
            }[locale] || "";

          return {
            value: a.id,
            label: `${languageName}-${a.fabric}-${a.season}`,
          };
        });
        setUsageDropdownlistValue(usageDropdownlist);

        const responseCatagory = await axios.get(
          `${jwtConfig.fetchUrlSecret}catagories`,
          axiosConfig
        ); // Replace with your actual API endpoint
        const catagoryDropdownlist = response.data.map((a) => {
          const languageName =
            {
              en: a.englishName,
              cn: a.chineseName,
              ru: a.russianName,
            }[locale] || "";

          return {
            value: a.id,
            label: `${languageName}-${a.fabric}-${a.season}`,
          };
        });
        console.log("responseCatagory", responseCatagory);
        setCatagoryDropdownlistValue(catagoryDropdownlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}materials`,
          axiosConfig
        ); // Replace with your actual API endpoint
        const materialDropdownlist = response.data.map((a) => {
          const languageName =
            {
              en: a.englishName,
              cn: a.chineseName,
              ru: a.russianName,
            }[locale] || "";

          return {
            value: a.id,
            label: `${a.code}-${languageName}`,
          };
        });
        console.log("material", response);
        setMaterialDropdownlistValue(materialDropdownlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, []);

  const onFinish = async (values) => {
    if (values.upload)
      values.imageUrl = values.upload.map((i) => i.response.fileId);

    const response = await axios
      .post(`${jwtConfig.fetchUrlSecret}product`, values, axiosConfig)
      .catch(function (error) {
        console.log(error);
      });
    if (response && response.data && response.status === 200) {
      props.setIsModalOpen(false);
    }
    //TODO: what to do after clicking save button
  };

  const onReset = () => {
    form.resetFields();
  };

  const uploadProps = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        const aprops = form.getFieldsValue();
        //form.setFieldValue('file', info.response.fileId)
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
          name="codeFromSupplier"
          label="Code From Supplier"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="codeFromSupplier" />
        </Form.Item>
        <Form.Item
          name="codeGenerated"
          label="Code Generated"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="codeGenerated" disabled={true} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        <Form.Item
          name="usage"
          label="Usage"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select mode="multiple" allowClear options={usageDropdownlist} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber placeholder="price" />
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
          <InputNumber placeholder="gram" />
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
          <InputNumber placeholder="width" />
        </Form.Item>
        <Form.Item
          name="stockCount"
          label="Stock Count"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <InputNumber placeholder="stockCount" disabled={true} />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select options={catagoryDropdownlist} />
        </Form.Item>
        <Form.List name="ingredient" label="Ingredient">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    label="Ingredient"
                    name={[name, "name"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing name",
                      },
                    ]}
                  >
                    <Select options={materialDropdownlist} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "percentage"]}
                    rules={[
                      {
                        required: false,
                        message: "Missing percentage",
                      },
                    ]}
                  >
                    <InputNumber placeholder="Percentage" />
                  </Form.Item>
                  %
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add ingredients
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
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
    </div>
  );
};

export default MyComponent;
