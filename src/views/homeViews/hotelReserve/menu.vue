<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="菜单"></card-top-info>
      <div class="previewArea">
        <section class="block1" v-if="hasNoHotel">
          暂无酒店
          <el-button type="primary" @click="toCreateHotel" class="openCreateFormBtn">前往创建</el-button>
        </section>
        <section class="block2" v-if="!hasNoHotel && previewStatus === 0">
          <div class="currentNav">菜单 ({{ menuList.length }})</div>
          <div class="cardList">
            <div class="card" v-for="(item, index) in menuList" :key="index">
              <div
                class="poster"
                :style="{ backgroundImage: 'url(' + item.content.coverPath + ')' }"
                @click="openEditMenuForm(item.menuId)"
              ></div>
              <div class="ct">
                <div class="name" @click="openEditMenuForm(item.menuId)">{{ item.content.name }}</div>
                <div class="contains" v-show="item.dishList && item.dishList.length > 0" @click="openEditMenuForm(item.menuId)">
                  含一份菜单
                </div>
                <div class="price" @click="openEditMenuForm(item.menuId)">
                  ¥<label>{{ item.content.pricePerDesk }}</label
                  >/桌
                </div>
              </div>
              <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="deleteCurrentMenu(item.menuId)" />
            </div>
          </div>
        </section>
        <section class="block3" v-if="!hasNoHotel && previewStatus === 0">
          <el-button type="primary" @click="openAddMenuForm" class="openAddMenuFormBtn">新增菜单</el-button>
        </section>
        <section class="block4" v-if="!hasNoHotel && previewStatus === 1">
          <div class="navTop">
            <div class="navItem">
              <div class="deskNum">{{ previewData.pricePerDesk }}元/桌</div>
            </div>
          </div>
          <div class="section1">
            <div class="posterImgItem">
              <img :src="previewData.coverPath" class="posterImg" v-show="previewData.coverPath" />
              <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" />
            </div>
            <div class="name">{{ previewData.name }}</div>
            <div class="desc" v-show="previewData.dishList && previewData.dishList.length > 0">含一个菜单</div>
          </div>
          <div class="section2">
            <div class="menuBox">
              <div class="posterImgItem">
                <img :src="previewData.coverPath" class="posterImg" v-show="previewData.coverPath" />
                <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" />
              </div>
              <div class="menuItem" v-for="(item, index) in previewData.dishList" :key="index">{{ item }}</div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-其他费用-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">服务费</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.otherPrice.servicePrice }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">开瓶费</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.otherPrice.openBottlePrice }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">进场费</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.otherPrice.approachPrice }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-附加信息-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">附加信息</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.additionInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- 表单——创建菜单 -->
      <div class="formArea" v-show="createFormVisible">
        <div class="formTit">创建菜单：</div>
        <el-form ref="form" :model="createForm" label-width="80px">
          <div class="formTit2" v-show="createFormStep === 0">菜单基本信息(step1)：</div>
          <el-form-item label="每桌价格" v-show="createFormStep === 0">
            <el-input-number
              v-model="createForm.pricePerDesk"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onCreateFormPricePerDeskInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="菜单封面" v-show="createFormStep === 0">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="名称" v-show="createFormStep === 0">
            <el-input v-model="createForm.name" maxlength="40" @input="onCreateFormNameInput" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 0">
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 1">菜单列表(step2)：</div>
          <el-form-item label="菜单" v-show="createFormStep === 1">
            <el-input type="textarea" :rows="12" v-model="createForm.dishList" maxlength="300" @input="onCreateFormDishListInput">
            </el-input>
            <label class="tip3">每道菜用分号(;)隔开</label>
          </el-form-item>
          <el-form-item v-show="createFormStep === 1">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 2">菜单其他信息(step3)：</div>
          <el-form-item label="服务费" v-show="createFormStep === 2">
            <el-input
              v-model="createForm.otherPrice.servicePrice"
              maxlength="5"
              @input="onCreateFormServicePriceInput"
              placeholder="请输入服务费"
            ></el-input>
          </el-form-item>
          <el-form-item label="开瓶费" v-show="createFormStep === 2">
            <el-input
              v-model="createForm.otherPrice.openBottlePrice"
              maxlength="5"
              @input="onCreateFormOpenBottlePriceInput"
              placeholder="请输入开瓶费"
            ></el-input>
          </el-form-item>
          <el-form-item label="进场费" v-show="createFormStep === 2">
            <el-input
              v-model="createForm.otherPrice.approachPrice"
              maxlength="5"
              @input="onCreateFormApproachPriceInput"
              placeholder="请输入进场费"
            ></el-input>
          </el-form-item>
          <el-form-item label="附加信息" v-show="createFormStep === 2">
            <el-input type="textarea" :rows="4" v-model="createForm.additionInfo" maxlength="120" @input="onCreateFormAdditionInfoInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 2">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="submitCreateForm">立即创建</el-button>
            <el-button @click="cancelCreateForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表单——编辑菜单 -->
      <div class="formArea" v-show="editFormVisible">
        <div class="formTit">编辑菜单：</div>
        <el-form ref="form" :model="editForm" label-width="80px">
          <div class="formTit2" v-show="editFormStep === 0">菜单基本信息(step1)：</div>
          <el-form-item label="每桌价格" v-show="editFormStep === 0">
            <el-input-number
              v-model="editForm.pricePerDesk"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onEditFormPricePerDeskInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="菜单封面" v-show="editFormStep === 0">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="名称" v-show="editFormStep === 0">
            <el-input v-model="editForm.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入菜单名称"></el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 0">
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 1">菜单列表(step2)：</div>
          <el-form-item label="菜单" v-show="editFormStep === 1">
            <el-input type="textarea" :rows="12" v-model="editForm.dishList" maxlength="300" @input="onEditFormDishListInput"> </el-input>
            <label class="tip3">每道菜用分号(;)隔开</label>
          </el-form-item>
          <el-form-item v-show="editFormStep === 1">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 2">菜单其他信息(step3)：</div>
          <el-form-item label="服务费" v-show="editFormStep === 2">
            <el-input
              v-model="editForm.otherPrice.servicePrice"
              maxlength="5"
              @input="onEditFormServicePriceInput"
              placeholder="请输入服务费"
            ></el-input>
          </el-form-item>
          <el-form-item label="开瓶费" v-show="editFormStep === 2">
            <el-input
              v-model="editForm.otherPrice.openBottlePrice"
              maxlength="5"
              @input="onEditFormOpenBottlePriceInput"
              placeholder="请输入开瓶费"
            ></el-input>
          </el-form-item>
          <el-form-item label="进场费" v-show="editFormStep === 2">
            <el-input
              v-model="editForm.otherPrice.approachPrice"
              maxlength="5"
              @input="onEditFormApproachPriceInput"
              placeholder="请输入进场费"
            ></el-input>
          </el-form-item>
          <el-form-item label="附加信息" v-show="editFormStep === 2">
            <el-input type="textarea" :rows="4" v-model="editForm.additionInfo" maxlength="120" @input="onEditFormAdditionInfoInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 2">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="submitEditForm">立即修改</el-button>
            <el-button @click="cancelEditForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import request from '@/utils/request';
import {
  getMenuList, addMenu, editMenu, deleteMenu,
} from '@/api/hotelReserve/index';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      hasNoHotel: true,
      previewStatus: 0, // 0: 展示列表 1：展示详情
      currentMenuId: '',
      createFormStep: 0,
      editFormStep: 0,
      createFormVisible: false,
      editFormVisible: false,
      previewData: {
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 菜单封面
        dishList: [], // 菜单列表
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
      },
      createForm: {
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 菜单封面
        dishList: '', // 菜单列表 需要特殊处理
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
      },
      editForm: {
        name: '', // 名称
        pricePerDesk: 0, // 每桌价格
        coverPath: '', // 菜单封面
        dishList: '',
        otherPrice: {
          servicePrice: '', // 服务费
          openBottlePrice: '', // 开瓶费
          approachPrice: '', // 进场费
        },
        additionInfo: '', // 附加信息
      },
      menuList: [],
    };
  },
  created() {
    if (this.$store.state.login.hotelId) {
      this.hasNoHotel = false;
      this.getMenuList();
    }
  },
  methods: {
    toCreateHotel() {
      this.$router.push({
        path: '/app/hotelReserve/hotel',
        query: {
          hasNoHotel: this.hasNoHotel,
        },
      });
    },
    openAddMenuForm() {
      this.createFormVisible = true;
      this.previewStatus = 1;
    },
    openEditMenuForm(menuId) {
      console.log('打开编辑页面');
      this.currentMenuId = menuId;
      const currentMenu = this.menuList.find((item) => item.menuId === this.currentMenuId);
      console.log(currentMenu);
      this.previewData.name = currentMenu.content.name;
      this.previewData.pricePerDesk = currentMenu.content.pricePerDesk;
      this.previewData.coverPath = currentMenu.content.coverPath;
      this.previewData.dishList = currentMenu.content.dishList;
      this.previewData.otherPrice.servicePrice = currentMenu.content.otherPrice.servicePrice;
      this.previewData.otherPrice.openBottlePrice = currentMenu.content.otherPrice.openBottlePrice;
      this.previewData.otherPrice.approachPrice = currentMenu.content.otherPrice.approachPrice;
      this.previewData.additionInfo = currentMenu.content.additionInfo;

      this.editForm.name = currentMenu.content.name;
      this.editForm.pricePerDesk = currentMenu.content.pricePerDesk;
      this.editForm.coverPath = currentMenu.content.coverPath;
      this.editForm.dishList = currentMenu.content.dishList.join(';');
      this.editForm.otherPrice.servicePrice = currentMenu.content.otherPrice.servicePrice;
      this.editForm.otherPrice.openBottlePrice = currentMenu.content.otherPrice.openBottlePrice;
      this.editForm.otherPrice.approachPrice = currentMenu.content.otherPrice.approachPrice;
      this.editForm.additionInfo = currentMenu.content.additionInfo;
      this.previewStatus = 1;
      this.editFormVisible = true;
    },
    submitCreateForm() {
      if (!this.createForm.name) {
        this.$message({
          type: 'warning',
          message: '菜单名称不能为空!',
        });
        return;
      }
      if (!this.createForm.pricePerDesk && this.createForm.priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的每桌价格!',
        });
        return;
      }
      if (!this.createForm.coverPath) {
        this.$message({
          type: 'warning',
          message: '菜单封面不能为空!',
        });
        return;
      }
      if (!this.createForm.dishList) {
        this.$message({
          type: 'warning',
          message: '菜单列表不能为空!',
        });
        return;
      }
      if (!this.createForm.otherPrice.servicePrice) {
        this.$message({
          type: 'warning',
          message: '服务费不能为空!',
        });
        return;
      }
      if (!this.createForm.otherPrice.openBottlePrice) {
        this.$message({
          type: 'warning',
          message: '开瓶费不能为空!',
        });
        return;
      }
      if (!this.createForm.otherPrice.approachPrice) {
        this.$message({
          type: 'warning',
          message: '进场费不能为空!',
        });
        return;
      }
      if (!this.createForm.additionInfo) {
        this.$message({
          type: 'warning',
          message: '附加信息不能为空!',
        });
        return;
      }
      const tempForm = {
        ...this.createForm,
        dishList: this.createForm.dishList.indexOf(';') > -1 ? this.createForm.dishList.split(';') : this.createForm.dishList.split('；'),
      };
      console.log(tempForm);
      addMenu(this.$store.state.login.hotelId, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.cancelCreateForm();
          this.getMenuList();
          this.$message.success('创建成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
        });
    },
    submitEditForm() {
      if (!this.editForm.name) {
        this.$message({
          type: 'warning',
          message: '菜单名称不能为空!',
        });
        return;
      }
      if (!this.editForm.pricePerDesk && this.editForm.priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的每桌价格!',
        });
        return;
      }
      if (!this.editForm.coverPath) {
        this.$message({
          type: 'warning',
          message: '菜单封面不能为空!',
        });
        return;
      }
      if (!this.editForm.dishList) {
        this.$message({
          type: 'warning',
          message: '菜单列表不能为空!',
        });
        return;
      }
      if (!this.editForm.otherPrice.servicePrice) {
        this.$message({
          type: 'warning',
          message: '服务费不能为空!',
        });
        return;
      }
      if (!this.editForm.otherPrice.openBottlePrice) {
        this.$message({
          type: 'warning',
          message: '开瓶费不能为空!',
        });
        return;
      }
      if (!this.editForm.otherPrice.approachPrice) {
        this.$message({
          type: 'warning',
          message: '进场费不能为空!',
        });
        return;
      }
      if (!this.editForm.additionInfo) {
        this.$message({
          type: 'warning',
          message: '附加信息不能为空!',
        });
        return;
      }
      const tempForm = {
        ...this.editForm,
        dishList: this.editForm.dishList.indexOf(';') > -1 ? this.editForm.dishList.split(';') : this.editForm.dishList.split('；'),
      };
      console.log(tempForm);
      editMenu(this.currentMenuId, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.cancelEditForm();
          this.getMenuList();
          this.$message.success('编辑成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('编辑失败!');
        });
    },
    cancelEditForm() {
      this.editFormVisible = false;
      this.editFormStep = 0;
      this.previewStatus = 0;
      this.currentMenuId = '';
      this.editForm.name = '';
      this.editForm.pricePerDesk = '';
      this.editForm.pricePerDesk = 0;
      this.editForm.coverPath = '';
      this.editForm.dishList = '';
      this.editForm.otherPrice.servicePrice = '';
      this.editForm.otherPrice.openBottlePrice = '';
      this.editForm.otherPrice.approachPrice = '';
      this.editForm.additionInfo = '';
      this.previewData.name = '';
      this.previewData.pricePerDesk = '';
      this.previewData.pricePerDesk = 0;
      this.previewData.coverPath = '';
      this.previewData.dishList = [];
      this.previewData.otherPrice.servicePrice = '';
      this.previewData.otherPrice.openBottlePrice = '';
      this.previewData.otherPrice.approachPrice = '';
      this.previewData.additionInfo = '';
    },
    cancelCreateForm() {
      this.createFormVisible = false;
      this.previewStatus = 0;
      this.createFormStep = 0;
      this.createForm.name = '';
      this.createForm.pricePerDesk = '';
      this.createForm.pricePerDesk = 0;
      this.createForm.coverPath = '';
      this.createForm.dishList = '';
      this.createForm.otherPrice.servicePrice = '';
      this.createForm.otherPrice.openBottlePrice = '';
      this.createForm.otherPrice.approachPrice = '';
      this.createForm.additionInfo = '';

      this.previewData.name = '';
      this.previewData.pricePerDesk = 0;
      this.previewData.coverPath = '';
      this.previewData.dishList = [];
      this.previewData.otherPrice.servicePrice = '';
      this.previewData.otherPrice.openBottlePrice = '';
      this.previewData.otherPrice.approachPrice = '';
      this.previewData.additionInfo = '';
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
      this.requestUploadImg(e.file);
    },
    requestUploadImg(tmpFile) {
      const formData = new FormData();
      formData.append('file', tmpFile);
      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log('图片地址', res);
          this.previewData.coverPath = res.data.filePath;
          if (this.createFormVisible) {
            this.createForm.coverPath = res.data.filePath;
          } else if (this.editFormVisible) {
            this.editForm.coverPath = res.data.filePath;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    nextCreateForm() {
      if (this.createFormStep === 2) {
        return;
      }
      this.createFormStep += 1;
    },
    previousCreateForm() {
      if (this.createFormStep === 0) {
        return;
      }
      this.createFormStep -= 1;
    },
    nextEditForm() {
      if (this.editFormStep === 2) {
        return;
      }
      this.editFormStep += 1;
    },
    previousEditForm() {
      if (this.editFormStep === 0) {
        return;
      }
      this.editFormStep -= 1;
    },
    removeCurrentPoster(imgPath) {
      this.previewDetail.detail.posterList = this.previewDetail.detail.posterList.filter((item) => item !== imgPath);
      if (this.createFormVisible) {
        this.createForm.detail.posterList = this.createForm.detail.posterList.filter((item) => item !== imgPath);
      } else if (this.editFormVisible) {
        this.editForm.detail.posterList = this.editForm.detail.posterList.filter((item) => item !== imgPath);
      }
    },
    deleteCurrentBanquet(banquetId) {
      this.$confirm('确认删除当前宴会厅?')
        .then(() => {
          console.log(`删除${banquetId}`);
          //   deleteBanquet(banquetId)
          //     .then((res) => {
          //       console.log(res);
          //       this.getBanquetList();
          //       this.$message.success('删除成功!');
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //       this.$message.error('删除失败!');
          //     });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },
    // 菜单相关
    getMenuList() {
      getMenuList(this.$store.state.login.hotelId)
        .then((res) => {
          console.log(res.data.list);
          if (res.data.list.length > 0) {
            this.menuList = res.data.list.map((item) => ({
              menuId: item.wedding_menu_id,
              content: JSON.parse(item.json_data),
            }));
          } else {
            this.menuList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeCurrentCover() {
      this.previewData.coverPath = '';
      if (this.createFormVisible) {
        this.createForm.coverPath = '';
      } else if (this.editFormVisible) {
        this.editForm.coverPath = '';
      }
    },
    deleteCurrentMenu(menuId) {
      this.$confirm('确认删除当前菜单?')
        .then(() => {
          console.log(`删除${menuId}`);
          deleteMenu(menuId)
            .then((res) => {
              console.log(res);
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
    onCreateFormPricePerDeskInput(val) {
      this.previewData.pricePerDesk = val;
    },
    onCreateFormNameInput(val) {
      this.previewData.name = val;
    },
    onCreateFormDishListInput(val) {
      if (val.indexOf(';') > -1) {
        this.previewData.dishList = val.split(';');
      } else if (val.indexOf('；') > -1) {
        this.previewData.dishList = val.split('；');
      }
    },
    onCreateFormServicePriceInput(val) {
      this.previewData.otherPrice.servicePrice = val;
    },
    onCreateFormOpenBottlePriceInput(val) {
      this.previewData.otherPrice.openBottlePrice = val;
    },
    onCreateFormApproachPriceInput(val) {
      this.previewData.otherPrice.approachPrice = val;
    },
    onCreateFormAdditionInfoInput(val) {
      this.previewData.additionInfo = val;
    },

    onEditFormPricePerDeskInput(val) {
      this.previewData.pricePerDesk = val;
    },
    onEditFormNameInput(val) {
      this.previewData.name = val;
    },
    onEditFormDishListInput(val) {
      if (val.indexOf(';') > -1) {
        this.previewData.dishList = val.split(';');
      } else if (val.indexOf('；') > -1) {
        this.previewData.dishList = val.split('；');
      }
    },
    onEditFormServicePriceInput(val) {
      this.previewData.otherPrice.servicePrice = val;
    },
    onEditFormOpenBottlePriceInput(val) {
      this.previewData.otherPrice.openBottlePrice = val;
    },
    onEditFormApproachPriceInput(val) {
      this.previewData.otherPrice.approachPrice = val;
    },
    onEditFormAdditionInfoInput(val) {
      this.previewData.additionInfo = val;
    },
  },
};
</script>

<style lang="less" scoped>
.myMainCard {
  position: relative;
}
.previewArea {
  width: 405px;
  height: 749px;
  background-image: url('../../../assets/image/iphone.png');
  background-size: 100% 100%;
  margin-left: 40px;
  padding: 25px;
  margin-bottom: 20px;
  padding-top: 60px;
  padding-bottom: 50px;
  .block1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #606266;
    font-size: 28px;
    height: 100%;
    .openCreateFormBtn {
      margin-top: 20px;
    }
  }
  .block2 {
    padding-bottom: 24px;
    margin-bottom: 16px;
    .currentNav {
      padding: 0 16px;
      font-size: 18px;
      font-weight: 500;
      color: #333333;
    }
    .cardList {
      padding: 0 6px;
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      overflow: hidden;
      max-height: 589px;
      overflow-y: auto;
      .card {
        width: 100%;
        height: 96px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
        position: relative;
        display: flex;
        align-items: center;
        .poster {
          width: 96px;
          height: 96px;
          cursor: pointer;
          border-radius: 10px;
          background-size: cover;
        }
        .ct {
          padding: 8px;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #333333;
            cursor: pointer;
          }
          .price {
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 4px;
            cursor: pointer;
            label {
              font-size: 14px;
            }
          }
          .contains {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 6px;
          }
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 2px;
          top: 2px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            opacity: 1;
          }
        }
      }
      &::-webkit-scrollbar {
        width: 7px;
        height: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: transparent;
        border-radius: 6px;
      }
      &::-webkit-scrollbar-corner {
        background-color: rgba(0, 0, 0, 0.8);
      }
      &::-webkit-scrollbar-thumb:horizontal {
        width: 7px;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 6px;
      }
      &::-webkit-scrollbar-thumb:vertical {
        width: 7px;
        background-color: rgba(0, 0, 0, 0.8);
        border-radius: 6px;
      }
    }
  }
  .block3 {
    margin-top: -34px;
    text-align: center;
  }
  .block4 {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    .navTop {
      height: 41px;
      white-space: nowrap;
      .navItem {
        width: 184px;
        height: 100%;
        flex-direction: column;
        font-size: 12px;
        font-weight: 400;
        color: #ff457a;
        position: relative;
        display: inline-block;
        padding-top: 12px;
        .deskNum {
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 6px;
        }
        &::after {
          content: '';
          display: block;
          width: 108px;
          height: 3px;
          background: #ff457a;
          position: absolute;
          bottom: 0;
          left: 35px;
        }
      }
    }
    .section1 {
      background-color: #fff;
      .posterImgItem {
        position: relative;
        width: 100%;
        height: 238px;
        .posterImg {
          width: 100%;
          height: 100%;
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
          top: -22px;
          cursor: pointer;
          opacity: 0;
        }
        &:hover {
          .deleteIcon {
            opacity: 1;
          }
        }
      }
      .name {
        padding: 0 16px;
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        padding-top: 16px;
      }
      .desc {
        padding: 0 16px;
        margin-top: 4px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
      }
    }
    .section2 {
      background: #fff;
      padding-top: 20px;
      padding-bottom: 28px;
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        padding-bottom: 20px;
        .posterImgItem {
          position: relative;
          width: 343px;
          height: 125px;
          margin-bottom: 20px;
          .posterImg {
            width: 100%;
            height: 100%;
          }
          .deleteIcon {
            position: absolute;
            width: 22px;
            height: 22px;
            right: -1px;
            top: -25px;
            cursor: pointer;
            opacity: 0;
          }
          &:hover {
            .deleteIcon {
              opacity: 1;
            }
          }
        }
        .menuItem {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          text-align: center;
        }
      }
    }
    .section4 {
      background: #fff;
      .tit {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        text-align: center;
      }
      .infoList {
        margin-top: 16px;
        padding-left: 24px;
        padding-right: 16px;
        .infoItem {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          .label {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
          .ct {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            width: 207px;
          }
        }
      }
      .contactBtn {
        width: 6303px;
        height: 38px;
        background: #ff457a;
        border-radius: 4px;
        margin: 0 auto;
        margin-top: 25px;
        font-size: 12px;
        font-weight: 500;
        color: #ffffff;
      }
    }
    &::-webkit-scrollbar {
      width: 7px;
      height: 10px;
    }
    &::-webkit-scrollbar-track-piece {
      background-color: transparent;
      border-radius: 6px;
    }
    &::-webkit-scrollbar-corner {
      background-color: rgba(0, 0, 0, 0.8);
    }
    &::-webkit-scrollbar-thumb:horizontal {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
    &::-webkit-scrollbar-thumb:vertical {
      width: 7px;
      background-color: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
    }
  }
}
.formArea::v-deep {
  width: 60%;
  position: absolute;
  left: 480px;
  top: 63px;
  .formTit {
    font-size: 23px;
    font-weight: 500;
    color: #3b3c3d;
    margin-bottom: 20px;
  }
  .formTit2 {
    font-size: 19px;
    font-weight: 500;
    color: #3b3c3d;
    margin-bottom: 20px;
  }
  .el-form {
    width: 50%;
    .uploadImg {
      position: relative;
      .el-upload__tip {
        display: none;
      }
    }
    .tip1 {
      color: #333;
      font-size: 8px;
      position: absolute;
      right: -71px;
    }
    .tip2 {
      color: #333;
      font-size: 8px;
      position: absolute;
      right: 0;
    }
    .tip3 {
      color: #333;
      font-size: 8px;
      position: absolute;
      right: -126px;
    }
  }
}
</style>
