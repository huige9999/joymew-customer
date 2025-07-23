<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card v-loading="isLoading">
        <card-top-info title="大屏菜单设置"></card-top-info>
        <div class="setting-form">
          <el-form :model="settingForm" label-width="100px">
            <el-form-item label="主菜单：">
              <el-checkbox-group v-model="settingForm.mainMenu">
                <el-checkbox
                  :label="mainMenu.label"
                  border
                  v-for="mainMenu in mainMenuOptions"
                  v-model="mainMenu.value"
                  :key="mainMenu.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="游戏菜单：">
              <el-checkbox-group v-model="settingForm.gameMenu">
                <el-checkbox
                  :label="gameMenu.label"
                  border
                  v-for="gameMenu in gameMenuOptions"
                  :value="gameMenu.value"
                  :key="gameMenu.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitSettingForm">保存</el-button>
              <el-button type="plain" @click="selectAll">全选</el-button>
              <el-button @click="cancelSubmit">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import request from '@/utils/request';

export default {
  name: 'customMenu',
  data() {
    return {
      xiemu: null,
      settingForm: {
        mainMenu: [],
        gameMenu: [],
      },
      mainMenuOptions: [
        {
          label: '3D签到',
          value: '0-01',
        },
        {
          label: '签到簿',
          value: '0-02',
        },
        {
          label: '手写签到',
          value: '0-03',
        },
        {
          label: '启动仪式',
          value: '0-04',
        },
        {
          label: '转一转',
          value: '1-01',
        },
        {
          label: '扭一扭',
          value: '1-02',
        },
        {
          label: '猜红包',
          value: '1-03',
        },
        {
          label: '争分夺秒',
          value: '1-04',
        },
        {
          label: '送祝福',
          value: '8-02',
        },
        {
          label: '幸运小转盘',
          value: '1-06',
        },
        {
          label: '摇红包',
          value: '2-01',
        },
        {
          label: '点红包',
          value: '2-02',
        },
        {
          label: '全民红包雨',
          value: '2-03',
        },
        {
          label: '2024新版红包雨',
          value: '2-04',
        },
        {
          label: '默认摇一摇',
          value: '3-01',
        },
        {
          label: '追新娘',
          value: '3-02',
        },
        {
          label: '谁最牛',
          value: '3-03',
        },
        {
          label: '都市赛车',
          value: '3-04',
        },
        {
          label: '疯狂游泳',
          value: '3-05',
        },
        {
          label: '猴子爬树',
          value: '3-06',
        },
        {
          label: '赛龙舟',
          value: '3-07',
        },
        {
          label: '抬花轿',
          value: '3-08',
        },
        {
          label: '滑雪大冒险',
          value: '3-09',
        },
        {
          label: '兔飞猛进',
          value: '3-10',
        },
        {
          label: '飞龙在天',
          value: '3-11',
        },
        {
          label: '福蛇贺岁',
          value: '3-12',
        },
        {
          label: '数钞票',
          value: '4-01',
        },
        {
          label: '切水果',
          value: '4-02',
        },
        {
          label: '数钞票（新）',
          value: '4-03',
        },
        {
          label: '狼吞虎咽',
          value: '4-04',
        },
        {
          label: '武松打虎',
          value: '4-05',
        },
        {
          label: '谁是射手王',
          value: '4-06',
        },
        {
          label: '兔子投篮',
          value: '4-07',
        },
        {
          label: '游龙戏珠',
          value: '4-08',
        },
        {
          label: '金蛇纳福',
          value: '4-09',
        },
        {
          label: '开宝箱',
          value: '5-01',
        },
        {
          label: '红包墙',
          value: '5-02',
        },
        {
          label: '高级开宝箱',
          value: '5-03',
        },
        {
          label: '3D抽奖',
          value: '6-01',
        },
        {
          label: '名单抽奖',
          value: '6-02',
        },
        {
          label: '巨幕抽奖',
          value: '6-03',
        },
        {
          label: '地球抽奖',
          value: '6-04',
        },
        {
          label: '图片抽奖',
          value: '6-05',
        },
        {
          label: '卡牌抽奖',
          value: '6-06',
        },
        {
          label: '转盘抽奖',
          value: '6-07',
        },
        {
          label: '名单抽奖(粒子)',
          value: '6-08',
        },
        {
          label: '播放视频',
          value: '15',
        },
        {
          label: '画面定格',
          value: '15-01',
        },
        {
          label: '谢幕',
          value: '14',
        },
        {
          label: '更换背景',
          value: '13',
        },
        {
          label: '喊红包',
          value: '2-05',
        },
        // 二维码和祝福榜菜单也可自定义
        // 此处代码待时机允许解开注释
        // 需要大屏相应位置的代码解开注释配合使用
        // {
        //   label: '二维码',
        //   value: '11'
        // },{
        //   label: '祝福榜',
        //   value: '8'
        // }
      ],
      gameMenuOptions: [
        {
          label: '神奇的汉字',
          value: '7-18',
        },
        {
          label: '开心问答',
          value: '7-19',
        },
        {
          label: '猜明星',
          value: '7-3',
        },
        {
          label: '开心猜成语',
          value: '7-1',
        },
        {
          label: '猜成语',
          value: '7-4',
        },
        {
          label: '投票',
          value: '7-2',
        },
        {
          label: '猜英雄',
          value: '7-6',
        },
        {
          label: '猜歌名',
          value: '7-7',
        },
        {
          label: '互动雀神大赛',
          value: '7-9',
        },
        {
          label: '雀神大赛',
          value: '7-20',
        },
        {
          label: '诗词答题',
          value: '7-10',
        },
        {
          label: '跳一跳',
          value: '7-11',
        },
        {
          label: '伴郎伴娘',
          value: '7-12',
        },
        {
          label: '对对碰',
          value: '7-13',
        },
        {
          label: '猜奥特曼',
          value: '7-14',
        },
        {
          label: '说颜色',
          value: '7-15',
        },
        {
          label: '猜电影',
          value: '7-16',
        },
        {
          label: '评分',
          value: '7-17',
        },
        {
          label: '搞笑猜明星',
          value: '7-0',
        },
        {
          label: '火眼金睛',
          value: '7-8',
        },
        {
          label: '驻场音乐',
          value: '7-21',
        },
        {
          label: '你划我猜',
          value: '7-22',
        },
        {
          label: '猜灯谜',
          value: '7-23',
        },
        {
          label: '台词模仿秀',
          value: '7-24',
        },
        {
          label: '看图识景',
          value: '7-25',
        },
        {
          label: '品牌达人',
          value: '7-26',
        },
      ],
      isLoading: false,
    };
  },
  computed: {
    mainMenuResult() {
      return this.convertChoosedArray(this.settingForm.mainMenu, this.mainMenuOptions);
    },
    gameMenuResult() {
      return this.convertChoosedArray(this.settingForm.gameMenu, this.gameMenuOptions);
    },
  },
  created() {
    this.initData();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  methods: {
    selectAll() {
      this.settingForm.mainMenu = this.mainMenuOptions.map((item) => item.label);
      this.settingForm.gameMenu = this.gameMenuOptions.map((item) => item.label);
    },
    initData() {
      request
        .get(`/qiYeNe/liebiao?splid=${this.$store.state.liveId}`)
        .then((res) => {
          console.log(res);
          if (!res.data.xiemu) {
            this.settingForm.degree = 'common';
            this.xiemu = {
              otherBusinessCustomMenuIds: 'common',
            };
            return;
          }
          const xiemuObj = JSON.parse(res.data.xiemu);
          this.xiemu = xiemuObj;
          if (this.xiemu.otherBusinessCustomMenuIds) {
            this.settingForm.mainMenu = this.getMainMenuByStr(this.xiemu.otherBusinessCustomMenuIds, 'mainMenu');
            this.settingForm.gameMenu = this.getMainMenuByStr(this.xiemu.otherBusinessCustomMenuIds, 'gameMenu');
          } else {
            this.settingForm.mainMenu = [];
            this.settingForm.gameMenu = [];
          }
        })
        .catch((err) => {
          console.log(err);
          // 兼容送祝福1-05->8-02的改变(临时代码 2024-04-01号可以删除)
          if (this.xiemu.otherBusinessCustomMenuIds.includes('1-05')) {
            this.xiemu.otherBusinessCustomMenuIds = this.xiemu.otherBusinessCustomMenuIds.replace('1-05', '8-02');
          }
          this.settingForm.mainMenu = this.getMainMenuByStr(this.xiemu.otherBusinessCustomMenuIds, 'mainMenu');
          this.settingForm.gameMenu = this.getMainMenuByStr(this.xiemu.otherBusinessCustomMenuIds, 'gameMenu');
        });
    },
    submitSettingForm() {
      console.log(this.mainMenuResult, this.gameMenuResult);
      const resultMenuList = this.mainMenuResult.concat(this.gameMenuResult);
      if (resultMenuList.length > 0) {
        this.xiemu.otherBusinessCustomMenuIds = resultMenuList.join(',');
      } else {
        this.xiemu.otherBusinessCustomMenuIds = '';
      }
      console.log(this.xiemu);
      this.isLoading = true;
      request
        .post('/qiYeNe/update', {
          xiemu: JSON.stringify(this.xiemu),
          splid: this.$store.state.liveId,
        })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        });
    },
    convertChoosedArray(choosedArray, sourceArray) {
      return choosedArray.map((item) => sourceArray.find((sourceItem) => sourceItem.label === item).value);
    },
    cancelSubmit() {
      console.log(this.mainMenuResult, this.gameMenuResult);
      this.settingForm.mainMenu.splice(0);
      this.settingForm.gameMenu.splice(0);
      this.xiemu.otherBusinessCustomMenuIds = '';
      console.log(this.xiemu);
      this.isLoading = true;
      request
        .post('/qiYeNe/update', {
          xiemu: JSON.stringify(this.xiemu),
          splid: this.$store.state.liveId,
        })
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        });
    },
    getMainMenuByStr(idStr, type) {
      // 7-xxx 为游戏菜单 其他为主菜单
      let resultMenu;
      const ids = idStr.split(',');
      if (type === 'mainMenu') {
        resultMenu = ids
          .filter((idItem) => !idItem.includes('7-'))
          .map((menuId) => this.mainMenuOptions.find((menuItem) => menuItem.value === menuId).label);
      } else {
        resultMenu = ids
          .filter((idItem) => idItem.includes('7-'))
          .map((menuId) => this.gameMenuOptions.find((menuItem) => menuItem.value === menuId).label);
      }
      return resultMenu;
    },
  },
};
</script>
<style lang="less" scoped></style>
