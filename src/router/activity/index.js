import activityInfo from '@/router/activity/activityInfo';
import gameSetting from '@/router/activity/gameSetting';
import activityIncome from '@/router/activity/activityIncome';
import activityData from '@/router/activity/activityData';

export default
[
  {
    path: '/app/activity',
    name: 'activity',
    component: () => import('@/layout/activity/index'),
    children: [
      {
        path: 'activityInfo',
        // 这里的四个菜单对应的component均为外层框架，还需要进一步填充里面的内容，所以不能有name值作为跳转目标
        // name: 'activityInfo',
        component: () => import('@/views/activityViews/activityInfo/index'),
        meta: {
          index: '1',
          // 菜单标题
          title: '活动信息',
          icon: require('../../assets/image/icon/menu/gameInfo.png'),
          defaultSubpage: 'themeSetting',
        },
        children: activityInfo,
      },
      {
        path: 'gamesSetting',
        component: () => import('@/views/activityViews/gamesSetting/index'),
        meta: {
          index: '2',
          title: '游戏设置',
          icon: require('../../assets/image/icon/menu/gameSetting.png'),
          defaultSubpage: 'giftAllFree',
        },
        children: gameSetting,
      },
      {
        path: 'activityData',
        component: () => import('@/views/activityViews/activityData/index'),
        meta: {
          index: '3',
          title: '活动数据',
          icon: require('../../assets/image/icon/menu/gameData.png'),
          defaultSubpage: 'signIn',
        },
        children: activityData,
      },
      {
        path: 'activityIncome',
        component: () => import('@/views/activityViews/activityIncome/index'),
        meta: {
          index: '4',
          title: '活动收入',
          icon: require('../../assets/image/icon/menu/gameIncome.png'),
          defaultSubpage: 'report',
        },
        children: activityIncome,
      },
    ],
  },
];
