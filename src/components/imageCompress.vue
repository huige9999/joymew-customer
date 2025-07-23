<template>
  <el-drawer title="图片压缩配置" :visible.sync="visible" direction="rtl">
    <el-form :model="compressConfigForm" label-width="120px">
      <el-form-item label="最大宽度：">
        <el-input-number v-model="compressConfigForm.maxWidth" controls-position="right" :min="0" :max="2000" size="mini"></el-input-number>
      </el-form-item>
      <el-form-item label="最大高度：">
        <el-input-number
          v-model="compressConfigForm.maxHeight"
          controls-position="right"
          :min="0"
          :max="2000"
          size="mini"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="压缩比例：">
        <el-input-number
          v-model="compressConfigForm.ratio"
          controls-position="right"
          :min="0"
          :max="1"
          size="mini"
          :step="0.1"
        ></el-input-number>
        <div class="tip">压缩比例设置为0,表示关闭图片压缩功能</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmConfigForm">确定</el-button>
        <el-button @click="cancelConfig">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
// type属性的取值
// const TYPES = ['screen', 'h5', 'mpCover', 'mpCard'];

// 所有情况的默认值
const DEFAULTVALUES = [
  {
    maxWidth: 1920,
    maxHeight: 1080,
    ratio: 0.7,
  },
  {
    maxWidth: 750,
    maxHeight: 1334,
    ratio: 0.7,
  },
  {
    maxWidth: 500,
    maxHeight: 400,
    ratio: 0.7,
  },
];

// type和默认值的映射关系
const TYPE_DEFAULTVAALUE_MAP = {
  screen: DEFAULTVALUES[0],
  h5: DEFAULTVALUES[1],
  mpCover: DEFAULTVALUES[1],
  mpCard: DEFAULTVALUES[2],
};

export default {
  props: {
    imageCompressDrawerVisible: {
      type: Boolean,
      default: false,
      required: true,
    },
    type: {
      type: String,
      default: '',
      required: true,
    },
  },
  watch: {
    imageCompressDrawerVisible(newVal) {
      if (newVal) {
        this.visible = true;
        this.initForm();
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.$emit('closeImageCompress');
      }
    },
  },
  data() {
    return {
      compressConfigForm: {
        maxWidth: 0,
        maxHeight: 0,
        ratio: 0,
      },
      visible: false,
    };
  },
  methods: {
    initForm() {
      const storageComressConfigStr = localStorage.getItem('imageCompressConfig');
      if (storageComressConfigStr) {
        const storageComressConfigObj = JSON.parse(storageComressConfigStr);
        if (storageComressConfigObj[this.type]) {
          const { maxWidth, maxHeight, ratio } = storageComressConfigObj[this.type];
          this.compressConfigForm = {
            maxWidth,
            maxHeight,
            ratio,
          };
        } else {
          this.compressConfigForm = TYPE_DEFAULTVAALUE_MAP[this.type];
        }
      } else {
        this.compressConfigForm = TYPE_DEFAULTVAALUE_MAP[this.type];
      }
    },
    /**
     * 将表单配置的值存入缓存
     */
    confirmConfigForm() {
      const storageComressConfigStr = localStorage.getItem('imageCompressConfig');
      if (storageComressConfigStr) {
        const storageComressConfigObj = JSON.parse(storageComressConfigStr);
        const comressConfigObj = {
          ...storageComressConfigObj,
          [this.type]: this.compressConfigForm,
        };
        const compressConfigStr = JSON.stringify(comressConfigObj);
        localStorage.setItem('imageCompressConfig', compressConfigStr);
      } else {
        const comressConfigObj = {
          [this.type]: this.compressConfigForm,
        };
        const compressConfigStr = JSON.stringify(comressConfigObj);
        localStorage.setItem('imageCompressConfig', compressConfigStr);
      }
      this.cancelConfig();
    },
    /**
     * 关闭弹窗
     */
    cancelConfig() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
