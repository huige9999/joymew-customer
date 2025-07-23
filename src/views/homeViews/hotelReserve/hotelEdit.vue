<template>
  <sub-page>
    <main-card class="myMainCard">
      <div style="height: 60px; display: flex; align-items: center; padding-left: 10px">
        <el-page-header @back="goBack" :content="title"> </el-page-header>
      </div>
      <card-top-info title="酒店信息"></card-top-info>

      <el-row>
        <el-col :span="8">
          <hotel-previewer :hotelBaseData="hotelBaseData" :id="hotelId" v-show="currentTab === 'a'"></hotel-previewer>
          <banquet-previewer
            :banquetList="banquetList"
            :previewStatus="previewStatus"
            :previewDetail="banquetBaseData"
            :id="hotelId"
            v-show="currentTab === 'b'"
          ></banquet-previewer>
          <activity-previewer
            :activityList="activityList"
            :previewStatus="previewStatus"
            :previewDetail="activityBaseData"
            :id="hotelId"
            v-show="currentTab === 'e'"
          ></activity-previewer>
          <menu-previewer
            :menuBaseData="menuBaseData"
            :id="hotelId"
            :previewStatus="previewStatus"
            v-show="currentTab === 'c'"
            :menuList="menuList"
          ></menu-previewer>
          <msweddingdress-previewer
            :previewDetail="msWeddingDressBaseData"
            :id="hotelId"
            :previewStatus="previewStatus"
            :msWeddingDressList="msWeddingDressList"
            v-show="currentTab === 'f'"
          ></msweddingdress-previewer>
          <!-- 关于我们的预览弹窗 -->
          <about-us-previewer :previewData="aboutUsData" v-show="currentTab === 'g'"></about-us-previewer>
        </el-col>
        <el-col :span="16">
          <el-tabs type="border-card" @tab-click="handleClick" v-model="currentTab">
            <el-tab-pane label="酒店信息" name="a">
              <div>
                <hotel-editor v-model="hotelBaseData" :id="hotelId"></hotel-editor>
              </div>
            </el-tab-pane>
            <el-tab-pane label="宴会厅" name="b" v-if="!isMsWeddingDress">
              <banquet-editor v-model="banquetBaseData" :id="hotelId" :banquetList="banquetList" @update="update"></banquet-editor>
            </el-tab-pane>
            <el-tab-pane label="套餐" name="c" v-if="!isMsWeddingDress">
              <menu-editor v-model="menuBaseData" :id="hotelId" :menuList="menuList" @update="update"></menu-editor>
            </el-tab-pane>
            <el-tab-pane label="优惠活动" name="e">
              <activity-editor v-model="activityBaseData" :id="hotelId" :activityList="activityList" @update="update"></activity-editor>
            </el-tab-pane>
            <el-tab-pane label="精选单品" name="f">
              <msweddingdress-editor
                v-model="msWeddingDressBaseData"
                :id="hotelId"
                :msWeddingDressList="msWeddingDressList"
                @update="update"
              ></msweddingdress-editor>
            </el-tab-pane>
            <el-tab-pane label="关于我们" name="g">
              <about-us-editor v-model="aboutUsData"></about-us-editor>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import HotelPreviewer from './components/HotelPreviewer/index';
import BanquetPreviewer from './components/BanquetPreviewer/index';
import HotelEditor from './components/HotelEditor/index';
import BanquetEditor from './components/BanquetEditor/index';
import MenuEditor from './components/MenuEditor/index';
import MenuPreviewer from './components/MenuPreviewer/index';
import ActivityPreviewer from './components/ActivityPreviewer/index';
import ActivityEditor from './components/ActivityEditor/index';
import MsweddingdressEditor from './components/MsweddingdressEditor/index';
import MsweddingdressPreviewer from './components/MsweddingdressPreviewer/index';
import AboutUsEditor from './components/AboutUsEditor/index';
import AboutUsPreviewer from './components/AboutUsPreviewer/index';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    HotelPreviewer,
    HotelEditor,
    BanquetEditor,
    MenuEditor,
    BanquetPreviewer,
    MenuPreviewer,
    ActivityPreviewer,
    ActivityEditor,
    MsweddingdressEditor,
    MsweddingdressPreviewer,
    AboutUsEditor,
    AboutUsPreviewer,
  },
  data() {
    return {
      hotelId: '',
      currentTab: 'a',
      hotelBaseData: {
        hotelName: '',
        location: '',
        phone: '',
        carouselList: [],
        icon: '',
        carouselVideoList: [], // 视频轮播
        baseParaList: [], // 装修时间、宴会厅、最低餐标、停车位;格式举例：['2019','4/36','1899','500']
        baseLabelList: [], // 格式举例：['特色餐厅','停车位多', '无柱大厅']
      },
      banquetList: [],
      previewStatus: 0,
      banquetBaseData: {
        id: null,
        name: '', // 名称
        deskNum: '', // 桌数
        pricePerDesk: 0, // 每桌价格
        columnStatus: '0', // 柱有无
        floorHeight: '', // 层高
        detail: {
          feature: '', // 特色
          priceStartOrder: '', // 起订价格 单位元/桌
          deskNumStartOrder: '', // 起订桌数
          deskSpecification: '', // 桌规格 单位人/桌
          areaWelcomeGuestsStatus: '0', // 迎宾区有无
          champagneTowerStatus: '0', // 香槟塔有无
          stageStatus: '0', // 舞台有无
          servicePrice: '', // 服务价格
          posterList: [],
        },
      },
      menuList: [],
      menuBaseData: {
        id: null,
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 菜单封面
        dishList: '', // 菜单列表 需要特殊处理
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
      },
      groupList: [],
      groupBaseData: {
        id: null,
        carouselList: [],
        name: '',
        desc: '',
        banquet: {
          pricePerDesk: '', // 每桌价格 单位元
          peopleNumPerDesk: '', // 每桌人数 单位人
          deskNum: '', // 桌数
          drink: '', // 酒水
          afternoonTea: '', // 下午茶
          extraTip: '', // 补充说明
        },
        coverPath: '',
        dishList: [],
        field: '',
        weddingArragement: {
          welcomeGuestsArea: '',
          ceremonyArea: '',
          banqueArea: '',
        },
        flowerDecoration: {
          husband: '',
          wife: '',
          guests: '',
        },
        serviceTeam: {
          emcee: {
            name: '',
            desc: '',
          },
          makeUp: {
            name: '',
            desc: '',
          },
          sy: {
            name: '',
            desc: '',
          },
          sx: {
            name: '',
            desc: '',
          },
          other: {
            name: '',
            desc: '',
          },
        },
        ceremony: '',
        lightEquipment: '',
        personalityProduction: '',
        extraInfo: '',
      },

      activityList: [],
      activityBaseData: {
        id: null,
        carouselList: [],
        name: '', // 名称
        desc: '', // 描述
        coverPath: '',
      },

      msWeddingDressList: [],
      msWeddingDressBaseData: {
        id: null,
        carouselList: [],
        coverPath: '',
        name: '',
        type: '',
        desc: '',
      },

      aboutUsData: {
        kf_phone: '',
        wx_account: '',
        kf_qr_code: '',
        hlt_intro: '',
        swiper_imgs: [],
        hlt_poster: [],
        hlt_name: '',
        hlt_logo: '',
      },
    };
  },
  computed: {
    title() {
      const { hotelBaseData } = this;
      return hotelBaseData.hotelName || '';
    },
    // 米纱婚纱
    isMsWeddingDress() {
      return this.hotelId === '11';
    },
  },
  created() {
    if (this.$route.query.id) {
      this.hotelId = this.$route.query.id;
    } else {
      this.$message.error('酒店信息错误');
    }
  },
  methods: {
    update(e) {
      console.log('update', e);
      const props = Object.keys(e);
      props.forEach((prop) => {
        console.log(props, prop, this[prop], e[prop]);
        this[prop] = e[prop];
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
.myMainCard {
  position: relative;
}
</style>
