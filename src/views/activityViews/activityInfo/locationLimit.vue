<template>
  <sub-page>
    <div class="set-customWish-container">
      <main-card>
        <card-top-info title="地理位置限制"> </card-top-info>
        <el-form ref="configForm" :model="configForm" class="configForm">
          <el-form-item label="是否开启地理位置限制：">
            <el-switch v-model="configForm.locationLimitSwitch"></el-switch>
            <div class="tip">(开启此功能后，用户可以设置活动的地点和范围，不在这个范围的用户无法参与互动!)</div>
          </el-form-item>
          <el-form-item class="searchItem" label="活动地点:" v-show="configForm.locationLimitSwitch">
            <el-autocomplete
              class="inline-input"
              v-model="configForm.keyword"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
              style="width: 680px"
            ></el-autocomplete>
          </el-form-item>
          <div class="mapCotainer" ref="mapContainer" v-show="configForm.locationLimitSwitch"></div>
          <el-form-item label="范围:" class="scope" v-show="configForm.locationLimitSwitch">
            <el-slider
              v-model="configForm.scope"
              :min="0.1"
              :max="1000"
              :step="0.1"
              :precision="1"
              style="width: 680px"
              show-input
            ></el-slider>
            <label class="unit">km</label>
          </el-form-item>
          <!-- <el-form-item label="自定义头像昵称:" class="formAuth" v-show="configForm.locationLimitSwitch">
            <el-switch v-model="configForm.needFormAuth" active-value="1" inactive-value="0"></el-switch>
          </el-form-item> -->
          <el-form-item v-show="configForm.locationLimitSwitch" class="btnWrap">
            <el-button type="primary" style="width: 200px" @click="saveLocation">保存</el-button>
          </el-form-item>
        </el-form>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
/* eslint-disable no-undef */
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { editActivityMsg } from '@/api/setting/activitySetting/activity';

export default {
  name: 'locationLimit',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      configForm: {
        locationLimitSwitch: false,
        keyword: '',
        address: '',
        lat: '',
        lng: '',
        scope: 0.1,
        needFormAuth: '0',
      },
    };
  },
  watch: {
    'configForm.locationLimitSwitch': {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.initMap();
          });
        } else {
          this.saveLocation();
        }
      },
    },
  },
  created() {
    this.initData();
  },
  mounted() {
    // this.initMap();
  },
  computed: {},
  methods: {
    initMap() {
      if (this.map) {
        return;
      }
      // console.log('当前地址信息：', new TMap.service.IPLocation());
      if (this.configForm.lat && this.configForm.lng) {
        const center = new TMap.LatLng(this.configForm.lat, this.configForm.lng);
        this.map = new TMap.Map(this.$refs.mapContainer, {
          center, // 设置地图中心点坐标
          zoom: 17.2, // 设置地图缩放级别
          pitch: 43.5, // 设置俯仰角
          rotation: 45, // 设置地图旋转角度
        });
        this.search = new TMap.service.Search({ pageSize: 20 });
        this.suggest = new TMap.service.Suggestion({
          pageSize: 20,
        });
        this.markers = new TMap.MultiMarker({
          map: this.map,
          geometries: [],
        });
        this.infoWindowList = [];
        this.bindMapClick();
      } else {
        const ipLocation = new TMap.service.IPLocation();
        ipLocation.locate().then((res) => {
          console.log('当前地址信息：', res);
          const center = new TMap.LatLng(res.result.location.lat, res.result.location.lng);
          this.map = new TMap.Map(this.$refs.mapContainer, {
            center, // 设置地图中心点坐标
            zoom: 17.2, // 设置地图缩放级别
            pitch: 43.5, // 设置俯仰角
            rotation: 45, // 设置地图旋转角度
          });
          this.search = new TMap.service.Search({ pageSize: 20 });
          this.suggest = new TMap.service.Suggestion({
            pageSize: 20,
          });
          this.markers = new TMap.MultiMarker({
            map: this.map,
            geometries: [],
          });
          this.infoWindowList = [];
          this.bindMapClick();
        });
      }
    },
    bindMapClick() {
      this.map.on('click', (evt) => {
        console.log(evt);
        this.configForm.address = evt.poi.name;
        this.configForm.keyword = evt.poi.name;
        this.configForm.lat = evt.poi.latLng.lat;
        this.configForm.lng = evt.poi.latLng.lng;
      });
    },
    setSuggesion(index) {
      this.infoWindowList.forEach((infoWindow) => {
        infoWindow.close();
      });
      this.infoWindowList.length = 0;
      this.markers.setGeometries([]);
      this.markers.updateGeometries([
        {
          id: '0', // 点标注数据数组
          position: this.suggestionList[index].location,
        },
      ]);
      const infoWindow = new TMap.InfoWindow({
        map: this.map,
        position: this.suggestionList[index].location,
        content: `<h3>${this.suggestionList[index].title}</h3><p>地址：${this.suggestionList[index].address}</p>`,
        offset: { x: 0, y: -50 },
      });
      this.infoWindowList.push(infoWindow);
      this.map.setCenter(this.suggestionList[index].location);
      this.markers.on('click', (e) => {
        this.infoWindowList[Number(e.geometry.id)].open();
      });
    },
    handleSelect(item) {
      console.log(item);
      this.configForm.address = item.value;
      this.configForm.lat = item.lat;
      this.configForm.lng = item.lng;
      this.setSuggesion(item.index);
    },
    querySearch(queryString, cb) {
      this.suggest.getSuggestions({ keyword: queryString, location: this.map.getCenter() }).then((res) => {
        console.log(res);
        const results = res.data.map((item, index) => {
          return {
            index,
            value: item.address,
            lat: item.location.lat,
            lng: item.location.lng,
          };
        });
        this.suggestionList = res.data;
        cb(results);
      });
    },
    initData() {
      const hasLocationSetBefore = (locationVal) => {
        return !!(locationVal && locationVal.includes('lat'));
      };
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log('开关信息:', res.data.location_val);
        const tmpLocationVal = res.data.location_val;
        if (!hasLocationSetBefore(tmpLocationVal)) {
          this.configForm.locationLimitSwitch = false;
        } else {
          const tmpLocation = JSON.parse(tmpLocationVal);
          this.configForm.locationLimitSwitch = true;
          this.configForm.keyword = tmpLocation.address;
          this.configForm.lat = tmpLocation.lat;
          this.configForm.lng = tmpLocation.lng;
          this.configForm.scope = tmpLocation.scope;
          // 用不到该值(其他业务耦合进来的)，原封不动的还给服务端
          this.configForm.needFormAuth = tmpLocation.needFormAuth || '0';
        }
      });
    },
    requestUploadLocation(val) {
      const data = {
        splid: this.$store.state.liveId,
        location_val: val,
      };
      console.log(data);
      editActivityMsg(data).then((res) => {
        console.log('提交修改', res);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
        }
      });
    },
    saveLocation() {
      if (!this.configForm.locationLimitSwitch) {
        // this.requestUploadLocation('0');
        const tmpQuery = {
          needFormAuth: this.configForm.needFormAuth,
        };
        this.requestUploadLocation(JSON.stringify(tmpQuery));
      } else if (this.configForm.lat && this.configForm.lng && this.configForm.needFormAuth) {
        const tmpQuery = {
          lat: this.configForm.lat,
          lng: this.configForm.lng,
          scope: this.configForm.scope,
          needFormAuth: this.configForm.needFormAuth,
          address: this.configForm.address || this.configForm.keyword,
        };
        this.requestUploadLocation(JSON.stringify(tmpQuery));
      } else if (this.configForm.keyword) {
        this.$message.error('请选择正确的活动地点!');
      } else {
        this.$message.error('活动地点不能为空!');
      }
    },
  },
};
</script>
<style lang="less" scoped>
.configForm {
  padding-left: 20px;
  padding-bottom: 40px;
  .tip {
    font-size: 14px;
    color: #606266;
    display: inline;
    margin-left: 20px;
  }
  .mapCotainer {
    width: 760px;
    height: 400px;
    background-color: #000;
  }
  .scope::v-deep {
    margin-top: 40px;
    .el-form-item__content {
      display: flex;
    }
    .unit {
      margin-left: 20px;
    }
  }
  .btnWrap::v-deep {
    .el-form-item__content {
      padding-left: 250px;
    }
  }
}
</style>
