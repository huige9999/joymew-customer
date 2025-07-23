<template>
  <div class="formWrap">
    <div class="formAreaWrap">
      <!-- {{banquetList}} -->
      <el-row :gutter="12" class="banquetList">

        <el-col :span="6" class="banqueItem" v-for="menu in menuList" :key="'menuId' + menu.menuId">
          <!-- <img :src="banquet.content.detail.posterList[0]" alt="" class="img" /> -->
          <el-image :src="menu.content.coverPath" class="img" fit="cover">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
          </el-image>
          <div class="baseInfo">
            {{ menu.content.name }}
          </div>
          <div class="op-wrap">
            <el-link type="primary" @click="deleteCurrentMenu(menu.menuId)">删除</el-link>
            <el-link type="primary" class="item" @click="openEditMenuForm(menu.menuId)">修改</el-link>
          </div>
        </el-col>

        <el-col :span="6" class="banqueItem center" @click.native="showEdit">
          <i class="el-icon-plus"></i>
        </el-col>
      </el-row>

      <el-dialog   :close-on-click-modal="false" :close-on-press-escape="false"  :title="title" append-to-body :visible.sync="dialogVisible" width="50%" @close="handleClose">
        <!-- 表单——编辑套餐 -->
        <div class="formArea">
          <!-- <div class="formTit">编辑套餐：</div> -->
          <el-form ref="form" :model="value" label-width="80px">
            <el-steps :active="active" finish-status="finish" align-center style="margin:10px 0;margin-bottom:20px">
              <el-step title="step1" description="套餐基本信息"  @click.native="FormStep=0"></el-step>
              <el-step title="step2"  description="套餐列表"  @click.native="FormStep=1"></el-step>
              <el-step title="step3"  description="套餐其他信息"  @click.native="FormStep=2"></el-step>
            </el-steps>
            <!-- <div class="formTit2" v-show="FormStep === 0">套餐基本信息(step1)：</div>
            <div class="formTit2" v-show="FormStep === 1">套餐列表(step2)：</div>
            <div class="formTit2" v-show="FormStep === 2">套餐其他信息(step3)：</div> -->
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
            <el-form-item label="套餐封面" v-show="FormStep === 0">
              <el-upload action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
                <img v-if="value.coverPath" :src="value.coverPath" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="名称" v-show="FormStep === 0">
              <el-input :value="value.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入套餐名称"></el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 0">
              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="套餐" v-show="FormStep === 1">
              <el-input type="textarea" :rows="12" :value="value.dishList" maxlength="300" @input="onEditFormDishListInput"> </el-input>
              <label class="tip3">每道菜用分号(;)隔开</label>
            </el-form-item>
            <el-form-item v-show="FormStep === 1">
              <el-button type="primary" @click="previousForm">上一步</el-button>
              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="服务费" v-show="FormStep === 2">
              <el-input
                :value="value.otherPrice.servicePrice"
                maxlength="5"
                @input="onEditFormServicePriceInput"
                placeholder="请输入服务费"
              ></el-input>
            </el-form-item>
            <el-form-item label="开瓶费" v-show="FormStep === 2">
              <el-input
                :value="value.otherPrice.openBottlePrice"
                maxlength="5"
                @input="onEditFormOpenBottlePriceInput"
                placeholder="请输入开瓶费"
              ></el-input>
            </el-form-item>
            <el-form-item label="进场费" v-show="FormStep === 2">
              <el-input
                :value="value.otherPrice.approachPrice"
                maxlength="5"
                @input="onEditFormApproachPriceInput"
                placeholder="请输入进场费"
              ></el-input>
            </el-form-item>
            <el-form-item label="附加信息" v-show="FormStep === 2">
              <el-input type="textarea" :rows="4" :value="value.additionInfo" maxlength="120" @input="onEditFormAdditionInfoInput">
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 2">
              <el-button type="primary" @click="previousForm">上一步</el-button>
              <el-button type="primary" @click="submitForm">立即{{formType}}</el-button>
              <el-button @click="resetForm">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getMenuList, addMenu, editMenu, deleteMenu } from '@/api/hotelReserve/index';
import { uploadImg } from '../index';

export default {
  name: 'MenuEditor',
  props: {
    value: Object,
    id: [Number, String],
    menuList: Array,
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
      return this.value.id ? '编辑套餐' : '添加套餐';
      // return this.dishList.join( '')
    },
    active() {
      return this.FormStep;
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
    this.getMenuList();
  },

  methods: {
    showEdit() {
      this.dialogVisible = true;
      this.$emit('update', {
        previewStatus: 1,
      });
      this.$emit('input', {
        id: null,
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 套餐封面
        dishList: '', // 套餐列表 需要特殊处理
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
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
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 套餐封面
        dishList: '', // 套餐列表 需要特殊处理
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
      });
    },
    handleClose() {
      this.resetForm();
    },
    // 套餐相关
    getMenuList() {
      if (!this.id) {
        return;
      }
      getMenuList(this.id)
        .then((res) => {
          console.log(res.data.list);
          if (res.data.list.length > 0) {
            this.$emit('update', {
              menuList: res.data.list.map((item) => ({
                menuId: item.wedding_menu_id,
                content: JSON.parse(item.json_data),
              })),
            });
          } else {
            this.$emit('update', {
              menuList: [],
            });
            // this.menuList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openEditMenuForm(menuId) {
      console.log('打开编辑页面');
      this.currentMenuId = menuId;
      const currentMenu = this.menuList.find((item) => item.menuId === this.currentMenuId);
      const { name, pricePerDesk, coverPath, dishList, additionInfo, otherPrice } = currentMenu.content;
      const { servicePrice, openBottlePrice, approachPrice } = otherPrice;
      console.log(currentMenu);
      const data = {
        id: menuId,
        name, // 名称
        pricePerDesk, // 每桌价格
        coverPath, // 套餐封面
        dishList: dishList.join(';'), // 套餐列表 需要特殊处理
        otherPrice: {
          servicePrice, // 服务费
          openBottlePrice, // 开瓶费
          approachPrice, // 进场费
        },
        additionInfo, // 附加信息
      };
      this.$emit('input', data);
      this.previewStatus = 1;
      this.$emit('update', {
        previewStatus: 1,
      });
      this.dialogVisible = true;
    },
    submitForm() {
      const { name, pricePerDesk, priceStartOrder, coverPath, dishList } = this.value;

      if (!name) {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空!',
        });
        return;
      }
      if (!pricePerDesk && priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的每桌价格!',
        });
        return;
      }
      if (!coverPath) {
        this.$message({
          type: 'warning',
          message: '套餐封面不能为空!',
        });
        return;
      }
      if (!dishList) {
        this.$message({
          type: 'warning',
          message: '套餐列表不能为空!',
        });
        return;
      }
      // if (!otherPrice.servicePrice) {
      //   this.$message({
      //     type: 'warning',
      //     message: '服务费不能为空!',
      //   });
      //   return;
      // }
      // if (!otherPrice.openBottlePrice) {
      //   this.$message({
      //     type: 'warning',
      //     message: '开瓶费不能为空!',
      //   });
      //   return;
      // }
      // if (!otherPrice.approachPrice) {
      //   this.$message({
      //     type: 'warning',
      //     message: '进场费不能为空!',
      //   });
      //   return;
      // }
      // if (!additionInfo) {
      //   this.$message({
      //     type: 'warning',
      //     message: '附加信息不能为空!',
      //   });
      //   return;
      // }
      const tempForm = {
        ...this.value,
        dishList: dishList.indexOf(';') > -1 ? dishList.split(';') : dishList.split('；'),
      };
      if (this.value.id) {
        editMenu(this.value.id, JSON.stringify(tempForm))
          .then((res) => {
            console.log(res);
            this.resetForm();
            this.getMenuList();
            this.$message.success('编辑成功!');
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('编辑失败!');
          });

        return;
      }

      addMenu(this.id, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.resetForm();
          this.getMenuList();
          this.$message.success('创建成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
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
          this.$emit('input', {
            ...this.value,
            coverPath: res,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    nextForm() {
      if (this.FormStep === 2) {
        return;
      }
      this.FormStep += 1;
    },
    previousForm() {
      if (this.FormStep === 0) {
        return;
      }
      this.FormStep -= 1;
    },
    deleteCurrentMenu(menuId) {
      this.$confirm('确认删除当前套餐?')
        .then(() => {
          console.log(`删除${menuId}`);
          deleteMenu(menuId)
            .then((res) => {
              console.log(res);
              this.resetForm();
              this.getMenuList();
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
    onEditFormPricePerDeskInput(val) {
      this.$emit('input', {
        ...this.value,
        pricePerDesk: val,
      });
    },
    onEditFormNameInput(val) {
      this.$emit('input', {
        ...this.value,
        name: val,
      });
    },
    onEditFormDishListInput(val) {
      this.$emit('input', {
        ...this.value,
        dishList: val,
      });
    },
    onEditFormServicePriceInput(val) {
      this.$emit('input', {
        ...this.value,
        otherPrice: {
          ...this.value.otherPrice,
          servicePrice: val,
        },
      });
    },
    onEditFormOpenBottlePriceInput(val) {
      this.$emit('input', {
        ...this.value,
        otherPrice: {
          ...this.value.otherPrice,
          openBottlePrice: val,
        },
      });
    },
    onEditFormApproachPriceInput(val) {
      this.$emit('input', {
        ...this.value,
        otherPrice: {
          ...this.value.otherPrice,
          approachPrice: val,
        },
      });
    },
    onEditFormAdditionInfoInput(val) {
      this.$emit('input', {
        ...this.value,
        additionInfo: val,
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

.uploadImg {
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  display: block;
  position: relative;
  &::v-deep .el-upload {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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
