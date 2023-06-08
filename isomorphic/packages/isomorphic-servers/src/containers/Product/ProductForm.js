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
    console.log('locale', locale)
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
              zh: a.chineseName,
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
        const catagoryDropdownlist = responseCatagory.data.map((a) => {
          const languageName =
            {
              en: a.englishName,
              zh: a.chineseName,
              ru: a.russianName,
            }[locale] || "";

          return {
            value: a.id,
            label: `${languageName}`,
          };
        });
        setCatagoryDropdownlistValue(catagoryDropdownlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, [locale]);

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
              zh: a.chineseName,
              ru: a.russianName,
            }[locale] || "";

          return {
            value: a.id,
            label: `${a.code}-${languageName}`,
          };
        });

        setMaterialDropdownlistValue(materialDropdownlist);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, [locale]);
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
      <Form form={form} name="control-hooks" onFinish={onFinish} {...layout}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: false,
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
              required: false,
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
          name="sampleSource"
          label="Sample Source"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Sample Source" />
        </Form.Item>
        <Form.Item
          name="provider"
          label="Provider"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input placeholder="Provider" />
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
          label="Price"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Form.Item name={["price", "USDAmount"]} label="USDAmount">
            <InputNumber placeholder="USDAmount" />
          </Form.Item>
          <Form.Item
            name={["price", "localCurrencyAmount"]}
            label="local Currency Amount"
          >
            <InputNumber placeholder="local Currency Amount" />
          </Form.Item>
          <Form.Item
            name={["price", "currencyName"]}
            label="Currency Name"
            rules={[
              {
                required: false,
                message:
                  "if localCurrencyAmount exists, currencyName is required",
              },
            ]}
          >
            <Select placeholder="Select Currency Name">
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="RMB">RMB</Select.Option>
              <Select.Option value="SOM">SOM</Select.Option>
              <Select.Option value="RUB">RUB</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["price", "realExchangeRate"]}
            label="Real ExchangeRate"
          >
            <InputNumber placeholder="Real ExchangeRate" />
          </Form.Item>
          <Form.Item
            name={["price", "autoExchangeRate"]}
            label="Auto ExchangeRate"
          >
            <InputNumber placeholder="Auto ExchangeRate" disabled={true} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Cost"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Form.Item name={["cost", "USDAmount"]} label="USDAmount">
            <InputNumber placeholder="USDAmount" />
          </Form.Item>
          <Form.Item
            name={["cost", "localCurrencyAmount"]}
            label="local Currency Amount"
          >
            <InputNumber placeholder="local Currency Amount" />
          </Form.Item>
          <Form.Item
            name={["cost", "currencyName"]}
            label="Currency Name"
            rules={[
              {
                required: false,
                message:
                  "if localCurrencyAmount exists, currencyName is required",
              },
            ]}
          >
            <Select placeholder="Select Currency Name">
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="RMB">RMB</Select.Option>
              <Select.Option value="SOM">SOM</Select.Option>
              <Select.Option value="RUB">RUB</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["cost", "realExchangeRate"]}
            label="Real ExchangeRate"
          >
            <InputNumber placeholder="Real ExchangeRate" />
          </Form.Item>
          <Form.Item
            name={["cost", "autoExchangeRate"]}
            label="Auto ExchangeRate"
          >
            <InputNumber placeholder="Auto ExchangeRate" disabled={true} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Market Price"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Form.Item name={["marketPrice", "USDAmount"]} label="USDAmount">
            <InputNumber placeholder="USDAmount" />
          </Form.Item>
          <Form.Item
            name={["marketPrice", "localCurrencyAmount"]}
            label="local Currency Amount"
          >
            <InputNumber placeholder="local Currency Amount" />
          </Form.Item>
          <Form.Item
            name={["marketPrice", "currencyName"]}
            label="Currency Name"
            rules={[
              {
                required: false,
                message:
                  "if localCurrencyAmount exists, currencyName is required",
              },
            ]}
          >
            <Select placeholder="Select Currency Name">
              <Select.Option value="USD">USD</Select.Option>
              <Select.Option value="RMB">RMB</Select.Option>
              <Select.Option value="SOM">SOM</Select.Option>
              <Select.Option value="RUB">RUB</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["marketPrice", "realExchangeRate"]}
            label="Real ExchangeRate"
          >
            <InputNumber placeholder="Real ExchangeRate" />
          </Form.Item>
          <Form.Item
            name={["marketPrice", "autoExchangeRate"]}
            label="Auto ExchangeRate"
          >
            <InputNumber placeholder="Auto ExchangeRate" disabled={true} />
          </Form.Item>
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
          <Select>
            <Select.Option value="KG"></Select.Option>
            <Select.Option value="Meter"></Select.Option>
          </Select>
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
