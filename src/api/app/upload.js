import request from '@/utils/request';
/* eslint-disable */
/**
 * 上传图片
 * @param {*} formData
 * file: (binary)
 */
export const uploadImage = (formData) => {
  return request
    .post('/beiJing/shangchuanTomcat', formData, { loading: 1 });
};
