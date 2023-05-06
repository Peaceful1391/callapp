import  { useState, useEffect } from 'react';
import {useUserStore} from '../store/UserStore'
import { Link } from "react-router-dom";
import {
  Table,
  Space,
  Button,
  Form,
  Input,
  Modal,
  Select,
} from 'antd';


interface User {
  id?: number | string,
  name: string,
  email: string,
  gender: string,
  address: {
    street: string,
    city: string
  },
  phone: number | string
}

interface Values {
  id: number | string,
  name: string,
  email: string,
  gender: string,
  street: string,
  city: string,
  phone: number | string
}

const { Item } = Form;

function App() {
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddOpen, setIsAddModalOpen] = useState<boolean>(false);

  const [id, setId] = useState<number | string>(0)
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [gender, setGender] = useState<string>('male');
  const [street, setStreet] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [phone, setPhone] = useState<number | string>('')
  const users = useUserStore(state => state.users)
  const setUsers = useUserStore(state => state.setUsers)
  const deleteUser = useUserStore(state => state.deleteUser) 
  const createUser = useUserStore(state => state.createUser)
  const updateUser = useUserStore(state => state.updateUser)

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender'
    },
    {
      title: 'Street',
      dataIndex: ["address", "street"],
      key: 'street',
    },
    {
      title: 'City',
      dataIndex: ["address", "city"],
      key: 'city'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user:User) => (
        <Space size="middle">
          <a onClick={() => {
            deleteUser(user.id as number)
          }}
          >Delete</a>
        </Space>
      )
    }
  ]

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const addUser = async (values: Values) => {
    const body: User = {
      name: values.name,
      email: values.email,
      gender: values.gender,
      address: {
        street: values.street,
        city: values.city,
      },
      phone: values.phone
    }    
    
    try {
      createUser(body)
      handleAddCancel()
      addForm.resetFields()
    } catch (error) {
      console.error('Error:', error);
    }
  } 

  const editUser = async (values: Values) => {
    const body = {
      id: id,
      name: values.name,
      email: values.email,
      gender: values.gender,
      address: {
        street: values.street,
        city: values.city,
      },
      phone: values.phone
    }

    try {
      updateUser(body)
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if(!users.length) {
      setUsers()
    }
  }, []);

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
  };
  

  return (
    <>
      <div>
        <Button onClick={() => {showAddModal()}}>Add new user</Button>
        <Link to='/chart'><Button>Go to Chart</Button></Link>
      </div>

      <Table dataSource={users} onRow={(user) => {
    return {
      onDoubleClick: () => {
        editForm.resetFields();
        setId(user.id as number)
        setName(user.name);
        setEmail(user.email);
        setGender(user.gender);
        setStreet(user.address.street);
        setCity(user.address.city);
        setPhone(user.phone);
        showEditModal();
        }
    };
  }} columns={columns} rowKey='id'/>

      <Modal
        // forceRender
        title='Edit User'
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={editForm} onFinish={editUser} layout="vertical">
          <Item
            label='Name'
            name='name'
            initialValue={name}
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder='Enter your name' />
          </Item>
          <Item
            label='Email'
            name='email'
            initialValue={email}
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please input a valid email' },
            ]}
          >
            <Input placeholder='Enter your email' />
          </Item>
          <Item
            label='Gender'
            name='gender'
            initialValue={gender}
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select placeholder="Select your gender">
              {genderOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Item>
          <Item
            label='City'
            name='city'
            initialValue={city}
            rules={[{ required: true, message: 'Please input your city' }]}
          >
            <Input placeholder='Enter your city'  />
          </Item>
          <Item
            label='Street'
            name='street'
            initialValue={street}
            rules={[{ required: true, message: 'Please input your street address' }]}
          >
            <Input placeholder='Enter your street address' />
          </Item>
          <Item
            label='Phone'
            name='phone'
            initialValue={phone}
            rules={[{ required: true, message: 'Please input your phone number' }]}
          >
            <Input placeholder='Enter your phone number'  />
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Item>
        </Form>
      </Modal>

      <Modal
        // forceRender
        title='Add User'
        open={isAddOpen}
        onCancel={handleAddCancel}
        footer={null}
        destroyOnClose={true}
      >
        <Form form={addForm} onFinish={addUser} layout="vertical">
          <Item
            label='Name'
            name='name'
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder='Enter your name'  />
          </Item>
          <Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input your email' },
              { type: 'email', message: 'Please input a valid email' },
            ]}
          >
            <Input placeholder='Enter your email'  />
          </Item>
          <Item
            label='Gender'
            name='gender'
            initialValue={"male"}
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select placeholder="Select your gender">
              {genderOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Item>
          <Item
            label='City'
            name='city'
            rules={[{ required: true, message: 'Please input your city' }]}
          >
            <Input placeholder='Enter your city'  />
          </Item>
          <Item
            label='Street'
            name='street'
            rules={[{ required: true, message: 'Please input your street address' }]}
          >
            <Input placeholder='Enter your street address'  />
          </Item>
          <Item
            label='Phone'
            name='phone'
            rules={[{ required: true, message: 'Please input your phone number' },
            {
              pattern:/^\+\d{1,3}\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
              message: 'Please enter a valid phone number',
            },]}
          >
            <Input placeholder='Enter your phone number'  />
          </Item>
          <Item>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Item>
        </Form>
      </Modal>
    </>
  )
}

export default App
