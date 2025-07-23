// 获取手机号服务相关api
import request from '@/utils/request';

/** 获取使用情况 */
export const reqGetUseInfo = () => request.post('/getPhone/getCount');

/** 获取充值金额列表 */
export const reqGetRechargeList = () => request.get('/getPhone/rechargeType');

/** 支付宝付款
 * @param {string} amount 金额
 */
export const reqAlipay = (amount) => request.get('/kpPay/chongzhi2', { params: { type: '10', amount } });

/**
 * 获取充值记录
 * @param {number} currentPage 当前页
 * @param {number} showCount 每页显示条数
 * @param {string} startDate 开始时间，格式为yyyy-MM-dd
 * @param {string} endDate 结束时间，格式为yyyy-MM-dd
 */
export const reqGetRechargeRecord = ({ currentPage, showCount, startDate, endDate }) => request.post('/getPhone/getUsePhoneRecord', { type: '1', currentPage, showCount, dateGe: startDate, dateLe: endDate });

/**
 * 获取使用记录
 * @param {number} currentPage 当前页
 * @param {number} showCount 每页显示条数
 * @param {string} startDate 开始时间，格式为yyyy-MM-dd
 * @param {string} endDate 结束时间，格式为yyyy-MM-dd
 */
export const reqGetUseRecord = ({ currentPage, showCount, startDate, endDate }) => request.post('/getPhone/getUsePhoneRecord', { type: '2', currentPage, showCount, dateGe: startDate, dateLe: endDate });
