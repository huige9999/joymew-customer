import request from '@/utils/request';
import * as qiniu from 'qiniu-js';

/**
 * 上传音频文件到七牛云
 * 输入：音频文件、业务名、压缩级别(可选，音频不压缩)、域名(可选)
 * 输出: Promise对象
 *      resolve()结果：{ hash, key }
 */
const uploadMusic = ((function uploadMusic() {
  let token;
  let domain;
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z0,
  };
  const putExtra = {};
  const chars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
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
  function qnUpload(file, serviceName) {
    return new Promise((resolve, reject) => {
      const key = generateKey(serviceName);
      const observable = qiniu.upload(file, key, token, putExtra, config);
      observable.subscribe(() => {
      }, (err) => {
        reject(err);
      }, (complete) => {
        complete.key = `${domain}${complete.key}`;
        resolve(complete);
      });
    });
  }
  return (file, serviceName, _compressVal, domainPram = 'https://ustatic.hudongmiao.com/') => {
    let tmpPromise;
    domain = domainPram;
    if (token) {
      // 存在token 直接上传
      tmpPromise = qnUpload(file, serviceName);
    } else {
      // 无token 先生成token再上传
      tmpPromise = generateQnToken().then((res) => {
        token = res?.data?.token;
        return qnUpload(file, serviceName);
      });
    }
    return tmpPromise;
  };
})());

export default uploadMusic;
