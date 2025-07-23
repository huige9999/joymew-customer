This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where empty lines have been removed.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: package.json, src/router/activity/activityInfo.js
- Files matching these patterns are excluded: *.png, *.mp3, *.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/
  router/
    activity/
      activityInfo.js
package.json
```

# Files

## File: src/router/activity/activityInfo.js
```javascript
export default [
  {
    path: 'themeSetting',
    name: 'themeSetting',
    component: () => import('@/views/activityViews/activityInfo/themeSetting'),
    meta: {
      index: '1',
      title: '主题设置',
      icon: 'el-icon-joymew-shouye1',
      parentIndex: '1',
    },
  },
  {
    path: 'activityEdit',
    name: 'activityEdit',
    component: () => import('@/views/activityViews/activityInfo/activityEdit/index'),
    meta: {
      index: '2',
      title: '信息修改',
      icon: 'el-icon-joymew-bianji',
      parentIndex: '1',
    },
  },
  {
    path: 'companyLogo',
    name: 'companyLogo',
    component: () => import('@/views/activityViews/activityInfo/companyLogo'),
    meta: {
      index: '3',
      title: 'LOGO设置',
      icon: 'el-icon-joymew-shezhi',
      parentIndex: '1',
    },
  },
  {
    path: 'customWish',
    name: 'customWish',
    component: () => import('@/views/activityViews/activityInfo/customWish'),
    meta: {
      index: '4',
      title: '自定义签到语',
      icon: 'el-icon-joymew-zidingyi',
      parentIndex: '1',
    },
  },
  {
    path: 'getPhone',
    name: 'getPhone',
    component: () => import('@/views/activityViews/activityInfo/getPhone'),
    meta: {
      index: '5',
      title: '获取手机号',
      icon: 'el-icon-joymew-shoujihao',
      parentIndex: '1',
    },
  },
  {
    path: 'curtainCall',
    name: 'curtainCall',
    component: () => import('@/views/activityViews/activityInfo/curtainCall'),
    meta: {
      index: '6',
      title: '谢幕设置',
      icon: 'el-icon-joymew-cunchufangshijieshu',
      parentIndex: '1',
    },
  },
  {
    path: 'livePhoto',
    name: 'livePhoto',
    component: () => import('@/views/activityViews/activityInfo/livePhoto'),
    meta: {
      index: '7',
      title: '现场照片',
      icon: 'el-icon-joymew-zhaopian',
      parentIndex: '1',
    },
  },
  {
    path: 'qrcodeFixed',
    name: 'qrcodeFixed',
    component: () => import('@/views/activityViews/activityInfo/qrcodeFixed'),
    meta: {
      index: '8',
      title: '固定二维码',
      icon: 'el-icon-joymew-erweima',
      parentIndex: '1',
    },
  },
  {
    path: 'hbkdRecharge',
    name: 'hbkdRecharge',
    component: () => import('@/views/activityViews/activityInfo/hbkdRecharge'),
    meta: {
      index: '9',
      title: '红包口袋充值',
      icon: 'el-icon-joymew-wodehongbao',
      parentIndex: '1',
    },
  },
  {
    path: 'custom3DSign',
    name: 'custom3DSign',
    component: () => import('@/views/activityViews/activityInfo/custom3DSign'),
    meta: {
      index: '10',
      title: '自定义3D签到',
      icon: 'el-icon-joymew-qiandao',
      parentIndex: '1',
    },
  },
  {
    path: 'launchCeremony',
    name: 'launchCeremony',
    component: () => import('@/views/activityViews/activityInfo/launchCeremony'),
    meta: {
      index: '12',
      title: '启动仪式',
      icon: 'el-icon-joymew-4wed_arch',
      parentIndex: '1',
    },
  },
  {
    path: 'seat',
    name: 'seat',
    component: () => import('@/views/activityViews/activityInfo/seat'),
    meta: {
      index: '13',
      title: '席位表',
      icon: 'el-icon-joymew-24gl-table',
      parentIndex: '1',
    },
  },
  {
    path: 'songChoose',
    name: 'songChoose',
    component: () => import('@/views/activityViews/activityInfo/songChoose'),
    meta: {
      index: '14',
      title: '点歌设置',
      icon: 'el-icon-joymew-dianyingzhiye-gequbang',
    },
  },
  {
    path: 'locationLimit',
    name: 'locationLimit',
    component: () => import('@/views/activityViews/activityInfo/locationLimit'),
    meta: {
      index: '15',
      title: '地理位置限制',
      icon: 'el-icon-joymew-diliweizhi',
      parentIndex: '1',
    },
  },
  {
    path: 'messageVerify',
    name: 'messageVerify',
    component: () => import('@/views/activityViews/activityInfo/messageVerify'),
    meta: {
      index: '16',
      title: '消息审核',
      icon: 'el-icon-joymew-shenhe',
      parentIndex: '1',
    },
  },
  {
    path: 'customMenu',
    name: 'customMenu',
    component: () => import('@/views/activityViews/activityInfo/customMenu'),
    meta: {
      index: '16',
      title: '大屏菜单设置',
      icon: 'el-icon-joymew-caidan',
      parentIndex: '1',
    },
  },
  {
    path: 'signWhiteList',
    name: 'signWhiteList',
    component: () => import('@/views/activityViews/activityInfo/signWhiteList'),
    meta: {
      index: '17',
      title: '签到白名单',
      icon: 'el-icon-joymew-baimingdan',
      parentIndex: '1',
    },
  },
  {
    path: 'configLink',
    name: 'ConfigLink',
    component: () => import('@/views/appTempViews/configLink'),
    meta: {
      index: '18',
      title: '链接生成',
      icon: 'el-icon-joymew-caidan',
      parentIndex: '1',
    },
  },
];
```

## File: package.json
```json
{
  "name": "joymew-customer",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "lint": "vue-cli-service lint",
    "build:prod": "vue-cli-service build",
    "build:stage": "vue-cli-service build --mode staging",
    "build:stageonline": "vue-cli-service build --mode stageonline",
    "build:company": "vue-cli-service build --mode company",
    "dev": "vue-cli-service serve",
    "local": "vue-cli-service serve --mode local"
  },
  "dependencies": {
    "axios": "^0.20.0",
    "clipboard": "^2.0.6",
    "core-js": "^3.6.5",
    "countup.js": "^2.0.7",
    "dayjs": "^1.11.10",
    "element-ui": "^2.8.2",
    "lodash": "^4.17.21",
    "qiniu-js": "^3.4.0",
    "qs": "^6.9.4",
    "serve": "^11.3.2",
    "vue": "^2.6.11",
    "vue-baidu-map": "^0.21.22",
    "vue-clipboard2": "^0.3.1",
    "vue-core-video-player": "^0.2.0",
    "vue-cropper": "^0.3.6",
    "vue-router": "^3.4.8",
    "vue-smooth-dnd": "^0.8.1",
    "vuedraggable": "^2.24.3",
    "vuescroll": "^4.9.0-beta.11",
    "vuex": "^3.4.0",
    "vuex-persistedstate": "^4.0.0-beta.1"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "~4.5.0",
    "@vue/cli-plugin-eslint": "~4.5.0",
    "@vue/cli-plugin-router": "~4.5.0",
    "@vue/cli-plugin-vuex": "~4.5.0",
    "@vue/cli-service": "~4.5.0",
    "@vue/eslint-config-airbnb": "^5.0.2",
    "babel-eslint": "^10.1.0",
    "eslint": "^6.7.2",
    "eslint-plugin-import": "^2.20.2",
    "eslint-plugin-vue": "^6.2.2",
    "less": "^3.0.4",
    "less-loader": "^5.0.0",
    "node-sass": "^4.10.0",
    "sass-loader": "^7.0.3",
    "style-resources-loader": "^1.3.2",
    "vue-cli-plugin-style-resources-loader": "~0.1.4",
    "vue-template-compiler": "^2.6.11"
  }
}
```
