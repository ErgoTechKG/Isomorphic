import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const { Option } = Select;
const sights = {
  Beijing: ["Tiananmen", "Great Wall"],
  Shanghai: ["Oriental Pearl", "The Bund"],
};
const App = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const [prodcutsData, setProductsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}product/all`,
          axiosConfig
        ); // Replace with your actual API endpoint
        console.log('response.data', response.data)
        setProductsData(response.data.map(i => ({value:i.id, 
        label:`${i.codeChina}-${i.codeKent}-${i.codeKent0}`})));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        //setLoading(false); // Set loading to false after data is fetched (including error cases)
      }
    };

    fetchData();
  }, []);
  console.log('prodcutsData', prodcutsData)
  return (
    <Form
      form={form}
      name="dynamic_form_complex"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      autoComplete="off"
    >
      <Form.Item
        name="date"
        label="Date"
        rules={[
          {
            required: true,
            message: "Missing Date",
          },
        ]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="product"
        label="Product"
        rules={[
          {
            required: true,
            message: "Missing Product",
          },
        ]}
      >
        <Select
          showSearch
          placeholder="Select a product"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={prodcutsData}
        />
      </Form.Item>
      <Form.List name="rolls">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area ||
                    prevValues.sights !== curValues.sights
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="Sight"
                      name={[field.name, "sight"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing sight",
                        },
                      ]}
                    >
                      <Select
                        disabled={!(form.getFieldValue("date") && form.getFieldValue("product"))}
                        style={{
                          width: 130,
                        }}
                      >
                        {(sights[form.getFieldValue("area")] || []).map(
                          (item) => (
                            <Option key={item} value={item}>
                              {item}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  {...field}
                  label="Price"
                  name={[field.name, "price"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add rolls
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default App;
