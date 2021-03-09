import axios from "axios";

export const createAPI = () => {
  const api = axios.create({
    baseURL: '/',
    timeout: 100000,
    withCredentials: true
  });


  api.interceptors.request.use(
    (config) => {
      return axios.get('/user/jwt/').then((tokenResponse) => {
        const token = tokenResponse.data;
        config.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve(config)
       }).catch(error => {
          return Promise.reject(error)
       })
  }, (error) => {
  return Promise.reject(error);
  });

  return api;
};