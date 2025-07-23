<template>
  <sub-page>
    <div class="set-customWish-container">
      <main-card>
        <card-top-info title="自定义3D签到"> </card-top-info>
        <el-form ref="form" :model="configForm" class="configForm" v-show="hasPurchase">
          <el-form-item label="是否开启虚拟头像：">
            <el-switch v-model="configForm.needVirtualAvator" active-value="1" inactive-value="0" @change="requestUpdate"></el-switch>
            <div class="tip">(当签到人数不足时，使用默认头像填充图形)</div>
          </el-form-item>
          <el-form-item label="动画配置：">
            <el-table :data="configForm.aniTypes" @selection-change="aniTypesSelectionChange" ref="multipleTable">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="动画名称" align="center" prop="shapeName" />
              <el-table-column label="持续时间" align="center" prop="duration" />
              <el-table-column label="旋转轴" align="center" prop="rotateOrigin" />
              <el-table-column label="镜头距离" align="center" prop="cameraLocation" />
              <el-table-column label="x轴平移距离" align="center" prop="xMove" />
              <el-table-column label="y轴平移距离" align="center" prop="yMove" />
              <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="showEdit(scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddLogo">自定义动画图案</el-button>
            <div class="tip">(可以自己上传图片，自定义3D签到动画图案)</div>
          </el-form-item>
        </el-form>
        <div class="unPurchaseStatus" v-show="!hasPurchase">
          <div class="intro">
            购买此功能，可以展示默认形状(球体、立方体、网格、随机位置、圆柱、表格等形状)，也可以展示自己上传logo生成的自定义形状。
          </div>
          <div class="status" v-if="!hasPurchase && !isShowErweima">
            <div class="price">¥388</div>
            <div class="purchaseBtn" @click="confirmRecharge">立即购买</div>
          </div>
          <div class="erweima-box" v-show="isShowErweima" v-loading="loadingQrcode">
            <div class="erweima">
              <div><iframe :srcdoc="erweimaHtml" frameborder="0"></iframe></div>
            </div>
            <el-button type="primary" @click="DoneRecharge" size="small" class="finishPayBtn">已完成支付</el-button>
          </div>
        </div>
        <div class="preview-canvas" style="display: none">
          <canvas ref="preview"></canvas>
        </div>
        <el-dialog title="上传logo图片" :visible.sync="uploadDialogShow" top="10vh" width="402px">
          <el-upload class="upload-demo" drag action multiple :auto-upload="false" :on-change="fileChange">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将Logo文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过1Mb</div>
            <div class="el-upload__tip" slot="tip">请上传对比度高的文件,以达到最好的转换效果</div>
          </el-upload>
        </el-dialog>
        <el-dialog title="logo转换为动画图案" width="100%" top="0" :visible.sync="logoDialogShow"  :close-on-click-modal="false">
          <div style="display: flex">
            <el-form ref="form" :model="dialogForm" label-width="80px" style="width: 500px">
              <el-form-item label="清晰度">
                <el-slider v-model="dialogForm.pixel" show-input :min="5" :max="100"></el-slider>
                <label>建议清晰度往小调整</label>
              </el-form-item>
              <el-form-item label="灰度值">
                <el-slider v-model="dialogForm.threshold" show-input :min="0" :max="255"></el-slider>
                <label>建议灰度值往大调整</label>
              </el-form-item>

              <el-form-item label="方块总数">
                <span>{{ activeBlockNum }}</span>
                <label style="margin-left: 20px">(建议方块总数不超过200)</label>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleFile('reverse')">反向转换logo</el-button>
                <el-button type="primary" @click="handleFile">转换logo</el-button>
                <el-button type="primary" @click="saveCustomLogo">保存动画图案</el-button>
              </el-form-item>
            </el-form>

            <div>
              <img style="height: 200px; margin-left: 30px" :src="previewImg" alt />
            </div>
          </div>

          <div class="position" :style="{ width: Math.ceil(width) * 20 + 'px' }">
            <ul>
              <li
                :data-index="index"
                :class="{ on: item.on }"
                v-for="(item, index) in position"
                :key="index"
                @click="editBlocks(index)"
              ></li>
            </ul>
          </div>
        </el-dialog>
        <el-dialog title="修改logo" width="40%" :visible.sync="editDialogShow">
          <el-form ref="form" :model="editForm" label-width="120px">
            <el-form-item label="动画名称：">
              {{ editForm.shapeName }}
            </el-form-item>
            <el-form-item label="持续时间：">
              <el-slider v-model="editForm.duration" show-input :min="10" :max="86400"></el-slider>秒
            </el-form-item>
            <el-form-item label="旋转轴：">
              <el-radio-group v-model="editForm.rotateOrigin">
                <el-radio label="x">x轴</el-radio>
                <el-radio label="y">y轴</el-radio>
                <el-radio label="z">z轴</el-radio>
                <el-radio label="">无旋转轴</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="镜头距离：">
              <el-slider v-model="editForm.cameraLocation" show-input :min="10" :max="20000"></el-slider>
            </el-form-item>
            <el-form-item label="x轴平移距离：">
              <el-slider v-model="editForm.xMove" show-input :min="-10000" :max="10000"></el-slider>
            </el-form-item>
            <el-form-item label="y轴平移距离：">
              <el-slider v-model="editForm.yMove" show-input :min="-10000" :max="10000"></el-slider>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 200px" @click="confirmEdit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import { purchaseLivePhotoFunc2 } from '@/api/setting/activitySetting/activity';
import { getActivity } from '@/api/setting/activitySetting/theme';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import request from '@/utils/request';

let tempFile;

// 灰度值 计算公式
function getGray(R, G, B) {
  return R * 0.299 + G * 0.587 + B * 0.114;
}

export default {
  name: 'threeDSign',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      hasPurchase: false, // 功能是否开通
      // 弹出框中支付二维码是否显示
      isShowErweima: false,
      // 支付二维码html标签
      erweimaHtml: '',
      loadingQrcode: false,
      position: [], // logo方块编辑位置
      previewImg: '', // Logo 纯色像素化 预览图
      width: 0, // 转换成方块矩阵的长
      height: 0, // 转换成方块矩阵的宽
      uploadDialogShow: false,
      logoDialogShow: false,
      editDialogShow: false,
      dialogForm: {
        pixel: 10, // 转换时 每个一块的面积(xx像素 xx像素)
        threshold: 190, // 灰度值
      },
      editForm: {
        shape: '',
        shapeName: '',
        duration: 0,
        rotateOrigin: '',
        cameraLocation: 3000,
        xMove: 0,
        yMove: 0,
      },
      configForm: {
        needVirtualAvator: '0',
        aniTypes: [
          {
            shape: 'table',
            shapeName: '表格',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
          {
            shape: 'sphere',
            shapeName: '球',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
          {
            shape: 'helix',
            shapeName: '圆柱',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
          {
            shape: 'grid',
            shapeName: '网格',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
          {
            shape: 'cube',
            shapeName: '立方体',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
          {
            shape: 'random',
            shapeName: '随机形状',
            duration: 30,
            rotateOrigin: 'y',
            cameraLocation: 3000,
            xMove: 0,
            yMove: 0,
            isActive: false,
          },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  computed: {
    activeBlockNum() {
      return this.position.filter((item) => item.on).length;
    },
  },
  methods: {
    DoneRecharge() {
      this.isShowErweima = false;
      this.initData();
    },
    confirmRecharge() {
      this.isShowErweima = true;
      this.loadingQrcode = true;
      this.requestErweima();
    },
    requestErweima() {
      const data = {
        splid: this.$store.state.liveId,
        type: '5',
        pay_type: 'zfb',
      };
      purchaseLivePhotoFunc2(data).then((res) => {
        console.log(res);
        this.erweimaHtml = `${res.data.order}`;
        this.loadingQrcode = false;
      });
    },
    showAddLogo() {
      this.uploadDialogShow = true;
    },
    fileChange(file) {
      if (file.raw instanceof File) {
        tempFile = file;
        this.handleFile();
        this.uploadDialogShow = false;
        this.logoDialogShow = true;
      }
    },
    handleFile(flag) {
      const canvas = this.$refs.preview;
      const ctx = canvas.getContext('2d');
      const reader = new FileReader();

      reader.readAsDataURL(tempFile.raw);
      reader.onload = (res) => {
        const img = new Image();
        img.src = res.currentTarget.result;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const pixel = ctx.getImageData(0, 0, img.width, img.height);
          if (flag === 'reverse') {
            this.toPixelReverse(pixel, canvas, ctx);
          } else {
            this.toPixel(pixel, canvas, ctx);
          }
        };
        img.onerror = () => {
          console.log('img load error');
        };
      };
    },
    toPixelReverse(pixel, canvas, ctx) {
      this.position = [];
      if (this.dialogForm.pixel === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const imageData = pixel.data;
      console.log(imageData);
      for (let i = 0; i < canvas.height; i += this.dialogForm.pixel) {
        for (let j = 0; j < canvas.width; j += this.dialogForm.pixel) {
          // 计算灰度值   面积大于一半 此块为黑色
          let num = 0;
          for (let dx = 0; dx < this.dialogForm.pixel; dx++) {
            for (let dy = 0; dy < this.dialogForm.pixel; dy++) {
              const x = i + dx;
              const y = j + dy;
              const p = x * canvas.width + y;
              const gray = getGray(imageData[p * 4 + 0], imageData[p * 4 + 1], imageData[p * 4 + 2]);
              if (gray >= this.dialogForm.threshold) {
                num += 1;
              }
            }
          }
          let color = '';
          if (num <= this.dialogForm.pixel * this.dialogForm.pixel * 0.5) {
            // 着黑色
            color = '255';
            this.position.push({
              x: j / this.dialogForm.pixel,
              y: i / this.dialogForm.pixel,
              on: false,
            });
          } else {
            color = '0';
            this.position.push({
              x: j / this.dialogForm.pixel,
              y: i / this.dialogForm.pixel,
              on: true,
            });
          }
          for (let dx = 0; dx < this.dialogForm.pixel; dx++) {
            for (let dy = 0; dy < this.dialogForm.pixel; dy++) {
              const x = i + dx;
              const y = j + dy;
              const p = x * canvas.width + y;
              imageData[p * 4 + 0] = color;
              imageData[p * 4 + 1] = color;
              imageData[p * 4 + 2] = color;
            }
          }
        }
      }
      ctx.putImageData(pixel, 0, 0);
      this.previewImg = canvas.toDataURL('image/jpeg');
      // 转换成 file
      const arr = this.previewImg.split(',');
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'logo');
      this.logoFile = file;
      const step = this.dialogForm.pixel;
      this.width = canvas.width / step;
      this.height = canvas.height / step;
      for (let i = step; i < canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.closePath();
        ctx.stroke();
      }
      for (let j = step; j < canvas.height; j += step) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.closePath();
        ctx.stroke();
      }
      console.log('反转后的像素数组>>>', this.position.filter((item) => item.on));
    },
    // 将图片转换为像素图
    toPixel(pixel, canvas, ctx) {
      this.position = [];
      if (this.dialogForm.pixel === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imageData = pixel.data;

      for (let i = 0; i < canvas.height; i += this.dialogForm.pixel) {
        for (let j = 0; j < canvas.width; j += this.dialogForm.pixel) {
          // 计算灰度值   面积大于一半 此块为黑色
          let num = 0;
          for (let dx = 0; dx < this.dialogForm.pixel; dx++) {
            for (let dy = 0; dy < this.dialogForm.pixel; dy++) {
              const x = i + dx;
              const y = j + dy;
              const p = x * canvas.width + y;
              const gray = getGray(imageData[p * 4 + 0], imageData[p * 4 + 1], imageData[p * 4 + 2]);
              if (gray >= this.dialogForm.threshold) {
                num += 1;
              }
            }
          }
          let color = '';
          if (num > this.dialogForm.pixel * this.dialogForm.pixel * 0.5) {
            // 着黑色
            color = '255';
            this.position.push({
              x: j / this.dialogForm.pixel,
              y: i / this.dialogForm.pixel,
              on: false,
            });
          } else {
            color = '0';
            this.position.push({
              x: j / this.dialogForm.pixel,
              y: i / this.dialogForm.pixel,
              on: true,
            });
          }

          for (let dx = 0; dx < this.dialogForm.pixel; dx++) {
            for (let dy = 0; dy < this.dialogForm.pixel; dy++) {
              const x = i + dx;
              const y = j + dy;
              const p = x * canvas.width + y;
              imageData[p * 4 + 0] = color;
              imageData[p * 4 + 1] = color;
              imageData[p * 4 + 2] = color;
            }
          }
        }
      }
      ctx.putImageData(pixel, 0, 0);
      this.previewImg = canvas.toDataURL('image/jpeg');

      // 转换成 file
      const arr = this.previewImg.split(',');
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], 'logo');
      this.logoFile = file;
      const step = this.dialogForm.pixel;
      this.width = canvas.width / step;
      this.height = canvas.height / step;
      for (let i = step; i < canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.closePath();
        ctx.stroke();
      }
      for (let j = step; j < canvas.height; j += step) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.closePath();
        ctx.stroke();
      }
    },
    editBlocks(index) {
      this.position[index].on = !this.position[index].on;
    },
    aniTypesSelectionChange(e) {
      if (this.firstToggleSlection === undefined) {
        return;
      }
      const { aniTypes } = this.configForm;
      const tmpLen = e.length;
      aniTypes.forEach((item) => {
        let tmpIndex = -1;
        for (let i = 0; i < tmpLen; i += 1) {
          if (e[i].shape === item.shape) {
            tmpIndex = i;
          }
        }
        if (tmpIndex > -1) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      if (this.firstToggleSlection) {
        this.requestUpdate();
      }
    },
    toggleSelectionRow(rows) {
      if (rows) {
        rows.forEach((row) => {
          if (row.isActive) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
      this.firstToggleSlection = true;
    },
    showEdit(e) {
      console.log(e);
      this.editForm.duration = e.duration;
      this.editForm.rotateOrigin = e.rotateOrigin;
      this.editForm.cameraLocation = e.cameraLocation;
      this.editForm.xMove = e.xMove;
      this.editForm.yMove = e.yMove;
      this.editForm.shapeName = e.shapeName;
      this.editForm.shape = e.shape;
      this.editDialogShow = true;
    },
    saveCustomLogo() {
      const blockPosition = this.position
        .filter((item) => item.on)
        .map((item) => ({
          x: item.x,
          y: item.y,
        }));

      // 计算最终logo的每个方块的坐标
      blockPosition.forEach((item) => {
        item.x = item.x * 110 - (110 * Math.ceil(this.width)) / 2;
        item.y = -(item.y * 110) + (110 * Math.ceil(this.height)) / 2;
      });
      const { aniTypes } = this.configForm;
      const tmpLen = aniTypes.length;
      const newLogo = {
        shape: `customLogo${tmpLen - 5}`,
        shapeName: `自定义Logo${tmpLen - 5}`,
        duration: 30,
        rotateOrigin: 'y',
        cameraLocation: 3000,
        xMove: 0,
        yMove: 0,
        pData: blockPosition,
        isActive: true,
      };
      aniTypes.push(newLogo);
      this.logoDialogShow = false;
      this.toggleSelectionRow([newLogo]);
    },
    confirmEdit() {
      const editShape = this.editForm.shape;
      const { aniTypes } = this.configForm;
      const tmpLen = aniTypes.length;
      for (let i = 0; i < tmpLen; i += 1) {
        if (aniTypes[i].shape === editShape) {
          aniTypes[i].duration = this.editForm.duration;
          aniTypes[i].rotateOrigin = this.editForm.rotateOrigin;
          aniTypes[i].cameraLocation = this.editForm.cameraLocation;
          aniTypes[i].xMove = this.editForm.xMove;
          aniTypes[i].yMove = this.editForm.yMove;
          break;
        }
      }
      this.editDialogShow = false;
      this.requestUpdate();
    },
    requestUpdate() {
      if (!this.hasPurchase) {
        this.$message.error('您尚未购买该功能!');
        return;
      }
      const { aniTypes } = this.configForm;
      const lastAniTypes = aniTypes.filter((item) => item.isActive);
      const lastForm = {
        needVirtualAvator: this.configForm.needVirtualAvator === '1',
        aniTypes: lastAniTypes,
      };
      console.log(lastForm);
      if (lastAniTypes.length === 0) {
        this.$message.error('至少选中一个动画效果!');
        return;
      }
      const formData = {
        custom_logo: JSON.stringify(lastForm),
        splid: this.$store.state.liveId,
      };
      request.post('/qiYeNe/update', formData).then((res) => {
        console.log(res);
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    initData() {
      getActivity({ splid: this.$store.state.liveId }).then((res) => {
        console.log(res);
        this.hasPurchase = res.data.custom_logo_switch === '1';
        if (res.data.custom_logo && this.hasPurchase) {
          const customLogo = JSON.parse(res.data.custom_logo);
          console.log(customLogo);
          this.configForm.needVirtualAvator = customLogo.needVirtualAvator ? '1' : '0';
          customLogo.aniTypes.forEach((item) => {
            if (item.pData) {
              this.configForm.aniTypes.push(item);
            } else {
              const tmpAniTypes = this.configForm.aniTypes;
              const tmpLen = tmpAniTypes.length;
              for (let i = 0; i < tmpLen; i += 1) {
                if (tmpAniTypes[i].shape === item.shape) {
                  tmpAniTypes[i].isActive = true;
                  break;
                }
              }
            }
          });
          this.toggleSelectionRow(this.configForm.aniTypes);
        } else {
          this.firstToggleSlection = true;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.block {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
  .key {
    width: 100px;
  }
}
.position {
  position: relative;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: ' ';
    width: 1px;
    height: 100%;
    background-color: gray;
  }
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: ' ';
    width: 100%;
    height: 1px;
    background-color: gray;
  }

  ul {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  li {
    list-style: none;
    width: 20px;
    height: 20px;
    float: left;
    border-right: 1px solid gray;
    box-sizing: border-box;
    border-bottom: 1px solid gray;
    cursor: pointer;

    &.on {
      background-color: red;
    }
  }
}
.configForm {
  padding-left: 20px;
  .tip {
    font-size: 14px;
    color: #606266;
    display: inline;
    margin-left: 20px;
  }
}
.unPurchaseStatus {
  width: 100%;
  margin-bottom: 40px;
  position: relative;
  padding: 0 20px;
  .intro {
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    line-height: 25px;
  }
  .status {
    margin-top: 32px;
    .price {
      font-size: 28px;
      font-weight: 500;
      color: #f91b1b;
    }
    .purchaseBtn {
      width: 130px;
      height: 46px;
      background: #1890ff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      margin-top: 8px;
      cursor: pointer;
      &:hover {
        background: rgba(24, 144, 255, 0.6);
      }
    }
    .hasBuy {
      font-size: 28px;
      font-weight: 500;
      color: #f91b1b;
    }
  }
  .erweima-box {
    display: flex;
    align-items: center;
    padding-top: 20px;
    margin-bottom: 20px;
    position: relative;
    .finishPayBtn {
      left: 13%;
      position: absolute;
    }
  }
}
</style>
