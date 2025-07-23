<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="宴会厅"></card-top-info>
      <div class="previewArea">
        <section class="block1" v-if="hasNoHotel">
          暂无酒店
          <el-button type="primary" @click="toCreateHotel" class="openCreateFormBtn">前往创建</el-button>
        </section>
        <section class="block2" v-if="!hasNoHotel && previewStatus === 0">
          <div class="currentNav">宴会厅 ({{ banquetList.length }})</div>
          <div class="cardList">
            <div class="card" v-for="(item, index) in banquetList" :key="index">
              <div class="topPoster" @click="openEditBanquetForm(item.banquetId)"><img :src="item.content.detail.posterList[0]" /></div>
              <div class="info">
                <div class="hotelName" @click="openEditBanquetForm(item.banquetId)">{{ item.content.name }}</div>
                <div class="trait" @click="openEditBanquetForm(item.banquetId)">
                  <label>层高 {{ item.content.floorHeight }}米</label>
                  <label>{{ item.content.columnStatus === '0' ? '无柱' : '有柱' }}</label>
                </div>
              </div>
              <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="deleteCurrentBanquet(item.banquetId)" />
            </div>
          </div>
        </section>
        <section class="block3" v-if="!hasNoHotel && previewStatus === 0">
          <el-button type="primary" @click="openAddBanquetForm" class="openAddBanquetFormBtn">新增宴会厅</el-button>
        </section>
        <section class="block4" v-if="!hasNoHotel && previewStatus === 1">
          <div class="introArea">
            <div class="name">{{ previewDetail.name }}</div>
            <div class="baseInfo">
              <div class="infoItem">{{ previewDetail.deskNum }}桌</div>
              <div class="infoItem">¥{{ previewDetail.pricePerDesk }}元/桌</div>
              <div class="infoItem">{{ previewDetail.columnStatus === '0' ? '无' : '有' }}柱</div>
              <div class="infoItem">层高{{ previewDetail.floorHeight }}米</div>
            </div>
            <div class="advanBox">
              <div class="advanList">
                <div class="advanItem">
                  <div class="label">宴会厅特色：</div>
                  <div class="ct">
                    {{ previewDetail.detail.feature }}
                  </div>
                </div>
                <div class="advanItem">
                  <div class="subItem">
                    <div class="label">起订价：</div>
                    <div class="ct">{{ previewDetail.detail.priceStartOrder }}元/桌</div>
                  </div>
                  <div class="subItem">
                    <div class="label">起订桌数：</div>
                    <div class="ct">{{ previewDetail.detail.deskNumStartOrder }}桌</div>
                  </div>
                </div>
                <div class="advanItem">
                  <div class="subItem">
                    <div class="label">桌规格：</div>
                    <div class="ct">{{ previewDetail.detail.deskSpecification }}人/桌</div>
                  </div>
                  <div class="subItem">
                    <div class="label">迎宾区：</div>
                    <div class="ct">{{ previewDetail.detail.areaWelcomeGuestsStatus === '0' ? '无' : '有' }}</div>
                  </div>
                </div>
                <div class="advanItem">
                  <div class="subItem">
                    <div class="label">香槟塔：</div>
                    <div class="ct">{{ previewDetail.detail.champagneTowerStatus === '0' ? '无' : '有' }}</div>
                  </div>
                  <div class="subItem">
                    <div class="label">舞台：</div>
                    <div class="ct">{{ previewDetail.detail.stageStatus === '0' ? '无' : '有' }}</div>
                  </div>
                </div>
                <div class="advanItem">
                  <div class="subItem">
                    <div class="label">服务费：</div>
                    <div class="ct">{{ previewDetail.detail.servicePrice }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="posterImgWrap">
            <div class="imgItem" v-for="(item, index) in previewDetail.detail.posterList" :key="index">
              <img :src="item" class="posterImg" />
              <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentPoster(item)" />
            </div>
          </div>
        </section>
      </div>
      <!-- 表单——创建宴会厅 -->
      <div class="formArea" v-show="createFormVisible">
        <div class="formTit">创建宴会厅：</div>
        <div class="formTit2" v-show="createFormStep === 0">宴会厅基本信息(step1)：</div>
        <el-form ref="form" :model="createForm" label-width="80px">
          <el-form-item label="名称" v-show="createFormStep === 0">
            <el-input v-model="createForm.name" maxlength="40" @input="onCreateFormNameInput" placeholder="请输入宴会厅名称"></el-input>
          </el-form-item>
          <el-form-item label="桌数" v-show="createFormStep === 0">
            <el-input
              v-model="createForm.deskNum"
              maxlength="10"
              @input="onCreateFormDeskNumInput"
              placeholder="请输入桌数(如:0-0)"
            ></el-input>
            <label class="tip1">格式：0-0</label>
          </el-form-item>
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
          <el-form-item label="柱" v-show="createFormStep === 0">
            <el-radio-group v-model="createForm.columnStatus" @change="onCreateFormColumnStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="层高" v-show="createFormStep === 0">
            <el-input-number
              v-model="createForm.floorHeight"
              :precision="2"
              :step="0.1"
              :max="1000"
              @input="onCreateFormFloorHeightInput"
            ></el-input-number>
            <label class="tip2">米</label>
          </el-form-item>
          <el-form-item v-show="createFormStep === 0">
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 1">宴会厅详情(step2)：</div>
          <el-form-item label="特色" v-show="createFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="createForm.detail.feature" @input="onCreateFormDetailFeatureInput" maxlength="120">
            </el-input>
          </el-form-item>
          <el-form-item label="起订价格" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.detail.priceStartOrder"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onCreateFormDetailPriceStartOrderInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="起订桌数" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.detail.deskNumStartOrder"
              :precision="0"
              :max="1000"
              @input="onCreateFormDetailDeskNumStartOrderInput"
            ></el-input-number>
            <label class="tip2">桌</label>
          </el-form-item>
          <el-form-item label="桌规格" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.detail.deskSpecification"
              :max="100"
              :precision="0"
              @input="onCreateFormDetailDeskSpecificationInput"
            ></el-input-number>
            <label class="tip2">人/桌</label>
          </el-form-item>
          <el-form-item label="迎宾区" v-show="createFormStep === 1">
            <el-radio-group v-model="createForm.detail.areaWelcomeGuestsStatus" @change="onCreateFormDetailAreaWelcomeGuestsStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="香槟塔" v-show="createFormStep === 1">
            <el-radio-group v-model="createForm.detail.champagneTowerStatus" @change="onCreateFormDetailChampagneTowerStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="舞台" v-show="createFormStep === 1">
            <el-radio-group v-model="createForm.detail.stageStatus" @change="onCreateFormDetailStageStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务价格" v-show="createFormStep === 1">
            <el-input v-model="createForm.detail.servicePrice" maxlength="40" @input="onCreateFormDetailServicePriceInput"></el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 1">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 2">宴会厅海报(step3)：</div>
          <el-form-item label="海报图" v-show="createFormStep === 2">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-show="createFormStep === 2">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="submitCreateForm">立即创建</el-button>
            <el-button @click="cancelCreateForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表单——编辑宴会厅 -->
      <div class="formArea" v-show="editFormVisible">
        <div class="formTit">编辑宴会厅：</div>
        <div class="formTit2" v-show="editFormStep === 0">宴会厅基本信息(step1)：</div>
        <el-form ref="form" :model="editForm" label-width="80px">
          <el-form-item label="名称" v-show="editFormStep === 0">
            <el-input v-model="editForm.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入宴会厅名称"></el-input>
          </el-form-item>
          <el-form-item label="桌数" v-show="editFormStep === 0">
            <el-input v-model="editForm.deskNum" maxlength="10" @input="onEditFormDeskNumInput" placeholder="请输入桌数(如:0-0)"></el-input>
            <label class="tip1">格式：0-0</label>
          </el-form-item>
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
          <el-form-item label="柱" v-show="editFormStep === 0">
            <el-radio-group v-model="editForm.columnStatus" @change="onEditFormColumnStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
              <!-- <el-radio label="2">不显示</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="层高" v-show="editFormStep === 0">
            <el-input-number
              v-model="editForm.floorHeight"
              :precision="2"
              :step="0.1"
              :max="1000"
              @input="onEditFormFloorHeightInput"
            ></el-input-number>
            <label class="tip2">米</label>
          </el-form-item>
          <el-form-item v-show="editFormStep === 0">
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 1">宴会厅详情(step2)：</div>
          <el-form-item label="特色" v-show="editFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="editForm.detail.feature" @input="onEditFormDetailFeatureInput" maxlength="120">
            </el-input>
          </el-form-item>
          <el-form-item label="起订价格" v-show="editFormStep === 1">
            <el-input-number
              v-model="editForm.detail.priceStartOrder"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onEditFormDetailPriceStartOrderInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="起订桌数" v-show="editFormStep === 1">
            <el-input-number
              v-model="editForm.detail.deskNumStartOrder"
              :precision="0"
              :max="1000"
              @input="onEditFormDetailDeskNumStartOrderInput"
            ></el-input-number>
            <label class="tip2">桌</label>
          </el-form-item>
          <el-form-item label="桌规格" v-show="editFormStep === 1">
            <el-input-number
              v-model="editForm.detail.deskSpecification"
              :max="100"
              :precision="0"
              @input="onEditFormDetailDeskSpecificationInput"
            ></el-input-number>
            <label class="tip2">人/桌</label>
          </el-form-item>
          <el-form-item label="迎宾区" v-show="editFormStep === 1">
            <el-radio-group v-model="editForm.detail.areaWelcomeGuestsStatus" @change="onEditFormDetailAreaWelcomeGuestsStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="香槟塔" v-show="editFormStep === 1">
            <el-radio-group v-model="editForm.detail.champagneTowerStatus" @change="onEditFormDetailChampagneTowerStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="舞台" v-show="editFormStep === 1">
            <el-radio-group v-model="editForm.detail.stageStatus" @change="onEditFormDetailStageStatusChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务价格" v-show="editFormStep === 1">
            <el-input v-model="editForm.detail.servicePrice" maxlength="40" @input="onEditFormDetailServicePriceInput"></el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 1">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 2">宴会厅海报(step3)：</div>
          <el-form-item label="海报图" v-show="editFormStep === 2">
            <el-upload drag action multiple :http-request="handleFormImgFile" list-type="picture" :show-file-list="false" class="uploadImg">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item v-show="editFormStep === 2">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="submitEditForm">修改</el-button>
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
import { getBanquetList, addBanquet, editBanquet, deleteBanquet } from '@/api/hotelReserve/index';

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
      banquetList: [],
      currentBanquetId: '', // 当前展示详情的宴会厅id
      createFormStep: 0,
      editFormStep: 0,
      createFormVisible: false,
      editFormVisible: false,
      previewDetail: {
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
      },
      createForm: {
        name: '', // 名称
        deskNum: '', // 桌数
        pricePerDesk: 0, // 每桌价格
        columnStatus: '0', // 柱有无
        floorHeight: '', // 层高
        detail: {
          feature: '', // 特色
          priceStartOrder: '', // 起订价格 单位元/桌
          deskNumStartOrder: '', // 起订桌数
          deskSpecification: '', // 桌规格 单位人/桌
          areaWelcomeGuestsStatus: '0', // 迎宾区有无
          champagneTowerStatus: '0', // 香槟塔有无
          stageStatus: '0', // 舞台有无
          servicePrice: '', // 服务价格
          posterList: [],
        },
      },
      editForm: {
        name: '', // 名称
        deskNum: '', // 桌数
        pricePerDesk: 0, // 每桌价格
        columnStatus: '0', // 柱有无
        floorHeight: '', // 层高
        detail: {
          feature: '', // 特色
          priceStartOrder: '', // 起订价格 单位元/桌
          deskNumStartOrder: '', // 起订桌数
          deskSpecification: '', // 桌规格 单位人/桌
          areaWelcomeGuestsStatus: '0', // 迎宾区有无
          champagneTowerStatus: '0', // 香槟塔有无
          stageStatus: '0', // 舞台有无
          servicePrice: '', // 服务价格
          posterList: [],
        },
      },
    };
  },
  created() {
    this.hasNoHotel = false;
    this.getBanquetList();
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
    openAddBanquetForm() {
      this.createFormVisible = true;
      this.previewStatus = 1;
    },
    openEditBanquetForm(banquetId) {
      console.log('打开编辑页面');
      this.currentBanquetId = banquetId;
      const currentBanquet = this.banquetList.find((item) => item.banquetId === this.currentBanquetId);
      console.log(currentBanquet);
      this.previewDetail.name = currentBanquet.content.name;
      this.previewDetail.deskNum = currentBanquet.content.deskNum;
      this.previewDetail.pricePerDesk = currentBanquet.content.pricePerDesk;
      this.previewDetail.columnStatus = currentBanquet.content.columnStatus;
      this.previewDetail.floorHeight = currentBanquet.content.floorHeight;
      this.previewDetail.detail.feature = currentBanquet.content.detail.feature;
      this.previewDetail.detail.priceStartOrder = currentBanquet.content.detail.priceStartOrder;
      this.previewDetail.detail.deskNumStartOrder = currentBanquet.content.detail.deskNumStartOrder;
      this.previewDetail.detail.deskSpecification = currentBanquet.content.detail.deskSpecification;
      this.previewDetail.detail.areaWelcomeGuestsStatus = currentBanquet.content.detail.areaWelcomeGuestsStatus;
      this.previewDetail.detail.champagneTowerStatus = currentBanquet.content.detail.champagneTowerStatus;
      this.previewDetail.detail.stageStatus = currentBanquet.content.detail.stageStatus;
      this.previewDetail.detail.servicePrice = currentBanquet.content.detail.servicePrice;
      this.previewDetail.detail.posterList = currentBanquet.content.detail.posterList;
      this.editForm.name = currentBanquet.content.name;
      this.editForm.deskNum = currentBanquet.content.deskNum;
      this.editForm.pricePerDesk = currentBanquet.content.pricePerDesk;
      this.editForm.columnStatus = currentBanquet.content.columnStatus;
      this.editForm.floorHeight = currentBanquet.content.floorHeight;
      this.editForm.detail.feature = currentBanquet.content.detail.feature;
      this.editForm.detail.priceStartOrder = currentBanquet.content.detail.priceStartOrder;
      this.editForm.detail.deskNumStartOrder = currentBanquet.content.detail.deskNumStartOrder;
      this.editForm.detail.deskSpecification = currentBanquet.content.detail.deskSpecification;
      this.editForm.detail.areaWelcomeGuestsStatus = currentBanquet.content.detail.areaWelcomeGuestsStatus;
      this.editForm.detail.champagneTowerStatus = currentBanquet.content.detail.champagneTowerStatus;
      this.editForm.detail.stageStatus = currentBanquet.content.detail.stageStatus;
      this.editForm.detail.servicePrice = currentBanquet.content.detail.servicePrice;
      this.editForm.detail.posterList = currentBanquet.content.detail.posterList;
      this.previewStatus = 1;
      this.editFormVisible = true;
    },
    getBanquetList() {
      getBanquetList('7' || this.$store.state.login.hotelId)
        .then((res) => {
          console.log(res);
          if (res.data.list.length > 0) {
            this.banquetList = res.data.list.map((item) => ({
              banquetId: item.wedding_banquet_id,
              content: JSON.parse(item.json_data),
            }));
          } else {
            this.banquetList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submitCreateForm() {
      if (!this.createForm.name) {
        this.$message({
          type: 'warning',
          message: '宴会厅名称不能为空!',
        });
        return;
      }
      if (!this.createForm.deskNum) {
        this.$message({
          type: 'warning',
          message: '桌数不能为空!',
        });
        return;
      }
      if (!this.createForm.floorHeight) {
        this.$message({
          type: 'warning',
          message: '层高不能为空!',
        });
        return;
      }
      if (!this.createForm.detail.feature) {
        this.$message({
          type: 'warning',
          message: '特色不能为空!',
        });
        return;
      }
      if (!this.createForm.detail.priceStartOrder && this.createForm.detail.priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订价格!',
        });
        return;
      }
      if (!this.createForm.detail.deskNumStartOrder && this.createForm.detail.deskNumStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订桌数!',
        });
        return;
      }
      if (!this.createForm.detail.deskSpecification) {
        this.$message({
          type: 'warning',
          message: '请输入正确的桌规格!',
        });
        return;
      }
      if (!this.createForm.detail.servicePrice) {
        this.$message({
          type: 'warning',
          message: '服务价格不能为空!',
        });
        return;
      }
      if (this.createForm.detail.posterList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张海报图!',
        });
        return;
      }
      console.log(this.createForm);
      addBanquet(this.$store.state.login.hotelId, JSON.stringify(this.createForm))
        .then((res) => {
          console.log(res);
          this.cancelCreateForm();
          this.getBanquetList();
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
          message: '宴会厅名称不能为空!',
        });
        return;
      }
      if (!this.editForm.deskNum) {
        this.$message({
          type: 'warning',
          message: '桌数不能为空!',
        });
        return;
      }
      if (!this.editForm.floorHeight) {
        this.$message({
          type: 'warning',
          message: '层高不能为空!',
        });
        return;
      }
      if (!this.editForm.detail.feature) {
        this.$message({
          type: 'warning',
          message: '特色不能为空!',
        });
        return;
      }
      if (!this.editForm.detail.priceStartOrder && this.editForm.detail.priceStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订价格!',
        });
        return;
      }
      if (!this.editForm.detail.deskNumStartOrder && this.editForm.detail.deskNumStartOrder !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的起订桌数!',
        });
        return;
      }
      if (!this.editForm.detail.deskSpecification) {
        this.$message({
          type: 'warning',
          message: '请输入正确的桌规格!',
        });
        return;
      }
      if (!this.editForm.detail.servicePrice) {
        this.$message({
          type: 'warning',
          message: '服务价格不能为空!',
        });
        return;
      }
      if (this.editForm.detail.posterList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张海报图!',
        });
        return;
      }
      console.log(this.editForm);
      editBanquet(this.currentBanquetId, JSON.stringify(this.editForm))
        .then((res) => {
          console.log(res);
          this.cancelCreateForm();
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
      this.currentBanquetId = '';
      this.editForm.name = '';
      this.editForm.deskNum = '';
      this.editForm.pricePerDesk = 0;
      this.editForm.columnStatus = '0';
      this.editForm.floorHeight = '';
      this.editForm.detail.feature = '';
      this.editForm.detail.priceStartOrder = '';
      this.editForm.detail.deskNumStartOrder = '';
      this.editForm.detail.deskSpecification = '';
      this.editForm.detail.areaWelcomeGuestsStatus = '0';
      this.editForm.detail.champagneTowerStatus = '0';
      this.editForm.detail.stageStatus = '0';
      this.editForm.detail.servicePrice = '';
      this.editForm.detail.posterList = [];
      this.previewDetail.name = '';
      this.previewDetail.deskNum = '';
      this.previewDetail.pricePerDesk = 0;
      this.previewDetail.columnStatus = '0';
      this.previewDetail.floorHeight = '';
      this.previewDetail.detail.feature = '';
      this.previewDetail.detail.priceStartOrder = '';
      this.previewDetail.detail.deskNumStartOrder = '';
      this.previewDetail.detail.deskSpecification = '';
      this.previewDetail.detail.areaWelcomeGuestsStatus = '0';
      this.previewDetail.detail.champagneTowerStatus = '0';
      this.previewDetail.detail.stageStatus = '0';
      this.previewDetail.detail.servicePrice = '';
      this.previewDetail.detail.posterList = [];
    },
    cancelCreateForm() {
      this.createFormVisible = false;
      this.previewStatus = 0;
      this.createFormStep = 0;
      this.createForm.name = '';
      this.createForm.deskNum = '';
      this.createForm.pricePerDesk = 0;
      this.createForm.columnStatus = '0';
      this.createForm.floorHeight = '';
      this.createForm.detail.feature = '';
      this.createForm.detail.priceStartOrder = '';
      this.createForm.detail.deskNumStartOrder = '';
      this.createForm.detail.deskSpecification = '';
      this.createForm.detail.areaWelcomeGuestsStatus = '0';
      this.createForm.detail.champagneTowerStatus = '0';
      this.createForm.detail.stageStatus = '0';
      this.createForm.detail.servicePrice = '';
      this.createForm.detail.posterList = [];
      this.previewDetail.name = '';
      this.previewDetail.deskNum = '';
      this.previewDetail.pricePerDesk = 0;
      this.previewDetail.columnStatus = '0';
      this.previewDetail.floorHeight = '';
      this.previewDetail.detail.feature = '';
      this.previewDetail.detail.priceStartOrder = '';
      this.previewDetail.detail.deskNumStartOrder = '';
      this.previewDetail.detail.deskSpecification = '';
      this.previewDetail.detail.areaWelcomeGuestsStatus = '0';
      this.previewDetail.detail.champagneTowerStatus = '0';
      this.previewDetail.detail.stageStatus = '0';
      this.previewDetail.detail.servicePrice = '';
      this.previewDetail.detail.posterList = [];
    },
    handleFormImgFile(e) {
      console.log(e);
      if (e.file.size > 10300000) {
        this.$message.error('上传图片不超10M!');
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
          this.previewDetail.detail.posterList.push(res.data.filePath);
          this.editForm.detail.posterList = this.previewDetail.detail.posterList;
          if (this.createFormVisible) {
            this.createForm.detail.posterList.push(res.data.filePath);
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
    onCreateFormNameInput(val) {
      this.previewDetail.name = val;
    },
    onCreateFormDeskNumInput(val) {
      this.previewDetail.deskNum = val;
    },
    onCreateFormPricePerDeskInput(val) {
      this.previewDetail.pricePerDesk = val;
    },
    onCreateFormColumnStatusChange(val) {
      console.log(val);
      this.previewDetail.columnStatus = val;
    },
    onCreateFormFloorHeightInput(val) {
      this.previewDetail.floorHeight = val;
    },
    onCreateFormDetailFeatureInput(val) {
      this.previewDetail.detail.feature = val;
    },
    onCreateFormDetailPriceStartOrderInput(val) {
      this.previewDetail.detail.priceStartOrder = val;
    },
    onCreateFormDetailDeskNumStartOrderInput(val) {
      this.previewDetail.detail.deskNumStartOrder = val;
    },
    onCreateFormDetailDeskSpecificationInput(val) {
      this.previewDetail.detail.deskSpecification = val;
    },
    onCreateFormDetailAreaWelcomeGuestsStatusChange(val) {
      this.previewDetail.detail.areaWelcomeGuestsStatus = val;
    },
    onCreateFormDetailChampagneTowerStatusChange(val) {
      this.previewDetail.detail.champagneTowerStatus = val;
    },
    onCreateFormDetailStageStatusChange(val) {
      this.previewDetail.detail.stageStatus = val;
    },
    onCreateFormDetailServicePriceInput(val) {
      this.previewDetail.detail.servicePrice = val;
    },
    onEditFormNameInput(val) {
      this.previewDetail.name = val;
    },
    onEditFormDeskNumInput(val) {
      this.previewDetail.deskNum = val;
    },
    onEditFormPricePerDeskInput(val) {
      this.previewDetail.pricePerDesk = val;
    },
    onEditFormColumnStatusChange(val) {
      console.log(val);
      this.previewDetail.columnStatus = val;
    },
    onEditFormFloorHeightInput(val) {
      this.previewDetail.floorHeight = val;
    },
    onEditFormDetailFeatureInput(val) {
      this.previewDetail.detail.feature = val;
    },
    onEditFormDetailPriceStartOrderInput(val) {
      this.previewDetail.detail.priceStartOrder = val;
    },
    onEditFormDetailDeskNumStartOrderInput(val) {
      this.previewDetail.detail.deskNumStartOrder = val;
    },
    onEditFormDetailDeskSpecificationInput(val) {
      this.previewDetail.detail.deskSpecification = val;
    },
    onEditFormDetailAreaWelcomeGuestsStatusChange(val) {
      this.previewDetail.detail.areaWelcomeGuestsStatus = val;
    },
    onEditFormDetailChampagneTowerStatusChange(val) {
      this.previewDetail.detail.champagneTowerStatus = val;
    },
    onEditFormDetailStageStatusChange(val) {
      this.previewDetail.detail.stageStatus = val;
    },
    onEditFormDetailServicePriceInput(val) {
      this.previewDetail.detail.servicePrice = val;
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
        width: 166px;
        height: 188px;
        background: #ffffff;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
        margin-bottom: 12px;
        position: relative;
        .topPoster {
          height: 125px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          height: 67px;
          padding: 8px;
          .hotelName {
            font-size: 14px;
            font-weight: 500;
            color: #333333;
            cursor: pointer;
          }
          .trait {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
            margin-top: 4px;
            cursor: pointer;
          }
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
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
    .introArea {
      flex-direction: column;
      .name {
        font-size: 20px;
        font-weight: 400;
        color: #000000;
        padding: 0 10px;
      }
      .baseInfo {
        margin-top: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        display: flex;
        .infoItem {
          padding: 0 10px;
          position: relative;
          display: flex;
          align-items: center;
          &::before {
            content: '';
            width: 2px;
            height: 12px;
            opacity: 1;
            background: #dddddd;
            position: absolute;
            right: 0;
          }
          &:last-child {
            &::before {
              background: transparent;
            }
          }
        }
      }
      .advanBox {
        width: 343px;
        border: 1px solid #dddddd;
        margin-top: 16px;
        flex-direction: column;
        padding: 10px 14px;
        display: flex;
        align-items: center;
        margin-left: 5px;
        .advanList {
          flex-direction: column;
          overflow: hidden;
          display: flex;
          align-items: center;
          .advanItem {
            width: 311px;
            display: flex;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
            justify-content: space-between;
            .label {
              font-size: 14px;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.4);
              white-space: nowrap;
            }
            .ct {
              font-size: 14px;
              font-weight: 400;
              color: #333333;
            }
            .subItem {
              width: 50%;
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
    .posterImgWrap {
      margin-top: 24px;
      margin-left: 5px;
      .imgItem {
        width: 100%;
        position: relative;
        .posterImg {
          width: 100%;
        }
        .deleteIcon {
          position: absolute;
          width: 22px;
          height: 22px;
          right: 0px;
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
      right: 182px;
    }
  }
}
</style>
