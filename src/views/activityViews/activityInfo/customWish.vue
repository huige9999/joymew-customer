<template>
  <sub-page>
    <div class="set-customWish-container">
      <main-card>
        <card-top-info title="自定义签到语">
          <!-- <div class="switchWrap">
            <p>开启功能</p>
            <el-switch
              active-color="#3B86FF"
              inactive-color="#f1f1f3"
              v-model="funcSwitch"
              @change="switchFunc"
              class="funcSwitch"
            ></el-switch>
          </div> -->
        </card-top-info>
        <div class="tipCt">
          {{ tipContent }}
        </div>
        <div class="mainContent">
          <div class="addWarp">
            <p class="para">添加祝福语</p>
            <div class="addContent">
              <el-autocomplete
                class="inline-input"
                v-model="wishContent"
                :fetch-suggestions="querySearch"
                placeholder="请输入获取选择签到语内容"
              ></el-autocomplete>
              <el-button class="addBtn" type="primary" @click="add">点击添加</el-button>
            </div>
          </div>
          <div class="tableWarp">
            <el-table :data="wishList" border style="width: 100%">
              <el-table-column prop="num" type="index" label="序号" align="center"></el-table-column>
              <el-table-column prop="bless_str" label="祝福语" align="center"></el-table-column>
              <el-table-column label="删除" align="center">
                <template slot-scope="scope">
                  <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="deleteWish(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { addWish, getWishList, wishSwitch, removeWish } from '@/api/setting/setting';

export default {
  name: 'setCompany',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      wishList: [],
      wishContent: '',
      suggestWishList: [
        {
          value: '年年有今日，岁岁有今朝！',
        },
        {
          value: '天天天真快乐，年年年轻漂亮！',
        },
        {
          value: '岁岁年年今朝在，日日月月乐长行！',
        },
        {
          value: '金玉良缘，天作之合！',
        },
        {
          value: '郎才女貌，喜结同心！',
        },
        {
          value: '生日里快乐吉祥，祝福中前程似锦！',
        },
        {
          value: '祝生意兴隆，祝财源滚滚！',
        },
        {
          value: '明朝加岁，大家同祝贺！',
        },
        {
          value: '可喜可贺，恭喜恭喜！',
        },
      ],
      funcSwitch: true,
    };
  },
  created() {
    this.getList();
  },
  computed: {
    tipContent() {
      let tmpTC;
      if (this.funcSwitch) {
        tmpTC = '来宾扫码签到，随机弹出以下祝福语';
      } else {
        tmpTC = '来宾扫码签到，只能自己编辑祝福语内容';
      }
      return tmpTC;
    },
  },
  methods: {
    switchFunc() {
      const params = {
        // liveId: this.$store.state.liveId,
        // sign_wish_switch: this.funcSwitch ? '1' : '0',
        splid: this.$store.state.liveId,
        toggle_signbless: this.funcSwitch ? '1' : '0',
      };
      wishSwitch(params)
        .then((res) => {
          console.log(res, 'signWish');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    querySearch(queryString, cb) {
      const { suggestWishList } = this;
      const results = queryString ? suggestWishList.filter(this.createFilter(queryString)) : suggestWishList;
      cb(results);
    },
    createFilter(queryString) {
      return (targetObj) => targetObj.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    },
    add() {
      if (!this.wishContent) {
        this.$message.error('祝福语不能为空!');
        return;
      }
      const params = {
        // content: this.wishContent,
        // liveid: this.$store.state.liveId,
        // type: '1',
        bless_str: this.wishContent,
        splid: this.$store.state.liveId,
        wtype: '1',
      };
      addWish(params).then((res) => {
        console.log(res, 'addWish');
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '签到语添加成功',
          });
          this.wishContent = '';
        }
        this.getList();
      });
    },
    getList() {
      getWishList({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res, 'wishList-----');
        this.wishList = res.data.varList;
        // res.data.live.sign_wish_switch === '0' ? (this.funcSwitch = false) : (this.funcSwitch = true);
      });
    },
    deleteWish(obj) {
      console.log(obj, 'wishItem');
      const params = {
        // id: obj.id,
        // liveid: this.$store.state.liveId,
        id: obj.id,
        splid: this.$store.state.liveId,
      };
      removeWish(params).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '签到语添加成功',
          });
          this.getList();
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.switchWrap {
  display: flex;
  align-items: center;
  padding-right: 50px;
  p {
    font-size: 16px;
    color: #000;
  }

  .funcSwitch {
    margin-left: 10px;
  }
}
.deleteIcon {
  width: 22px;
  height: 22px;
}
.tipCt {
  font-size: 16px;
  color: #000;
  margin-top: 23px;
  padding-left: 40px;
}
.mainContent {
  padding-top: 34px;
  padding-left: 40px;
  position: relative;
  height: 700px;

  .addWarp {
    .para {
      color: #000;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .addContent {
      display: flex;
      .inline-input {
        width: 250px;
      }
      .addIpt {
        width: 254px;
        height: 50px;
      }

      .addBtn {
        margin-left: 12px;
      }
    }
  }

  .tableWarp {
    margin-top: 36px;
    width: 638px;
  }
}
</style>
