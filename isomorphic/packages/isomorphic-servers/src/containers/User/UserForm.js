import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Select
} from 'antd';
import axios from 'axios';
import jwtConfig from '@iso/config/jwt.config';
import axiosConfig from '../../library/helpers/axios';
const MyComponent = (props) => {
  console.log('props', props)
  // State variables
  //const [count, setCount] = useState(0);
  const [user, setUser] = useState(props.user);

  // Effect hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${jwtConfig.fetchUrlSecret}users`, axiosConfig); // Replace with your actual API endpoint
       //setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Event handler
  const handleClick = () => {
    props.setIsModalOpen(false);
  };

  const handleSave = async () => {
    console.log('user', user)
    const response = await axios.put(`${jwtConfig.fetchUrlSecret}user`, user, axiosConfig); // Replace with your actual API endpoint
    console.log('response', response)
  };

  const updateEmail = (value) => {
    //value is new email
    //date props.user.email to new email
    setUser(prevUser => ({ ...prevUser, email: value }));
  }
  const updateName = (value) => {
    //value is new email
    //date props.user.email to new email
    setUser(prevUser => ({ ...prevUser, email: value }));
  }
  const updateAddress = (value) => {
    setUser(prevUser => ({ ...prevUser, address: value }));
  }
  
  const updateRole = (value) => {
    setUser(prevUser => ({ ...prevUser, role: value }));
  }


  return (
    <div>
      <Input placeholder="Email" defaultValue={props.user.email} onChange={value => updateEmail(value)}/>
      <Input placeholder="Name" defaultValue={props.user.name} onChange={value => updateName(value)}/>
      <Input placeholder="Address" defaultValue={props.user.address} onChange={value => updateAddress(value)}/>
      <Select
        defaultValue={props.user.role}
        style={{
          width: 120,
        }}
        onChange={updateRole}
        
        
        options={[
          {
            value: 'ADMIN',
            label: 'ADMIN',
          },
          {
            value: 'USER',
            label: 'USER',
          },
          {
            value: 'CLIENT',
            label: 'CLIENT',
          },
          {
            value: 'INKUSER',
            label: 'INKUSER',
            disabled: true,
          },
          {
            value: 'BISHKEKUSER',
            label: 'BISHKEKUSER',
          },
          {
            value: 'CHINESEUSER',
            label: 'CHINESEUSER',
          },
          {
            value: 'PENDING',
            label: 'PENDING',
          },
        ]}
      />
      <Button onClick={handleClick}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default MyComponent;