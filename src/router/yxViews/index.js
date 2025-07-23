export default [
  {
    path: '/app/yxViews',
    name: '游戏',
    component: () => import('@/layout/yx/index'),
    children: [
      {
        path: 'main',
        name: 'main',
        component: () => import('@/views/yxViews/main'),
        meta: {
          index: '1',
          title: '',
          icon: 'el-icon-joymew-gift',
          parentIndex: '20',
        },
      },
    ],
  },
  {
    path: '/app/yxChouJiang',
    name: '幸运大转盘',
    component: () => import('@/layout/yx/index'),
    children: [
      {
        path: 'chouJiang',
        name: 'chouJiang',
        component: () => import('@/views/yxViews/createChouJiang/index'),
        meta: {
          index: '1',
          title: '幸运大转盘',
          parentIndex: '21',
        },
      },
    ],
  },
];
