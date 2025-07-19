// api/auth.js
import axios from 'axios';

const API_URL = 'http://192.168.1.118:3000/api/auth';
export const signIn = (email, password) => axios.post(`${API_URL}/signin`, { email, password });
export const signUp = (user) => {
return axios.post(`${API_URL}/signup`, user)};
