<template>
  <sub-page>
    <main-card>
      <card-top-info title="自定义抽奖名单" style="position: relative"> </card-top-info>

      <!-- 名单列表 -->
      <div class="user-list-table-container">
        <div class="line-between"></div>
        <!-- 存放数字框 -->
        <div class="warp">
          <!-- <div class="warp-content" :v-for="item in arr">
            <div class="item">{{ item }}</div>
          </div> -->
        </div>
        <!-- 手动添加按钮 -->
        <div class="addUserBtnA">
          <el-button type="primary" @click="showAddUserDialog"><span>点击生成数字</span></el-button>
        </div>
      </div>
      <!-- 添加用户名单弹出框 -->
      <my-dialog :show="isShowAddUserDialog">
        <div class="addUser-dialog-container">
          <div class="add-user-title" slot="title">
            <div class="text">生成数字</div>
          </div>
          <div class="form-box">
            <div class="username">
              <div class="title">范围</div>
              <el-button slot="append" @click="down" style="margin-left: 0px">-</el-button>
              <el-input v-model="inputDown" placeholder="请输入" style="width: 100px; text-align: center"></el-input>
              <el-button slot="append" @click="up">+</el-button>

              <div class="title" style="width: 100px; text-align: center">到</div>
              <el-button slot="append" @click="sub" style="margin-left: 5px">-</el-button>
              <el-input v-model="inputUp" placeholder="请输入" style="width: 100px; text-align: center"></el-input>
              <el-button slot="append" @click="add">+</el-button>
            </div>
            <div class="isNeiding">
              <div class="title">位置</div>
              <el-radio v-model="radio" label="1">一致</el-radio>
              <el-radio v-model="radio" label="2">不一致</el-radio>
            </div>
            <div class="btn-group" style="padding-left: 145px">
              <el-button type="primary" @click="saveAdd(inputDown, inputUp)">确定</el-button>
              <el-button type="info" @click="cancelAdd" style="margin-left: 20px">取消</el-button>
            </div>
          </div>
        </div>
      </my-dialog>
    </main-card>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import myDialog from '@/components/myDialog';
import request from '@/utils/request';

export default {
  name: 'customDraw',
  data() {
    return {
      // 是否显示添加名单用户弹出框
      isShowAddUserDialog: false,
      // 是否显示导入名单弹出框
      isShowImportDialog: false,
      // 输入框传输数字
      inputDown: 0,
      inputUp: 0,
      // 数字类型
      radio: '1',
      // 传回数字数组
      arr: [],
    };
  },
  created() {},
  methods: {
    // 数字增减
    down() {
      if (this.inputDown > 0) {
        this.inputDown -= 1;
      }
    },
    up() {
      this.inputDown += 1;
    },
    sub() {
      if (this.inputUp > 0) {
        this.inputUp -= 1;
      }
    },
    add() {
      this.inputUp++;
    },
    /* 显示添加用户弹出框 */
    showAddUserDialog() {
      console.log('添加弹出');
      this.isShowAddUserDialog = true;
    },
    /* 确认向后台传输数据 */
    saveAdd(inputDown, inputUp) {
      // const liveId = this.$store.state.liveId;
      // const start = inputDown;
      // const end = inputUp;
      // console.log(liveId);
      const obj = {
        // liveId: this.$store.state.liveId,
        // start: inputDown,
        // end: inputUp,
        splid: this.$store.state.liveId,
        start: inputDown,
        end: inputUp,
      };
      console.log(obj);
      request.post('neiDing/shengChengNumber', obj).then((res) => {
        console.log(res);
        this.arr = res;
      });
      this.isShowAddUserDialog = false;
      // if (username) {
      //   if (this.isNeiding) {
      //     if (selectedAwardType) {
      //       // 请求
      //       this.requestSaveAdd(username, selectedAwardType);
      //       this.isShowAddUserDialog = false;
      //       this.clearAddData();
      //     } else {
      //       this.$message({
      //         message: '请完善所有信息!',
      //         type: 'error',
      //       });
      //     }
      //   } else {
      //     // 请求
      //     this.requestSaveAdd(username, selectedAwardType);
      //     this.isShowAddUserDialog = false;
      //     this.clearAddData();
      //   }
      // } else {
      //   this.$message({
      //     message: '请完善所有信息!',
      //     type: 'error',
      //   });
      // }
    },
    /* 取消添加数据 */
    cancelAdd() {
      this.isShowAddUserDialog = false;
      // this.clearAddData();
    },
  },
  computed: {
    // EditIsNeiding() {
    //   if(this.currentEdit.name){
    //     return true
    //   }else{
    //     return false
    //   }
    // }
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    myDialog,
  },
};
</script>
<style lang="less">
.line-between {
  width: 90%;
  height: 1px;
  background-color: #c5c5c5;
  margin: 30px auto;
}
.warp {
  width: 90%;
  height: 300px;
  border: 1px #c5c5c5 solid;
  border-radius: 8px;
  margin: 100px auto 50px;
}
.warp-content {
  width: 80%;
  height: 100%;
  margin: 0 auto;
  border: 1px red solid;
}
.item {
  width: 20%;
  float: left;
  text-align: center;
  font-size: 16px;
  margin-top: 12px;
}
.addUserBtnA {
  width: 50%;
  margin: 30px auto;
  height: 36px;
  text-align: center;
  line-height: 36px;
  cursor: pointer;
}
// 字体
.title {
  font-size: 18px;
}

/* 添加用户名单弹出框 */
.addUser-dialog-container {
  padding-bottom: 50px;
  .add-user-title {
    display: flex;
    align-items: center;
    .text {
      margin-left: 20px;
      font-size: 25px;
      font-family: SourceHanSansSC-Regular, SourceHanSansSC;
      font-weight: 400;
      color: #42474e;
    }
  }
  .form-box {
    > div {
      display: flex;
      align-items: center;
      margin-top: 30px;
      .title {
        width: 100px;
        font-size: 18px;
        font-family: SourceHanSansSC-Normal, SourceHanSansSC;
        font-weight: 400;
        color: #6f7682;
      }
    }
  }
}
</style>
