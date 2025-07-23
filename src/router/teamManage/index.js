export default [
  {
    path: '/teamManage',
    component: () => import('@/layout/teamManage/index'),
    children: [
      {
        path: 'teamIndex',
        name: 'TeamIndex',
        component: () => import('@/views/teamManageViews/teamIndex'),
        meta: {
          teamManageIndex: '1',
          title: '合作团队',
          icon: 'el-icon-joymew-shouye1',
        },
      },
      {
        path: 'teamProfit',
        name: 'TeamProfit',
        component: () => import('@/views/teamManageViews/teamProfit'),
        meta: {
          teamManageIndex: '2',
          title: '团队收益',
          icon: 'el-icon-joymew-bianji',
        },
      },
      {
        path: 'teamWithdraw',
        name: 'TeamWithdraw',
        component: () => import('@/views/teamManageViews/teamWithdraw'),
        meta: {
          teamManageIndex: '3',
          title: '收益提现',
          icon: 'el-icon-joymew-shezhi',
        },
      },
    ],
  },
];
