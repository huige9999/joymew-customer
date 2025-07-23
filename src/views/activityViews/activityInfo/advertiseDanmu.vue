<!-- 广告弹幕设置 -->
<template>
    <sub-page>
        <div class="getPhoneNumber-container">
            <main-card style="min-height: 700px" v-loading="loading">
                <card-top-info title="广告弹幕"></card-top-info>
                <p class="tip">开启广告弹幕后，来宾手机端会在特定时机推送这种类型的弹幕(此弹幕只有来宾自己能看到，不会在大屏展示)</p>
                <div class="formItem">
                    <label class="key">司仪名片弹幕：</label>
                    <el-switch v-model="switchForm.hostCard" inactive-color="#eaeaea" @change="changeHostCardSwitch"
                        :active-value="1" :inactive-value="0"></el-switch>
                </div>
            </main-card>
        </div>
    </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { editActivityInfo } from '@/api/setting/activitySetting/activity';

export default {
  name: 'advertiseDanmu',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      loading: false,
      switchForm: {
        hostCard: 0,
      },
      advertiseDanmuTypeList: [],
    };
  },
  computed: {},
  watch: {
  },
  created() {
    this.initData();
  },
  methods: {
    updateAdvertiseDanmuTypeListBySwitchForm() {
      const formKeys = Object.keys(this.switchForm);
      const tmpAdvertiseDanmuTypeList = JSON.parse(JSON.stringify(this.advertiseDanmuTypeList));
      this.advertiseDanmuTypeList.splice(0);
      formKeys.forEach((objKey) => {
        if (this.switchForm[objKey] === 1) {
          const tmpIndex = tmpAdvertiseDanmuTypeList.findIndex((objItem) => {
            if (typeof objItem === 'string') {
              return objItem === objKey;
            }
            return objItem.type === objKey;
          });
          if (tmpIndex !== -1) {
            this.advertiseDanmuTypeList.push({
              ...tmpAdvertiseDanmuTypeList[tmpIndex],
              type: objKey,
            });
          } else {
            this.advertiseDanmuTypeList.push({
              type: objKey,
              rank: '',
              introduce: '',
            });
          }
        }
      });
    },
    updateSwitchFormByAdvertiseDanmuTypeList() {
      this.advertiseDanmuTypeList.forEach((objKey) => {
        // this.switchForm[objKey] = 1;
        // objKey取值'hostCard'或者{type: 'hostCard',rank: '', introduce: ''} 两种情况
        // 判断objKey是字符串还是对象
        if (typeof objKey === 'string' && this.switchForm[objKey]) {
          this.switchForm[objKey] = 1;
        } else if (this.switchForm[objKey.type]) {
          this.switchForm[objKey.type] = 1;
        }
      });
    },
    initData() {
      this.loading = true;
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res);
        if (res.data.userInfo.card_json) {
          this.advertiseDanmuTypeList = JSON.parse(res.data.userInfo.card_json);
          this.updateSwitchFormByAdvertiseDanmuTypeList();
        }
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    },
    changeHostCardSwitch() {
      this.updateAdvertiseDanmuTypeListBySwitchForm();
      console.log(this.advertiseDanmuTypeList);
      this.loading = true;
      editActivityInfo({
        card_json: JSON.stringify(this.advertiseDanmuTypeList),
        splid: this.$store.state.liveId,
      }).then((res) => {
        console.log(res);
        this.loading = false;
        this.$message({
          message: '更改成功!',
          type: 'success',
        });
      }).catch((err) => {
        console.log(err);
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tip {
    font-size: 16px;
    margin-top: 5px;
    padding-left: 40px;
}

.formItem {
    padding-top: 34px;
    padding-left: 40px;

    .key {
        font-size: 17px;
        margin-right: 6px;
    }
}
</style>
