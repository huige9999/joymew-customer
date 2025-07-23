import router from '@/router/index';
import { cloneDeep } from 'lodash';
import store from '../index';

// 从router中深度赋值一份菜单出来
function deepCopyMenus(menus) {
  function createSingleObj(item) {
    const tmpObj = {
      path: item.path,
      name: item.name,
      component: item.component,
      // XXX 这里之所以只深拷贝meta，是因为其他是原来写的，不确定会不会有问题，而meta中的数据都是非函数类型的数据，所以可以深拷贝
      meta: cloneDeep(item.meta),
      children: [],
    };
    return tmpObj;
  }
  const targetMenus = [];
  menus.forEach((item, index) => {
    targetMenus.push(createSingleObj(item));
    item.children.forEach((subItem) => {
      if (!subItem.meta.notMenu) {
        const targetChildren = targetMenus[index].children;
        targetChildren.push(createSingleObj(subItem));
      }
    });
  });
  return targetMenus;
}

function removeMenu(arr, index) {
  if (index > -1) {
    arr.splice(index, 1);
  }
}

// 知识付费(isCanUploadKp)
function handleKnowledgePay(arr, isCanUploadKp) {
  if (isCanUploadKp === '1') {
    return;
  }
  const targetIndex = arr.findIndex((item) => item.meta.index === '9');
  removeMenu(arr, targetIndex);
}

// 合伙人、区域代理(hhr_type, daili_switch)
function handlePartner(arr, hhr_type, daili_switch) {
  const targetIndex = arr.findIndex((item) => item.meta.index === '6');
  const targetSubIndex = arr[targetIndex].children.findIndex((item) => item.meta.index === '6-3');
  const targetUnpartnerIndex = arr.findIndex((item) => item.meta.index === '6.1');

  if (hhr_type === '0' || hhr_type === '3') {
    // 普通用户
    removeMenu(arr, targetIndex);
  } else if (hhr_type === '1' || hhr_type === '2') {
    // 合伙人
    removeMenu(arr, targetUnpartnerIndex);
  }
  if (hhr_type === '3') {
    // 拥有团队管理权限
    arr.push({
      name: 'TeamIndex',
      path: '/teamManage/teamIndex',
      meta: {
        icon: 'el-icon-joymew-yonghuguanli_huaban',
        index: '14',
        title: '团队管理',
      },
      component: null,
      children: [],
    });
  }
  if (daili_switch === '0' && targetSubIndex > -1) {
    removeMenu(arr[targetIndex].children, targetSubIndex);
  }
}

// 个人中心的下级注册(is_can_create_user)
function handleSubregister(arr, is_can_create_user) {
  if (is_can_create_user === '1') {
    return;
  }
  const targetIndex = arr.findIndex((item) => item.meta.index === '3');
  const subArr = arr[targetIndex].children;
  const targetSubIndex = subArr.findIndex((item) => item.meta.index === '3-5');
  removeMenu(subArr, targetSubIndex);
}

// 定制版首页(is_can_create_user)
function handleCustomhome(arr, is_can_create_user) {
  if (is_can_create_user === '0') {
    const targetIndex = arr.findIndex((item) => item.meta.index === '1.1');
    removeMenu(arr, targetIndex);
  } else if (is_can_create_user === '1') {
    const targetIndex = arr.findIndex((item) => item.meta.index === '1');
    removeMenu(arr, targetIndex);
  }
  // 游客模式首页
  const targetYkIndex = arr.findIndex((item) => item.meta.index === '1.2');
  removeMenu(arr, targetYkIndex);

  // 教程首页
  const targetTeachVideoIndex = arr.findIndex((item) => item.meta.index === '1.3');
  removeMenu(arr, targetTeachVideoIndex);

  // // 奖励首页
  // const targetRewardVideoIndex = arr.findIndex((item) => item.meta.index === '1.4');
  // removeMenu(arr, targetRewardVideoIndex);
}

// 婚宴预定(wedding_switch)
function handleWeddingReserve(arr, wedding_switch) {
  if (wedding_switch === '1') {
    return;
  }
  const targetIndex = arr.findIndex((item) => item.meta.index === '10');
  removeMenu(arr, targetIndex);
}

// 同庆楼/云境(high_privilege)
function handleHighPrivilege(arr, high_privilege, is_can_create_user) {
  const isTql = high_privilege === 3 || high_privilege === 4;
  const isYj = high_privilege === 5;
  if (!((isTql || isYj) && is_can_create_user === '1')) {
    // 非同庆楼/云境高级账号
    const targetIndex = arr.findIndex((item) => item.meta.index === '2');
    const subArr = arr[targetIndex].children;
    const targetSubIndex = subArr.findIndex((item) => item.meta.index === '2-4');
    removeMenu(subArr, targetSubIndex);
  }

  if (isTql || isYj) {
    // 同庆楼/云境共有
    const partnerIndex = arr.findIndex((item) => item.meta.index === '6');
    removeMenu(arr, partnerIndex);
    const hhrIndex = arr.findIndex((item) => item.meta.index === '6.1');
    removeMenu(arr, hhrIndex);
    const inviteIndex = arr.findIndex((item) => item.meta.index === '7');
    removeMenu(arr, inviteIndex);
    const myHbIndex = arr.findIndex((item) => item.meta.index === '8');
    removeMenu(arr, myHbIndex);
    const userCenterIndex = arr.findIndex((item) => item.meta.index === '3');
    const inviteBenifitIndex = arr[userCenterIndex].children.findIndex((item) => item.meta.index === '3-7');
    removeMenu(arr[userCenterIndex].children, inviteBenifitIndex);
    const accountIndex = arr.findIndex((item) => item.meta.index === '4');
    const withdrawIndex = arr[accountIndex].children.findIndex((item) => item.meta.index === '4-2');
    removeMenu(arr[accountIndex].children, withdrawIndex);
  }

  // 针对meta.index为13的菜单，根据meta.show来判断是否保留
  const index13Menu = arr.find((item) => item.meta.index === '13');
  if (!index13Menu) return;
  index13Menu.children = index13Menu.children.filter((item) => item.meta.show.high_privilege.includes(high_privilege));
  if (index13Menu.children.length === 0) {
    removeMenu(
      arr,
      arr.findIndex((item) => item.meta.index === '13'),
    );
  }
}

// 高级模式隐藏菜单
function hideMenuHighLevel(arr) {
  const targeLen = arr.length - 1;
  arr.splice(1, targeLen);
}

// 判断营销活动数据页面的路由
function removeYx(arr) {
  const ignores = ['12-1', '12-4', '12-5', '12-6'];
  let count = 0;
  arr.forEach((item) => {
    if (ignores.some((idx) => idx === item.meta.index)) {
      count += 1;
    }
  });
  if (count === 0) return;
  for (let i = 0; i < count; i++) {
    const targetIndex = arr.findIndex((item) => ignores.some((idx) => idx === item.meta.index));
    removeMenu(arr, targetIndex);
  }
}

// 新用户菜单隐藏
function handleNewUser(arr, is_hide_tx) {
  if (!is_hide_tx) {
    return;
  }
  const yxhkIndex = arr.findIndex((item) => item.meta.index === '5');
  removeMenu(arr, yxhkIndex);
  const cityPartnerIndex = arr.findIndex((item) => item.meta.index === '6');
  removeMenu(arr, cityPartnerIndex);
  const cityPartnerIndex2 = arr.findIndex((item) => item.meta.index === '6.1');
  removeMenu(arr, cityPartnerIndex2);
  const myRedPackageIndex = arr.findIndex((item) => item.meta.index === '8');
  removeMenu(arr, myRedPackageIndex);
  const hmCourseIndex = arr.findIndex((item) => item.meta.index === '9');
  removeMenu(arr, hmCourseIndex);
  const hotelReserveIndex = arr.findIndex((item) => item.meta.index === '10');
  removeMenu(arr, hotelReserveIndex);
  const templateConfigIndex = arr.findIndex((item) => item.meta.index === '11');
  removeMenu(arr, templateConfigIndex);
  const yx = arr.findIndex((item) => item.meta.index === '12');
  removeMenu(arr, yx);
  const hltIndex = arr.findIndex((item) => item.meta.index === '13');
  removeMenu(arr, hltIndex);
}

const state = {
  homeMenus: [],
  isInHMenuHidden: false, // 是否处于高级模式菜单隐藏状态
  /**
   * @date 2024-11-13
   * 当前激活的菜单id，改成store管理，方便在各个组件中修改当前激活的菜单
   */
  activeMenuIndex: '0',
};

const handleCompanyMenu = (state) => {
  console.log('初始化年会版本');
  const menusSource = router.options.routes[0].children;
  const targetMenus = deepCopyMenus(menusSource);
  const keepMenus = ['cHome', 'myActivity', 'yxhk'];
  const subMenus = {
    home: [],
    // myActivity: ['create', 'currentActivity', 'completeActivity'],
    myActivity: ['create'],
    yxhk: ['xifen', 'adset'],
  };

  state.homeMenus = targetMenus.filter((item) => {
    const flag = keepMenus.includes(item.path);
    if (flag && item.children) {
      const targetSubMenus = subMenus[item.path];
      item.children = item.children.filter((sub) => {
        return targetSubMenus.includes(sub.path);
      });
    }
    return flag;
  });
};

const mutations = {
  initHomeMenus(state) {
    console.log('初始化homeMenus');
    console.log(router.options.routes[0].children);
    const { isCanUploadKp, wedding_switch, hhr_type, is_can_create_user, high_privilege } = store.state.login.userInfo;
    const { daili_switch, user_end_type, is_hide_tx } = store.state.login.userInfo.config;
    if (user_end_type === '1') {
      handleCompanyMenu(state);
      return;
    }
    console.log('xxxxxx相关参数xxxxxxxxx');
    console.log('知识付费:', isCanUploadKp);
    console.log('婚宴预定:', wedding_switch);
    console.log('合伙人:', hhr_type);
    console.log('子菜单区域代理:', daili_switch);
    console.log('个人中心的下级注册/定制版首页/同庆楼云境高级:', is_can_create_user);
    console.log('同庆楼云境:', high_privilege);
    // 第一次遍历home路由， 深度赋值一份(排除meta.notMenu)给homeMenus
    const menusSource = router.options.routes[0].children;
    state.homeMenus = deepCopyMenus(menusSource);
    handleKnowledgePay(state.homeMenus, isCanUploadKp);
    handlePartner(state.homeMenus, hhr_type, daili_switch);
    handleSubregister(state.homeMenus, is_can_create_user);
    handleCustomhome(state.homeMenus, is_can_create_user);
    handleWeddingReserve(state.homeMenus, wedding_switch);
    handleHighPrivilege(state.homeMenus, high_privilege, is_can_create_user);
    removeYx(state.homeMenus);
    handleNewUser(state.homeMenus, is_hide_tx);
    console.log('xxxxxxxx处理后的menusxxxxxxxx');
    console.log(state.homeMenus);
  },
  // 高级模式展示菜单
  showMenuHighLevel(state) {
    state.homeMenus.splice(0);
    const { isCanUploadKp, wedding_switch, hhr_type, is_can_create_user, high_privilege } = store.state.login.userInfo;
    const { daili_switch, is_hide_tx } = store.state.login.userInfo.config;
    const menusSource = router.options.routes[0].children;
    state.homeMenus = deepCopyMenus(menusSource);
    handleKnowledgePay(state.homeMenus, isCanUploadKp);

    handlePartner(state.homeMenus, hhr_type, daili_switch);
    handleSubregister(state.homeMenus, is_can_create_user);
    handleCustomhome(state.homeMenus, is_can_create_user);
    handleWeddingReserve(state.homeMenus, wedding_switch);
    handleHighPrivilege(state.homeMenus, high_privilege, is_can_create_user);
    removeYx(state.homeMenus);
    handleNewUser(state.homeMenus, is_hide_tx);
    state.isInHMenuHidden = false;
    console.log('高级模式展示菜单', state.homeMenus);
  },
  // 高级模式隐藏菜单
  hideMenuHighLevel(state) {
    state.homeMenus.splice(0);
    const menusSource = router.options.routes[0].children;
    state.homeMenus = deepCopyMenus(menusSource);
    hideMenuHighLevel(state.homeMenus);
    state.isInHMenuHidden = true;
  },

  deleteTeachMenu(state) {
    const targetIndex = state.homeMenus.findIndex((item) => item.meta.index === '15');
    removeMenu(state.homeMenus, targetIndex);
  },
  setActiveMenu(state, id) {
    state.activeMenuIndex = id;
    // alert(`id${id}`);
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
