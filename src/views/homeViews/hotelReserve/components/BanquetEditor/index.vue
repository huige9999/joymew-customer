<template>
  <div class="formWrap">
    <div class="formArea">
      <!-- {{banquetList}} -->
      <el-row :gutter="12" class="banquetList">
        <el-col :span="6" class="banqueItem" v-for="banquet in banquetList" :key="'banquetId' + banquet.banquetId">
          <el-image :src="banquet.content.detail.posterList[0]" class="img" fit="cover">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
          </el-image>
          <div class="baseInfo">
            {{ banquet.content.name }}
          </div>
          <div class="op-wrap">
            <el-link type="primary" @click="deleteCurrentBanquet(banquet.banquetId)">删除</el-link>
            <el-link type="primary" class="item" @click.native="openEditBanquetForm(banquet.banquetId)">修改</el-link>
          </div>
        </el-col>

        <el-col :span="6" class="banqueItem center" @click.native="showEdit">
          <i class="el-icon-plus"></i>
        </el-col>
      </el-row>

      <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :title="title"
        append-to-body
        :visible.sync="dialogVisible"
        width="50%"
        @close="handleClose"
      >
        <div class="formArea" v-if="dialogVisible">
          <!-- <div class="formTit">编辑宴会厅：</div> -->
          <el-steps :active="active" finish-status="finish" align-center style="margin: 10px 0; margin-bottom: 20px">
            <el-step title="step1" description="宴会厅基本信息" @click.native="FormStep = 0"></el-step>
            <el-step title="step2" description="宴会厅详情" @click.native="FormStep = 1"></el-step>
            <el-step title="step3" description="宴会厅海报" @click.native="FormStep = 2"></el-step>
          </el-steps>
          <!-- <div class="formTit2" v-show="FormStep === 0">宴会厅基本信息(step1)：</div>
          <div class="formTit2" v-show="FormStep === 1">宴会厅详情(step2)：</div>
          <div class="formTit2" v-show="FormStep === 2">宴会厅海报(step3)：</div> -->
          <el-form ref="form" :model="value" label-width="80px">
            <el-form-item label="名称" v-show="FormStep === 0">
              <el-input :value="value.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入宴会厅名称"></el-input>
            </el-form-item>
            <el-form-item label="桌数" v-show="FormStep === 0">
              <el-input :value="value.deskNum" maxlength="10" @input="onEditFormDeskNumInput" placeholder="请输入桌数(如:0-0)"></el-input>
              <label class="tip1">格式：0-0</label>
            </el-form-item>
            <el-form-item label="每桌价格" v-show="FormStep === 0">
              <el-input-number
                :value="value.pricePerDesk"
                :precision="2"
                :step="0.1"
                :max="10000"
                @input="onEditFormPricePerDeskInput"
              ></el-input-number>
              <label class="tip2">元/桌</label>
            </el-form-item>
            <el-form-item label="柱" v-show="FormStep === 0">
              <el-radio-group v-model="value.columnStatus" @change="onEditFormColumnStatusChange">
                <el-radio label="0">无</el-radio>
                <el-radio label="1">有</el-radio>
                <el-radio label="2">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="层高" v-show="FormStep === 0">
              <el-input-number
                :value="value.floorHeight"
                :precision="2"
                :step="0.1"
                :max="1000"
                @input="onEditFormFloorHeightInput"
              ></el-input-number>
              <label class="tip2">米</label>
            </el-form-item>
            <el-form-item v-show="FormStep === 0">
              <el-button type="primary" @click="nextEditForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="特色" v-show="FormStep === 1">
              <el-input type="textarea" :rows="4" :value="value.detail.feature" @input="onEditFormDetailFeatureInput" maxlength="120">
              </el-input>
            </el-form-item>
            <el-form-item label="起订价格" v-show="FormStep === 1">
              <el-input-number
                :value="value.detail.priceStartOrder"
                :precision="2"
                :step="0.1"
                :max="10000"
                @input="onEditFormDetailPriceStartOrderInput"
              ></el-input-number>
              <label class="tip2">元/桌</label>
            </el-form-item>
            <div>
              <el-form-item label="起订桌数" v-show="FormStep === 1">
                <el-input-number
                  :value="value.detail.deskNumStartOrder"
                  :precision="0"
                  :max="1000"
                  @input="onEditFormDetailDeskNumStartOrderInput"
                ></el-input-number>
                <label class="tip2">桌</label>
              </el-form-item>
              <el-form-item label="桌规格" v-show="FormStep === 1">
                <el-input-number
                  :value="value.detail.deskSpecification"
                  :max="100"
                  :precision="0"
                  @input="onEditFormDetailDeskSpecificationInput"
                ></el-input-number>
                <label class="tip2">人/桌</label>
              </el-form-item>
              <el-form-item label="迎宾区" v-show="FormStep === 1">
                <el-radio-group :value="value.detail.areaWelcomeGuestsStatus" @change="onEditFormDetailAreaWelcomeGuestsStatusChange">
                  <el-radio label="0">无</el-radio>
                  <el-radio label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="香槟塔" v-show="FormStep === 1">
                <el-radio-group :value="value.detail.champagneTowerStatus" @change="onEditFormDetailChampagneTowerStatusChange">
                  <el-radio label="0">无</el-radio>
                  <el-radio label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="舞台" v-show="FormStep === 1">
                <el-radio-group :value="value.detail.stageStatus" @change="onEditFormDetailStageStatusChange">
                  <el-radio label="0">无</el-radio>
                  <el-radio label="1">有</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="服务价格" v-show="FormStep === 1">
                <el-input :value="value.detail.servicePrice" maxlength="40" @input="onEditFormDetailServicePriceInput"></el-input>
              </el-form-item>
              <el-form-item v-show="FormStep === 1">
                <el-button type="primary" @click="previousEditForm">上一步</el-button>
                <el-button type="primary" @click="nextEditForm">下一步</el-button>
              </el-form-item>
            </div>

            <el-form-item label="海报图" v-show="FormStep === 2">
              <el-upload action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false">
                <div class="LBImgWrap">
                  <div class="uploadLBImg" v-for="img in value.detail.posterList" :key="img" @click.stop="() => {}">
                    <div class="close" @click="removeCurrentCarousel(img)"></div>
                    <img :src="img" alt="" class="img" />
                  </div>
                  <div class="uploadLBImg">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item v-show="FormStep === 2">
              <el-button type="primary" @click="previousEditForm">上一步</el-button>
              <el-button type="primary" @click="submitEditForm">{{ formType }}</el-button>
              <el-button @click="resetForm">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getBanquetList, addBanquet, editBanquet, deleteBanquet } from '@/api/hotelReserve/index';
import { uploadImg } from '../index';

export default {
  name: 'BanquetEditor',
  props: {
    value: Object,
    id: [Number, String],
    banquetList: Array,
  },
  data() {
    return {
      previewStatus: 0, // 0: 展示列表 1：展示详情
      FormStep: 0,
      dialogVisible: false,
    };
  },
  computed: {
    title() {
      return this.value.id ? '编辑宴会厅' : '添加宴会厅';
    },
    active() {
      return this.FormStep + 1;
    },
    formType() {
      return this.value.id ? '修改' : '添加';
    },
  },
  created() {
    if (!this.id) {
      this.$message.error('酒店信息错误');
      return;
    }
    this.getBanquetList();
  },
  methods: {
    sure() {},
    nextStep() {},
    showEdit() {
      this.dialogVisible = true;
      this.$emit('input', {
        id: null,
        name: '宴会厅名称', // 名称
        deskNum: '0', // 桌数
        pricePerDesk: '0', // 每桌价格
        columnStatus: '0', // 柱有无
        floorHeight: '0', // 层高
        detail: {
          feature: '详细介绍宴会厅的特色', // 特色
          priceStartOrder: '0', // 起订价格 单位元/桌
          deskNumStartOrder: '0', // 起订桌数
          deskSpecification: '0', // 桌规格 单位人/桌
          areaWelcomeGuestsStatus: '0', // 迎宾区有无
          champagneTowerStatus: '0', // 香槟塔有无
          stageStatus: '0', // 舞台有无
          servicePrice: '0', // 服务价格
          posterList: [],
        },
      });
      this.$emit('update', {
        previewStatus: 1,
      });
    },
    getBanquetList() {
      if (!this.id) {
        return;
      }
      getBanquetList(this.id)
        .then((res) => {
          console.log(res);
          if (res.data.list.length > 0) {
            this.$emit('update', {
              banquetList: res.data.list.map((item) => ({
                banquetId: item.wedding_banquet_id,
                content: JSON.parse(item.json_data),
              })),
            });
          } else {
            this.$emit('update', {
              banquetList: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openEditBanquetForm(banquetId) {
      console.log('打开编辑页面');
      this.currentBanquetId = banquetId;
      const currentBanquet = this.banquetList.find((item) => item.banquetId === this.currentBanquetId);
      console.log(currentBanquet);
      const { name, deskNum, pricePerDesk, columnStatus, floorHeight, detail } = currentBanquet.content;
      const {
        feature,
        priceStartOrder,
        deskNumStartOrder,
        deskSpecification,
        posterList,
        servicePrice,
        stageStatus,
        champagneTowerStatus,
        areaWelcomeGuestsStatus,
      } = detail;
      this.$emit('update', {
        previewStatus: 1,
      });
      const data = {
        id: banquetId,
        name, // 名称
        deskNum, // 桌数
        pricePerDesk, // 每桌价格
        columnStatus: String(columnStatus), // 柱有无
        floorHeight, // 层高
        detail: {
          feature, // 特色
          priceStartOrder, // 起订价格 单位元/桌
          deskNumStartOrder, // 起订桌数
          deskSpecification, // 桌规格 单位人/桌
          areaWelcomeGuestsStatus, // 迎宾区有无
          champagneTowerStatus: String(champagneTowerStatus), // 香槟塔有无
          stageStatus: String(stageStatus), // 舞台有无
          servicePrice, // 服务价格
          posterList,
        },
      };
      console.log(data);
      this.$emit('input', data);
      this.FormStep = 0;
      this.previewStatus = 1;
      this.$emit('update', {
        previewStatus: 1,
      });
      this.dialogVisible = true;
    },
    deleteCurrentBanquet(banquetId) {
      this.$confirm('确认删除当前宴会厅?')
        .then(() => {
          console.log(`删除${banquetId}`);
          deleteBanquet(banquetId)
            .then((res) => {
              console.log(res);
              this.getBanquetList();
              this.$message.success('删除成功!');
            })
            .catch((err) => {
              console.log(err);
              this.$message.error('删除失败!');
            });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    handleClose() {
      // this.dialogVisible = false;
      this.resetForm();
    },
    submitEditForm() {
      const { name, deskNum, detail } = this.value;
      if (!name) {
        this.$message({
          type: 'warning',
          message: '宴会厅名称不能为空!',
        });
        return;
      }
      if (!deskNum) {
        this.$message({
          type: 'warning',
          message: '桌数不能为空!',
        });
        return;
      }

      if (!detail.feature) {
        this.$message({
          type: 'warning',
          message: '特色不能为空!',
        });
        return;
      }
      if (!detail.priceStartOrder && detail.priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订价格!',
        });
        return;
      }
      if (!detail.deskNumStartOrder && detail.deskNumStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订桌数!',
        });
        return;
      }
      if (!detail.deskSpecification) {
        this.$message({
          type: 'warning',
          message: '请输入正确的桌规格!',
        });
        return;
      }
      if (!detail.servicePrice) {
        this.$message({
          type: 'warning',
          message: '服务价格不能为空!',
        });
        return;
      }
      if (detail.posterList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张海报图!',
        });
        return;
      }
      console.log(this.value);
      if (this.value.id) {
        const { id } = this.value;
        editBanquet(id, JSON.stringify(this.value))
          .then((res) => {
            console.log(res);
            this.resetForm();
            this.getBanquetList();
            this.$message.success('编辑成功!');
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('编辑失败!');
          });
        return;
      }
      if (!this.id) {
        this.$message.error('酒店信息错误');
        return;
      }
      addBanquet(this.id, JSON.stringify(this.value))
        .then((res) => {
          console.log(res);
          this.resetForm();
          this.getBanquetList();
          this.$message.success('创建成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
        });
    },
    resetForm() {
      this.FormStep = 0;
      this.dialogVisible = false;
      this.previewStatus = 0;
      this.$emit('update', {
        previewStatus: 0,
      });
      this.$emit('input', {
        id: null,
        name: '宴会厅名称', // 名称
        deskNum: '0', // 桌数
        pricePerDesk: '0', // 每桌价格
        columnStatus: '0', // 柱有无
        floorHeight: '0', // 层高
        detail: {
          feature: '详细介绍宴会厅的特色', // 特色
          priceStartOrder: '0', // 起订价格 单位元/桌
          deskNumStartOrder: '0', // 起订桌数
          deskSpecification: '0', // 桌规格 单位人/桌
          areaWelcomeGuestsStatus: '0', // 迎宾区有无
          champagneTowerStatus: '0', // 香槟塔有无
          stageStatus: '0', // 舞台有无
          servicePrice: '0', // 服务价格
          posterList: [],
        },
      });
    },
    removeCurrentCarousel(imgPath) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          posterList: this.value.detail.posterList.filter((item) => item !== imgPath),
        },
      });
    },
    handleFormImgFile(e) {
      console.log(e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
      console.log('打印图片');
      console.log(e.file);
      // this.requestUploadImg(e.file);
      uploadImg(e.file)
        .then((res) => {
          const posterList = this.value.detail.posterList.map((item) => item);
          posterList.push(res);
          console.log(res);
          this.$emit('input', {
            ...this.value,
            detail: {
              ...this.value.detail,
              posterList,
            },
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    nextEditForm() {
      if (this.FormStep === 2) {
        return;
      }
      this.FormStep += 1;
    },
    previousEditForm() {
      if (this.FormStep === 0) {
        return;
      }
      this.FormStep -= 1;
    },
    onEditFormNameInput(val) {
      this.$emit('input', {
        ...this.value,
        name: val,
      });
    },
    onEditFormDeskNumInput(val) {
      this.$emit('input', {
        ...this.value,
        deskNum: val,
      });
    },
    onEditFormPricePerDeskInput(val) {
      this.$emit('input', {
        ...this.value,
        pricePerDesk: val,
      });
    },
    onEditFormColumnStatusChange(val) {
      this.$emit('input', {
        ...this.value,
        columnStatus: val,
      });
    },
    onEditFormFloorHeightInput(val) {
      this.$emit('input', {
        ...this.value,
        floorHeight: val,
      });
    },
    onEditFormDetailFeatureInput(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          feature: val,
        },
      });
    },
    onEditFormDetailPriceStartOrderInput(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          priceStartOrder: val,
        },
      });
    },
    onEditFormDetailDeskNumStartOrderInput(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          deskNumStartOrder: val,
        },
      });
    },
    onEditFormDetailDeskSpecificationInput(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          deskSpecification: val,
        },
      });
    },
    onEditFormDetailAreaWelcomeGuestsStatusChange(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          areaWelcomeGuestsStatus: val === '1' ? '0' : '1',
        },
      });
    },
    onEditFormDetailChampagneTowerStatusChange(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          champagneTowerStatus: val === '1' ? '0' : '1',
        },
      });
    },
    onEditFormDetailStageStatusChange(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          stageStatus: val === '1' ? '0' : '1',
        },
      });
    },
    onEditFormDetailServicePriceInput(val) {
      this.$emit('input', {
        ...this.value,
        detail: {
          ...this.value.detail,
          servicePrice: val,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.center {
  display: flex;
  // width: 100%;
  height: 160px;
  margin-bottom: 40px;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  i {
    font-size: 120rpx;
  }
}
.myMainCard {
  position: relative;
}
.formWrap {
  width: 100%;
  min-height: 600px;
}
.banquetList {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  .banqueItem {
    margin-top: 12px;
    box-sizing: border-box;

    // margin-left:12px;
    .img {
      // width: 213px;
      height: 160px;
    }
    .baseInfo {
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .op-wrap {
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .item {
        margin-left: 10px;
      }
    }
  }
}
.LBImgWrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .uploadLBImg {
    width: 213.33px;
    height: 120px;
    margin-left: 17px;
    margin-top: 17px;
    border: 1px solid #dcdcdc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    position: relative;
    .close {
      width: 24px;
      height: 24px;
      background-image: url('~@/assets/image/hotel/close.png');
      background-size: 100% 100%;
      position: absolute;
      top: -12px;
      right: -12px;
    }
    .img {
      width: 213.33px;
      height: 120px;
      pointer-events: none;
      // border: 1px solid #dcdcdc;
    }
  }
}
// width: 50%;
.uploadImg {
  box-sizing: border-box;
  display: block;
  position: relative;
  .avatar {
    width: 160px;
    height: 160px;
    border: 1px solid #dcdcdc;
  }
  .el-upload__tip {
    display: none;
  }
}
</style>
