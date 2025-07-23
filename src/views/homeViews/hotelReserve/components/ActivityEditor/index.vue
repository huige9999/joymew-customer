<template>
  <div class="formWrap">
    <div class="formArea">
      <!-- {{activityList}} -->
      <el-row :gutter="12" class="activityList">

        <el-col :span="6" class="banqueItem" v-for="activity in activityList" :key="'activityId' + activity.activityId">
          <el-image :src="activity.content.coverPath" class="img" fit="cover">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
          </el-image>
          <div class="baseInfo">
            {{ activity.content.name }}
          </div>
          <div class="op-wrap">
            <el-link type="primary" @click="deleteCurrentActivity(activity.activityId)">删除</el-link>
            <el-link type="primary" class="item" @click.native="openEditActivityForm(activity.activityId)">修改</el-link>
          </div>
        </el-col>

        <el-col :span="6" class="banqueItem center" @click.native="showEdit">
          <i class="el-icon-plus"></i>
        </el-col>
      </el-row>

      <el-dialog  :close-on-click-modal="false" :close-on-press-escape="false" :title="title" append-to-body :visible.sync="dialogVisible" width="50%" @close="handleClose">
        <div class="formArea" v-if="dialogVisible">
          <!-- <div class="formTit">编辑优惠活动：</div> -->
          <el-steps :active="active" finish-status="finish" align-center style="margin:10px 0;margin-bottom:20px">
            <el-step title="step1" description="优惠活动基本信息" @click.native="FormStep = 0"></el-step>
            <!-- <el-step title="step2" description="优惠活动详情" @click.native="FormStep = 1"></el-step> -->
            <el-step title="step2" description="优惠活动详情图片" @click.native="FormStep = 1"></el-step>
          </el-steps>

          <el-form ref="form" :model="value" label-width="120px">
            <el-form-item label="名称" v-show="FormStep === 0">
              <el-input :value="value.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入优惠活动名称"></el-input>
            </el-form-item>
            <el-form-item label="优惠活动描述" v-show="FormStep === 0">
              <el-input
                type="textarea"
                :value="value.desc"
                maxlength="40"
                @input="onEditFormDescInput"
                placeholder="请输入优惠活动描述"
              ></el-input>
            </el-form-item>

            <el-form-item label="菜单封面" v-show="FormStep === 0">
              <el-upload
                action
                multiple
                :http-request="handleFormImgFile2"
                list-type="picture"
                :show-file-list="false"
                class="uploadImgCover"
              >
                <img v-if="value.coverPath" :src="value.coverPath" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
              </el-upload>
            </el-form-item>
            <el-form-item v-show="FormStep === 0">
              <el-button type="primary" @click="nextEditForm">下一步</el-button>
            </el-form-item>
            <el-form-item label="详情图" v-show="FormStep === 1">
              <el-upload action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false">
                <div class="LBImgWrap">
                  <div class="uploadLBImg" v-for="img in value.carouselList" :key="img" @click.stop="() => {}">
                    <div class="close" @click="removeCurrentCarousel(img)"></div>
                    <img :src="img" alt="" class="img" />
                  </div>
                  <div class="uploadLBImg">
                    <i class="el-icon-plus"></i>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item v-show="FormStep === 1">
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
import { getActivityList, addActivity, editActivity, deleteActivity } from '@/api/hotelReserve/index';
import { uploadImg } from '../index';

export default {
  name: 'ActivityEditor',
  props: {
    value: Object,
    id: [Number, String],
    activityList: Array,
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
      return this.value.id ? '编辑优惠活动' : '添加优惠活动';
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
    this.getActivityList();
  },
  methods: {
    sure() {},
    nextStep() {},
    showEdit() {
      this.dialogVisible = true;
      const data = {
        id: null,
        carouselList: [],
        name: '', // 名称
        desc: '', // 名称
        coverPath: '',
      };
      this.$emit('input', data);
      this.$emit('update', {
        previewStatus: 1,
      });
    },
    getActivityList() {
      if (!this.id) {
        return;
      }
      getActivityList(this.id)
        .then((res) => {
          console.log(res);
          if (res.data.list.length > 0) {
            this.$emit('update', {
              activityList: res.data.list.map((item) => ({
                activityId: item.wedding_activity_id,
                content: item.img_json_data ? JSON.parse(item.img_json_data) : {},
              })),
            });
          } else {
            this.$emit('update', {
              activityList: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openEditActivityForm(activityId) {
      console.log('打开编辑页面');
      this.currentActivityId = activityId;
      const currentActivity = this.activityList.find((item) => item.activityId === this.currentActivityId);
      console.log(currentActivity);
      const { name, carouselList, desc, coverPath } = currentActivity.content;
      this.$emit('update', {
        previewStatus: 1,
      });

      const data = {
        id: activityId,
        carouselList,
        name, // 名称
        desc, // 名称
        coverPath,
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
    deleteCurrentActivity(activityId) {
      this.$confirm('确认删除当前优惠活动?')
        .then(() => {
          console.log(`删除${activityId}`);
          deleteActivity(activityId)
            .then((res) => {
              console.log(res);
              this.getActivityList();
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
      const { name, desc, carouselList, coverPath } = this.value;
      if (!name) {
        this.$message({
          type: 'warning',
          message: '优惠活动名称不能为空!',
        });
        return;
      }
      if (!desc) {
        this.$message({
          type: 'warning',
          message: '描述不能为空!',
        });
        return;
      }
      if (!coverPath) {
        this.$message({
          type: 'warning',
          message: '封面不能为空!',
        });
        return;
      }
      if (carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张详情图!',
        });
        return;
      }

      console.log(this.value);
      if (this.value.id) {
        const { id } = this.value;
        editActivity(id, JSON.stringify(this.value))
          .then((res) => {
            console.log(res);
            this.resetForm();
            this.getActivityList();
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
      addActivity(this.id, JSON.stringify(this.value))
        .then((res) => {
          console.log(res);
          this.resetForm();
          this.getActivityList();
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
      const data = {
        id: null,
        carouselList: [],
        name: '', // 名称
        desc: '', // 名称
        coverPath: '',
      };
      this.$emit('input', data);
    },
    removeCurrentCarousel(imgPath) {
      this.$emit('input', {
        ...this.value,
        carouselList: this.value.carouselList.filter((item) => item !== imgPath),
      });
    },
    handleFormImgFile2(e) {
      console.log(e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超过10M!');
        return;
      }
      if (!(e.file.type === 'image/jpeg' || e.file.type === 'image/png')) {
        this.$message.error('上传图片只能是jpg或png格式');
        return;
      }
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
          const carouselList = this.value.carouselList.map((item) => item);
          carouselList.push(res);
          console.log(res);
          this.$emit('input', {
            ...this.value,
            carouselList,
          });
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    nextEditForm() {
      if (this.FormStep === 1) {
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
    onEditFormDescInput(val) {
      this.$emit('input', {
        ...this.value,
        desc: val,
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
.activityList {
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
.uploadImgCover {
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
