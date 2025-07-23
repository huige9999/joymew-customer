export default [
  {
    path: '/app',
    name: 'home',
    component: () => import('@/layout/home/index'),
    children: [
      // 首页
      {
        path: 'home',
        name: 'myHome',
        component: () => import('@/views/homeViews/home/home.vue'),
        meta: {
          index: '1',
          title: '首页',
          icon: 'el-icon-joymew-shouye',
        },
        children: [],
      },
      // 同庆楼/云境(高级)首页
      {
        path: 'homeTql',
        name: 'homeTql',
        component: () => import('@/views/homeViews/home/homeTql.vue'),
        meta: {
          index: '1.1',
          title: '首页',
          icon: 'el-icon-joymew-shouye',
        },
        children: [],
      },
      // 首页
      {
        path: 'cHome',
        name: 'myCompanyHome',
        component: () => import('@/views/homeViews/home/homeCompany.vue'),
        meta: {
          index: '1.2',
          title: '首页',
          icon: 'el-icon-joymew-shouye',
        },
        children: [],
      },
      // 首页-视频教程
      {
        path: 'teachVideo',
        name: 'teachVideo',
        component: () => import('@/views/homeViews/teachVideo/index.vue'),
        meta: {
          index: '1.3',
          title: '视频教程',
          icon: 'el-icon-joymew-shouye',
        },
        children: [],
      },
      // 我的互动
      {
        path: 'myActivity',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '2',
          title: '我的互动',
          icon: 'el-icon-joymew-shuju',
        },
        children: [
          {
            path: 'create',
            name: 'create',
            component: () => import('@/views/homeViews/myActivity/create/index.vue'),
            meta: {
              index: '2-1',
              title: '创建活动',
            },
          },
          {
            path: 'currentActivity',
            name: 'currentActivity',
            component: () => import('@/views/homeViews/myActivity/currentActivity/index.vue'),
            meta: {
              index: '2-2',
              title: '正在进行',
            },
          },
          {
            path: 'completeActivity',
            name: 'completeActivity',
            component: () => import('@/views/homeViews/myActivity/completeActivity/index.vue'),
            meta: {
              index: '2-3',
              title: '已经完成',
            },
          },
          {
            path: 'lowerLevelActivity',
            name: 'lowerLevelActivity',
            component: () => import('@/views/homeViews/myActivity/lowerLevelActivity/index.vue'),
            meta: {
              index: '2-4',
              title: '下级活动列表',
            },
          },
        ],
      },
      // 个人中心
      {
        path: 'userCenter',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '3',
          title: '个人中心',
          icon: 'el-icon-joymew-yonghu-xianxing',
        },
        children: [
          {
            path: 'inviteMakeM',
            name: 'inviteMakeM',
            component: () => import('@/views/homeViews/userCenter/inviteMakeM.vue'),
            meta: {
              index: '3-1',
              title: '我的邀请',
            },
          },
          {
            path: 'subIncomeCountDown',
            name: 'subIncomeCountDown',
            component: () => import('@/views/homeViews/cityPartner/subIncomeCountDown.vue'),
            meta: {
              index: '3-7',
              title: '邀请收益',
            },
          },
          {
            path: 'myInfo',
            name: 'myInfo',
            component: () => import('@/views/homeViews/userCenter/myInfo_unsaved.vue'),
            meta: {
              index: '3-2',
              title: '个人资料',
            },
          },
          {
            path: 'bindWechat',
            name: 'bindWechat',
            component: () => import('@/views/homeViews/userCenter/bindWeChatBranch.vue'),
            meta: {
              index: '3-3',
              title: '绑定微信/支付宝',
            },
          },
          {
            path: 'changingPasswords',
            name: 'changingPasswords',
            component: () => import('@/views/homeViews/userCenter/changingPasswords.vue'),
            meta: {
              index: '3-4',
              title: '修改密码',
            },
          },
          {
            path: 'register',
            name: 'register',
            component: () => import('@/views/homeViews/userCenter/register.vue'),
            meta: {
              index: '3-5',
              title: '下级注册',
            },
          },
          {
            path: 'userDegree',
            name: 'userDegree',
            component: () => import('@/views/homeViews/userCenter/userDegree.vue'),
            meta: {
              index: '3-6',
              title: '我的等级',
            },
          },
        ],
      },
      // 我的账户
      {
        path: 'myAccount',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '4',
          title: '我的账户',
          icon: 'el-icon-joymew-zhanghuxinxi',
        },
        children: [
          {
            path: 'profitDetail',
            name: 'profitDetail',
            component: () => import('@/views/homeViews/myAccount/profitDetail.vue'),
            meta: {
              index: '4-1',
              title: '收益明细',
            },
          },
          {
            path: 'appWithDraw',
            name: 'appWithDraw',
            component: () => import('@/views/homeViews/myAccount/appWithDraw/appWithDraw.vue'),
            meta: {
              index: '4-2',
              title: '提现',
            },
          },
          {
            path: 'profitWithdraw-weChat',
            name: 'profitWithdraw-weChat',
            component: () => import('@/views/homeViews/myAccount/profitWithdraw_weChat.vue'),
            meta: {
              index: '4-3',
              title: '提现记录',
            },
          },
          {
            path: 'dataChart',
            name: '数据报表',
            component: () => import('@/views/homeViews/myAccount/dataChart.vue'),
            meta: {
              index: '4-4',
              title: '数据报表',
            },
          },
        ],
      },
      // 营销获客
      {
        path: 'yxhk',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '5',
          title: '营销获客',
          icon: 'el-icon-joymew-xiaolian',
        },
        children: [
          {
            path: 'xifen',
            name: 'xifen',
            component: () => import('@/views/homeViews/xifen/index.vue'),
            meta: {
              index: '5-1',
              title: '绑定公众号',
            },
          },
          {
            path: 'adset',
            name: 'adset',
            component: () => import('@/views/homeViews/adset/index.vue'),
            meta: {
              index: '5-2',
              title: '上传广告位',
            },
          },
        ],
      },
      // 嗨喵合伙人
      {
        path: 'cityPartner',
        name: 'cityPartner',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '6',
          title: '嗨喵合伙人',
          icon: 'el-icon-joymew-yonghuguanli_huaban',
        },
        children: [
          {
            path: 'subPerson',
            name: 'subPerson',
            component: () => import('@/views/homeViews/cityPartner/subPerson.vue'),
            meta: {
              index: '6-1',
              title: '人员列表',
            },
          },
          {
            path: 'incomeCountDown',
            name: 'incomeCountDown',
            component: () => import('@/views/homeViews/cityPartner/incomeCountDown.vue'),
            meta: {
              index: '6-2',
              title: '结算详情',
            },
          },
          {
            path: 'areaProxy',
            name: 'areaProxy',
            component: () => import('@/views/homeViews/cityPartner/areaProxy.vue'),
            meta: {
              index: '6-3',
              title: '区域代理',
            },
          },
        ],
      },
      // 嗨喵合伙人(非合伙人)
      {
        path: 'cityPartner',
        name: 'cityPartnerBranch',
        component: () => import('@/views/homeViews/cityPartner/cityPartnerBranch.vue'),
        meta: {
          index: '6.1',
          title: '嗨喵合伙人',
          icon: 'el-icon-joymew-yonghuguanli_huaban',
        },
        children: [],
      },
      // 邀请赚钱
      {
        path: 'myInvite',
        name: 'myInvite',
        component: () => import('@/views/homeViews/userCenter/myInvite.vue'),
        meta: {
          index: '7',
          title: '邀请赚钱',
          icon: 'el-icon-joymew-hezuo',
        },
        children: [],
      },
      // 我的红包
      {
        path: 'myRedPackage',
        name: 'myRedPackage',
        component: () => import('@/views/homeViews/myRedPackage/index.vue'),
        meta: {
          index: '8',
          title: '我的红包',
          icon: 'el-icon-joymew-hongbao',
        },
        children: [],
      },
      // 知识付费
      {
        path: 'hmCourse',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '9',
          title: '知识付费',
          icon: 'el-icon-joymew-shuji',
        },
        children: [
          {
            path: 'coureManage',
            name: 'coureManage',
            component: () => import('@/views/homeViews/hmCourse/coureManage.vue'),
            meta: {
              index: '9-1',
              title: '课程管理',
            },
          },
          {
            path: 'usrOrder',
            name: 'usrOrder',
            component: () => import('@/views/homeViews/hmCourse/usrOrder.vue'),
            meta: {
              index: '9-2',
              title: '成交订单',
            },
          },
          {
            path: 'addCourse',
            name: 'addCourse',
            component: () => import('@/views/homeViews/hmCourse/addCourse.vue'),
            meta: {
              index: '9-3',
              title: '课程编辑',
              notMenu: true,
            },
          },
          {
            path: 'upVideoList',
            name: 'upVideoList',
            component: () => import('@/views/homeViews/hmCourse/upVideoList.vue'),
            meta: {
              index: '9-4',
              title: '小节列表',
              notMenu: true,
            },
          },
          {
            path: 'addVideo',
            name: 'addVideo',
            component: () => import('@/views/homeViews/hmCourse/addVideo.vue'),
            meta: {
              index: '9-5',
              title: '添加小节',
              notMenu: true,
            },
          },
        ],
      },
      // 婚宴预定
      {
        path: 'hotelReserve',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '10',
          title: '婚宴预定',
          icon: 'el-icon-joymew-zhangdan',
        },
        children: [
          {
            path: 'allHotel',
            name: 'allHotel',
            component: () => import('@/views/homeViews/hotelReserve/allHotel.vue'),
            meta: {
              index: '10-1',
              title: '酒店信息',
            },
          },
          {
            path: 'editHotel',
            name: 'editHotel',
            component: () => import('@/views/homeViews/hotelReserve/hotelEdit.vue'),
            meta: {
              index: '10-2',
              title: '酒店编辑',
              notMenu: true,
            },
          },
        ],
      },
      // 互动模板配置
      {
        path: 'templateConfig',
        name: 'templateConfig',
        component: () => import('@/views/homeViews/templateConfig/index.vue'),
        meta: {
          index: '11',
          title: '互动配置模板',
          icon: 'el-icon-joymew-moban',
        },
        children: [],
      },
      // 营销活动
      {
        path: 'yx',
        name: 'yx',
        component: () => import('@/views/homeViews/yx/index'),
        redirect: 'yx/createActivity',
        meta: {
          index: '12',
          title: '营销活动',
          icon: 'el-icon-joymew-flag',
        },
        children: [
          {
            path: 'createActivity',
            name: 'createActivity',
            component: () => import('@/views/homeViews/yx/createActivity/index'),
            meta: {
              index: '12-2',
              title: '创建活动',
            },
            children: [],
          },
          {
            path: 'myActivities',
            name: 'myActivities',
            component: () => import('@/views/homeViews/yx/myActivity/index'),
            meta: {
              index: '12-3',
              title: '我的活动',
            },
            children: [],
          },
        ],
      },
      {
        path: 'yxrank',
        name: 'yxrank',
        component: () => import('@/views/homeViews/yx/rank/rank.vue'),
        meta: {
          index: '12-1',
          title: '数据',
        },
        children: [],
      },
      {
        path: 'chouJiangData',
        name: 'chouJiangData',
        component: () => import('@/views/homeViews/yx/rank/chouJiangData.vue'),
        meta: {
          index: '12-4',
          title: '中奖名单',
        },
        children: [],
      },
      {
        path: 'daodian',
        name: 'daodian',
        component: () => import('@/views/yxViews/createDaodian/createDaodian'),
        meta: {
          index: '12-5',
          title: '到店礼',
        },
        children: [],
      },
      {
        path: 'daodianData',
        name: 'daodianData',
        component: () => import('@/views/homeViews/yx/rank/daodianData.vue'),
        meta: {
          index: '12-6',
          title: '到店礼数据',
        },
        children: [],
      },
      // 婚礼堂
      {
        path: 'yjDz',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '13',
          title: '婚礼堂',
          icon: 'el-icon-joymew-b-',
        },
        children: [
          {
            path: 'giftPriceCustom',
            name: 'giftPriceCustom',
            component: () => import('@/views/homeViews/yjDz/giftPriceCustom.vue'),
            meta: {
              index: '13-1',
              title: '礼物价格自定义',
              show: { high_privilege: [5] },
            },
          },
          {
            path: 'advertCustom',
            name: 'advertCustom',
            component: () => import('@/views/homeViews/yjDz/advertCustom.vue'),
            meta: {
              index: '13-2',
              title: '开屏广告自定义',
              show: { high_privilege: [5] },
            },
          },
          {
            path: 'getPhoneNumber',
            name: 'getPhoneNumber',
            component: () => import('@/views/homeViews/yjDz/getPhoneNumber.vue'),
            meta: {
              index: '13-3',
              title: '手机号获取服务',
              show: { high_privilege: [3, 4, 5] },
            },
          },
        ],
      },
      // 团队管理 menuIndex: 14

      // 首页-视频教程
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/index.vue'),
        meta: {
          index: '15',
          title: '视频教程',
          icon: 'el-icon-joymew-dianmingdan',
        },
        children: [
          {
            path: 'reward',
            name: 'reward',
            component: () => import('@/views/homeViews/videoReward/index.vue'),
            meta: {
              index: '15-1',
              title: '福利教程',
            },
          },

          {
            path: 'all',
            name: 'all',
            component: () => import('@/views/homeViews/teachVideo/index.vue'),
            meta: {
              index: '15-2',
              title: '全部教程',
              icon: 'el-icon-joymew-shouye',
            },
            children: [],
          },
        ],
      },
    ],
  },
];
