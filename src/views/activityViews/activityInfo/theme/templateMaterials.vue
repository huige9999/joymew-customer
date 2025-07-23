<template>
  <div class="templateMaterials">
    <el-dialog
      :visible.sync="templateMaterialsDialogVisible"
      :close-on-click-modal="false"
      title="模板库"
      class="elDialog"
      width="1000px"
      v-loading="isLoading"
    >
      <div class="dialogContent">
        <div class="navMenu">
          <div class="navItem" :class="{ active: currentNavIndex === 0 }" @click="onNavItemClick(0)">风格主题</div>
          <div class="navItem" :class="{ active: currentNavIndex === 1 }" @click="onNavItemClick(1)">节日背景</div>
        </div>
        <div class="templateMaterialList">
          <div
            class="materialItem"
            v-for="(item, index) in templateMaterialsDisplay"
            :key="currentNavIndex + '-' + index"
            :class="{ active: item.isActive }"
            @click="chooseTemplateMaterial(item)"
          >
            <img :src="item.screenCover" class="coverImg" />
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
        <el-pagination
          :total="total"
          :page-size="showCount"
          :current-page.sync="currentPage"
          @current-change="onCurrentPageChange"
          layout="prev, pager, next"
          class="myPagination"
        ></el-pagination>
      </div>
      <template #footer>
        <div class="btnGroup">
          <div class="btn cancel" @click="onCancelChooseMaterials">取消</div>
          <div class="btn confirm" @click="onConfirmChooseMaterials">确定</div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { formatScreenUrl, getScreenTemplateMaterialType, judgeUrlIsTemplate, templateMaterials } from '@/assets/constant/theme';
import request from '@/utils/request';

export default {
  name: 'templateMaterials',
  data() {
    return {
      templateMaterialsDialogVisible: false,
      currentNavIndex: 1, // 取值0表示风格主题，取值1表示节日背景
      templateMaterialsDisplay: [],
      templateMaterialsSource: [],
      currentPage: 1,
      showCount: 8,
      total: 0,
      choosedScreenCover: '', // 选中的封面
      choosedTemplateMaterial: null,
      isLoading: false,
      inNavMenuChooseScene: false,
      inPageChooseScene: false,
      inTemplateChooseScene: false,
    };
  },
  watch: {
    // 只作用于：用户点击切换navMenu的场景
    // 给templateMaterialsSource赋值 值为templateMaterials(经过map处理active项)
    // templateMaterialsDisplay赋值 值为templateMaterialsSource(经过初始化的分页逻辑处理)
    currentNavIndex(val) {
      if (!this.inNavMenuChooseScene) {
        return;
      }
      if (val === 0) {
        this.templateMaterialsSource = this.templateMaterialThemes.map((item) => {
          return {
            ...item,
            isActive: item.screenCover === this.choosedScreenCover,
          };
        });
        this.initTemplateMaterialsDisplay();
      } else {
        this.templateMaterialsSource = templateMaterials.festival.map((item) => {
          return {
            ...item,
            isActive: item.screenCover === this.choosedScreenCover,
          };
        });
        this.initTemplateMaterialsDisplay();
      }
      this.inNavMenuChooseScene = false;
    },
    // 只作用于：用户点击分页器的场景
    // templateMaterialsDisplay赋值 值为templateMaterialsSource(经过map处理active项、经过分页逻辑处理)
    currentPage(newPage) {
      if (!this.inPageChooseScene) {
        return;
      }
      this.templateMaterialsDisplay = this.templateMaterialsSource
        .map((i) => {
          return {
            ...i,
            isActive: i.screenCover === this.choosedScreenCover,
          };
        })
        .slice((newPage - 1) * this.showCount, newPage * this.showCount);
      this.inPageChooseScene = false;
    },
    // 只作用于：用户手动选择模板的场景
    // templateMaterialsDisplay赋值 值为templateMaterialsSource(经过map处理active项)
    choosedScreenCover(newVal) {
      if (!this.inTemplateChooseScene) {
        return;
      }
      this.templateMaterialsDisplay = this.templateMaterialsDisplay.map((i) => {
        return {
          ...i,
          isActive: i.screenCover === newVal,
        };
      });
      this.inNavMenuChooseScene = false;
    },
    // 通知父组件移除templateMaterials组件
    templateMaterialsDialogVisible(newVal) {
      if (!newVal) {
        this.$emit('templateMaterialClose');
      }
    },
  },
  props: {
    screenBgList: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  created() {
    if (this.$store.state.sceneType === '0') {
      this.templateMaterialThemes = templateMaterials.theme.wedding;
    } else if (this.$store.state.sceneType === '1') {
      this.templateMaterialThemes = templateMaterials.theme.enterprise;
    } else if (['2', '21', '22', '23', '24', '25'].includes(this.$store.state.sceneType)) {
      this.templateMaterialThemes = templateMaterials.theme.birth;
    } else {
      this.templateMaterialThemes = [];
    }
  },
  mounted() {},
  methods: {
    openDialog() {
      this.initTemplateMaterialsDisplay(true);
      this.templateMaterialsDialogVisible = true;
    },
    onNavItemClick(index) {
      this.inNavMenuChooseScene = true;
      this.currentNavIndex = index;
    },
    // templateMaterialsDisplay赋值
    // isFirst无值则执行默认的赋值逻辑
    // isFirst有指则需要根据screenBgList的值来给templateMaterialsDisplay赋值
    initTemplateMaterialsDisplay(isFirst) {
      if (
        !isFirst
        || this.screenBgList.length > 1
        || this.screenBgList.length === 0
        || (this.screenBgList.length === 1 && !judgeUrlIsTemplate(this.screenBgList[0].url))
      ) {
        // 执行默认赋值逻辑
        this.currentPage = 1;
        this.templateMaterialsSource = this.currentNavIndex === 0
          ? this.templateMaterialThemes.map((item) => ({ ...item, isActive: false }))
          : templateMaterials.festival.map((item) => ({ ...item, isActive: false }));
        this.total = this.templateMaterialsSource.length;
        this.templateMaterialsDisplay = this.templateMaterialsSource.slice(0, this.showCount);
      } else {
        // 大屏选择过模板图片
        // screenBgList赋值 值为格式化后的url
        const screenBgUrl = formatScreenUrl(this.screenBgList[0].url);
        // currentNavInde赋值
        this.currentNavIndex = getScreenTemplateMaterialType(screenBgUrl);
        // templateMaterialsSource赋值
        this.templateMaterialsSource = this.currentNavIndex === 0
          ? this.templateMaterialThemes.map((item) => ({ ...item, isActive: item.screen === screenBgUrl }))
          : templateMaterials.festival.map((item) => ({ ...item, isActive: item.screen === screenBgUrl }));
        // 查找screenBgUrl在templateMaterialsSource中的索引
        // currentPage赋值、total赋值、templateMaterialsDisplay赋值、choosedScreenCover赋值、choosedTemplateMaterial赋值
        const screenBgIndex = this.templateMaterialsSource.findIndex((item) => item.screen === screenBgUrl);
        this.currentPage = Math.ceil((screenBgIndex + 1) / this.showCount);
        this.total = this.templateMaterialsSource.length;
        this.choosedScreenCover = this.templateMaterialsSource[screenBgIndex].screenCover;
        this.choosedTemplateMaterial = this.templateMaterialsSource[screenBgIndex];
        this.templateMaterialsDisplay = this.templateMaterialsSource.slice(
          (this.currentPage - 1) * this.showCount,
          this.currentPage * this.showCount,
        );
      }
    },
    onCancelChooseMaterials() {
      this.inTemplateChooseScene = true;
      this.templateMaterialsDialogVisible = false;
      this.choosedScreenCover = '';
      this.choosedTemplateMaterial = null;
    },
    async onConfirmChooseMaterials() {
      if (!this.choosedTemplateMaterial) {
        this.$message({
          message: '请选择模板!',
          type: 'warning',
        });
        return;
      }
      if (this.screenBgList.length > 1 || (this.screenBgList.length === 1 && !judgeUrlIsTemplate(this.screenBgList[0].url))) {
        this.$message({
          message: '大屏背景已存在自定义，请删除后重新选择模板!',
          type: 'warning',
        });
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      if (this.screenBgList.length === 1 && judgeUrlIsTemplate(this.screenBgList[0].url)) {
        // 调用接口删除背景图
        const screenBg = this.screenBgList[0];
        const deleteScreenBgRes = await request.post('/beiJing/removePcBeiJing', {
          id: screenBg.id,
          url: screenBg.url,
        });
        console.log('删除背景图结果:', deleteScreenBgRes);
      }
      if (this.choosedTemplateMaterial.screenCover) {
        // 调用接口设置大屏封面
        const screenUploadRes = await request.post('/beiJing/savePcBeiJing', {
          splid: this.$store.state.liveId,
          piclink: this.choosedTemplateMaterial.screen.split('https://static.hudongmiao.com/')[1],
        });
        console.log('大屏背景上传结果:', screenUploadRes);
        this.$emit('screenBgListRefresh');
      }
      if (this.choosedTemplateMaterial.mobileCover) {
        // 调用接口设置小屏背景和签到背景
        const mpUploadRes = await request.post('/qiYeNe/update', {
          splid: this.$store.state.liveId,
          qd_back: this.choosedTemplateMaterial.mobile,
        });
        console.log('签到背景上传结果:', mpUploadRes);
        const h5UploadRes = await request.post('/qiYeNe/update', {
          splid: this.$store.state.liveId,
          phone_piclink: this.choosedTemplateMaterial.mobile,
        });
        console.log('h5背景上传结果:', h5UploadRes);
        this.$emit('mobileThemeRefresh');
      }
      this.isLoading = false;
      this.templateMaterialsDialogVisible = false;

      // if (this.screenBgList.length > 0) {
      //   // 如果上传过背景只能手动删除后才能选择模板
      //   this.$message({
      //     message: '大屏背景已存在自定义，请删除后重新选择模板!',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // this.isLoading = true;
      // console.log(this.choosedTemplateMaterial);
      // console.log(this.$store.state.login.userInfo.qinNiu_prefix);
      // if (this.choosedTemplateMaterial.screenCover) {
      //   this.choosedTemplateMaterial.screen = this.choosedTemplateMaterial.screen.replace(
      //     'https://static.hudongmiao.com/',
      //     this.$store.state.login.userInfo.qinNiu_prefix
      //   );
      //   console.log(this.choosedTemplateMaterial.screen);
      //   // 调用接口设置大屏封面
      //   const screenUploadRes = await request.post('/beiJing/savePcBeiJing', {
      //     splid: this.$store.state.liveId,
      //     piclink: this.choosedTemplateMaterial.screen.split(this.$store.state.login.userInfo.qinNiu_prefix)[1]
      //   });
      //   console.log('大屏背景上传结果:', screenUploadRes);
      //   this.$emit('screenBgListRefresh');
      // }
      // if (this.choosedTemplateMaterial.mobileCover) {
      //   // 调用接口设置小屏背景和签到背景
      //   const mpUploadRes = await request.post('/qiYeNe/update', {
      //     splid: this.$store.state.liveId,
      //     qd_back: this.choosedTemplateMaterial.mobile
      //   });
      //   console.log('签到背景上传结果:', mpUploadRes);
      //   const h5UploadRes = await request.post('/qiYeNe/update', {
      //     splid: this.$store.state.liveId,
      //     phone_piclink: this.choosedTemplateMaterial.mobile
      //   });
      //   console.log('h5背景上传结果:', h5UploadRes);
      //   this.$emit('mobileThemeRefresh');
      // }
      // this.isLoading = false;
      // this.templateMaterialsDialogVisible = false;
    },
    chooseTemplateMaterial(item) {
      this.inTemplateChooseScene = true;
      this.choosedScreenCover = item.screenCover;
      this.choosedTemplateMaterial = item;
    },
    onCurrentPageChange() {
      this.inPageChooseScene = true;
    },
  },
};
</script>
<style lang="less" scoped>
.elDialog::v-deep {
  .el-dialog__header {
    text-align: center;
  }
}
.dialogContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  .navMenu {
    width: 271px;
    height: 49px;
    background: rgba(30, 135, 240, 0.1);
    border-radius: 65px;
    display: flex;
    .navItem {
      font-size: 20px;
      font-weight: 400;
      color: #1e87f0;
      flex: 1;
      text-align: center;
      line-height: 49px;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      &.active {
        background: #1e87f0;
        color: #fff;
        border-radius: 65px;
      }
    }
  }
  .templateMaterialList {
    width: 100%;
    height: 400px;
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(4, 213px);
    grid-template-rows: auto auto;
    grid-column-gap: 24px;
    grid-row-gap: 30px;
    justify-content: center;
    .materialItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      .coverImg {
        width: 213px;
        height: 120px;
        border-radius: 2px;
      }
      .name {
        font-size: 20px;
        font-weight: 400;
        color: #333333;
      }
      &:hover {
        .coverImg {
          transition: transform 0.3s ease-out;
          transform: scale(1.1);
        }
      }
      &.active {
        .coverImg {
          border: 4px solid #249aff;
        }
        .name {
          color: #249aff;
        }
      }
    }
  }
  .myPagination {
    margin-top: 28px;
  }
}
.btnGroup {
  display: flex;
  justify-content: center;
  gap: 24px;
  .btn {
    width: 68px;
    height: 38px;
    border-radius: 2px;
    text-align: center;
    line-height: 38px;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    &.confirm {
      background: #249aff;
      color: #ffffff;
    }
    &.cancel {
      background: #f2f3f5;
      color: #1d2129;
    }
  }
}

.templateMaterials::v-deep {
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0.9);
    position: fixed;
  }
}
</style>
