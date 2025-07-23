import request from '@/utils/request';

// 获取酒店信息
// export const getHotelInfo = () => request.get('/wedding/getWedding');
export const getHotelInfo = (params) => request.post('/wedding/newGetWedding', params);

// 获取酒店信息
export const getHotelList = () => request.get('/wedding/newGetWedding');

// 创建酒店
export const createHotel = (jsonStr) => request.post('/wedding/saveWedding', {
  json_data: jsonStr,
});

// 编辑酒店
export const editHotel = (weddingId, jsonStr) => request.post('/wedding/editWedding', {
  wedding_id: weddingId,
  json_data: jsonStr,
});

// 删除酒店
export const deleteHotel = (weddingId) => request.post('/wedding/editWedding', {
  wedding_id: weddingId,
  is_delete: 1,
});

// 获取宴会厅列表
export const getBanquetList = (weddingId) => request.get(
  `/weddingBanquet/getWeddingBanquetList?wedding_id=${weddingId}`,
);

// 获取单个宴会厅
export const getBanquetDetail = (banquetId) => request.get(
  `/weddingBanquet/getWeddingBanquet?wedding_banquet_id=${banquetId}`,
);

// 新增宴会厅
export const addBanquet = (weddingId, jsonStr) => request.post('/weddingBanquet/saveWeddingBanquet', {
  wedding_id: weddingId,
  json_data: jsonStr,
});

// 编辑宴会厅
export const editBanquet = (banquetId, jsonStr) => request.post('/weddingBanquet/editWeddingBanquet', {
  wedding_banquet_id: banquetId,
  json_data: jsonStr,
});

// 删除宴会厅
export const deleteBanquet = (banquetId) => request.post('/weddingBanquet/editWeddingBanquet', {
  wedding_banquet_id: banquetId,
  is_delete: 1,
});

// 获取菜单列表
export const getMenuList = (weddingId) => request.get(`/weddingMenu/getWeddingMenuList?wedding_id=${weddingId}`);

// 获取单个菜单
export const getMenuDetail = (menuId) => request.get(`/weddingMenu/getWeddingMenu?wedding_menu_id=${menuId}`);

// 新增菜单
export const addMenu = (weddingId, jsonStr) => request.post('/weddingMenu/saveWeddingMenu', {
  wedding_id: weddingId,
  json_data: jsonStr,
});

// 编辑菜单
export const editMenu = (menuId, jsonStr) => request.post('/weddingMenu/editWeddingMenu', {
  wedding_menu_id: menuId,
  json_data: jsonStr,
});

// 删除菜单
export const deleteMenu = (menuId) => request.post('/weddingMenu/editWeddingMenu', {
  wedding_menu_id: menuId,
  is_delete: 1,
});

// 获取套餐列表
export const getSetMealList = (weddingId) => request.get(
  `/weddingPackage/getWeddingPackageList?wedding_id=${weddingId}`,
);

// 获取单个套餐
export const getSetMealDetail = (setMealId) => request.get(
  `/weddingPackage/getWeddingPackage?wedding_package_id=${setMealId}`,
);

// 新增套餐
export const addSetMeal = (weddingId, jsonStr) => request.post('/weddingPackage/saveWeddingPackage', {
  wedding_id: weddingId,
  json_data: jsonStr,
});

// 编辑菜单
export const editSetMeal = (setMealId, jsonStr) => request.post('/weddingPackage/editWeddingPackage', {
  wedding_package_id: setMealId,
  json_data: jsonStr,
});

// 删除菜单
export const deleteSetMeal = (setMealId) => request.post('/weddingPackage/editWeddingPackage', {
  wedding_package_id: setMealId,
  is_delete: 1,
});

// 婚宴预定功能开关
export const switchFunc = (switchStatus, hotelId) => request.post('/wedding/editWeddingSwitch', {
  is_show_wedding: switchStatus,
  wedding_id: hotelId,
});

// 婚宴预定入口Logo
export const setIcon = (iconPath, hotelId) => request.post('/wedding/editWeddingIcon', {
  wedding_icon: iconPath,
  wedding_id: hotelId,
});

// 获取单个宴会厅
export const getActivityList = (banquetId) => request.get(
  `/weddingActivity/getWeddingActivityList?wedding_id=${banquetId}`,
);

// 新增宴会厅
export const addActivity = (weddingId, jsonStr) => request.post('/weddingActivity/saveWeddingActivity', {
  wedding_id: weddingId,
  title: '',
  img_json_data: jsonStr,
});

// 编辑宴会厅
export const editActivity = (activityId, jsonStr) => request.post('/weddingActivity/editWeddingActivity', {
  wedding_activity_id: activityId,
  title: '',
  img_json_data: jsonStr,
});

// 删除宴会厅
export const deleteActivity = (activityId) => request.post('/weddingActivity/editWeddingActivity', {
  wedding_activity_id: activityId,
  is_delete: 1,
});

/** 保存关于我们的数据
 * @param {json} 关于我们数据的json
 */
export const saveAboutUsData = (dataJson) => {
  return request.post('/hlt/saveHltInfo', {
    dataJson,
  });
};

/** 获取配置的关于我们数据 */
export const getAboutUs = () => {
  return request.post('/hlt/getHltDataInfo');
};
