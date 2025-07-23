import request from '@/utils/request';

export const uploadImg = (tmpFile) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', tmpFile);
    request
      .post('/beiJing/shangchuanTomcat', formData)
      .then((res) => {
        resolve(res.data.filePath);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
};

export const a = 1;
