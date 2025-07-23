import request from '@/utils/request';
/* eslint-disable */
/**
 * api_from_page 表明调用此接口的页面
* */

/**
 *
 * @param {*} param0
 */
export const Login = ({ request_from_page }) => {
  return request.post('/dengLuHm/gogogo', {
    request_from_page,
  });
};


/**
 * 是否加过企业微信
 */
export const reqHasAddQyWeixin = () => {
  return request.post('/common/isJoinQw',{});
}