export default [
  {
    path: 'report',
    name: 'report',
    component: () => import('@/views/activityViews/activityIncome/report'),
    meta: {
      index: '1',
      title: '报表',
      icon: 'el-icon-joymew-baobiao',
      parentIndex: '4',
    },
  },
  {
    path: 'gift',
    name: 'gift',
    component: () => import('@/views/activityViews/activityIncome/gift'),
    meta: {
      index: '2',
      title: '礼物',
      icon: 'el-icon-joymew-liwu',
      parentIndex: '4',
    },
  },
  {
    path: 'chat',
    name: 'chat',
    component: () => import('@/views/activityViews/activityIncome/chat'),
    meta: {
      index: '3',
      title: '弹幕',
      icon: 'el-icon-joymew-danmu',
      parentIndex: '4',
    },
  },
  {
    path: 'allScreen',
    name: 'allScreen',
    component: () => import('@/views/activityViews/activityIncome/allScreen'),
    meta: {
      index: '4',
      title: '霸屏',
      icon: 'el-icon-joymew-VIP',
      parentIndex: '4',
    },
  },
  {
    path: 'photo',
    name: 'photo',
    component: () => import('@/views/activityViews/activityIncome/photo'),
    meta: {
      index: '5',
      title: '照片',
      icon: 'el-icon-joymew-zhaopian',
      parentIndex: '4',
    },
  },
  {
    path: 'superDanmu',
    name: 'superDanmu',
    component: () => import('@/views/activityViews/activityIncome/superDanmu'),
    meta: {
      index: '6',
      title: '全屏特效',
      icon: 'el-icon-joymew-mod-wizard',
      parentIndex: '4',
    },
  },
  {
    path: 'guessBox',
    name: 'guessBox',
    component: () => import('@/views/activityViews/activityIncome/guessBox'),
    meta: {
      index: '7',
      title: '猜宝箱',
      icon: 'el-icon-joymew-baoxiang',
      parentIndex: '4',
    },
  },
  {
    path: 'zyz',
    name: 'zyz',
    component: () => import('@/views/activityViews/activityIncome/zyz'),
    meta: {
      index: '8',
      title: '扭一扭',
      icon: 'el-icon-joymew-servicehuanqiubida',
      parentIndex: '4',
    },
  },
  {
    path: 'redpackageRain',
    name: 'redpackageRain',
    component: () => import('@/views/activityViews/activityIncome/redpackageRain'),
    meta: {
      index: '9',
      title: '红包口袋',
      icon: 'el-icon-joymew-wodehongbao',
      parentIndex: '4',
    },
  },
  {
    path: 'redWall',
    name: 'redWall',
    component: () => import('@/views/activityViews/activityIncome/redWall'),
    meta: {
      index: '10',
      title: '红包墙',
      icon: 'el-icon-joymew-qiang',
      parentIndex: '4',
    },
  },
  {
    path: 'orderSong',
    name: 'orderSong',
    component: () => import('@/views/activityViews/activityIncome/orderSong'),
    meta: {
      index: '11',
      title: '点歌',
      icon: 'el-icon-joymew-huatong-',
      parentIndex: '4',
    },
  },
  {
    path: 'scoreAdd',
    name: 'scoreAdd',
    component: () => import('@/views/activityViews/activityIncome/scoreAdd'),
    meta: {
      index: '12',
      title: '加分宝',
      icon: 'el-icon-joymew-jiafen',
      parentIndex: '4',
    },
  },
];
