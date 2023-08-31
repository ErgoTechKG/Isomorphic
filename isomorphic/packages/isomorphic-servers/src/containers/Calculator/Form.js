import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { message, Button, Switch, Space, InputNumber, Form } from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
const MyComponent = (props) => {
  const [form] = Form.useForm();
  //const [record, setRecord] = useState(props.record);
  const Auth = useSelector((state) => state.Auth);
  const [userDropdownlistValue, setUserDropdownlistValue] = useState([]);
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

  useEffect(() => {}, [props.record]);

  useEffect(() => {}, []);

  const handleChange = () => {
    //TODO: Handle SELECT events
  };

  const onFinish = async (values) => {
    console.log('values', values)


    let logisticUSD = values.isPluff
    ? parseFloat(values.logisticPluffUSD)
    : parseFloat(values.logisticReUSD);
    
  let mPerKG = (1000 / values.width / values.gram) * 100;
  let costKGBKKUSD =
    parseFloat(
      values.priceChinaKG ? values.priceChinaKG : mPerKG * values.priceChinaMeter
    ) /
      parseFloat(values.exRate) +
      logisticUSD;



  // console.log('cost in Bihskek per kg', ((i.priceChinaKG?i.priceChinaKG:(1000/i.width/i.gram)*100*i.priceChinaMeter + logisticRMB.value)/exRate.value))
  let costBkkM = costKGBKKUSD / mPerKG;
      console.log('final', costBkkM * (1 + values.profitRate/100))
      message.success(`${costBkkM * (1 + values.profitRate/100)} per m`);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Space style={{ width: "100%" }} direction="vertical">
        <Form form={form} name="control-hooks" onFinish={onFinish} {...layout}>
          <Form.Item
            name="logisticReUSD"
            label="logisticReUSD"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonBefore="$" placeholder="logisticReUSD" />
          </Form.Item>
          <Form.Item
            name="logisticPluffUSD"
            label="logisticPluffUSD"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonBefore="$" placeholder="logisticPluffUSD" />
          </Form.Item>
          <Form.Item
            name="exRate"
            label="exRate"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber placeholder="exRate" />
          </Form.Item>
          <Form.Item
            name="profitRate"
            label="profitRate"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <InputNumber addonBefore="%" placeholder="profitRate" />
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
            name="isPluff"
            label="Is Pluff"
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName="checked"
          >
            <Switch>isPluff</Switch>
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
