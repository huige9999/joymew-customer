<template>
  <div class="previewWrap">
    <div class="preview">
      <div class="close" @click="change"></div>
      <div class="preview-detail">
        <div class="show" :class="{ show2: type === '2' }"></div>
      </div>
      <div class="preview-more">
        <div class="plain">小程序打开</div>

        <img :src="imgSrc" alt="" class="qrcode" />

        <div class="text">微信扫一扫预览效果</div>

        <!-- <el-button class="plain2" @click="download"> 下载二维码</el-button> -->

        <a :href="imgSrc" download target="_blank" class="plain2">下载二维码</a>
        <!-- <div class="plain2">下载二维码</div> -->

        <div class="min-item">
          <div class="label">
            <div class="label-icon"></div>
            小程序APPID
          </div>
          <div class="input-wrap">
            <div class="input-text">{{ appId }}</div>
            <div class="input-button" @click="copyAPPID">复制</div>
          </div>
        </div>

        <div class="min-item">
          <div class="label">
            <div class="label-icon"></div>
            小程序活动路径
          </div>
          <div class="input-wrap">
            <div class="input-text">/pages/index/index?id={{ id }}</div>
            <div class="input-button" @click="copyAddress">复制</div>
          </div>
        </div>

        <div class="else">
          <el-popconfirm
            v-if="release"
            confirm-button-text="好的"
            cancel-button-text="不用了"
            icon="el-icon-info"
            icon-color="red"
            title="确定发布本条活动吗"
            @confirm="fabu"
            @onConfirm="fabu"
          >
            <el-button type="primary" slot="reference"> 马上发布</el-button>
          </el-popconfirm>

          <el-button plain @click="edit" v-if="!canEdit">进入编辑</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getActivityCode } from '../../../api/yx/yx';

export default {
  props: {
    id: String,
    release: Boolean,
    canEdit: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '1',
    },
  },
  data() {
    return {
      imgSrc: '',
      appId: 'wx341e552aeabccc55',
    };
  },
  created() {
    this.getActivityCode();
    // this.imgSrc =
    //   'https://thirdwx.qlogo.cn/mmopen/vi_32/bUrGSf23HibGv15wE0Zv42XnC3BDeibYqkTwxgXcz4hRLzJWxmdgJjo9u0ibbrWwEwZ80g1VFN50Wel6lrDQAER0Q/132';
  },

  methods: {
    getActivityCode() {
      getActivityCode({
        scene: this.id,
        type: this.$props.type,
      })
        .then((res) => {
          console.log('code', res.smallProgramCode);
          // 当type为2，且返回的code不为 '200' 时，提示先创建一场互动
          if (this.$props.type === '2' && (!res.code || String(res.code) !== '200')) {
            this.$message({
              message: '请先创建一场互动~',
              type: 'fail',
            });
            return;
          }
          this.imgSrc = res.smallProgramCode;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    change() {
      console.log(1);
      this.$emit('change');
    },
    copyAPPID() {
      this.$copyText(`${this.appId}`).then(
        () => {
          this.$message({
            message: 'APPID复制成功',
            type: 'success',
          });
        },
        (err) => {
          console.log(err);
          this.$message.error('APPID复制失败');
        },
      );
    },
    copyAddress() {
      this.$copyText(`/pages/index/index?id=${this.id}`).then(
        () => {
          this.$message({
            message: '活动地址复制成功',
            type: 'success',
          });
        },
        (err) => {
          console.log(err);
          this.$message.error('活动地址复制失败');
        },
      );
    },
    fabu() {
      this.$emit('fabu', {
        id: this.id,
        type: this.$props.type,
      });
    },
    edit() {
      this.$emit('edit', {
        id: this.id,
        type: this.$props.type,
      });
    },
  },
};
</script>

<style lang="less" scoped>
@basePath: '~@/assets/image/yx/demo/';

.previewWrap {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  overflow: hidden;
  .close {
    width: 30px;
    height: 30px;
    // border: 1px solid red;
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    background-image: url(~@/assets/image/opManage/close.png);
    background-size: 70% 70%;
    background-position: center;
    background-color: grey;
    border-radius: 100%;
  }
  .preview {
    width: 880px;
    height: 702px;
    position: absolute;
    box-shadow: 5px 5px 10px #dedede, -5px -5px 10px #dedede;
    top: calc(50% - 702px / 2);
    left: calc(50% - 880px / 2);
    @radius: 10px;
    border-radius: @radius;
    display: flex;
    transform: scale(0.8);

    .preview-detail {
      width: 440px;
      height: 702px;

      background: #f2f5f8;
      border-top-left-radius: @radius;
      border-bottom-left-radius: @radius;
      display: flex;
      justify-content: center;
      align-items: center;
      .show {
        width: 300px;
        height: 593px;
        background-image: url('@{basePath}home.jpeg');
        background-size: 100% 100%;
      }
      .show2 {
        background-image: url('~@/assets/image/yx/choujiang/home.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    .preview-more {
      width: 440px;
      height: 702px;
      background: #ffffff;
      border-top-right-radius: @radius;
      border-bottom-right-radius: @radius;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      .plain {
        margin-top: 27px;
        width: 151px;
        height: 45px;
        border: 1px solid #1e87f0;
        border-radius: 4px;
        color: #1e87f0;
        display: flex;
        font-size: 20px;
        justify-content: center;
        align-items: center;
        // cursor: pointer;
      }
      .qrcode {
        width: 198px;
        height: 198px;
        // border: 1px solid #dedede;
        margin-top: 25px;
      }
      .text {
        margin-top: 25px;
        color: rgba(0, 0, 0, 0.4);
        font-size: 16px;
      }
      .plain2 {
        width: 185px;
        height: 45px;
        border: 1px solid #dddddd;
        border-radius: 4px;
        color: #333333;
        font-size: 20px;
        display: flex;
        margin-top: 25px;

        justify-content: center;
        align-items: center;
      }
      .min-item {
        width: 325px;
        margin-top: 25px;
        display: flex;
        flex-direction: column;
        .label {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: rgba(0, 0, 0, 0.4);
          font-size: 14px;
          .label-icon {
            width: 4px;
            height: 16px;
            background: #1e87f0;
            border-radius: 3px;
            margin-right: 8px;
          }
        }
        .input-wrap {
          width: 325px;
          height: 32px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          margin-top: 8px;
          display: flex;
          .input-text {
            width: 252px;
            text-align: left;
            line-height: 32px;
            // display: flex;
            // justify-content: flex-start;
            // align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            border-right: 1px solid #d9d9d9;
            padding: 0 10px;
          }
          .input-button {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #1e87f0;
            cursor: pointer;
          }
        }
      }
      .else {
        height: 100px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
