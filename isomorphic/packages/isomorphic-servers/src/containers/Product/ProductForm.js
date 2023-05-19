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

  const [user, setUser] = useState(props.product);

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
      <Input placeholder="Name" defaultValue={props.product?props.product.name:null} onChange={value => updateEmail(value)}/>
      <Input placeholder="Description" defaultValue={props.product?props.product.description:null} onChange={value => updateName(value)}/>
      <Input placeholder="ImageUrl" defaultValue={props.product?props.product.ImageUrl:null} onChange={value => updateAddress(value)}/>

      <Button onClick={handleClick}>Cancel</Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default MyComponent;