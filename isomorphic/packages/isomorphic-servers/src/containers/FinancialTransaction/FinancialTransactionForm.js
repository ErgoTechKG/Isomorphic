import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Select,
  Space,
  InputNumber
} from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
const MyComponent = (props) => {
  console.log('props', props)
  const [record, setRecord] = useState(props.record);
  const [userDropdownlistValue, setUserDropdownlistValue] = useState([]);
  // Effect hook
  useEffect(() => {
    const fetchData = async () => {
      try {
      //const response = await axios.get(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
      //setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
        console.log('response user', response)
        const userDropdownlist = response.data.map(a => ({value: a.id, label: a.name}))
        setUserDropdownlistValue(userDropdownlist)
        console.log('user droplist', userDropdownlist)
        //setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Event handler
  const handleClick = () => {
    props.setIsModalOpen(false);
  };

  const handleChange = () => {
    //TODO: Handle SELECT events
  };

  const handleSave = () => {
    //const response = await axios.put(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
  };

  const updatDescription = (value) => {
    //setUser(prevUser => ({ ...prevUser, email: value }));
  }



  return (
    <div>
      {/* <Input placeholder="Email" defaultValue={props.user.email} onChange={value => updateEmail(value)}/>
     */}
     <Space style={{ width: '100%' }} direction="vertical">
      <Select
        placeholder="Select From which User"
        defaultValue={props.record?props.record.userFrom:null}
        onChange={handleChange}
        options={userDropdownlistValue}
      />
      <Select
        placeholder="Select To which User"
        defaultValue={props.record?props.record.userFrom:null}
        onChange={handleChange}
        options={userDropdownlistValue}
      />
      <Input placeholder="Description" defaultValue={props.record?props.record.description:null} onChange={value => updatDescription(value)}/>
      <InputNumber placeholder="Amount" defaultValue={props.record?props.record.amount:null}/>
      <Select
        placeholder="Status"
        defaultValue={props.record?props.record.status:null}
        onChange={handleChange}
        options={[
          {
            label:"PENDING",
            value:'PENDING'
          },
          {
            label:"PAID",
            value:'PAID'
          },
          {
            label:"SHIPPED",
            value:'SHIPPED'
          },
          {
            label:"DELIVERED",
            value:'DELIVERED'
          },
        ]}
      />
            <Select
        placeholder="Order"
        defaultValue={props.record?props.record.order:null}
        onChange={handleChange}
        options={[]}
      />
      <Button onClick={handleClick}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
      </Space>
    </div>
  );
};

export default MyComponent;