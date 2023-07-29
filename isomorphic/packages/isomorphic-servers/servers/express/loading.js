import React, {useState, useEffect} from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
// import ClipLoader from "react-spinners/ClipLoader";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);
const Spinner = () => <Spin indicator={antIcon} />;
export default Spinner;