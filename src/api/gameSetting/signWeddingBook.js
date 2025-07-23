/**
 * 「签婚书」模块相关接口
 * @author: Ruan Jiazhen
 * @date: 2024-04-19 14:45:34
 * */

import request from '@/utils/request';

/**
 * 获取已填写的信息
 * @param {String} splid 婚礼ID
 */
export const reqGetSubmittedInfo = (splid) => request.post('/common/GetCwInfo', { splid });

/**
 * 提交签婚书信息
 * @param {Object} data 签婚书信息
 * @param {String} data.marryMan 新郎姓名
 * @param {String} data.marryWoman 新娘姓名
 * @param {String} data.marryDate 婚礼日期
 * @param {String} data.splid 活动ID
 */
export const reqSubmitSignWeddingBook = (data) => request.post('/common/SaveCwInfo', data);
