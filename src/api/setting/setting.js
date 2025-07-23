import store from '@/store';
import request from '@/utils/request';

// 活动信息
/**
 * 获取遥控器二维码
 */
export const getControlQRcode = ({ splid, logoPath, page = 'pages/index/controller/controller' }) => request.post('/newHuoDongHm/getSmallProgramCode', {
  // logoPath,
  // page,
  // id,
  // request_from_page,
  splid,
  logoPath,
  page,
});

// 游戏设置

// 活动数据

// 活动收入
// 企业信息设置
export const setCompanyLogo = (params) => request.post('/qiYeNe/saveQiyeInfo', params);
// 获取企业信息
export const getCompanyLogo = (params) => request.post('/qiYeNe/qiYeList', params);

// 添加签到语
export const addWish = (params) => request.post('/qianDaoYu/add', params);
// 获取签到语列表
export const getWishList = (params) => request.post('/qianDaoYu/list', params);
// 签到语开关设置
export const wishSwitch = (params) => request.post('/qianDaoYu/updateSwitch', params);
// 删除签到语
export const removeWish = (params) => request.post('/qianDaoYu/shanchu', params);

// 获取投票列表
export const voteList = (params) => request.post('/hmTouPiao/listTp', params);
// 删除投票选项
export const removeVote = (params) => request.post('/hmTouPiao/deleteTp', params);
// 添加投票信息
export const saveVote = (params) => request.post('/hmTouPiao/saveTp', params);
// 投票设置
export const editVote = (params) => request.post('/hmTouPiao/updateTpNumber', params);
// 更新投票
export const updateVote = (params) => request.post('/hmTouPiao/updateTp', params);
// 加票
export const addVoteSize = (params) => request.post('/hmTouPiao/addTpCount', params);
// 更新投票模式
export const updateVoteMode = (params) => request.post('/sheZhi/updateDetail', params);
// 清空投票数据
export const clearVoteData = () => request.get(`/hmTouPiao/clearTpCount?splid=${store.state.liveId}`);
// 编辑投票内容
export const editVoteContent = ({ description, id }) => request.get(`/hmTouPiao/updateTp?description=${description}&id=${id}`);
// 强制输入手机号开关
export const phoneSwitch = (params) => request.post('/qianDaoYu/updatePhoneSwitch', params);

// 添加评价人信息
export const saveMarkUser = (params) => request.post('/player/savePlayer', params);

// 编辑评价人信息
export const editMarkUser = (params) => request.post('/player/editPlayer', params);

// 获取评价人列表
export const getMarkUserList = (params) => request.get(`/player/getPlayerList?splid=${params.splid}`);

// 编辑音乐总开关
export const editUserConfig = (is_open_music) => request.post('/music/editUserConfig', {
  is_open_music,
});

// 获取音乐列表
export const getMusicList = ({ currentPage, showCount }) => request.post('/music/getMusicList', {
  currentPage,
  showCount,
});

// 获取单个音乐信息
export const getMusicInfo = (music_id) => request.post('/music/getMusicInfo', {
  music_id,
});

// 编辑音乐
export const editMusic = ({ music_id, music_name, music_price, is_delete, kind }) => request.post('/music/editMusic', {
  music_id,
  music_name,
  music_price,
  is_delete,
  kind,
});

// 编辑音乐总开关
export const saveMusic = ({ music_name, music_price, kind }) => request.post('/music/saveMusic', {
  music_name,
  music_price,
  kind,
  type: 1,
});

// 获取音乐总开关
export const getUserConfig = () => request.post('/music/getUserConfig', {});

// 获取评分数据列表
export const getRemarkData = ({ splid, orderBy }) => request.post('/player/getPlayerInfoList', {
  splid,
  order_by: orderBy.toString(),
});

/** 获取活动信息
 * @param {String} key 要查询的信息的key
 */
export const reqGetActivityDetail = (key) => request.post('/sheZhi/getActivityDetail', {
  splid: store.state.liveId,
  key,
});
