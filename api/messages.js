import axios from 'axios';
const API_URL = 'http://192.168.1.104:3000/api/messages';

export const sendMessage = async (message) => {
  const response = await axios.post(`${API_URL}`, message);
  return response.data;
};
export const getMessages = (groupId) => axios.get(`${API_URL}/${groupId}`);
