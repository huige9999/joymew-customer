# 项目概述
  嗨喵悦动主持人后台网页，用于主持人创建活动、配置活动、配置个人信息等操作

# 开发
本项目推荐`nodejs`版本为`14.17.5`，其他版本可能出现无法正常部署的问题。

首次拉取到本地后，使用`npm install`命令安装npm包。
## 操作命令

### 项目构建
  `npm run build:prod`
### 项目运行
  `npm run dev`
### 项目语法检测修复
`npm run lint`

说明：代码语法严格接受eslint约束

## 环境变量配置
在`.env.development`、`.env.production`等文件中配置环境变量，开发环境中需要手动配置`VUE_APP_TOKEN`

## 常见问题
### 打开任何界面均自动跳转到根路由空白页面

原因可能为**token过期**，此时需要使用新的token进行替换。

打开[嗨喵悦动官网](www.hudongmiao.com)登录，然后在本地存储中拷贝获取的token，在`App.vue`文件中，找到如下代码，对setToken方法中的传递的token变量进行替换：
``` javascript
if (process.env.NODE_ENV === 'development') {
  console.log('development');
  setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHQiOjE2ODcxNjU5NDI2NDYsInVpZCI6ImU1ZjFlZThhYzBjMDQwMDI4ZWIzNTY0MmI5NjQyZDNmIiwiaWF0IjoxNjg1NDM3OTQyNjQ2fQ.jUVXTxI7oHCd-cMVL1XcmN53T53UZ44oC8ZyKQRj7d8');
  ...
}
```
然后访问/app/home路径，看到头像和昵称被替换成自己账号的，即为成功，不再会自动跳转。

# 项目访问
## 首页
http://localhost/#/app/home
## 活动设置
http://localhost/#/app/activity/activityInfo/themeSetting
## 登录
http://localhost/#/login


## 主界面 数据


### homeViews       //主界面

#### 嗨喵合伙人
```
├─ cityPartner         //嗨喵合伙人
│  ├─ components
│  │  ├─ monthlySettlement.vue // 月度结算
│  │  └─ subordinateList.vue  //下级列表
│  ├─ cityPartnerBranch.vue  //嗨喵合伙人   状态判断
│  ├─ CityPartnerIndex.vue      //嗨喵合伙人页面
│  └─ CityPartnerIntroduction.vue  //嗨喵合伙人介绍
```

#### 首页
```
├─ home // 首页
│  ├─ components
│  │  ├─ headerRightData.vue
│  │  └─ homeHeader.vue
│  └─ home.vue
```

#### 我的账号
```
├─ myAccount
│  ├─ activityProfit.vue
│  ├─ hbReward.vue
│  ├─ profitDetail.vue
│  ├─ profitWithdraw.vue
│  ├─ profitWithdraw_alipay.vue
│  ├─ profitWithdraw_weChat.vue
│  ├─ withDrawApply.vue
│  └─ withDrawRecord.vue
├─ myActivity
│  ├─ components
│  ├─ completeActivity.vue
│  ├─ create-step1.vue
│  ├─ create.vue
│  └─ currentActivity.vue
```

#### 个人中心
```
├─ userCenter
│  ├─ bindWeChatBranch.vue
│  ├─ bindWechat_bind.vue
│  ├─ bindWechat_unbind.vue
│  ├─ myInfoBranch.vue
│  ├─ myInfo_saved.vue
│  ├─ myInfo_unsaved.vue
│  └─ myInvite.vue       // 我的邀请& 邀请赚钱
└─ xifen
   └─ index.vue
```

### 设置页面


## 设置界面 数据
activity



el-popconfirm

@confirm  开发环境有效 线上无效
@onConfirm  线上
