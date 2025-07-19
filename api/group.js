import axios from 'axios';

const API_URL = 'http://192.168.1.118:3000/api/group';

export const createGroup = ({ groupName, userIds, createdBy, userRole }) => {
console.log(userIds);
  return axios.post(`${API_URL}/creategroup`, {
    groupName,
    userIds,
    createdBy,
    userRole,
  });
};

export const getGroupByEmail= (email) => {
    return axios.get(`${API_URL}/groups?email=${email}`);
};