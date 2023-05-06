import   { AxiosResponse } from 'axios'
import { create } from 'zustand'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import axios from '../utils/myAxios.js'

interface User {
  id?: number | string | undefined,
  name: string,
  email: string,
  gender: string,
  address: {
    street: string,
    city: string
  },
  phone: number | string
}

interface UsersState {
    users: Array<User>,
    setUsers: () => void,
    deleteUser: (id: number | string) => Promise<void>,
    createUser: (user: User) => Promise<void>,
    updateUser: (user: User) => Promise<void>, 
} 


const useUserStore = create<UsersState>((set) => ({
    users: [],
    setUsers: () => {
        axios.get<User[]>('/users')
            .then((res: AxiosResponse<User[]>) => {
                set({users: res.data})
            })
            .catch((err: Error )=> {
                console.error(err);
            });
    },
    deleteUser: async (id) => {
        try {
            const res = await axios.delete('/users/' + id);
            set({users: res.data})
          } catch (error) { 
            console.error('Error:', error);
          }
    },
    createUser: async (user)=> {
        try {
            const res = await axios.post('/users', user);
            set({users: res.data})

          } catch (error) {
            console.error('Error:', error);
          }
    },
    updateUser: async (user)=> { 
        try {
            const res = await axios.put(`/users/${user.id}`, user);
            set({users: res.data})

          } catch (error) {
            console.error('Error:', error);
          }
    },
}))

export {useUserStore}