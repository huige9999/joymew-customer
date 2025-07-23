<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card v-loading="isLoading">
        <card-top-info title="链接生成"></card-top-info>
        <div class="setting-form">
          <el-form
            :model="settingForm"
            label-width="150px"
          >
            <el-form-item label="后台功能模块：">
              <el-checkbox-group v-model="settingForm.backMenu">
                <el-checkbox
                  :label="backMenu.label"
                  border
                  v-for="backMenu in backMenuOptions"
                  :value="backMenu.value"
                  :key="backMenu.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="遥控器功能模块：">
              <el-checkbox-group v-model="settingForm.controlMenu">
                <el-checkbox
                  :label="controlMenu.label"
                  border
                  v-for="controlMenu in controlMenuOptions"
                  :value="controlMenu.value"
                  :key="controlMenu.value"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="有效期：">
              <el-input-number
                v-model="settingForm.expire"
                controls-position="right"
                :min="0"
                :max="30"
                :step="1"
                :precision="0"
              ></el-input-number>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitSettingForm"
              >
                生成链接
              </el-button>
              <el-button
                type="plain"
                @click="selectAll"
              >
                全选
              </el-button>
              <el-button @click="cancelSubmit">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="setting-form">
          <el-form label-width="150px">
            <el-form-item label="大屏链接：">
              <div
                class="link"
                @click.capture="copyLink(screenUrl)"
              >
                {{ screenUrl }}
              </div>
            </el-form-item>
            <el-form-item label="后台链接：">
              <div
                class="link"
                @click.capture="copyLink(backUrl)"
              >
                {{ backUrl }}
              </div>
            </el-form-item>
            <el-form-item label="遥控器链接：">
              <div
                class="link"
                @click.capture="copyLink(controlUrl)"
              >
                {{ controlUrl }}
              </div>
            </el-form-item>
          </el-form>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { getConfigUrlOptions, setConfigUrlOptions } from '@/api/setting/whiteList';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import appTempRoute from '@/router/appTemp/index';

const controlMode = [
  {
    value: '3DSignIn',
    label: '3D签到',
  },
  {
    value: 'signBook',
    label: '签到簿',
  },
  {
    value: 'handwrittenSignIn',
    label: '手写签到',
  },
  {
    value: 'startRite',
    label: '启动仪式',
  },
  {
    value: 'spinItUp',
    label: '转一转',
  },
  {
    value: 'twistItUp',
    label: '扭一扭',
  },
  {
    value: 'guessRedPacket',
    label: '猜红包',
  },
  {
    value: 'raceAgainstTime',
    label: '争分夺秒',
  },
  {
    value: 'sendBlessing',
    label: '送祝福',
  },
  {
    value: 'luckyWheel',
    label: '幸运小转盘',
  },
  {
    value: 'tapRedPacket',
    label: '点红包',
  },
  {
    value: 'shakeRedPacket',
    label: '摇红包',
  },
  {
    value: 'peopleRedPacketRain',
    label: '全民红包雨',
  },
  {
    value: 'defaultShake',
    label: '默认摇一摇',
  },
  {
    value: 'monkeyClimbing',
    label: '猴子爬树',
  },
  {
    value: 'crazySwimming',
    label: '疯狂游泳',
  },
  {
    value: 'urbanRacing',
    label: '都市赛车',
  },
  {
    value: 'whoIsTheBest',
    label: '谁最牛',
  },
  {
    value: 'chasingTheBride',
    label: '追新娘',
  },
  {
    value: 'weddingCarShake',
    label: '婚车摇一摇',
  },
  {
    value: 'dragonBoatRace',
    label: '赛龙舟',
  },
  {
    value: 'liftThePalanquin',
    label: '抬花轿',
  },
  {
    value: 'tigerYearSkiing',
    label: '虎年滑雪',
  },
  {
    value: 'rabbitFlying',
    label: '兔飞猛进',
  },
  {
    value: 'dragonInTheSky',
    label: '飞龙在天',
  },
  {
    value: 'cutFruit',
    label: '切水果',
  },
  {
    value: 'countingMoney',
    label: '数钞票',
  },
  {
    value: 'countingMoneyNew',
    label: '数钞票(新)',
  },
  {
    value: 'pigout',
    label: '狼吞虎咽',
  },
  {
    value: 'clickTiger',
    label: '武松打虎',
  },
  {
    value: 'playFootball',
    label: '谁是射手王',
  },
  {
    value: 'basketballShoot',
    label: '兔子投篮',
  },
  {
    value: 'dragonPlayBead',
    label: '游龙戏珠',
  },
  {
    value: 'redPacketWall',
    label: '红包墙',
  },
  {
    value: 'openTreasureBox',
    label: '开宝箱',
  },
  {
    value: 'threeDLotteryEnterprise',
    label: '3D抽奖',
  },
  {
    value: 'listLottery',
    label: '名单抽奖',
  },
  {
    value: 'listLotteryParticle',
    label: '新名单抽奖',
  },
  {
    value: 'bigScreenLottery',
    label: '巨幕抽奖',
  },
  {
    value: 'earthLottery',
    label: '地球抽奖',
  },
  {
    value: 'pictureLottery',
    label: '图片抽奖',
  },
  {
    value: 'cardDraw',
    label: '卡牌抽奖',
  },
  {
    value: 'wheelLottery',
    label: '转盘抽奖',
  },
  {
    value: 'guessStar',
    label: '搞笑猜明星',
  },
  {
    value: 'guessStarCommon',
    label: '猜明星',
  },
  {
    value: 'guessIdiom',
    label: '开心猜成语',
  },
  {
    value: 'guessIdiomCommon',
    label: '猜成语',
  },
  {
    value: 'vote',
    label: '投票',
  },
  {
    value: 'guessHero',
    label: '猜英雄',
  },
  {
    value: 'guessSong',
    label: '猜歌名',
  },
  {
    value: 'guessStarBySteps',
    label: '火眼金睛',
  },
  {
    value: 'mahjong',
    label: '互动雀神大赛',
  },
  {
    value: 'mahjongV1',
    label: '雀神大赛',
  },
  {
    value: 'poem',
    label: '诗词答题',
  },
  {
    value: 'jumpBone',
    label: '跳一跳',
  },
  {
    value: 'giveMark',
    label: '评分',
  },
  {
    value: 'aoteman',
    label: '猜奥特曼',
  },
  {
    value: 'guessTextColor',
    label: '说颜色',
  },
  {
    value: 'guessGenerality',
    label: '猜电影',
  },
  {
    value: 'hanzi',
    label: '神奇的汉字',
  },
  {
    value: 'happyQA',
    label: '开心问答',
  },
  {
    value: 'guessLanternRiddle',
    label: '猜灯谜',
  },
  {
    value: 'gestureRiddle',
    label: '你划我猜',
  },
  {
    value: 'msgWall',
    label: '祝福榜',
  },
  {
    value: 'danmu',
    label: '弹幕',
  },
  {
    value: 'qrCode',
    label: '二维码',
  },
  {
    value: 'music',
    label: '音乐',
  },
  {
    value: 'curtainCall',
    label: '谢幕',
  },
  {
    value: 'guessSpeech',
    label: '台词模仿秀',
  },
  {
    value: 'guessPicture',
    label: '看图识景',
  },
  {
    value: 'guessBrand',
    label: '品牌达人',
  },
  {
    value: 'shoutRedPacket',
    label: '喊红包',
  },
  {
    value: 'luckySnake',
    label: '福蛇贺岁',
  },
  {
    value: 'goldenSnake',
    label: '金蛇纳福',
  },
  {
    value: 'playGift',
    label: '免费发礼物',
  },
  {
    value: 'playPicture',
    label: '画面定格',
  },
  {
    value: 'playVideo',
    label: '视频播放',
  },
];

export default {
  name: 'customMenu',
  data() {
    return {
      settingForm: {
        backMenu: [],
        controlMenu: [],
        expire: 1,
      },
      backMenuOptions: [],
      controlMenuOptions: [],
      screenUrl: '',
      backUrl: '',
      controlUrl: '',
      isLoading: false,
    };
  },
  computed: {
    backMenuResult() {
      return this.convertChoosedArray(this.settingForm.backMenu, this.backMenuOptions);
    },
    controlMenuResult() {
      return this.convertChoosedArray(this.settingForm.controlMenu, this.controlMenuOptions);
    },
  },
  created() {
    this.initMenuOptions();
    this.initMenuOptionsFromServer();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  methods: {
    selectAll() {
      this.settingForm.backMenu = this.backMenuOptions.map((item) => item.label);
      this.settingForm.controlMenu = this.controlMenuOptions.map((item) => item.label);
    },
    initMenuOptions() {
      this.backMenuOptions = appTempRoute[0].children.map((item) => ({
        label: item.meta.title,
        value: item.meta.appTempIndex,
      }));
      this.controlMenuOptions = controlMode;
      const SCREENLINK = `https://screen.hudongmiao.com/#/?liveId=${this.$store.state.liveId}`;
      if (this.$store.state.sceneType === '0') {
        this.screenUrl = `${SCREENLINK}&screenType=wedding`;
      } else if (this.$store.state.sceneType === '1') {
        this.screenUrl = `${SCREENLINK}&screenType=enterprise`;
      } else {
        this.screenUrl = SCREENLINK;
      }
    },
    initMenuOptionsFromServer() {
      getConfigUrlOptions({
        splid: this.$store.state.liveId,
      })
        .then((res) => {
          console.log('配置数据:', res);
          const { isHasVal, data } = res.data;
          if (!isHasVal) {
            return;
          }
          const dataObj = JSON.parse(data);
          const { backFuncs, remoteControlFuncs, expire } = dataObj;
          const backMenuValues = backFuncs.funcs.split(',');
          const controlMenuValues = remoteControlFuncs;
          this.settingForm.backMenu = this.reconvertChoosedArray(backMenuValues, this.backMenuOptions);
          this.settingForm.controlMenu = this.reconvertChoosedArray(controlMenuValues, this.controlMenuOptions);
          if (expire) {
            this.settingForm.expire = Number(expire);
          }
          // 生成后台和遥控器地址
          this.backUrl = `https://www.hudongmiao.com/hm-customer/index.html#/appTemp?liveId=${this.$store.state.liveId}&token=${this.$store.state.login.userInfo.token}`;
          this.controlUrl = `https://shm.hudongmiao.com/hm-remotecontrol/#/controller?liveid=${this.$store.state.liveId}&token=${this.$store.state.login.userInfo.token}`;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    copyLink(link) {
      this.$copyText(`${link}`).then(
        (res) => {
          console.log(res);
          this.$message({
            message: '链接复制成功',
            type: 'success',
          });
        },
        (err) => {
          console.log(err);
          this.$message.error('链接复制失败');
        },
      );
    },
    convertChoosedArray(choosedArray, sourceArray) {
      return choosedArray.map((item) => sourceArray.find((sourceItem) => sourceItem.label === item).value);
    },
    reconvertChoosedArray(choosedArray, sourceArray) {
      return choosedArray.map((item) => sourceArray.find((sourceItem) => sourceItem.value === item).label);
    },
    submitSettingForm() {
      // console.log(this.backMenuResult, this.controlMenuResult);
      if (this.backMenuResult.length === 0 || this.controlMenuResult.length === 0) {
        this.$message.error('请选择后台和遥控的功能模块');
        return;
      }
      const backData = {
        sceneType: this.$store.state.sceneType,
        funcs: this.backMenuResult.join(','),
      };
      const controlData = this.controlMenuResult;
      const resultData = {
        backFuncs: backData,
        remoteControlFuncs: controlData,
        expire: this.settingForm.expire,
      };
      const resultStr = JSON.stringify(resultData);
      this.isLoading = true;
      setConfigUrlOptions({
        splid: this.$store.state.liveId,
        data: resultStr,
        expire: this.settingForm.expire.toString(),
      })
        .then((res) => {
          console.log(res);
          this.$message.success('设置成功!');
          // 生成后台和遥控器地址
          this.backUrl = `https://www.hudongmiao.com/hm-customer/index.html#/appTemp?liveId=${this.$store.state.liveId}&token=${this.$store.state.login.userInfo.token}`;
          this.controlUrl = `https://shm.hudongmiao.com/hm-remotecontrol/#/controller?liveid=${this.$store.state.liveId}&token=${this.$store.state.login.userInfo.token}`;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('设置失败!');
        });
    },
    cancelSubmit() {
      this.settingForm.backMenu = [];
      this.settingForm.controlMenu = [];
      this.isLoading = true;
      setConfigUrlOptions({
        splid: this.$store.state.liveId,
        data: '',
        expire: this.settingForm.expire.toString(),
      })
        .then((res) => {
          console.log(res);
          this.$message.success('设置成功!');
          // 生成后台和遥控器地址
          this.backUrl = '';
          this.controlUrl = '';
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
          this.$message.error('设置失败!');
        });
    },
  },
};
</script>
<style lang="less" scoped>
.link {
  cursor: pointer;
  color: #3694f1;
  &:hover {
    opacity: 0.6;
  }
}
</style>
