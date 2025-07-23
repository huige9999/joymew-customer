<template>
  <div v-if="TQL">
    <main-card>
      <card-top-info :title="kindTitle">
        <div class="btn-position">
          <el-button type="primary" icon="el-icon-plus" @click="addAwardDialogVisible = true">增加奖品</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="autoAddAwardDialogVisible = true">批量增加奖品</el-button>
        </div>
      </card-top-info>
      <div class="swing-score-list-container">
        <rewardTable :kind="kind" ref="table" v-model="awardList" @editRow="editAwardData" />
      </div>

      <!-- 新增奖项弹出框 -->
      <my-dialog :show="addAwardDialogVisible" style="width: 700px">
        <div class="editTitle" slot="title">
          <div class="title-text">添加奖项:</div>
        </div>
        <div class="awardClassTypes">
          <div class="awardClassType" :class="[{ active: awardClassType === 0 }]" @click="awardClassType = 0">
            优惠券
            <div class="award-line"></div>
          </div>
          <div class="awardClassType" :class="[{ active: awardClassType === 1 }]" @click="awardClassType = 1">
            实物
            <div class="award-line"></div>
          </div>
        </div>
        <div class="coupon" v-if="awardClassType === 0">
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">名次:</div>
              <div class="input">
                <el-select v-model="chooseRank" placeholder style="width: 300px">
                  <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">奖品名称:</div>
              <div class="input">
                <el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input>
              </div>
              <div class="tips"></div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">优惠券类目:</div>
              <div class="input">
                <el-select v-model="chooseCoupon" placeholder style="width: 300px" multiple>
                  <el-option v-for="item in coupons" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
                </el-select>
              </div>
            </div>

            <div class="coupon-list-wrap">
              <tqlCouponItem v-for="(choosed, index) in chooseCouponObjList" :key="index" :index="index" :choosed="choosed">
              </tqlCouponItem>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepAddTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>

        <div class="coupon" v-else>
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">名次:</div>
              <div class="input">
                <el-select v-model="chooseRank" placeholder style="width: 300px">
                  <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">实物名:</div>
              <div class="input">
                <el-input v-model="awardType" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepAddTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>
      </my-dialog>

      <!-- 编辑奖项弹出框 -->
      <my-dialog :show="editAwardDialogVisible" style="width: 700px">
        <div class="editTitle" slot="title">
          <div class="title-text">编辑奖项:</div>
        </div>
        <div class="awardClassTypes">
          <div class="awardClassType active">
            {{ awardClassType == '0' ? '优惠券' : '实物' }}
            <div class="award-line"></div>
          </div>
        </div>
        <div class="coupon" v-if="awardClassType === 0">
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">名次:</div>
              <div class="input">
                <el-select v-model="chooseRank" placeholder style="width: 300px" disabled>
                  <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">奖品名称:</div>
              <div class="input">
                <el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input>
              </div>
              <div class="tips"></div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">优惠券类目:</div>
              <div class="input">
                <el-select v-model="chooseCoupon" placeholder style="width: 300px" multiple>
                  <el-option v-for="item in coupons" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="coupon-list-wrap">
              <tqlCouponItem v-for="(choosed, index) in chooseCouponObjList" :key="index" :index="index" :choosed="choosed">
              </tqlCouponItem>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepEditTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>

        <div class="coupon" v-else>
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">名次:</div>
              <div class="input">
                <el-select v-model="chooseRank" placeholder style="width: 300px" disabled>
                  <el-option v-for="item in remainedRanks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">实物名:</div>
              <div class="input">
                <el-input v-model="awardType" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepEditTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>
      </my-dialog>

      <!-- 批量新增奖项弹出框 -->
      <my-dialog :show="autoAddAwardDialogVisible" style="width: 700px">
        <div class="editTitle" slot="title">
          <div class="title-text">添加奖项:</div>
        </div>
        <div class="awardClassTypes">
          <div class="awardClassType" :class="[{ active: awardClassType === 0 }]" @click="awardClassType = 0">
            优惠券
            <div class="award-line"></div>
          </div>
          <div class="awardClassType" :class="[{ active: awardClassType === 1 }]" @click="awardClassType = 1">
            实物
            <div class="award-line"></div>
          </div>
        </div>
        <div class="coupon" v-if="awardClassType === 0">
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">开始名次:</div>
              <div class="input">
                <el-select v-model="chooseStartRank" placeholder style="width: 300px">
                  <el-option v-for="item in ranks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">终止名次:</div>
              <div class="input">
                <el-select v-model="chooseEndRank" placeholder style="width: 300px">
                  <el-option v-for="item in ranks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">奖品名称:</div>
              <div class="input">
                <el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input>
              </div>
              <div class="tips"></div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">优惠券类目:</div>
              <div class="input">
                <el-select v-model="chooseCoupon" placeholder style="width: 300px" multiple>
                  <el-option v-for="item in coupons" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
                </el-select>
              </div>
            </div>

            <div class="coupon-list-wrap">
              <tqlCouponItem v-for="(choosed, index) in chooseCouponObjList" :key="index" :index="index" :choosed="choosed">
              </tqlCouponItem>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepAutoAddTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAutoAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>

        <div class="coupon" v-else>
          <div class="editInfo-container">
            <div class="editInfo-container-item award-info">
              <div class="title">开始名次:</div>
              <div class="input">
                <el-select v-model="chooseStartRank" placeholder style="width: 300px">
                  <el-option v-for="item in ranks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>
            <div class="editInfo-container-item award-info">
              <div class="title">终止名次:</div>
              <div class="input">
                <el-select v-model="chooseEndRank" placeholder style="width: 300px">
                  <el-option v-for="item in ranks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </div>

            <div class="editInfo-container-item award-info">
              <div class="title">实物名:</div>
              <div class="input">
                <el-input v-model="awardType" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </div>
          <div class="editBtn-group" style="margin-top: 80px">
            <el-button type="primary" class="save-btn" @click="keepAutoAddTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
            <el-button type="info" class="cancel-btn" @click="cancelAutoAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
          </div>
        </div>
      </my-dialog>
    </main-card>
  </div>
</template>

<script>
import myDialog from '@/components/myDialog';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { addTQLAward, editTQLAward, tqlCouponList, addTQLAutoAward } from '@/api/tql/gameSetting';
import tqlCouponItem from './components/tqlCouponItem';
import rewardTable from './components/rewardTable';

export default {
  name: 'TQLGameAward',
  computed: {
    chooseCouponObj() {
      if (this.coupons.length === 0) {
        return null;
      }
      if (this.chooseCoupon.length === 0) {
        return null;
      }
      const chooseCoupon = this.chooseCoupon[0];
      const chooseObj = this.coupons.find((item) => item.template_id === chooseCoupon);
      if (chooseObj) {
        return chooseObj;
      }
      return null;
    },
    chooseCouponObjList() {
      const list = [];
      if (!this.chooseCoupon) {
        return list;
      }
      this.chooseCoupon.forEach((choosed) => {
        const chooseObj = this.coupons.find((item) => item.template_id === choosed);
        if (chooseObj) {
          list.push(chooseObj);
        }
      });
      return list;
    },
    choosedRanks() {
      const { awardList } = this;

      const choosed = awardList.map((item) => item.rank);

      return choosed;
    },
    remainedRanks() {
      const { ranks, choosedRanks, editAwardDialogVisible } = this;

      const remain = ranks.filter((item) => {
        const choosed = choosedRanks.includes(item.value);

        if (editAwardDialogVisible) {
          return !choosed || item.value === this.chooseRank;
        }

        return !choosed;
      });
      // console.log('remain', remain);
      return remain;
    },

    TQL() {
      const highPrivilege = this.$store.state.login.userInfo.high_privilege;
      return highPrivilege === 3 || highPrivilege === 4;
    },
    kindTitle() {
      const { kind } = this;
      let title = '奖品设置';
      if (kind === '2') {
        title = `摇一摇${title}`;
      } else if (kind === '3') {
        title = `划一划${title}`;
      }

      return title;
    },
    splid() {
      return this.$store.state.liveId;
    },
  },
  props: {
    //   kind  2:摇一摇  3:划一划
    kind: {
      type: String,
    },
  },

  watch: {
    TQL() {
      if (this.TQL) {
        this.getTqlCouponList();
      }
    },
    chooseCoupon() {
      if (this.awardClassType === 1) {
        return;
      }
      const editing = this.addAwardDialogVisible === true || this.editAwardDialogVisible === true || this.autoAddAwardDialogVisible === true;
      if (this.prizeName === '' && editing) {
        this.prizeName = this.chooseCouponObj.name;
      }
    },
  },
  data() {
    return {
      // awardType: '',
      awardClassType: 0,

      addAwardDialogVisible: false,
      editAwardDialogVisible: false,
      autoAddAwardDialogVisible: false,

      prizeName: '',
      AwardData: null,
      chooseCoupon: [],
      coupons: [],
      chooseRank: '',
      chooseStartRank: '',
      chooseEndRank: '',
      ranks: [
        {
          label: '第一名',
          value: '1',
        },
        {
          label: '第二名',
          value: '2',
        },
        {
          label: '第三名',
          value: '3',
        },
        {
          label: '第四名',
          value: '4',
        },
        {
          label: '第五名',
          value: '5',
        },
        {
          label: '第六名',
          value: '6',
        },
        {
          label: '第七名',
          value: '7',
        },
        {
          label: '第八名',
          value: '8',
        },
        {
          label: '第九名',
          value: '9',
        },
        {
          label: '第十名',
          value: '10',
        },
      ],
      awardType: '',

      awardList: [],
    };
  },
  components: {
    MainCard,
    CardTopInfo,
    myDialog,
    tqlCouponItem,
    rewardTable,
  },
  methods: {
    /**
        生成 1 - 100 名的名单
         * */
    initRanks() {
      let ranks = new Array(100).fill({});

      ranks = ranks.map((item, index) => {
        const obj = {
          ...item,
          label: `第${index + 1}名`,
          value: String(index + 1),
        };
        return obj;
      });

      this.ranks = ranks;
    },
    editAwardData(row) {
      console.log(row);
      this.AwardData = row;
      this.awardType = row.prize_name;
      this.prizeName = row.prize_name;
      this.chooseCoupon = row.template_id.split(',');
      if (!row.template_id) {
        this.awardClassType = 1;
      } else {
        this.awardClassType = 0;
      }
      this.chooseRank = row.rank;
      console.log('编辑');
      this.editAwardDialogVisible = true;
    },

    showEditAwardDialog() {
      this.awardDialogVisible = true;
    },
    closeEditAwardDialog() {
      this.awardDialogVisible = false;
    },
    getTqlCouponList() {
      tqlCouponList({
        page: '1',
        perPage: '300',
      })
        .then((res) => {
          console.log('res', res);
          if (res?.data?.couponList) {
            const list = res.data.couponList;
            const newList = [];
            for (let i = 0; i < list.length; i++) {
              list[i] = list[i]
                .replace(/&lt;ul&gt;/g, '<ul>')
                .replace(/&lt;li&gt;/g, '<li>')
                .replace(/&lt;\/li&gt;/g, '</li>')
                .replace(/&lt;\/ul&gt;/g, '</ul>');
              newList.push(JSON.parse(list[i]));
            }
            // console.log(list);
            this.coupons = newList;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    keepAddTQL() {
      if (this.awardClassType === 0) {
        this.keepAddTQLCoupon();
      } else {
        this.keepAddTQLThing();
      }

      console.log('保存添加');
    },
    keepAddTQLCoupon() {
      const { chooseCouponObjList, chooseRank, chooseCoupon, prizeName } = this;
      if (prizeName && chooseCoupon && chooseRank && chooseCouponObjList.length > 0) {
        addTQLAward({
          template_id: chooseCoupon.join(','),
          prize_name: prizeName,
          splid: this.splid,
          kind: this.kind,
          rank: chooseRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.addAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    keepAddTQLThing() {
      const { awardType, chooseRank } = this;
      if (awardType && chooseRank) {
        addTQLAward({
          template_id: '',
          prize_name: awardType,
          splid: this.splid,
          kind: this.kind,
          rank: chooseRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.addAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    keepAutoAddTQL() {
      if (this.awardClassType === 0) {
        this.keepAutoAddTQLCoupon();
      } else {
        this.keepAutoAddTQLThing();
      }
    },
    keepAutoAddTQLThing() {
      const { awardType, chooseStartRank, chooseEndRank } = this;
      if (chooseEndRank && awardType && chooseStartRank && chooseStartRank && chooseEndRank) {
        addTQLAutoAward({
          template_id: '',
          prize_name: awardType,
          splid: this.splid,
          kind: this.kind,
          rank_start: chooseStartRank,
          rank_end: chooseEndRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.autoAddAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },

    keepAutoAddTQLCoupon() {
      const { chooseCoupon, chooseCouponObjList, chooseStartRank, chooseEndRank, prizeName } = this;
      if (chooseCoupon && chooseEndRank && chooseCouponObjList.length > 0 && chooseStartRank && prizeName) {
        addTQLAutoAward({
          template_id: chooseCoupon.join(','),
          prize_name: prizeName,
          splid: this.splid,
          kind: this.kind,
          rank_start: this.chooseStartRank,
          rank_end: this.chooseEndRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.autoAddAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
      console.log('保存添加');
    },
    cancelAdd() {
      this.clearData();
    },
    cancelAutoAdd() {
      this.clearData();
    },
    keepEditTQL() {
      if (this.awardClassType === 0) {
        this.keepEditTQLCoupon();
      } else {
        this.keepEditTQLThing();
      }

      console.log('保存添加');
    },
    keepEditTQLThing() {
      const { awardType, chooseRank, AwardData } = this;
      if (chooseRank && awardType) {
        editTQLAward({
          template_id: this.chooseCoupon,
          prize_name: awardType,
          splid: this.splid,
          cusaward_id: String(AwardData.cusaward_id),
          kind: AwardData.kind,
          rank: this.chooseRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '编辑奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.editAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    keepEditTQLCoupon() {
      const { chooseCoupon, prizeName, chooseCouponObjList, chooseRank, AwardData } = this;
      if (prizeName && chooseCoupon && chooseRank && chooseCouponObjList.length > 0) {
        editTQLAward({
          template_id: chooseCoupon.join(','),
          prize_name: prizeName,
          splid: this.splid,
          cusaward_id: String(AwardData.cusaward_id),
          kind: AwardData.kind,
          rank: chooseRank,
        }).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '编辑奖项成功',
              type: 'success',
            });
            console.log(res);
            this.$refs.table.fetchTQLAwardList();
          }
        });
        this.clearData();
        this.editAwardDialogVisible = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    cancelEdit() {
      this.clearData();
    },
    clearData() {
      this.editAwardDialogVisible = false;
      this.addAwardDialogVisible = false;
      this.autoAddAwardDialogVisible = false;
      this.awardType = '';
      this.awardClassType = 0;
      this.chooseCoupon = '';
      this.chooseRank = '';
      this.chooseStartRank = '';
      this.chooseEndRank = '';
      this.AwardData = null;
      this.prizeName = '';
      this.chooseCoupon = [];
    },
  },
  created() {
    if (this.TQL) {
      this.initRanks();
      this.getTqlCouponList();
    }
  },
};
</script>

<style lang="less" scoped>
.coupon-list-wrap {
  max-height: 400px;
  overflow-y: scroll;
}
.btn-position {
  margin-right: 40px;
}
.awardClassTypes {
  width: 80%;
  margin: 0 auto;
  height: 35px;
  font-size: 24px;
  display: flex;
  .awardClassType {
    width: 50%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    &.active {
      color: #249aff;
      font-weight: bold;
      .award-line {
        background: #249aff;
        position: absolute;
        width: 23px;
        height: 3px;
        left: 50%;
        transform: translateX(-50%);
        bottom: -5px;
      }
    }
  }
}
.editTitle {
  display: flex;
  .title-text {
    font-size: 26px;
    font-family: SourceHanSansSC-Regular, SourceHanSansSC;
    font-weight: 400;
    color: #42474e;
  }
}
.editInfo-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .editInfo-container-item {
    display: flex;
    align-items: center;
    margin-top: 30px;
  }
  .uploadImg {
    .uploadImg-input-box {
      width: 129px;
      height: 77px;
      border-radius: 4px;
      border: 1px dashed #cccccc;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 80px;
    }
    .uploadImg-btn {
      margin-left: 20px;
      .tips {
        margin-top: 10px;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .award-info {
    .title {
      font-size: 15px;
      font-family: SourceHanSansSC-Normal, SourceHanSansSC;
      font-weight: 400;
      color: #6f7682;
    }
    .input {
      margin-left: 80px;
    }
    .tips {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c7cdd5;
      margin-left: 20px;
    }
  }
}
.editBtn-group {
  padding-left: 143px;
  margin-top: 30px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  .save-btn,
  .cancel-btn {
    padding: 10px 40px;
  }
  .cancel-btn {
    margin-left: 30px;
  }
}

.coupon-detail {
  // margin-left: 10px;
  position: relative;
  width: 632px;
  //   height: 51px;
  .coupon-detail-bg {
    // position: absolute;
    width: 532px;
    // height: 102px;
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 532px;
      height: 102px;
    }
    .logo {
      position: absolute;
      right: 0;
      width: 102px;
      height: 102px;
    }
  }
  .coupon-detail-info {
    // position: absolute;
    width: 430px;
    // height: 102px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px 0px 5px #d5e1ff;
    flex-wrap: wrap;
    .coupon-detail-item {
      width: 50%;
    }
  }
}
</style>
