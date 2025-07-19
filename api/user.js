import axios from 'axios';

const API_URL = 'http://192.168.1.118:3000/api/user';
export const getAllUsers = () => axios.get(`${API_URL}/users`);
