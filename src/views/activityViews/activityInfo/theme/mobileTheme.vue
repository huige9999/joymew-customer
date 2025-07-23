<template>
  <div class="mobileTheme-area">
    <H5Theme :h5Theme="h5Theme" @cu="delateMobileBg" @uht="updateH5Theme"></H5Theme>
    <mpTheme :mpTheme="mpTheme" @cu="delateMpBg" @uht="updateMpTheme"></mpTheme>
  </div>
</template>
<script>
import { getMobileBgList, getActivity } from '@/api/setting/activitySetting/theme';
import request from '@/utils/request';
import { defaultH5Theme, defaultMpTheme } from '@/assets/constant/theme';
import H5Theme from './mobile/h5Theme';
import mpTheme from './mobile/mpTheme';

export default {
  name: 'mobileTheme',
  data() {
    return {
      h5Theme: defaultH5Theme,
      mpTheme: defaultMpTheme,
    };
  },
  components: {
    H5Theme,
    mpTheme,
  },
  created() {
    this.getMoblieList();
  },
  methods: {
    updateMpTheme(val) {
      this.mpTheme = val;
    },
    updateH5Theme(val) {
      this.h5Theme = val;
    },
    getMoblieList() {
      getMobileBgList({ params: { splid: this.$store.state.liveId } }).then((res) => {
        console.log('mobileImgList', res);
        if (res.data.phone_piclink && res.data.phone_piclink.indexOf('http') > -1) {
          this.h5Theme = res.data.phone_piclink;
        }
        this.$store.commit('login/updateIsScreenBgLS', res.data.draw_switch);
      });
      getActivity({
        splid: this.$store.state.liveId,
      }).then((res) => {
        console.log(res);
        if (res.data.qd_back && res.data.qd_back.indexOf('http') > -1) {
          this.mpTheme = res.data.qd_back;
        }
      });
    },
    getMpBg() {},
    /* 取消上传当前的图片 */
    delateMobileBg() {
      console.log('取消上传');
      const data = {
        splid: this.$store.state.liveId,
        phone_piclink: '0',
      };
      request.post('/qiYeNe/update', data).then((res) => {
        console.log('delate-mobileimg', res);
        this.$message({
          message: '取消上传成功',
          type: 'success',
        });
        this.getMoblieList();
        this.h5Theme = defaultH5Theme;
      });
    },
    delateMpBg() {
      console.log('取消上传');
      const data = {
        splid: this.$store.state.liveId,
        qd_back: '0',
      };
      request.post('/sheZhi/update', data).then((res) => {
        console.log('delate-mobileimg', res);
        this.$message({
          message: '取消上传成功',
          type: 'success',
        });
        // this.getMoblieList();
        this.mpTheme = defaultMpTheme;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mobileTheme-area {
  width: 45%;
  display: flex;
}
</style>
