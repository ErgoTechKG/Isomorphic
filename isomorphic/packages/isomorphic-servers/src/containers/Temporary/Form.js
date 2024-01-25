import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  message,
  Button,
  Select,
  Space,
  Upload,
  Form,
  Switch,
  List,
} from "antd";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const MyComponent = (props) => {
  const [form] = Form.useForm();
  //const [record, setRecord] = useState(props.record);
  const Auth = useSelector((state) => state.Auth);
  const [userDropdownlistValue, setUserDropdownlistValue] = useState([]);
  const [data, setData] = useState([]);
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

  // useEffect(() => {
  //   if (props.record) {
  //     form.setFieldsValue({
  //       description: props.record.description,
  //       userFrom: props.record.userFromId,
  //       userTo: props.record.userToId,
  //       amount: props.record.amount,
  //       status: props.record.status,
  //     });
  //   } else {
  //     form.resetFields();
  //   }
  // }, [props.record]);

  useEffect(() => {
    // const fetchUserData = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${jwtConfig.fetchUrlSecret}users`,
    //       axiosConfig
    //     ); // Replace with your actual API endpoint
    //     const userDropdownlist = response.data.map((a) => ({
    //       value: a.id,
    //       label: a.name,
    //     }));
    //     setUserDropdownlistValue(userDropdownlist);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // fetchUserData();
    form.setFieldsValue({
      switchField: false,
  });
  }, []);

  const onFinish = async (values) => {
    console.log('values', values)
    if (values.upload)
      values.imageUrl = values.upload.map((i) => i.response.fileId);

    const { upload, ...rest } = values;

    // const response = await axios
    //   .post(`${jwtConfig.fetchUrlSecret}temporary-upload`, rest, axiosConfig)
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // if (response && response.data && response.status === 200) {
    //   props.setIsModalOpen(false);
    // }
    //TODO: what to do after clicking save button
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
      setData(info.fileList)
    },
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Space style={{ width: "100%" }} direction="vertical">
        <Form form={form} name="control-hooks" onFinish={onFinish} {...layout}>
            <Form.Item name="isPluff" label="Enable feature" valuePropName="checked">
                <Switch />
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
