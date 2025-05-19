import { create } from 'zustand'
import axios from 'axios'

const useAuth = create((set) => ({ 
  user: null,
  token: localStorage.getItem('token') || null,
  login: async (email, password) => {
    const res = await axios.post('http://127.0.0.1:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    set({ token: res.data.access_token });
  },
  loadUser: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      const res = await axios.get('http://127.0.0.1:5000/api/auth/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
       },
        
      })
      set({ user: res.data.user })
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  }
}))

export default useAuth;