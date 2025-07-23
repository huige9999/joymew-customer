import { getConfigUrlOptions, inputLogin } from '@/api/setting/whiteList';
import appTempRoutes from '@/router/appTemp/index';
import { setToken } from '@/utils/request';

// 链接带参访问模式

/**
 * funcs取值example：
 *  1,2,3 对应某个页面
 *  1-1 对应页面某个功能
 *  0开头的表示layout页面的某个功能
 */

// 所需的参数
// liveId,token是url中传递 sceneType funcs是接口中获取
const PARMAS = ['token', 'liveId', 'sceneType', 'funcs'];

// 初始化
// 链接example：https://域名?token&liveId&funcs&mode=appTemp
export const init = () => {
  return new Promise((resolve, reject) => {
    // 1、读取url中的liveId、token并存入localStorage
    try {
      const tmpStr = window.location.href.split('appTemp?liveId=')[1];
      const liveId = tmpStr.split('&token=')[0];
      const token = tmpStr.split('&token=')[1];
      const setConfigInfo = (resolve, reject) => {
        // 2、请求接口获取token、sceneType,funcs并存入缓存
        getConfigUrlOptions({
          splid: liveId,
        })
          // eslint-disable-next-line consistent-return
          .then((res) => {
            console.log('配置数据:', res);
            const { isHasVal, data, token } = res.data;
            if (!isHasVal) {
              return Promise.reject(new Error('未配置活动信息'));
            }
            localStorage.setItem('token', token);
            setToken(token);
            const dataObj = JSON.parse(data);
            const { backFuncs: { sceneType, funcs } } = dataObj;
            localStorage.setItem('sceneType', sceneType);
            localStorage.setItem('funcs', funcs);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err);
            localStorage.clear();
            window.location.href = '/';
          });
      };
      localStorage.setItem('liveId', liveId);
      if (token) {
        setToken(null);
        // 请求新的token
        inputLogin({
          phone: '15799887766',
          password: '123456',
        })
          .then((loginRes) => {
            console.log('登录成功:', loginRes);
            setToken(loginRes.token);
            setConfigInfo(resolve, reject);
          })
          .catch((err) => {
            console.log(err);
            setConfigInfo(resolve, reject);
          });
      }
    } catch (err) {
      console.log(err);
      reject(err);
      localStorage.clear();
      window.location.href = '/';
    }
  });
};

// 清空appTemp模式下的缓存
export const clearStorageDataInAppTempMode = () => {
  PARMAS.forEach((paramKey) => {
    if (paramKey !== 'token') {
      localStorage.removeItem(paramKey);
    }
  });
};

// 根据funcs和路由数组计算出menus
export const getMenusByFuncsAndRoutes = () => {
  let funcs = localStorage.getItem('funcs');
  if (!funcs) {
    funcs = [];
  } else {
    funcs = funcs.split(',');
  }
  // 过滤出页面的索引数组
  funcs = funcs.filter((funcIndexStr) => !funcIndexStr.includes('-'));
  // 得到路由数组
  const routes = appTempRoutes[0].children;
  const menus = [];
  // 遍历路由数组
  // 1、设置路由权限 2、根据funcs得到menus
  routes.forEach((routeItem) => {
    if (funcs.includes(routeItem.meta.appTempIndex)) {
      routeItem.meta.hidden = false;
      menus.push(routeItem);
    }
  });
  return menus;
};
