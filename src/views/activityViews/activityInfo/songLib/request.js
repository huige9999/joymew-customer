import axios from 'axios';

export const BASEURL = 'http://192.168.66.44:8020';
// export const BASEURL = 'https://wwwstage.hudongmiao.com/';
// export const BASEURL = 'http://192.168.66.87:8020';
/* eslint-disable */
const service = axios.create({
  baseURL: '',
  headers: {
    token: localStorage.getItem('token'),
  },
  timeout: 20000,
});

/* 过滤请求 */
service.interceptors.request.use((config) => {
  // 动态获取token，确保每次请求都有最新的token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.token = token;
  }
  
  // 生产环境 移除 请求页面提示
  if (config.data && config.data.request_from_page && process.env.NODE_ENV !== 'development') {
    delete config.data.request_from_page;
  }
//   console.log('请求配置:', config);
  return config;
});

/* 过滤响应 */
service.interceptors.response.use(
  (result) => {
    if (result.data.message === '401') {
      // window.localStorage.removeItem('token');
      window.localStorage.clear();
      window.location.href = window.location.origin || 'https://www.hudongmiao.com/';
      console.log('登录过期');
      // TODO 处理登陆过期
      return Promise.reject('401');
    }
    if (result.status !== 200 || result.data.success === false) {
      return Promise.reject(result.data.message);
    }
    return result.data;
  },
  (err) => {
    return Promise.reject(err);
  },
);

const setToken = (token) => {
  service.defaults.headers.token = token || localStorage.getItem('token');
};

// 合伙人相关的请求实例
const servicePartner = axios.create({
  baseURL: 'http://192.168.66.44:8020',
  headers: {
    tokenPartner: localStorage.getItem('tokenPartner'),
  },
  timeout: 20000,
});

servicePartner.interceptors.response.use(
  (result) => {
    if (result.data.message === '401') {
      window.localStorage.clear();
      // https://www.hudongmiao.com/hm-customer/index.html#/partnerSystem/login
      window.location.href =
        `${window.location.origin}/hm-customer/index.html#/partnerSystem/login` ||
        'https://www.hudongmiao.com/hm-customer/index.html#/partnerSystem/login';

      console.log('登录过期');
      return Promise.reject('401');
    }
    if (result.status !== 200 || result.data.success === false) {
      return Promise.reject(result.data.message);
    }
    return result.data;
  },
  (err) => {
    return Promise.reject(err);
  },
);

const setTokenPartner = (tokenPartner) => {
  servicePartner.defaults.headers.token = tokenPartner || localStorage.getItem('tokenPartner');
};

export { servicePartner, setToken, setTokenPartner };
export default service;
