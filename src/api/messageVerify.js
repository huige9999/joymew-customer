import request from '@/utils/request';

// 获取审核功能基本信息
export const reqGetMsgCheckBaseInfo = (splid) => request.get(`/msgCheck/getMsgCheckBaseInfo?splid=${splid}`);

// 开启/关闭 审核功能
// checkSwitch取值0,1
export const reqUpdateCheckSwitch = (splid, checkSwitch) => request.post('/msgCheck/updateCheckSwitch', { splid, check_switch: checkSwitch });

// 获取消息审核列表
// type表示消息类型,1: 普通消息 2: 礼物消息
// status表示审核状态,0: 审核中 1: 已通过 2: 已拒绝
export const reqGetMsgChecList = (splid, type, status, currentPage, showCount) => request.get(`/msgCheck/getMsgCheckList?splid=${splid}&type=${type}&status=${status}&currentPage=${currentPage}&showCount=${showCount}`);

// 通过或者拒绝某个消息
// ids表示消息ID按逗号隔开
// status表示审核状态,1: 通过 2: 拒绝
export const reqHandleMsgChek = (splid, ids, status) => request.post('/msgCheck/handlerMsgCheck', { splid, ids: ids.toString(), status: status.toString() });

// 重新发送一次消息
export const reqSendMsg = (splid, ids) => request.post('/msgCheck/sendMsg', { splid, ids: ids.toString() });
