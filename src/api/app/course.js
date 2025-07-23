import request from '@/utils/request';
// import { reject, resolve } from 'core-js/fn/promise';

/**
 *获取我的课程列表
 * @param {*} showCount
 * @param {*} currentPage
 *
 */
export const getMyCourseList = () => request.post('/album/getMyAlbumList', {
  // params: {
  //   type: 1,
  // },
  type: '1', // 字符串
});

/**
 *获取我的课程成交订单
 * @param {*} showCount
 * @param {*} currentPage
 *
 */
export const getCourseOrder = ({ paystate, showCount, currentPage }) => request.post('/kpPay/getPayList', {
  showCount,
  currentPage,
  paystate,
});

export const upLoadFile = (formData) => new Promise((resolve, reject) => {
  request
    .post('/beiJing/shangchuanTomcat', formData, {
      loading: 1,
    })
    .then((res) => {
      // console.log(res);
      // this.$message({
      //   message: '图片上传成功!',
      //   type: 'success',
      // });
      resolve(res);
      // this.chooseImg = res.data.filePath;
    })
    .catch((err) => {
      // console.log(err);
      reject(err);
      // this.$message.error('图片上传失败!');
    });
});

export const upLoadMediaFile = (formData) => new Promise((resolve, reject) => {
  request
    .post('/beiJing/upload', formData, {
      loading: 1,
      timeout: 3000000,
    })
    .then((res) => {
      // console.log(res);
      // this.$message({
      //   message: '图片上传成功!',
      //   type: 'success',
      // });
      resolve(res);
      // this.chooseImg = res.data.filePath;
    })
    .catch((err) => {
      // console.log(err);
      reject(err);
      // this.$message.error('图片上传失败!');
    });
});

/**
 *保存课程
 */
export const saveCourse = ({ inviter_rate, album_title, album_desc, album_cover_urlalbum, purchase_price }) => request.post('/album/saveAlbum', {
  album_title,
  album_desc,
  album_cover_urlalbum,
  purchase_price,
  inviter_rate,
  type: '1',
});

/**
 *编辑课程
 */
export const editCourse = ({ inviter_rate, album_id, album_title, album_desc, album_cover_urlalbum, purchase_price }) => request.post('/album/editAlbum', {
  album_id,
  album_title,
  album_desc,
  album_cover_urlalbum,
  purchase_price,
  inviter_rate,
});

/**
 * 删除课程
 */
export const deleteCourse = ({ album_id }) => request.post('/album/deleteAlbum', {
  album_id,
});

/**
 * 修改课程上架状态
 * https://www.hudongmiao.com/album/editAlbumStatus?kind=0&album_id=27
 */
export const changeCourse = ({ album_id, kind }) => request.post('/album/editAlbumStatus', {
  album_id,
  kind,
});

/**
 * 获取课程基本信息
 */
export const getCourse = ({ album_id }) => request.post('/album/getAlbum', {
  album_id,
});

/**
 * 小节列表
 * @param {*} param0
 * @returns
 */
export const getChapterList = ({ album_id, currentPage, showCount }) => request.post('/albumInfo/getAlbumInfoList', {
  album_id,
  type: '1',
  currentPage,
  showCount,
});

/**
 * 获取小节 信息
 * @param {*} param0
 * @returns
 */
export const getChapterDetail = ({ album_info_id }) => request.post('/albumInfo/getAlbumInfo', {
  album_info_id,
});

/**
 * 保存小节 信息
 * @param {*} param0
 * @returns
 */
export const saveChapterDetail = ({
  album_info_title,
  rich_content,
  album_desc,
  album_info_time_size,
  audio_address,
  video_address,
  sort,
  album_id,
  is_need_pay,
}) => request.post('/albumInfo/saveAlbumInfo', {
  type: '1',
  rich_content,
  album_desc,
  album_info_title,
  album_info_time_size,
  audio_address,
  video_address,
  sort,
  album_id,
  is_need_pay,
});

/**
 * 编辑小节 信息
 * @param {*} param0
 * @returns
 */
export const editChapterDetail = ({
  album_info_title,
  rich_content,
  album_desc,
  album_info_time_size,
  audio_address,
  video_address,
  sort,
  album_id,
  is_need_pay,
  album_info_id,
}) => request.post('/albumInfo/editAlbumInfo', {
  type: '1',
  album_info_title,
  rich_content,
  album_desc,
  album_info_time_size,
  audio_address,
  video_address,
  sort,
  album_id,
  is_need_pay,
  album_info_id,
});

/**
 * 删除小节 信息
 * @param {*} param0
 * @returns
 */
export const deleteChapterDetail = ({ album_info_id }) => request.post('/albumInfo/deleteAlbumInfo', {
  album_info_id,
});

/**
 * 添加优惠券 信息
 * @param {*} param0
 * @returns
 */
export const addCoupon = ({ album_id, coupon_price }) => request.post('/coupon/saveCoupon', {
  coupon_price,
  album_id,
});

/**
 * 编辑优惠券 信息
 * @param {*} param0
 * @returns
 */
export const editCoupon = ({ coupon_id, coupon_price }) => request.post('/coupon/editCoupon', {
  coupon_id,
  coupon_price,
});

/**
 * 删除优惠券 信息
 * @param {*} param0
 * @returns
 */
export const deleteCoupon = ({ coupon_id }) => request.post('/coupon/editCoupon', {
  coupon_id,
  is_delete: '1',
});
