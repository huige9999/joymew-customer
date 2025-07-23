export default [
  {
    path: '/partnerSystem/login',
    component: () => import('@/views/partnerViews/login'),
    hidden: false,
  },
  {
    path: '/partnerSystem',
    component: () => import('@/layout/partner/index'),
    children: [
      {
        path: 'partnerHome',
        name: 'PartnerHome',
        component: () => import('@/views/partnerViews/home.vue'),
        hidden: false,
        meta: {
          index: '1',
          icon: 'el-icon-joymew-home',
          title: '首页',
          noCache: false,
        },
      },
      {
        path: 'partnerHd',
        name: 'PartnerHd',
        component: () => import('@/views/partnerViews/hd/index.vue'),
        hidden: false,
        meta: {
          index: '2',
          icon: 'el-icon-joymew-screen',
          title: '互动',
          noCache: false,
        },
      },
      {
        path: 'partnerHdDetail',
        name: 'PartnerHdDetail',
        component: () => import('@/views/partnerViews/hd/detail.vue'),
        hidden: true,
        meta: {
          index: '4',
          title: '互动详情',
          noCache: false,
        },
      },
      {
        path: 'partnerService',
        name: 'PartnerService',
        hidden: false,
        component: () => import('@/views/partnerViews/service/index.vue'),
        meta: {
          index: '3',
          icon: 'el-icon-joymew-peizhiguanli',
          title: '数据',
          noCache: false,
        },
        children: [
          {
            path: 'partnerSettleRecord',
            name: 'PartnerSettleRecord',
            component: () => import('@/views/partnerViews/service/settleRecord.vue'),
            hidden: false,
            meta: {
              index: '3-1',
              title: '结算记录',
              noCache: false,
            },
          },
          {
            path: 'partnerPersonList',
            name: 'PartnerPersonList',
            component: () => import('@/views/partnerViews/service/personList.vue'),
            hidden: false,
            meta: {
              index: '3-2',
              title: '人员列表',
              noCache: false,
            },
          },
          {
            path: 'partnerFollowRecord',
            name: 'PartnerFollowRecord',
            component: () => import('@/views/partnerViews/service/followRecord.vue'),
            hidden: false,
            meta: {
              index: '3-3',
              title: '跟进记录',
              noCache: false,
            },
          },
          {
            path: 'partnerLoginRecord',
            name: 'PartnerLoginRecord',
            component: () => import('@/views/partnerViews/service/loginRecord.vue'),
            hidden: false,
            meta: {
              index: '3-4',
              title: '登录日志',
              noCache: false,
            },
          },
          {
            path: 'partnerSuggestion',
            name: 'PartnerSuggestion',
            component: () => import('@/views/partnerViews/service/suggestion.vue'),
            hidden: false,
            meta: {
              index: '3-5',
              title: '反馈记录',
              noCache: false,
            },
          },
        ],
      },
    ],
  },
];
