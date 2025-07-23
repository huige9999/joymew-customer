<template>
  <div class="base">
    <div class="navBar">
      <div class="tip">请设置活动需要派发的奖励</div>
      <div class="wrap">
        <div class="tabs">
          <div
            class="tab"
            v-for="(reward, index) in tabList"
            :class="[{ active: activeTab === index }]"
            :key="reward.award_id"
            @click="changeTab(index)"
          >奖 项 {{ index + 1 }}</div>
        </div>
        <div class="op-btn">
          <div class="add" @click="add">+</div>
          <div class="dec" @click="del()">-</div>
        </div>
      </div>
    </div>
    <div class="title">基本选项 - 奖 项 {{ activeTab + 1 }}</div>

    <div>
      <el-form
        class="demo-form-inline"
        :inline="true"
        label-width="88px"
        label-position="left"
        :rules="rules"
        size="middle"
        :model="tabForm"
        ref="tabForm"
      >
        <el-form-item label="奖项等级" class="item" label-width prop="award_grade">
          <el-input v-model="tabForm.award_grade" placeholder="奖项等级" class="hm-input-max"></el-input>
        </el-form-item>
        <el-form-item label="奖项类型" class="item" prop="award_type">
          <!-- <el-input v-model="tabForm.award_type" placeholder="输入内容" class="hm-input-max"></el-input> -->
          <el-select v-model="tabForm.award_type" placeholder="请选择" class="hm-input-max">
            <el-option
              v-for="item in awardTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖项名称" class="item" prop="award_name">
          <el-input v-model="tabForm.award_name" placeholder="输入内容" class="hm-input-max"></el-input>
        </el-form-item>

        <el-form-item label="奖项数量" class="item" prop="award_size">
          <el-input v-model="tabForm.award_size" placeholder="输入内容" class="hm-input-max"></el-input>
        </el-form-item>

        <el-form-item label="兑奖方式" class="item" prop="cashing_method">
          <el-radio v-model="tabForm.cashing_method" label="0">快递</el-radio>
          <el-radio v-model="tabForm.cashing_method" label="1">到店自取</el-radio>
        </el-form-item>

        <el-form-item
          label="地址"
          class="item"
          prop="address"
          v-show="tabForm.cashing_method === '0'"
        >
          <el-input v-model="tabForm.address" placeholder="输入内容" class="hm-input-max"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('tabForm')">保存</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getAwardList, editAward, saveAward, deleteAward } from '../../../api/yx/yx';

const defaultTabForm = {
  address: '',
  award_grade: '一等奖',
  award_name: '价值100元礼品（示例）',
  award_size: '1',
  cashing_method: '0',
  award_type: '实物礼品',
};

export default {
  data() {
    return {
      activeTab: 0,
      tabList: [],
      // resultId: null,
      tabForm: defaultTabForm,
      awardTypes: [
        {
          label: '实物礼品',
          value: '实物礼品',
        },
      ],
      // tabForm: {
      //   address: '',
      //   award_grade: '',
      //   award_name: '',
      //   award_size: '',
      //   cashing_method: '0',
      //   award_type: '1',
      // },
      rules: {},
    };
  },
  props: {
    aid: String,
  },
  computed: {
    resultId() {
      return this.tabList[this.activeTab].award_id;
    },
  },
  created() {
    this.tabList = [
      defaultTabForm,
    ];
    if (this.aid) {
      this.getAwardList();
      // if (this.tabList[this.activeTab]) {
      //   this.resultId = this.tabList[this.activeTab].award_id;
      // }
    }
  },
  methods: {
    getAwardList() {
      getAwardList({
        activity_id: this.aid,
      })
        .then((res) => {
          console.log('res', res.data);
          if (res.data.list.length > 0) {
            this.tabList = res.data.list || [
              {
                defaultTabForm,
              },
            ];
          }

          this.tabForm = this.tabList[this.activeTab] || defaultTabForm;
          // this.activeTab = this.tabList.length - 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    changeTab(index) {
      this.activeTab = index;
      this.tabForm = this.tabList[this.activeTab] || defaultTabForm;
      // this.resultId = this.tabList[this.activeTab].award_id;
    },
    editAward() {
      const { award_name, award_grade, award_type, award_size, cashing_method, address } = this.tabForm;
      const params = {
        activity_id: this.aid, // '13f8f969270f461f852cba454181fd79',
        award_id: String(this.tabForm.award_id), //
        award_name, // '奖品名称',
        award_grade, // : '奖品等级',
        award_type, // : '1',
        award_size, // : '奖品数量',
        cashing_method, // '兑奖方式',
        address, // ': '兑奖地址',
      };
      editAward(params)
        .then((res) => {
          console.log(res);
          this.$message.success('保存成功');

          this.getAwardList();
        })
        .catch((err) => {
          this.$message('保存失败');

          console.log(err);
        });
    },
    saveAward() {
      const { award_name, award_grade, award_type, award_size, cashing_method, address } = this.tabForm;
      const params = {
        activity_id: this.aid, // '13f8f969270f461f852cba454181fd79',
        // award_id: this.tabForm.award_id, //
        award_name, // '奖品名称',
        award_grade, // : '奖品等级',
        award_type, // : '1',
        award_size, // : '奖品数量',
        cashing_method, // '兑奖方式',
        address, // ': '兑奖地址',
      };
      saveAward(params)
        .then((res) => {
          console.log(res);
          this.getAwardList();
          this.$message.success('保存成功');
        })
        .catch((err) => {
          console.log(err);
          this.$message('保存失败');
        });
    },
    deleteAward() {
      const params = {
        activity_id: this.aid, // '13f8f969270f461f852cba454181fd79',
        award_id: String(this.tabForm.award_id), //
      };
      deleteAward(params)
        .then((res) => {
          console.log(res);
          this.$message.success('删除成功');
          this.activeTab = 0;
          this.getAwardList();
        })
        .catch((err) => {
          console.log(err);
          this.$message('删除失败');
        });
    },
    del() {
      if (this.tabList.length <= 1) {
        this.$message('最少保留一项奖品');
        return;
      }
      const target = this.tabList[this.activeTab];
      if (target.award_id) {
        console.log(target);
        this.tabForm.award_id = target.award_id;
        this.deleteAward();
      } else {
        this.tabList.splice(this.tabList.length - 1, 1);
        this.changeTab(this.tabList.length - 1);
      }
    },
    add() {
      for (let i = 0; i < this.tabList.length; i++) {
        if (!this.tabList[i].award_id) {
          this.$message('请先保存当前奖项');
          return;
        }
      }

      this.tabList.push(defaultTabForm);

      // this.activeTab = this.tabList.length - 1
      this.changeTab(this.tabList.length - 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.resultId) {
            this.editAward();
          } else {
            this.saveAward();
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.base {
  width: 100%;
  // padding-left: 40px;
  .title {
    padding-left: 60px;

    font-weight: 500;
    color: #333333;
    font-size: 18px;
    margin-top: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3f3f3;
  }
  .navBar {
    width: 100%;
    margin-top: 24px;
    padding-left: 40px;
    background: #f6f6f6;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .tip {
      padding: 10px 0;
      font-size: 14px;
      color: #333;
      padding-bottom: 20px;
    }
    .wrap {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      .tabs {
        display: flex;
        .tab {
          width: 123px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &.active {
            background: #ffffff;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            color: #1E87F0;

          }
        }
      }
      .op-btn {
        padding-right: 40px;
        height: 40px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        .add {
          width: 21px;
          height: 21px;
          background: rgba(36, 154, 255, 0.2);
          border: 1px solid #249aff;
          color: #249aff;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
        }
        .dec {
          width: 21px;
          height: 21px;
          background: rgba(36, 154, 255, 0.2);
          color: #249aff;
          border: 1px solid #249aff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }
}
.demo-form-inline {
  font-size: 16px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .item {
    width: 100%;
  }
}
</style>
