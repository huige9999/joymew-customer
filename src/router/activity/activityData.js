export default [
  {
    path: 'signIn',
    name: 'signIn',
    component: () => import('@/views/activityViews/activityData/signIn'),
    meta: {
      index: '1',
      title: '签到嘉宾',
      keepAlive: true,
      icon: 'el-icon-joymew-yonghuguanli_huaban',
      parentIndex: '3',
    },
  },
  {
    path: 'winningRecord',
    name: 'winningRecord',
    component: () => import('@/views/activityViews/activityData/winningRecord'),
    meta: {
      index: '2',
      title: '中奖记录',
      keepAlive: true,
      icon: 'el-icon-joymew-jilu',
      parentIndex: '3',
    },
  },
];
