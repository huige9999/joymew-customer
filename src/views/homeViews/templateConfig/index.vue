<template>
  <sub-page>
    <div class="header">
      互动模版是减少每场互动繁琐的配置，比如游戏时间、获奖人数、签到语、LOGO信息、奖品信息等。有了模版后，创建活动时，只需选择模版，上传新人婚纱照即可，让活动更方便。
    </div>
    <main-card>
      <div class="noConfigArea" v-if="isEmptyTemplates">
        <div class="emptyTemplate">
          <img src="@/assets/image/icon/noConfigLogo.png" class="noConfigIcon" />
          <div class="createTip">您还没有模版，是否去创建？</div>
          <div class="createBtn" @click="openCtcDialog">去创建</div>
        </div>
      </div>
      <div class="configArea" v-if="!isEmptyTemplates">
        <div class="topAdd">
          <div class="addBtn" @click="openCtcDialog"><label>+</label>新增模板</div>
        </div>
        <my-table>
          <el-table :data="tableData" style="width: 100%" highlight-current-row header-row-class-name="table-header">
            <el-table-column type="index" width="120" align="center" label="序号"></el-table-column>
            <el-table-column prop="theme" label="模板名称" align="center"></el-table-column>
            <el-table-column prop="operate" label="操作" align="center" width="240">
              <template slot-scope="scope">
                <div class="operates" v-if="!(scope.row.is_forbit_edit && scope.row.is_forbit_edit === '1')">
                  <div class="oprateItem config" @click="openEtcDialog(scope.row.id)">修改</div>
                  <div class="oprateItem config" @click="toSetting(scope.row.id)">配置</div>
                  <div class="oprateItem edit" @click="deleteTemplate(scope.row.id, scope.row.theme)">删除</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </my-table>
      </div>
    </main-card>
    <!-- 创建模板弹窗 -->
    <my-dialog :show="ctcDialogVisible" class="ctcDialogWrap">
      <template v-slot:title>
        <div class="top">
          <div class="title">创建模板</div>
          <img src="@/assets/image/close.png" class="closeIcon" @click="closeCtcDialog" />
        </div>
      </template>
      <div class="fItem">
        <div class="label">模板名称：</div>
        <el-input v-model="templateName" class="ipt" maxlength="20"> </el-input>
      </div>
      <div class="cBtn" @click="createTemplate">创建</div>
    </my-dialog>
    <!-- 更新模板弹窗 -->
    <my-dialog :show="etcDialogVisible" class="ctcDialogWrap">
      <template v-slot:title>
        <div class="top">
          <div class="title">修改模板</div>
          <img src="@/assets/image/close.png" class="closeIcon" @click="closeEtcDialog" />
        </div>
      </template>
      <div class="fItem">
        <div class="label">模板名称：</div>
        <el-input v-model="templateName" class="ipt" maxlength="20"> </el-input>
      </div>
      <div class="cBtn" @click="requestEditInfo">修改</div>
    </my-dialog>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MyTable from '@/components/myTable';
import MainCard from '@/components/mainCard';
import myDialog from '@/components/myDialog';
import messageMixin from '@/mixins/messageBoxMixin';
import request from '@/utils/request';
import { getTemplateList, createTemplate } from '@/api/app/live';
import { getActivity } from '@/api/setting/activitySetting/theme';
import { editActivityMsg } from '@/api/setting/activitySetting/activity';

export default {
  name: 'templateConfig',
  mixins: [messageMixin],
  components: {
    MainCard, SubPage, myDialog, MyTable,
  },
  data() {
    return {
      ctcDialogVisible: false,
      etcDialogVisible: false,
      templateName: '',
      isEmptyTemplates: true,
      tableData: [],
      currentTemplateId: '',
    };
  },
  methods: {
    openCtcDialog() {
      this.ctcDialogVisible = true;
    },
    closeCtcDialog() {
      this.ctcDialogVisible = false;
    },
    openEtcDialog(id) {
      getActivity({
        splid: id,
      })
        .then((res) => {
          console.log(res);
          const info = res.data;
          // this.createForm.name = info.theme;
          // this.createForm.date = info.using_date;
          // this.createForm.type = info.scenario.length === 1 ? info.scenario : info.scenario.slice(0, 1);
          // this.createForm.address = info.hotel_name;
          // this.createForm.phone_zfb = info.phone_zfb;
          // this.selector = info.hide_gift_switch;
          // this.isSendSystemGift = info.isSendSystemGift;
          // this.isNeedUserComment = info.isNeedUserComment;
          // this.isGiftToHbkd = info.is_gift_to_hbkd;
          // this.hui_suo_switch = info.hui_suo_switch;
          // this.is_end_wedding = info.is_end_wedding;
          // this.isLimitBuyHbq = info.isLimitBuyHbq;
          this.templateName = info.theme;
          this.currentTemplateId = id;
          this.etcDialogVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    closeEtcDialog() {
      this.etcDialogVisible = false;
    },
    requestEditInfo() {
      if (this.is_show_phone === '1' && this.createForm.phone_zfb.length !== 11) {
        this.$message.error('手机号格式错误!');
        return;
      }
      const data = {
        splid: this.currentTemplateId,
        theme: this.templateName,
        // hotel_name: this.createForm.address,
        // hide_gift_switch: this.selector,
        // isSendSystemGift: this.isSendSystemGift,
        // isNeedUserComment: this.isNeedUserComment,
        // is_gift_to_hbkd: this.isGiftToHbkd,
        // isLimitBuyHbq: this.isLimitBuyHbq,
        // hui_suo_switch: this.hui_suo_switch,
        // phone_zfb: this.createForm.phone_zfb,
        // is_end_wedding: this.is_end_wedding,
      };
      editActivityMsg(data).then((res) => {
        console.log('提交修改', res);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功',
          });
        }
        this.getTemplateList();
        this.closeEtcDialog();
      });
    },
    getTemplateList() {
      this.tableData = [];
      getTemplateList({
        showCount: 10,
        currentPage: 1,
      })
        .then((res) => {
          console.log(res);
          this.tableData = res.data.liveList;
          if (this.tableData.length === 0) {
            this.isEmptyTemplates = true;
          } else {
            this.isEmptyTemplates = false;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createTemplate() {
      if (!this.templateName) {
        this.alertError('模板名称不能为空!');
        return;
      }
      if (this.tableData.length >= 10) {
        this.alertError('最多创建10个模板!');
        return;
      }
      createTemplate({
        theme: this.templateName,
        isTemplate: '1',
        scenario: '0',
      })
        .then((res) => {
          console.log(res);
          // this.alertSuccess('创建成功');
          this.closeCtcDialog();
          // this.templateName = '';
          // this.getTemplateList();
          this.$confirm('模板创建成功,是否跳转到配置页面', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info',
          })
            .then((result) => {
              if (result === 'confirm') {
                this.toSetting(res.data.id);
              }
            })
            .catch(() => {
              this.templateName = '';
              this.getTemplateList();
            });
        })
        .catch((err) => {
          console.log(err);
          this.alertError('创建失败！');
        });
    },
    deleteTemplate(id, deleteName = undefined) {
      return this._asyncDeleteTemplate(id, deleteName)
        .then(() => {
          // 弹出成功提示
          this.alertSuccess('删除成功');
          this.getTemplateList();
        })
        .catch((err) => {
          // 非取消造成的失败
          if (err.toString() !== 'Error: cancel') {
            this.alertError('删除失败');
          }
        });
    },
    async _asyncDeleteTemplate(id, deleteName) {
      let msg;
      if (typeof deleteName === 'undefined') {
        msg = '确认删除此模板？';
      } else {
        msg = `确认删除模板：${deleteName}？`;
      }
      // 删除活动确认框
      await this.confirmBox(msg, 'error');
      // 提交删除请求
      await request.post('/huoDongHm/shanChuHuoDong', {
        splid: id,
      });
    },
    toSetting(id) {
      this.$store.commit('initLiveInfo', {
        liveId: id,
        sceneType: '0',
        isTemplate: true,
      });
      this.$router.push('/app/activity/activityInfo/themeSetting');
    },
  },
  created() {},
  mounted() {
    this.getTemplateList();
  },
};
</script>

<style lang="less" scoped>
.header {
  font-size: 20px;
  color: #333333;
  font-weight: 400;
  padding: 20px;
  width: 100%;
  background-color: #ffffff;
  line-height: 30px;
  .blue {
    color: #1e87f0;
  }
  .red {
    color: #ff1e1e;
  }
}
.noConfigArea {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  .emptyTemplate {
    display: flex;
    flex-direction: column;
    align-items: center;
    .noConfigIcon {
      width: 318px;
      height: 255px;
      margin-right: 53px;
    }
    .createTip {
      font-size: 24px;
      font-weight: 400;
      color: #333333;
      margin-top: 39px;
    }
    .createBtn {
      width: 102px;
      height: 40px;
      background: #1e87f0;
      border-radius: 3px;
      text-align: center;
      line-height: 40px;
      margin-top: 27px;
      font-size: 18px;
      font-weight: 400;
      color: #ffffff;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
      }
    }
  }
}
.configArea::v-deep {
  flex: 1;
  padding: 35px;
  .topAdd {
    display: flex;
    justify-content: flex-end;
    font-size: 18px;
    font-weight: 400;
    color: #ffffff;
    .addBtn {
      width: 118px;
      height: 41px;
      background: #1e87f0;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      label {
        margin-right: 4px;
      }
      &:hover {
        opacity: 0.6;
      }
    }
  }
  .operates {
    display: flex;
    justify-content: center;
    width: 100%;
    cursor: pointer;
    .oprateItem {
      font-size: 18px;
      font-weight: 400;
      margin: 0 12px;
      &.edit {
        color: #ff4646;
      }
      &.config {
        color: #1e87f0;
      }
    }
  }
  .my-table {
    padding: 0;
    margin-top: 10px;
  }
}
.ctcDialogWrap::v-deep {
  .el-dialog {
    width: 620px;
    height: 340px;
    border-radius: 16px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 28px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
    }
    .closeIcon {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
  .fItem {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 83px;
    .label {
      font-size: 32px;
      font-weight: 500;
      color: #333333;
    }
    .ipt {
      width: 313px;
      border-radius: 8px;
    }
  }
  .cBtn {
    width: 118px;
    height: 44px;
    background: #249aff;
    border-radius: 4px;
    line-height: 44px;
    text-align: center;
    margin-top: 60px;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
    cursor: pointer;
    margin-left: 50%;
    transform: translateX(-50%);
    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
