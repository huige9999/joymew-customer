<template>
  <div class="formWrap">
    <div class="formArea">
      <!-- {{setMealList}} -->
      <el-row :gutter="12" class="setMealList">

        <el-col :span="6" class="banqueItem" v-for="banquet in groupList" :key="'banquetId' + banquet.setMealId">
          <!-- <img :src="banquet.content.detail.posterList[0]" alt="" class="img" /> -->
          <el-image :src="banquet.content.carouselList[0]" class="img" fit="cover">
            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
          </el-image>
          <div class="baseInfo">
            {{ banquet.content.name }}
          </div>
          <div class="op-wrap">
            <el-link type="primary" @click="deleteCurrentSetMeal(banquet.setMealId)">删除</el-link>
            <el-link type="primary" class="item" @click.native="openEditSetMealForm(banquet.setMealId)">修改</el-link>
          </div>
        </el-col>

        <el-col :span="6" class="banqueItem center" @click.native="showEdit">
          <i class="el-icon-plus"></i>
        </el-col>
      </el-row>

      <el-dialog   :close-on-click-modal="false" :close-on-press-escape="false" :title="title" append-to-body :visible.sync="dialogVisible" width="50%" @close="handleClose">
        <div class="formArea" v-if="dialogVisible">

          <!-- <div class="formTit">编辑套餐：</div>
          <div class="formTit2" v-show="FormStep === 0">套餐基本信息(step1)：</div>
          <div class="formTit2" v-show="FormStep === 1">喜宴(step2)：</div>
            <div class="formTit2" v-show="FormStep === 2">菜单(step3)：</div>
            <div class="formTit2" v-show="FormStep === 3">场地(step4)：</div>
            <div class="formTit2" v-show="FormStep === 4">婚礼布置(step5)：</div>
            <div class="formTit2" v-show="FormStep === 5">鲜花装饰(step6)：</div>
            <div class="formTit2" v-show="FormStep === 6">服务团队(step7)：</div>
            <div class="formTit2" v-show="FormStep === 7">仪式(step8)：</div>
            <div class="formTit2" v-show="FormStep === 8">灯光设备(step9)：</div>
            <div class="formTit2" v-show="FormStep === 9">个性制作(step10)：</div> -->
            <!-- <div class="formTit2" v-show="FormStep === 10">附加信息(step11)：</div> -->
            <el-steps :active="active" finish-status="finish" align-center style="margin:10px 0;margin-bottom:20px">
              <el-step title="step1" description="套餐基本信息" @click.native="FormStep=0"></el-step>
              <el-step title="step2" description="喜宴" @click.native="FormStep=1"></el-step>
              <el-step title="step3" description="菜单" @click.native="FormStep=2"></el-step>
              <el-step title="step4" description="场地" @click.native="FormStep=3"></el-step>
              <el-step title="step5" description="婚礼布置" @click.native="FormStep=4"></el-step>
              <el-step title="step6" description="鲜花装饰" @click.native="FormStep=5"></el-step>
              <el-step title="step7" description="服务团队" @click.native="FormStep=6"></el-step>
              <el-step title="step8" description="仪式" @click.native="FormStep=7"></el-step>
              <el-step title="step9" description="灯光设备" @click.native="FormStep=8"></el-step>
              <el-step title="step10" description="个性制作" @click.native="FormStep=9"></el-step>
              <el-step title="step11" description="附加信息" @click.native="FormStep=10"></el-step>

            </el-steps>
          <el-form ref="form" :model="value" label-width="80px">
            <el-form-item label="套餐轮播" v-show="FormStep === 0">
              <el-upload action multiple :http-request="handleFormImgFile1" list-type="picture" :show-file-list="false" class="uploadImg">
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
            <el-form-item label="名称" v-show="FormStep === 0">
              <el-input :value="value.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入套餐名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" v-show="FormStep === 0">
              <el-input :value="value.desc" maxlength="40" @input="onEditFormDescInput" placeholder="请输入套餐描述"></el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 0">
              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="每桌价格" v-show="FormStep === 1">
              <el-input-number
                :value="value.banquet.pricePerDesk"
                :precision="2"
                :step="0.1"
                :max="10000"
                @input="onEditFormPricePerDeskInput"
              ></el-input-number>
              <label class="tip2">元/桌</label>
            </el-form-item>
            <el-form-item label="每桌人数" v-show="FormStep === 1">
              <el-input-number
                :value="value.banquet.peopleNumPerDesk"
                :precision="0"
                :max="100"
                @input="onEditFormPeopleNumPerDeskInput"
              ></el-input-number>
              <label class="tip2">人</label>
            </el-form-item>
            <el-form-item label="桌数" v-show="FormStep === 1">
              <el-input-number :value="value.banquet.deskNum" :precision="0" :max="100" @input="onEditFormDeskNumInput"></el-input-number>
              <label class="tip2">桌</label>
            </el-form-item>
            <el-form-item label="酒水" v-show="FormStep === 1">
              <el-input type="textarea" :rows="4" :value="value.banquet.drink" maxlength="120" @input="onEditFormDrinkInput"> </el-input>
            </el-form-item>
            <el-form-item label="下午茶" v-show="FormStep === 1">
              <el-input type="textarea" :rows="4" :value="value.banquet.afternoonTea" maxlength="120" @input="onEditFormAfternoonTeaInput">
              </el-input>
            </el-form-item>
            <el-form-item label="补充说明" v-show="FormStep === 1">
              <el-input type="textarea" :rows="4" :value="value.banquet.extraTip" maxlength="120" @input="onEditFormExtraTipInput">
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 1">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="菜单封面" v-show="FormStep === 2">
              <el-upload
                drag
                action
                multiple
                :http-request="handleFormImgFile2"
                list-type="picture"
                :show-file-list="false"
                class="uploadImg"
              >
                <img v-if="value.coverPath" :src="value.coverPath" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="菜单" v-show="FormStep === 2">
              <el-input type="textarea" :rows="12" :value="value.dishList" maxlength="300" @input="onEditFormDishListInput"> </el-input>
              <label class="tip3">每道菜用分号(;)隔开</label>
            </el-form-item>
            <el-form-item v-show="FormStep === 2">
              <el-button type="primary" @click="previousForm">上一步</el-button>
              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="场地" v-show="FormStep === 3">
              <el-input type="textarea" :rows="12" :value="value.field" maxlength="120" @input="onEditFormFieldInput"> </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 3">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="迎宾区" v-show="FormStep === 4">
              <el-input
                type="textarea"
                :rows="4"
                :value="value.weddingArragement.welcomeGuestsArea"
                maxlength="120"
                @input="onEditFormWelcomeGuestsAreaInput"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="仪式区" v-show="FormStep === 4">
              <el-input
                type="textarea"
                :rows="4"
                :value="value.weddingArragement.ceremonyArea"
                maxlength="120"
                @input="onEditFormCeremonyAreaInput"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="婚宴区" v-show="FormStep === 4">
              <el-input
                type="textarea"
                :rows="4"
                :value="value.weddingArragement.banqueArea"
                maxlength="120"
                @input="onEditFormBanqueAreaInput"
              >
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 4">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="新郎" v-show="FormStep === 5">
              <el-input type="textarea" :rows="4" :value="value.flowerDecoration.husband" maxlength="120" @input="onEditFormHusbandInput">
              </el-input>
            </el-form-item>
            <el-form-item label="新娘" v-show="FormStep === 5">
              <el-input type="textarea" :rows="4" :value="value.flowerDecoration.wife" maxlength="120" @input="onEditFormWifeInput">
              </el-input>
            </el-form-item>
            <el-form-item label="贵宾" v-show="FormStep === 5">
              <el-input type="textarea" :rows="4" :value="value.flowerDecoration.guests" maxlength="120" @input="onEditFormGuestsInput">
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 5">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="司仪名称" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.emcee.name" maxlength="40" @input="onEditFormEmceeNameInput"></el-input>
            </el-form-item>
            <el-form-item label="司仪描述" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.emcee.desc" maxlength="40" @input="onEditFormEmceeDescInput"></el-input>
            </el-form-item>
            <el-form-item label="化妆名称" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.makeUp.name" maxlength="40" @input="onEditFormMakeUpNameInput"></el-input>
            </el-form-item>
            <el-form-item label="化妆描述" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.makeUp.desc" maxlength="40" @input="onEditFormMakeUpDescInput"></el-input>
            </el-form-item>
            <el-form-item label="摄影名称" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.sy.name" maxlength="40" @input="onEditFormSyNameInput"></el-input>
            </el-form-item>
            <el-form-item label="摄影描述" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.sy.desc" maxlength="40" @input="onEditFormSyDescInput"></el-input>
            </el-form-item>
            <el-form-item label="摄像名称" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.sx.name" maxlength="40" @input="onEditFormSxNameInput"></el-input>
            </el-form-item>
            <el-form-item label="摄像描述" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.sx.desc" maxlength="40" @input="onEditFormSxDescInput"></el-input>
            </el-form-item>
            <el-form-item label="其他人员名称" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.other.name" maxlength="40" @input="onEditFormOtherNameInput"></el-input>
            </el-form-item>
            <el-form-item label="其他人员描述" v-show="FormStep === 6">
              <el-input :value="value.serviceTeam.other.desc" maxlength="40" @input="onEditFormOtherDescInput"></el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 6">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="仪式" v-show="FormStep === 7">
              <el-input type="textarea" :rows="4" :value="value.ceremony" maxlength="120" @input="onEditFormCeremonyInput"> </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 7">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="灯光设备" v-show="FormStep === 8">
              <el-input type="textarea" :rows="4" :value="value.lightEquipment" maxlength="120" @input="onEditFormLightEquipmentInput">
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 8">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="个性制作" v-show="FormStep === 9">
              <el-input
                type="textarea"
                :rows="4"
                :value="value.personalityProduction"
                maxlength="120"
                @input="onEditFormPersonalityProductionInput"
              >
              </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 9">
              <el-button type="primary" @click="previousForm">上一步</el-button>

              <el-button type="primary" @click="nextForm">下一步</el-button>
            </el-form-item>

            <el-form-item label="附加信息" v-show="FormStep === 10">
              <el-input type="textarea" :rows="4" :value="value.extraInfo" maxlength="120" @input="onEditFormExtraInfoInput"> </el-input>
            </el-form-item>
            <el-form-item v-show="FormStep === 10">
              <el-button type="primary" @click="previousForm">上一步</el-button>
              <el-button type="primary" @click="submitForm">确认{{formType}}</el-button>
              <el-button @click="resetForm">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSetMealList, addSetMeal, editSetMeal, deleteSetMeal } from '@/api/hotelReserve/index';
import { uploadImg } from '../index';

export default {
  name: 'GroupEditor',
  props: {
    value: Object,
    id: [Number, String],
    groupList: Array,
  },
  data() {
    return {
      previewStatus: 0, // 0: 展示列表 1：展示详情
      FormStep: 0,
      dialogVisible: false,
      // setMealList: [],
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
    this.getSetMealList();
  },
  methods: {
    getSetMealList() {
      if (!this.id) {
        return;
      }
      getSetMealList(this.id)
        .then((res) => {
          if (res.data.list.length > 0) {
            // this.setMealList = res.data.list.map((item) => ({
            //   setMealId: item.wedding_package_id,
            //   content: JSON.parse(item.json_data),
            // }));
            this.$emit('update', {
              groupList: res.data.list.map((item) => ({
                setMealId: item.wedding_package_id,
                content: JSON.parse(item.json_data),
              })),
            });
          } else {
            this.$emit('update', {
              groupList: [],
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    sure() {},
    nextStep() {},
    showEdit() {
      this.dialogVisible = true;
      this.$emit('input', {
        id: null,
        carouselList: [],
        name: '',
        desc: '',
        banquet: {
          pricePerDesk: '', // 每桌价格 单位元
          peopleNumPerDesk: '', // 每桌人数 单位人
          deskNum: '', // 桌数
          drink: '', // 酒水
          afternoonTea: '', // 下午茶
          extraTip: '', // 补充说明
        },
        coverPath: '',
        dishList: [],
        field: '',
        weddingArragement: {
          welcomeGuestsArea: '',
          ceremonyArea: '',
          banqueArea: '',
        },
        flowerDecoration: {
          husband: '',
          wife: '',
          guests: '',
        },
        serviceTeam: {
          emcee: {
            name: '',
            desc: '',
          },
          makeUp: {
            name: '',
            desc: '',
          },
          sy: {
            name: '',
            desc: '',
          },
          sx: {
            name: '',
            desc: '',
          },
          other: {
            name: '',
            desc: '',
          },
        },
        ceremony: '',
        lightEquipment: '',
        personalityProduction: '',
        extraInfo: '',
      });
      this.$emit('update', {
        previewStatus: 1,
      });
    },
    handleClose() {
      // this.dialogVisible = false;
      this.resetForm();
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
        carouselList: [],
        name: '',
        desc: '',
        banquet: {
          pricePerDesk: '', // 每桌价格 单位元
          peopleNumPerDesk: '', // 每桌人数 单位人
          deskNum: '', // 桌数
          drink: '', // 酒水
          afternoonTea: '', // 下午茶
          extraTip: '', // 补充说明
        },
        coverPath: '',
        dishList: [],
        field: '',
        weddingArragement: {
          welcomeGuestsArea: '',
          ceremonyArea: '',
          banqueArea: '',
        },
        flowerDecoration: {
          husband: '',
          wife: '',
          guests: '',
        },
        serviceTeam: {
          emcee: {
            name: '',
            desc: '',
          },
          makeUp: {
            name: '',
            desc: '',
          },
          sy: {
            name: '',
            desc: '',
          },
          sx: {
            name: '',
            desc: '',
          },
          other: {
            name: '',
            desc: '',
          },
        },
        ceremony: '',
        lightEquipment: '',
        personalityProduction: '',
        extraInfo: '',
      });
    },
    removeCurrentCarousel(imgPath) {
      this.$emit('input', {
        ...this.value,
        carouselList: this.value.carouselList.filter((item) => item !== imgPath),
      });
    },
    openEditSetMealForm(setMealId) {
      console.log('打开编辑页面');
      this.currentSetMealId = setMealId;
      const currentSetMeal = this.groupList.find((item) => item.setMealId === this.currentSetMealId);
      console.log(currentSetMeal);
      const {
        carouselList,
        name,
        desc,
        banquet,
        coverPath,
        dishList,
        field,
        weddingArragement,
        flowerDecoration,
        ceremony,
        lightEquipment,
        personalityProduction,
        extraInfo,
        serviceTeam,
      } = currentSetMeal.content;
      const { pricePerDesk, peopleNumPerDesk, deskNum, drink, afternoonTea, extraTip } = banquet;
      const { welcomeGuestsArea, ceremonyArea, banqueArea } = weddingArragement;
      const { husband, wife, guests } = flowerDecoration;
      const { emcee, makeUp, sy, sx, other } = serviceTeam;
      this.$emit('input', {
        id: setMealId,
        carouselList,
        name,
        desc,
        coverPath,
        dishList: dishList.join(';'),
        field,
        banquet: {
          pricePerDesk, // 每桌价格 单位元
          peopleNumPerDesk, // 每桌人数 单位人
          deskNum, // 桌数
          drink, // 酒水
          afternoonTea, // 下午茶
          extraTip, // 补充说明
        },
        weddingArragement: {
          welcomeGuestsArea,
          ceremonyArea,
          banqueArea,
        },
        flowerDecoration: {
          husband,
          wife,
          guests,
        },
        serviceTeam: {
          emcee: {
            name: emcee.name,
            desc: emcee.desc,
          },
          makeUp: {
            name: makeUp.name,
            desc: makeUp.desc,
          },
          sy: {
            name: sy.name,
            desc: sy.desc,
          },
          sx: {
            name: sx.name,
            desc: sx.desc,
          },
          other: {
            name: other.name,
            desc: other.desc,
          },
        },
        ceremony,
        lightEquipment,
        personalityProduction,
        extraInfo,
      });

      this.previewStatus = 1;
      this.$emit('update', {
        previewStatus: 1,
      });
      this.dialogVisible = true;
    },
    submitForm() {
      if (this.value.carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张套餐轮播图!',
        });
        return;
      }
      if (!this.value.name) {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空!',
        });
        return;
      }
      if (!this.value.desc) {
        this.$message({
          type: 'warning',
          message: '套餐描述不能为空!',
        });
        return;
      }
      if (!this.value.banquet.pricePerDesk && this.value.banquet.pricePerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌价格!',
        });
        return;
      }
      if (!this.value.banquet.peopleNumPerDesk && this.value.banquet.peopleNumPerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌人数!',
        });
        return;
      }
      if (!this.value.banquet.deskNum && this.value.banquet.deskNum !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴桌数!',
        });
        return;
      }
      if (!this.value.banquet.drink) {
        this.$message({
          type: 'warning',
          message: '喜宴酒水不能为空!',
        });
        return;
      }
      if (!this.value.banquet.afternoonTea) {
        this.$message({
          type: 'warning',
          message: '喜宴下午茶不能为空!',
        });
        return;
      }
      if (!this.value.banquet.extraTip) {
        this.$message({
          type: 'warning',
          message: '喜宴补充说明不能为空!',
        });
        return;
      }
      if (!this.value.coverPath) {
        this.$message({
          type: 'warning',
          message: '菜单封面不能为空!',
        });
        return;
      }
      if (!this.value.dishList) {
        this.$message({
          type: 'warning',
          message: '菜单列表不能为空!',
        });
        return;
      }
      if (!this.value.field) {
        this.$message({
          type: 'warning',
          message: '场地不能为空!',
        });
        return;
      }
      if (!this.value.weddingArragement.welcomeGuestsArea) {
        this.$message({
          type: 'warning',
          message: '迎宾区不能为空!',
        });
        return;
      }
      if (!this.value.weddingArragement.ceremonyArea) {
        this.$message({
          type: 'warning',
          message: '仪式区不能为空!',
        });
        return;
      }
      if (!this.value.weddingArragement.banqueArea) {
        this.$message({
          type: 'warning',
          message: '婚宴区不能为空!',
        });
        return;
      }
      if (!this.value.flowerDecoration.husband) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新郎不能为空!',
        });
        return;
      }
      if (!this.value.flowerDecoration.wife) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新娘不能为空!',
        });
        return;
      }
      if (!this.value.flowerDecoration.guests) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰贵宾不能为空!',
        });
        return;
      }

      if (!this.value.serviceTeam.emcee.name) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪名称不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.emcee.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪描述不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.makeUp.name) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆名称不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.makeUp.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆描述不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.sy.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影名称不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.sy.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影描述不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.sx.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像名称不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.sx.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像描述不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.other.name) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员名称不能为空!',
        });
        return;
      }
      if (!this.value.serviceTeam.other.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员描述不能为空!',
        });
        return;
      }
      if (!this.value.ceremony) {
        this.$message({
          type: 'warning',
          message: '仪式不能为空!',
        });
        return;
      }
      if (!this.value.lightEquipment) {
        this.$message({
          type: 'warning',
          message: '灯光设备不能为空!',
        });
        return;
      }
      if (!this.value.personalityProduction) {
        this.$message({
          type: 'warning',
          message: '个性制作不能为空!',
        });
        return;
      }
      if (!this.value.extraInfo) {
        this.$message({
          type: 'warning',
          message: '附加信息不能为空!',
        });
        return;
      }
      const tempForm = {
        ...this.value,
        dishList: this.value.dishList.indexOf(';') > -1 ? this.value.dishList.split(';') : this.value.dishList.split('；'),
      };
      console.log(tempForm);
      if (tempForm.id) {
        editSetMeal(tempForm.id, JSON.stringify(tempForm))
          .then((res) => {
            console.log(res);
            this.resetForm();
            this.getSetMealList();
            this.$message.success('编辑成功!');
          })
          .catch((err) => {
            console.log(err);
            this.$message.error('编辑失败!');
          });
        return;
      }

      addSetMeal(this.id, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.resetForm();
          this.getSetMealList();
          this.$message.success('创建成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
        });
    },
    handleFormImgFile1(e) {
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
    nextForm() {
      if (this.FormStep === 10) {
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
    deleteCurrentSetMeal(setMealId) {
      this.$confirm('确认删除当前套餐?')
        .then(() => {
          console.log(`删除${setMealId}`);
          deleteSetMeal(setMealId)
            .then((res) => {
              console.log(res);
              this.getSetMealList();
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
    onEditFormDishListInput(val) {
      this.$emit('input', {
        ...this.value,
        dishList: val,
      });
    },
    onEditFormFieldInput(val) {
      this.$emit('input', {
        ...this.value,
        field: val,
      });
    },
    onEditFormCeremonyInput(val) {
      this.$emit('input', {
        ...this.value,
        ceremony: val,
      });
    },
    onEditFormLightEquipmentInput(val) {
      this.$emit('input', {
        ...this.value,
        lightEquipment: val,
      });
    },
    onEditFormExtraInfoInput(val) {
      this.$emit('input', {
        ...this.value,
        extraInfo: val,
      });
    },
    onEditFormPricePerDeskInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          pricePerDesk: val,
        },
      });
    },
    onEditFormPeopleNumPerDeskInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          peopleNumPerDesk: val,
        },
      });
    },
    onEditFormDeskNumInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          deskNum: val,
        },
      });
    },
    onEditFormDrinkInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          drink: val,
        },
      });
    },
    onEditFormAfternoonTeaInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          afternoonTea: val,
        },
      });
    },
    onEditFormExtraTipInput(val) {
      this.$emit('input', {
        ...this.value,
        banquet: {
          ...this.value.banquet,
          extraTip: val,
        },
      });
    },

    onEditFormPersonalityProductionInput(val) {
      this.$emit('input', {
        ...this.value,
        personalityProduction: val,
      });
    },

    onEditFormWelcomeGuestsAreaInput(val) {
      this.$emit('input', {
        ...this.value,
        weddingArragement: {
          ...this.value.weddingArragement,
          welcomeGuestsArea: val,
        },
      });
    },
    onEditFormCeremonyAreaInput(val) {
      this.$emit('input', {
        ...this.value,
        weddingArragement: {
          ...this.value.weddingArragement,
          ceremonyArea: val,
        },
      });
    },
    onEditFormBanqueAreaInput(val) {
      this.$emit('input', {
        ...this.value,
        weddingArragement: {
          ...this.value.weddingArragement,
          banqueArea: val,
        },
      });
    },
    onEditFormHusbandInput(val) {
      this.$emit('input', {
        ...this.value,
        flowerDecoration: {
          ...this.value.flowerDecoration,
          husband: val,
        },
      });
    },
    onEditFormWifeInput(val) {
      this.$emit('input', {
        ...this.value,
        flowerDecoration: {
          ...this.value.flowerDecoration,
          wife: val,
        },
      });
    },
    onEditFormGuestsInput(val) {
      this.$emit('input', {
        ...this.value,
        flowerDecoration: {
          ...this.value.flowerDecoration,
          guests: val,
        },
      });
    },
    onEditFormEmceeNameInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          emcee: {
            ...this.value.serviceTeam.emcee,
            name: val,
          },
        },
      });
      // this.previewData.serviceTeam.emcee.name = val;
    },
    onEditFormEmceeDescInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          emcee: {
            ...this.value.serviceTeam.emcee,
            desc: val,
          },
        },
      });
    },
    onEditFormMakeUpNameInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          makeUp: {
            ...this.value.serviceTeam.makeUp,
            name: val,
          },
        },
      });
    },
    onEditFormMakeUpDescInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          makeUp: {
            ...this.value.serviceTeam.makeUp,
            desc: val,
          },
        },
      });
      // this.previewData.serviceTeam.makeUp.desc = val;
    },
    onEditFormSyNameInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          sy: {
            ...this.value.serviceTeam.sy,
            name: val,
          },
        },
      });
    },
    onEditFormSyDescInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          sy: {
            ...this.value.serviceTeam.sy,
            desc: val,
          },
        },
      });
    },
    onEditFormSxNameInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          sx: {
            ...this.value.serviceTeam.sx,
            name: val,
          },
        },
      });
    },
    onEditFormSxDescInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          sx: {
            ...this.value.serviceTeam.sx,
            desc: val,
          },
        },
      });
    },
    onEditFormOtherNameInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          other: {
            ...this.value.serviceTeam.other,
            name: val,
          },
        },
      });
    },
    onEditFormOtherDescInput(val) {
      this.$emit('input', {
        ...this.value,
        serviceTeam: {
          ...this.value.serviceTeam,
          other: {
            ...this.value.serviceTeam.other,
            desc: val,
          },
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
.setMealList {
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
