import Vue from 'vue';
import VueRouter from 'vue-router';

import activity from '@/router/activity/index';
import appTemp from '@/router/appTemp/index';
import home from '@/router/home/index';
import partner from '@/router/partner/index';
import teamManage from '@/router/teamManage/index';
import yxViews from '@/router/yxViews/index';

// 暂存旧的replace方法
const oldVueRouterReplace = VueRouter.prototype.replace;
// 修改原型中的replace方法
VueRouter.prototype.replace = function replace(...args) {
  return oldVueRouterReplace.apply(this, args).catch((err) => err);
};

Vue.use(VueRouter);

const routes = [...home, ...activity, ...yxViews, ...partner, ...appTemp];

const router = new VueRouter({
  mode: 'hash',
  base: `${process.env.BASE_URL}`,
  routes,
});

export const handleRoutePermission = (userInfo) => {
  const { hhr_type } = userInfo;
  if (hhr_type === '3') {
    router.addRoutes(teamManage);
  }
};

export default router;
