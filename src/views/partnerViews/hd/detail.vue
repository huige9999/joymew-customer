<template>
    <div class="hd-detail-container">
        <!-- 基本信息 -->
        <el-card class="myCard activityInfo">
            <template #header>
                <span class="title">活动信息</span>
            </template>
            <el-row :gutter="20" class="lineGap">
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">名称： </div>
                        <div class="value">{{ hdBaseInfo.theme }}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">类型：</div>
                        <div class="value">{{ hdBaseInfo.sceneName }}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">签到：</div>
                        <div class="value">{{ hdBaseInfo.person }}</div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">日期：</div>
                        <div class="value">{{ hdBaseInfo.using_date }}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">地点：</div>
                        <div class="value">{{ hdBaseInfo.hotel_name }}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="itemInfo">
                        <div class="key">红包：</div>
                        <div class="value">{{ hdBaseInfo.balance }}</div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <!-- 背景图 -->
        <el-card class="myCard themeUpload">
            <template #header>
                <span class="title">桌面主题</span>
            </template>
            <el-row type="flex" justify="center">
                <el-col :span="8">
                    <div class="uploadItem">
                        <div class="key">大屏背景：</div>
                        <div class="imgVal">
                            <div class="imgPreview pc">
                                <el-carousel v-if="screenPic.length > 0" style="height: 73px" indicator-position="none"
                                    class="PCBG">
                                    <el-carousel-item v-for="(item, index) in screenPic" :key="index">
                                        <el-image :src="item" fit="fill"></el-image>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                            <div class="uploadStatus" :class="{ uploaded: screenPic.length > 0 }">{{ pcUploadResult }}</div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="uploadItem">
                        <div class="key">手机背景：</div>
                        <div class="imgVal">
                            <div class="imgPreview mobile">
                                <el-image class="phoneImg" :src="phonePic" fit="fill" v-if="phonePic"></el-image>
                            </div>
                            <div class="uploadStatus" :class="{ uploaded: phonePic }">{{ mobileUploadResult }}</div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <!-- 自定义签到语 -->
        <el-card class="myCard customWish">
            <template #header>
                <span class="title">自定义签到语</span>
            </template>
            <el-row type="flex" justify="center">
                <el-col :span="24">
                    <el-table v-loading="signLoading" border :header-cell-style="{ background: '#f2f3f5' }"
                        :data="customWishList" style="width: 100%;">
                        <el-table-column prop="num" label="序号" width="200">
                        </el-table-column>
                        <el-table-column prop="wish" label="祝福语">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <!-- 收益信息 -->
        <el-card class="myCard incomeDetail">
            <template #header>
                <span class="title">收益详情</span>
            </template>
            <el-row class="lineGap">
                <el-col :span="2" v-for="item in incomeDetail" :key="item.label">
                    <div class="tabItem" :class="{ active: item.label === activeType }" @click="changeTab(item.label)">
                        {{ item.name }}
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <!-- 礼物收益 -->
                    <el-table v-loading="loading" :data="incomeDetail[0].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'gift'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="礼物" min-width="120">
                            <template slot-scope="scope">
                                <div v-if="scope.row.info">
                                    {{ scope.row.info.giftname }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_income }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 弹幕收益 -->
                    <el-table v-loading="loading" :data="incomeDetail[1].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'danmu'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="祝福语" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.c01 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_income }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 霸屏收益 -->
                    <el-table v-loading="loading" :data="incomeDetail[2].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'bapin'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="祝福语" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.c01 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_income }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 照片收益 -->
                    <el-table v-loading="loading" :data="incomeDetail[3].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'photo'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="祝福语" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.c01 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_income }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 全屏特效 -->
                    <el-table v-loading="loading" :data="incomeDetail[4].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;"
                        v-if="activeType === 'allScreen'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="祝福语" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.title }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="收益" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_income }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 开宝箱 -->
                    <el-table v-loading="loading" :data="incomeDetail[5].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'kbx'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="宝箱" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.eprice }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.box_count }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 扭一扭 -->
                    <el-table v-loading="loading" :data="incomeDetail[6].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'nyn'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="中奖金额" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.c01 }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gsum }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 红包墙 -->
                    <el-table v-loading="loading" :data="incomeDetail[7].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'hbWall'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="红包" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gift_price }}
                            </template>
                        </el-table-column>
                        <el-table-column label="价格" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.buyamount }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 红包口袋 -->
                    <el-table v-loading="loading" :data="incomeDetail[8].valList"
                        :header-cell-style="{ background: '#f2f3f5' }" style="width: 100%;" v-if="activeType === 'hbkd'">
                        <el-table-column type="index" label="编号" width="120">
                        </el-table-column>
                        <el-table-column label="姓名" min-width="100">
                            <template slot-scope="scope">
                                <div class="wxNameBox">
                                    <img width="22" height="22" :src="scope.row.avator" />
                                    <span class="text">{{ scope.row.wx_name }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" min-width="120">
                            <template slot-scope="scope">
                                {{ scope.row.gsum }}
                            </template>
                        </el-table-column>
                        <el-table-column label="时间" min-width="120">
                            <template slot-scope="scope">
                                {{ new Date(scope.row.create_time) | formatDate }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>
<script>
import {
  getHdBaseInfo,
  getScreenBg,
  getMobileBg,
  getCustomSign,
  getGiftIncome,
  getDanmuIncome,
  getBapinIncome,
  getPhotoIncome,
  getAllScreenIncome,
  getKbxIncome,
  getNynIncome,
  getHbqIncome,
  getHbkdIncome,
} from '@/api/partnerSystem/index';
import formatDate from '@/utils/formatDate';

const SCENE_TYPE = {
  0: '婚礼版',
  1: '企业版',
  2: '生日版',
  21: '宝宝宴',
  22: '寿宴',
  23: '成人礼',
  24: '百露宴',
  25: '满月宴',
  41: '毕业礼',
  42: '谢师宴',
  43: '金榜题名',
  51: '同学会',
  52: '乔迁宴',
  53: '会销',
  54: '订婚宴',
};

export default {
  name: 'PartnerHdDetail',
  data() {
    return {
      id: '',
      userId: '',
      hdBaseInfo: {
        theme: '',
        sceneName: '',
        person: 0,
        using_date: '',
        hotel_name: '',
        balance: 0,
      },
      screenPic: [], // 大屏背景
      phonePic: '', // 手机背景
      customWishList: [], // 自定义祝福语
      activeType: 'gift', // tab类型
      incomeDetail: [
        {
          label: 'gift',
          name: '礼物',
          valList: [],
        },
        {
          label: 'danmu',
          name: '弹幕',
          valList: [],
        },
        {
          label: 'bapin',
          name: '霸屏',
          valList: [],
        },
        {
          label: 'photo',
          name: '照片',
          valList: [],
        },
        {
          label: 'allScreen',
          name: '全屏特效',
          valList: [],
        },
        {
          label: 'kbx',
          name: '开宝箱',
          valList: [],
        },
        {
          label: 'nyn',
          name: '扭一扭',
          valList: [],
        },
        {
          label: 'hbWall',
          name: '红包墙',
          valList: [],
        },
        {
          label: 'hbkd',
          name: '红包口袋',
          valList: [],
        },
      ],
      SCENE_TYPE,
      isActive: false,
      signLoading: false,
      loading: false,
      reload: false,
    };
  },
  computed: {
    mobileUploadResult() {
      return this.phonePic ? '已上传' : '未上传';
    },
    pcUploadResult() {
      return this.screenPic.length > 0 ? '已上传' : '未上传';
    },
  },
  filters: {
    // 时间戳
    formatDate(time) {
      return formatDate(time);
    },
  },
  created() {
    console.log(this.$route);
    this.id = this.$route.params.id;
    this.userId = this.$route.params.userId;
    this.getHdBaseInfo();
    this.getHdBack();
    this.getCustomSign();
    this.getIncomeDetail();
  },
  activated() {
    if (this.isActive) {
      if (this.$route.params.id) {
        this.id = this.$route.params.id;
        this.reload = true;
        this.activeType = 'gift';
        console.log(this.id);
      }
      if (this.$route.params.userId) {
        this.userId = this.$route.params.userId;
        this.reload = true;
        this.activeType = 'gift';
        console.log(this.userId);
      }
      this.getHdBaseInfo();
      this.getHdBack();
      this.getCustomSign();
      this.getIncomeDetail();
    } else {
      this.isActive = true;
    }
  },
  deactivated() {
    this.reload = false;
  },
  methods: {
    // 获取互动详情基本内容
    async getHdBaseInfo() {
      const res = await getHdBaseInfo(this.id);
      const target = res.data;
      console.log('互动详情的基本内容', target);
      const {
        theme,
        scenario,
        person,
        using_date,
        hotel_name,
        balance,
      } = target;
      if (theme) {
        const sceneName = SCENE_TYPE[scenario];
        Object.assign(this.hdBaseInfo, {
          theme,
          sceneName,
          person,
          using_date,
          hotel_name,
          balance,
        });
      }
      console.log(this.hdBaseInfo);
    },
    // 获取背景图
    async getHdBack() {
      // 获取大屏背景图
      const res = await getScreenBg({
        splid: this.id,
        spl_userId: this.userId,
      });
      // 获取手机背景图
      const res1 = await getMobileBg({
        splid: this.id,
        spl_userId: this.userId,
      });
      const target = res.data;
      const target1 = res1.data;
      console.log('大屏背景图：', target);
      console.log('手机背景图', target1);
      this.screenPic = target.varList.map((item) => {
        return item.piclink.indexOf('https') > -1 ? item.piclink : `https://ustatic.hudongmiao.com/${item.piclink}`;
      });
      this.phonePic = target1.title_piclink;
      console.log(this.phonePic);
    },
    // 获取自定义签到语
    async getCustomSign() {
      this.signLoading = true;
      const res = await getCustomSign({
        splid: this.id,
        spl_userId: this.userId,
      });
      const target = res.data;
      console.log('自定义签到语数据', target);
      this.signLoading = false;
      this.customWishList = target.varList.map((item, index) => ({
        num: index + 1,
        wish: item.bless_str,
      }));
    },
    // 切换tab类型
    changeTab(label) {
      this.activeType = label;
      this.getIncomeDetail();
    },
    // 获取收益数据
    async getIncomeDetail() {
      let res = '';
      switch (this.activeType) {
        case 'gift':
          if (this.incomeDetail[0].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getGiftIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[0].valList = res.data.list;
          break;
        case 'danmu':
          if (this.incomeDetail[1].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getDanmuIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[1].valList = res.data.list;
          break;
        case 'bapin':
          if (this.incomeDetail[2].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getBapinIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[2].valList = res.data.list;
          break;
        case 'photo':
          if (this.incomeDetail[3].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getPhotoIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[3].valList = res.data.list;
          break;
        case 'allScreen':
          if (this.incomeDetail[4].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getAllScreenIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[4].valList = res.data.list;
          break;
        case 'kbx':
          if (this.incomeDetail[5].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getKbxIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[5].valList = res.data.list;
          break;
        case 'nyn':
          if (this.incomeDetail[6].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getNynIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[6].valList = res.data.list;
          break;
        case 'hbWall':
          if (this.incomeDetail[7].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getHbqIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[7].valList = res.data.list;
          break;
        case 'hbkd':
          if (this.incomeDetail[8].valList.length > 0 && !this.reload) {
            return;
          }
          this.loading = true;
          res = await getHbkdIncome({
            splid: this.id,
            spl_userId: this.userId,
          });
          this.loading = false;
          this.incomeDetail[8].valList = res.data.list;
          break;
        default:
          console.log('参数异常');
      }
      console.log(this.incomeDetail);
    },
  },
};
</script>
<style lang="less" scoped>
.myCard::v-deep {
    margin-bottom: 20px;

    .el-card__header {
        border-bottom: unset;
    }

    .title {
        font-size: 16px;
        font-weight: 500;
        color: #1d2129;
        line-height: 24px;
    }
}

.activityInfo {

    .itemInfo {
        display: flex;
        align-items: center;

        .key {
            font-size: 14px;
            font-weight: 400;
            color: #4e5969;
            line-height: 22px;
        }

        .value {
            font-size: 14px;
            font-weight: 400;
            color: #1d2129;
            line-height: 22px;
        }
    }
}

.themeUpload {
    .uploadItem {
        display: flex;
        align-items: flex-start;

        .key {
            font-size: 14px;
            font-weight: 400;
            color: #1d2129;
            line-height: 22px;
        }

        .imgVal {
            margin-left: 16px;

            .imgPreview {
                border-radius: 4px;
                background-color: #000000;
                margin-bottom: 16px;

                &.pc::v-deep {
                    width: 120px;
                    height: 73px;

                    .el-carousel__container {
                        height: 73px;

                        .el-carousel__item {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }

                    .el-carousel__indicator--horizontal {
                        padding: unset;
                        overflow-x: unset;
                    }
                }

                &.mobile {
                    width: 34px;
                    height: 73px;
                }

                .phoneImg {
                    width: 100%;
                    height: 100%;
                }
            }

            .uploadStatus {
                font-size: 14px;
                font-weight: 400;
                color: #F53F3F;
                line-height: 22px;
                text-align: center;

                &.uploaded {
                    color: #00b42a;
                }
            }
        }
    }
}

.incomeDetail {
    .tabItem {
        font-size: 14px;
        font-weight: 400;
        text-align: LEFT;
        color: #4e5969;
        line-height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 30px;
        cursor: pointer;

        &.active {
            background: #f2f3f8;
            border-radius: 32px;
            color: #1664FF;
        }
    }
}

.text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 150px;
    display: block;
}

.lineGap {
    margin-bottom: 10px;
}

.wxNameBox {
    display: flex;
    align-items: center;

    img {
        border-radius: 50%;
        margin-right: 5px;
    }
}
</style>
