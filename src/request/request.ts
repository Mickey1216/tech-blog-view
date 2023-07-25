import axios, { CancelTokenSource } from 'axios';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { requestBaseUrl } from '@/config';

const request = axios.create({
  cancelToken: axios.CancelToken.source().token, // 取消请求
  baseURL: requestBaseUrl,
  timeout: 1 * 60 * 1000, // 1分钟
  headers: {
    'Content-Type': 'application/json;charset=utf-8', // 默认请求头
  },
});

// 请求取消令牌
export const requestSourceMap = new Map<string, CancelTokenSource>();

// 请求拦截器
request.interceptors.request.use((config) => {
  // 取消上一次请求
  const source = requestSourceMap.get(config.url || '');
  source && source.cancel();
  // 重新设置取消令牌
  const newSource = axios.CancelToken.source();
  config.cancelToken = newSource.token;
  requestSourceMap.set(config.url || '', newSource);

  config.headers = config.headers || {};
  // 上传图片不需要token
  if (config.url?.substring(0, 6) === 'images') return config;

  // 添加token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['authorization'] = `Bearer ${token}`;
  }
  // 开始进度条
  nprogress.start();

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  ({ data }) => {
    nprogress.done();
    if (data.error) { // 服务器返回错误
      throw new Error(data.error);
    }
    return data;
  },
  (err) => {
    nprogress.done();
    // 取消请求不报错
    if (axios.isCancel(err)) return '';
    throw new Error(err);
  }
);

export default request;
