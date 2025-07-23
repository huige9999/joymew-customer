import request from '@/utils/request';
import * as qiniu from 'qiniu-js';

/**
 * 输入：图片、业务名、压缩级别(可选 取值0->1)、域名(可选)
 * 输出: Promise对象
 *      resolve()结果：{ hash, key }
 */
const uploadImage = ((function uploadImage() {
  let token;
  let domain;
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z0,
  };
  const putExtra = {};
  const chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
    // 生成随机字符串
  function generateMixedStr(an) {
    let res = '';
    for (let ia = 0; ia < an; ia++) {
      const id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  }
  // 生成七牛token
  function generateQnToken() {
    return request.post('/host/getQnToken', {});
  }
  /**
     * 生成文件名
     *  => 规则：joymewCustomer/业务名/时间戳12位随机字符串
     */
  function generateKey(serviceName) {
    return `joymewCustomer/${serviceName}/${new Date().getTime()}and${generateMixedStr(12)}`;
  }
  function qnUpload(file, serviceName, compressVal) {
    return new Promise((resolve, reject) => {
      qiniu.compressImage(file, {
        quality: compressVal,
        noCompressIfLarger: true,
      }).then((data) => {
        const key = generateKey(serviceName);
        const observable = qiniu.upload(data.dist, key, token, putExtra, config);
        observable.subscribe(() => {
        }, (err) => {
          reject(err);
        }, (complete) => {
          complete.key = `${domain}${complete.key}`;
          resolve(complete);
        });
      });
    });
  }
  return (file, serviceName, compressVal = 1, domainPram = 'https://ustatic.hudongmiao.com/') => {
    let tmpPromise;
    domain = domainPram;
    if (token) {
      // 存在token 直接上传
      tmpPromise = qnUpload(file, serviceName, compressVal);
    } else {
      // 无token 先生成token再上传
      tmpPromise = generateQnToken().then((res) => {
        token = res?.data?.token;
        return qnUpload(file, serviceName, compressVal);
      });
    }
    return tmpPromise;
  };
})());

export default uploadImage;
