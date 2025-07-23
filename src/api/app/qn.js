import request from '@/utils/request';
import * as qiniu from 'qiniu-js';

export function getQnCode() {
  // console.log('data',data)
  return request.post('/host/getQnToken', {});
}
export const domain = 'https://ustatic.hudongmiao.com/';
export function uploadImg(file, key, callback) {
  // const key = '';
  const putExtra = {
    // fname: '',
    // params: {},
    // mimeType: ['video/*'],
  };
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z0,
  };
  return new Promise((resolve, reject) => {
    getQnCode()
      .then((res) => {
        const token = res?.data?.token;
        console.log(res, token);
        // return;
        if (token) {
          console.log('qiniu.upload');
          // try{
          const observable = qiniu.upload(file, key, token, putExtra, config);
          const observer = {
            next: (res) => {
              // console.log('next', res);
              if (callback) {
                callback('next', res);
              }
            },
            error: (err) => {
              // console.log('error', err);
              //   if (callback) {
              //     callback('error', err);
              //   }
              reject(err);

              // ...
            },
            complete: (res) => {
              // console.log('complete', res);

              //   if (callback) {
              //     callback('complete', res);
              //   }
              resolve(res);
              // ...
            },
          };
          // const subscription =
          observable.subscribe(observer); // 上传开始
        } else {
          reject(new Error('err'));
        }
      })
      .catch((err) => {
        console.log(err);
        reject(new Error('err'));
      });
  });
}
