import {create} from 'axios';
import {getToken} from 'utils/encryptedStorage';
import {serverErrors} from './handleServerError';
export const axios = create({
  baseURL: 'http://81.169.173.21:3000/apis/v1/',
  headers: {
    common: {'Content-Type': 'application/json'},
  },
});

axios.interceptors.response.use(
  response => successResponce(response),
  error => {
    return Promise.reject(serverErrors(error));
  },
);

axios.interceptors.request.use(
  async config => {
    const request = config;
    const key = await getToken();
    if (key) {
      request.headers.common.Authorization = key;
    }
    return request;
  },
  error => Promise.reject(error),
);

const successResponce = result => {
  const {data} = result;
  return data;
};
