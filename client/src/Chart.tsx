import { useEffect } from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { Pie } from '@ant-design/charts'

import { useUserStore } from '../store/UserStore'

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

interface City {
  [key: string]: number
}

function Chart() {
  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore(state => state.setUsers)

  useEffect(() => {
    if(!users.length) {
      setUsers()
    }
  }, []);

  function countUserCities(users: User[]) {
    let data: City = {}
  
    data = users.reduce((acc: City, user: User) => {
        const city = user.address.city
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {})
  
    return Object.entries(data).map(([type, value]) => ({ type, value }));
  }
  
  const data = countUserCities(users)

  const config = {
    data,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      style: {
        fontSize: 18,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    height: 400,
    width: 600,
  };

  return (
    
    <>
      <Link to='/'><Button>Go to Table</Button></Link>
      <Pie {...config}/>
    </>
  )
}

export default Chart
