import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Input,
  Button,
  Upload,
  Space,
  InputNumber,
  Form,
  message,
  Checkbox,
  Switch
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../../library/helpers/axios";

const { Search } = Input;

const MyComponent = (props) => {
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const Auth = useSelector((state) => state.Auth);
  console.log("props", props);
  console.log("fileList", fileList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}product?id=${props.recordID}`,
          axiosConfig
        ); // Replace with your actual API endpoint
        console.log("response", response);
        const fileListData = response.data.imageURL.map((file) => ({
          uid: file, // Use a unique identifier for the file
          name: file,
          status: "done", // Assuming the file is already uploaded and stored on the server
          url: `https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${file}`, // URL of the uploaded file
        }));

        setFileList(fileListData);
        form.setFieldsValue(response.data);
      //   form.setFieldsValue({
      //     isPluff: true,
      // });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Set loading to false after data is fetched (including error cases)
      }
    };
    console.log("props.recordID change");
    if (!props.recordID) {
      form.resetFields();
      setFileList([]);
    } else fetchData();
  }, [props.recordID]);

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
    if (props.recordID) {
      console.log("values", values);

      values.imageURL = fileList.map((i) =>
        i.response ? i.response.fileId : i.uid
      );

      const { upload, ...rest } = values;

      const response = await axios
        .put(
          `${jwtConfig.fetchUrlSecret}product?id=${props.recordID}`,
          rest,
          axiosConfig
        )
        .catch(function (error) {
          console.log(error);
          messageApi.open({
            type: "error",
            content: error,
          });
        });
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    } else {
      //console.log('value no id', values)
      if (values.upload)
        values.imageURL = values.upload.fileList.map((i) => i.response.fileId);

      const { upload, ...rest } = values;

      console.log("value no id rest", rest);

      const response = await axios
        .post(`${jwtConfig.fetchUrlSecret}product`, rest, axiosConfig)
        .catch(function (error) {
          console.log(error);
        });
      if (response && response.data && response.status === 200) {
        props.setIsModalOpen(false);
      }
    }
    form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
  };

  const onGenerateCode = async (value) => {
    if (value) {
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


  const onChange = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const uploadProps = {
    onChange(info, i) {
      // console.log("info", info, i);
      // if (info.file.status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status === "done") {
      //   message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === "error") {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
      let newFileList = [...info.fileList];
      console.log("newFileList", newFileList);
      // // 2. Read from response and show file link
      // newFileList = newFileList.map((file) => {
      //   if (file.response) {
      //     // Component will show file.url as link
      //     file.url = file.response.url;
      //   }
      //   return file;
      // });
      setFileList(newFileList);
    },
  };

  // const normFile = (e) => {
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const onRemove = async (value) => {
    console.log("onRemove", value);
    // const response = await axios.delete(
    //   `${jwtConfig.uploadUrl}?fileId=${value.response.fileId}`
    // ); // Replace with your actual API endpoint
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
            name="codeKent0"
            label="Old Kent Code"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input placeholder="Old Kent Code" />
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
            name="isPluff"
            label="Is Pluff"
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName="checked"
          >
            <Switch >isPluff</Switch>
          </Form.Item>

          <Form.Item
            name="isResToChina"
            label="Is Res To China"
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName="checked"
          >
            <Switch >isResToChina</Switch>
          </Form.Item>


          <Form.Item
            name="isKentSample"
            label="is Kent Sample"
            rules={[
              {
                required: false,
              },
            ]}
            valuePropName="checked"
          >
            <Switch >IsKentSample</Switch>
          </Form.Item>

          <Form.Item
            label="Upload"
            name="upload"
            // valuePropName="fileList"
            // getValueFromEvent={normFile}
          >
            <Upload
              action={jwtConfig.uploadUrl}
              listType="picture-card"
              name="file"
              multiple={true}
              fileList={fileList}
              onRemove={onRemove}
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
