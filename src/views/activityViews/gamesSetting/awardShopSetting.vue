<template>
  <sub-page>
    <div class="award-setting-contaienr">
      <main-card>
        <card-top-info title="自定义奖项设置"></card-top-info>
        <div class="toggle-bar">
          <div class="toggle-bar-item">
            <span>自定义奖项</span>
            <div class="underLine"></div>
          </div>
        </div>
        <div class="award-info-list-container">
          <my-table style="height: auto">
            <el-table
              :data="customAwardData"
              highlight-current-row
              style="width: 100%"
              header-row-class-name="table-header"
              :cell-style="cellStyle"
            >
              <el-table-column type="index" width="120" align="center" header-align="center" label="序号"> </el-table-column>
              <el-table-column min-width="120" align="center" header-align="center" label="奖品图片">
                <template slot-scope="scope">
                  <div class="upload-img">
                    <img width="47" height="31" style="border-radius: 4px" :src="scope.row.piclink" alt="" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label="奖项" prop="awardname" align="center" header-align="center"> </el-table-column>
              <el-table-column label="操作" min-width="100" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditAwardDialog(scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="confirmDelateOpen(scope.row.cusaward_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </my-table>
          <!-- 新增奖项按钮 -->
          <div class="addAwardBtn" @click="showAddAwardDialog"><span class="el-icon-plus" style="margin-right: 10px"></span>新增奖项</div>
        </div>

        <!-- 新增奖项弹出框 -->
        <my-dialog :show="addAwardDialogIsShow" style="width: 700px">
          <div class="editTitle" slot="title">
            <!-- <img src="@/assets/image/headImg.jpg" alt="" width="25" height="15"> -->
            <div class="title-text">添加奖项:</div>
          </div>
          <div class="awardClassTypes">
            <div class="awardClassType" :class="[{ active: awardClassType === 0 }]" @click="awardClassType = 0">
              默认
              <div class="award-line"></div>
            </div>
            <div class="awardClassType" :class="[{ active: awardClassType === 1 }]" @click="awardClassType = 1">
              优惠券
              <div class="award-line"></div>
            </div>
          </div>
          <div class="default" v-if="awardClassType === 0">
            <div class="editInfo-container">
              <div class="editInfo-container-item uploadImg">
                <div class="uploadImg-title">奖项图片:</div>
                <div class="uploadImg-input-box no-img">
                  <img :src="chooseImg" v-if="chooseImg" width="129" height="77" alt="" />
                  <img src="@/assets/image/default-uploadImg.png" v-else width="51" height="51" alt="" />
                </div>
                <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
                  <div class="uploadImg-btn">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus">选择图片</el-button>
                    <div class="tips">建议尺寸：900*500</div>
                  </div>
                </el-upload>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">奖品奖项:</div>
                <div class="input"><el-input v-model="awardType" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：一等奖/二等奖/参与奖/幸运奖</div>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">奖品名称:</div>
                <div class="input"><el-input v-model="awardName" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：礼品卡/购物券/现金1w</div>
              </div>
            </div>
            <div class="editBtn-group">
              <el-button type="primary" class="save-btn" @click="keepAdd(chooseImg, awardType, awardName)"
                >&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button
              >
              <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
            </div>
          </div>

          <div class="coupon" v-else>
            <div class="editInfo-container">
              <div class="editInfo-container-item award-info">
                <div class="title">奖品奖项:</div>
                <div class="input"><el-input v-model="awardType" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：一等奖/二等奖/参与奖/幸运奖</div>
              </div>
              <div class="editInfo-container-item award-info" v-if="chooseCoupon.length > 0">
                <div class="title">奖品名称:</div>
                <div class="input"><el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input></div>
                <div class="tips"></div>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">优惠券类目:</div>
                <div class="input">
                  <el-select v-model="chooseCoupon" placeholder="" multiple style="width: 300px">
                    <el-option v-for="item in coupons" :key="item.template_id" :label="item.name" :value="item.template_id"> </el-option>
                  </el-select>
                </div>
              </div>

              <div class="coupon-list-wrap">
                <shopCouponItem v-for="(choosed, index) in chooseCouponObjList" :key="index" :index="index" :choosed="choosed">
                </shopCouponItem>
              </div>
            </div>
            <div class="editBtn-group" style="margin-top: 80px">
              <el-button type="primary" class="save-btn" @click="keepAddTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
              <el-button type="info" class="cancel-btn" @click="cancelAdd">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
            </div>
          </div>
        </my-dialog>
        <!-- 编辑奖项弹出框 -->
        <my-dialog :show="editAwardDialogIsShow" style="width: 700px">
          <div class="editTitle" slot="title">
            <!-- <img src="@/assets/image/headImg.jpg" alt="" width="25" height="15"> -->
            <div class="title-text">编辑奖项:</div>
          </div>
          <div class="awardClassTypes">
            <div class="awardClassType active">
              {{ awardClassType === 0 ? '默认' : '优惠券' }}
              <div class="award-line"></div>
            </div>
            <!-- <div class="awardClassType" :class="[{ active: awardClassType === 1 }]">
              优惠券
              <div class="award-line"></div>
            </div> -->
          </div>
          <div class="default" v-if="awardClassType === 0">
            <div class="editInfo-container">
              <div class="editInfo-container-item uploadImg">
                <div class="uploadImg-title">奖项图片:</div>
                <div class="uploadImg-input-box no-img">
                  <img :src="chooseImg" v-if="chooseImg" width="129" height="77" alt="" />
                  <img src="@/assets/image/default-uploadImg.png" v-else width="51" height="51" alt="" />
                </div>
                <el-upload class="head-upload" name="testfile" :show-file-list="false" :http-request="handleFile" action>
                  <div class="uploadImg-btn">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus">选择图片</el-button>
                    <div class="tips">建议尺寸：900*500</div>
                  </div>
                </el-upload>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">奖品奖项:</div>
                <div class="input"><el-input v-model="awardType" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：一等奖/二等奖/参与奖/幸运奖</div>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">奖品名称:</div>
                <div class="input"><el-input v-model="awardName" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：礼品卡/购物券/现金1w</div>
              </div>
            </div>
            <div class="editBtn-group">
              <el-button type="primary" class="save-btn" @click="keepEdit(chooseImg, awardType, awardName, currentEditId)"
                >&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button
              >
              <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
            </div>
          </div>

          <div class="coupon" v-else>
            <div class="editInfo-container">
              <div class="editInfo-container-item award-info">
                <div class="title">奖品奖项:</div>
                <div class="input"><el-input v-model="awardType" placeholder="请输入内容"></el-input></div>
                <div class="tips">例如：一等奖/二等奖/参与奖/幸运奖</div>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">奖品名称:</div>
                <div class="input"><el-input v-model="prizeName" placeholder="请输入内容" type="textarea"></el-input></div>
                <div class="tips"></div>
              </div>
              <div class="editInfo-container-item award-info">
                <div class="title">优惠券类目:</div>
                <div class="input">
                  <el-select v-model="chooseCoupon" placeholder="" style="width: 300px" multiple>
                    <el-option v-for="item in coupons" :key="item.template_id" :label="item.name" :value="item.template_id"> </el-option>
                  </el-select>
                </div>

                <!-- <div class="tips">例如：礼品卡/购物券/现金1w</div> -->
              </div>

              <div class="coupon-list-wrap">
                <shopCouponItem v-for="(choosed, index) in chooseCouponObjList" :key="index" :index="index" :choosed="choosed">
                </shopCouponItem>
              </div>
            </div>
            <div class="editBtn-group" style="margin-top: 80px">
              <el-button type="primary" class="save-btn" @click="keepEditTQL">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
              <el-button type="info" class="cancel-btn" @click="cancelEdit">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
            </div>
          </div>
        </my-dialog>
      </main-card>
    </div>
  </sub-page>
</template>
<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import MyTable from '@/components/myTable';
import { getCustomAwardList, addCustomAward, editOrDeleteCustomAward } from '@/api/setting/activitySetting/gameSetting';
import { getShopCouponList } from '@/api/cusshop/gameSetting';
import myDialog from '@/components/myDialog';
import request from '@/utils/request';
import shopCouponItem from './TQL/miniGameAward/components/shopCouponItem';

export default {
  name: 'awardCommomSetting',
  data() {
    return {
      // 自定义奖项的数据列表
      customAwardData: [],
      // 编辑奖项弹出框是否显示
      editAwardDialogIsShow: false,
      // 添加奖项弹出框是否显示
      addAwardDialogIsShow: false,
      // 图片地址
      chooseImg: '',
      // 奖品奖项名称
      awardType: '',
      // 奖品名称
      awardName: '',
      // 当前被编辑自定义奖项的id值
      currentEditId: '',
      prizeName: '',
      awardClassType: 1,
      chooseCoupon: [],
      coupons: [],
      //   chooseCoupon: {},
    };
  },

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
  },
  watch: {
    chooseCoupon() {
      if (this.awardClassType === 0) {
        return;
      }
      if (this.prizeName === '' && (this.editAwardDialogIsShow === true || this.addAwardDialogIsShow === true)) {
        this.prizeName = this.chooseCouponObj.name;
      }
    },
  },
  created() {
    this.requestCustomData();
    this.getShopCouponList();
  },
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
    MyTable,
    myDialog,
    shopCouponItem,
  },
  methods: {
    getShopCouponList() {
      getShopCouponList({
        currentPage: '1',
        showCount: '300',
      })
        .then((res) => {
          const { couponInfo } = res.data;
          if (couponInfo) {
            const { list } = JSON.parse(couponInfo).data;
            list.forEach((item, i) => {
              list[i].template_id = Number(item.couponId);
            });
            this.coupons = list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /* 获取自定义奖项列表 */
    requestCustomData() {
      const data = {
        splid: this.$store.state.liveId,
        removed: '0',
        kind: '1',
        currentPage: '1',
        showCount: '500',
      };
      getCustomAwardList(data).then((res) => {
        if (res.code === 200) {
          console.log('自定义奖项列表数据', res);
          this.customAwardData = res.data.list.sort((a, b) => a.create_time - b.create_time);
        } else {
          console.error('自定义奖项列表数据获取失败');
        }
      });
    },
    /* el-table中设置某一列单元格中的文字颜色回调方法 */
    cellStyle({ columnIndex }) {
      let tcolor = '';
      if (columnIndex === 2) {
        tcolor = 'color:#ff6260';
      }
      return tcolor;
    },
    /* 显示编辑奖项的弹框 */
    showEditAwardDialog(currentRow) {
      if (currentRow.template_id) {
        this.awardClassType = 1;
        // console.log(currentRow.template_id.split(','))
        this.chooseCoupon = currentRow.template_id.split(',').map((num) => Number(num)) || [];
        // Vue.set(this, 'chooseCoupon', currentRow.template_id.split(','));
      } else {
        this.awardClassType = 0;
      }

      this.editAwardDialogIsShow = true;
      // 回显数据
      this.chooseImg = currentRow.piclink;
      this.awardName = currentRow.prize_name;
      this.prizeName = currentRow.prize_name;
      this.awardType = currentRow.awardname;

      this.currentEditId = currentRow.cusaward_id;
      console.log(currentRow);
    },
    /* 显示增加奖项的弹框 */
    showAddAwardDialog() {
      this.addAwardDialogIsShow = true;
    },
    /* 保存编辑 */
    keepEdit(chooseImg, awardType, awardName, currentAwardId) {
      if (this.chooseImg && this.awardType) {
        // 提交添加的奖项
        const data = {
          // name: awardType,
          // path_url: chooseImg,
          // prize_name: awardName,
          // liveId: this.$store.state.liveId,
          // custom_prize_id: currentAwardId,
          awardname: awardType,
          piclink: chooseImg,
          prize_name: awardName,
          splid: this.$store.state.liveId,
          cusaward_id: currentAwardId,
        };
        editOrDeleteCustomAward(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '编辑奖项成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.currentEditId = '';
        this.editAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },

    /* 保存编辑 */
    keepEditTQL() {
      this.chooseImg = 'https://ustatic.joymew.com/haimiao-tql/lottery/tqlcoupon.png';
      const { awardType, chooseImg, chooseCouponObjList, currentEditId, chooseCoupon, prizeName } = this;
      if (chooseImg && awardType && chooseCouponObjList.length > 0) {
        // 提交添加的奖项
        const data = {
          awardname: awardType,
          piclink: chooseImg,
          prize_name: prizeName,
          splid: this.$store.state.liveId,
          cusaward_id: currentEditId,
          template_id: chooseCoupon.join(','),
        };
        editOrDeleteCustomAward(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '编辑奖项成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.currentEditId = '';
        this.editAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
    },
    /* 取消编辑 */
    cancelEdit() {
      this.editAwardDialogIsShow = false;
      this.clearData();
      this.currentEditId = '';
      console.log('取消编辑');
    },
    /* 删除奖项 */
    deleteAward(id) {
      console.log(id);
      const data = {
        splid: this.$store.state.liveId,
        cusaward_id: id,
        removed: '1',
      };
      editOrDeleteCustomAward(data).then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.requestCustomData();
        }
      });
    },
    /* 删除操作确认框 */
    confirmDelateOpen(id) {
      console.log(this.customAwardData);
      if (this.customAwardData.length <= 1) {
        this.$message({
          type: 'error',
          message: '删除失败!至少有1条奖项!',
        });
        return;
      }
      this.$confirm('此操作将永久删除该奖项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deleteAward(id);
          this.$message({
            type: 'success',
            message: '删除奖项成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    /* 保存添加 */
    keepAdd(chooseImg, awardType, awardName) {
      if (this.chooseImg && this.awardType) {
        // 提交添加的奖项
        const data = {
          // name: awardType,
          // path_url: chooseImg,
          // prize_name: awardName,
          // liveid: this.$store.state.liveId,
          // kind: '1',
          awardname: awardType,
          piclink: chooseImg,
          prize_name: awardName,
          splid: this.$store.state.liveId,
          kind: '1',
        };
        addCustomAward(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.addAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
      console.log('保存添加');
    },
    /* 保存添加 */
    keepAddTQL() {
      this.chooseImg = 'https://ustatic.joymew.com/haimiao-tql/lottery/tqlcoupon.png';
      const { awardType, chooseImg, chooseCouponObjList, prizeName, chooseCoupon } = this;
      if (chooseImg && awardType && prizeName && chooseCouponObjList.length > 0) {
        // 提交添加的奖项
        const data = {
          template_id: chooseCoupon.join(','),
          awardname: awardType,
          piclink: chooseImg,
          prize_name: prizeName,
          splid: this.$store.state.liveId,
          kind: '1',
        };
        addCustomAward(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: '添加奖项成功',
              type: 'success',
            });
            console.log(res);
            this.requestCustomData();
          }
        });
        this.clearData();
        this.addAwardDialogIsShow = false;
      } else {
        this.$message({
          message: '请完善所有信息!',
          type: 'error',
        });
      }
      console.log('保存添加');
    },
    /* 取消添加 */
    cancelAdd() {
      this.addAwardDialogIsShow = false;
      this.clearData();
      console.log('取消添加');
    },
    /* 上传图片 */
    handleFile(e) {
      // 处理文件
      //  console.log(e)
      // 压缩一下文件

      const freader = new FileReader();
      freader.readAsDataURL(e.file); // 读取照片

      freader.onload = () => {
        this.chooseImg = freader.result;
        this.requestUploadFile();
      };
    },
    /* base 64 转换成file  这里对base64 进行压缩 */
    requestUploadFile() {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();
      img.src = this.chooseImg;
      // const that = this;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.clearRect(0, 0, img.width, img.height);
        context.drawImage(img, 0, 0, img.width, img.height);
        const result = canvas.toDataURL('image/jpeg', 0.7);

        // 转换成 file
        const formData = new FormData();
        const arr = result.split(',');
        // const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const file = new File([u8arr], 'photo');
        formData.append('file', file);
        request
          .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
          .then((res) => {
            console.log(res);
            this.$message({
              message: '图片上传成功!',
              type: 'success',
            });
            this.chooseImg = res.data.filePath;
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('图片上传失败!');
          });
      };
    },
    /* 编辑提交框消失时清空所有表单双向绑定的数据 */
    clearData() {
      this.chooseImg = '';
      this.awardType = '';
      this.awardName = '';
      this.prizeName = '';
      this.chooseCoupon = [];
    },
  },
};
</script>
<style lang="less" scoped>
.coupon-list-wrap {
  max-height: 400px;
  overflow-y: scroll;
}
.toggle-bar {
  display: flex;
  border-bottom: 1px solid #eeeeee;
  padding-left: 20px;
  .toggle-bar-item {
    position: relative;
    // flex-basis: 100px;
    height: 44px;
    justify-content: flex-start;
    padding: 10px 20px;
    text-align: center;
    cursor: pointer;
    background: #d8eafd;
    border-radius: 2px;
    span {
      color: #1e87f0;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }
    .underLine {
      position: absolute;
      width: 20px;
      height: 5px;
      background: #1e87f0;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 2px;
      opacity: 1;
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
.award-info-list-container {
  color: #1e87f0;
  .addAwardBtn {
    width: 96%;
    margin: 30px auto;
    height: 29px;
    border: 1px dashed #1e87f0;
    text-align: center;
    line-height: 29px;
    cursor: pointer;
  }
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
