<template>
  <sub-page>
    <main-card class="myMainCard">
      <card-top-info title="套餐"></card-top-info>
      <div class="previewArea">
        <section class="block1" v-if="hasNoHotel">
          暂无酒店
          <el-button type="primary" class="openCreateFormBtn">前往创建</el-button>
        </section>
        <section class="block2" v-if="!hasNoHotel && previewStatus === 0">
          <div class="currentNav">精选套餐 ({{ setMealList.length }})</div>
          <div class="cardList">
            <div class="card" v-for="(item, index) in setMealList" :key="index">
              <div
                class="poster"
                :style="{ backgroundImage: 'url(' + item.content.carouselList[0] + ')' }"
                @click="openEditSetMealForm(item.setMealId)"
              ></div>
              <div class="ct">
                <div class="name" @click="openEditSetMealForm(item.setMealId)">{{ item.content.name }}</div>
                <div class="price" @click="openEditSetMealForm(item.setMealId)">
                  ¥<label>{{ item.content.banquet.pricePerDesk }}</label
                  >/桌
                </div>
                <div class="contains" v-show="item.content.dishList && item.content.dishList.length > 0">含一份菜单</div>
              </div>
              <img src="@/assets/image/delete_icon.png" class="deleteIcon" />
            </div>
          </div>
        </section>
        <section class="block3" v-if="!hasNoHotel && previewStatus === 0">
          <el-button type="primary" @click="openAddSetMealForm" class="openAddSetMealFormBtn">新增套餐</el-button>
        </section>
        <section class="block4" v-if="!hasNoHotel && previewStatus === 1">
          <div class="section1">
            <el-carousel height="150px" class="hotelCarousel">
              <el-carousel-item v-for="(item, index) in previewData.carouselList" :key="index">
                <div class="cImgBox">
                  <img :src="item" class="cImg" />
                  <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCarousel(item)" />
                </div>
              </el-carousel-item>
            </el-carousel>
            <div class="name">{{ previewData.name }}</div>
            <div class="desc">{{ previewData.desc }}</div>
          </div>
          <div class="section2">
            <div class="tit">-喜宴-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">每桌单价：</div>
                <div class="val">{{ previewData.banquet.pricePerDesk }}元</div>
              </div>
              <div class="infoItem">
                <div class="label">每桌人数：</div>
                <div class="val">{{ previewData.banquet.peopleNumPerDesk }}人</div>
              </div>
              <div class="infoItem">
                <div class="label">桌数：</div>
                <div class="val v1">{{ previewData.banquet.deskNum }}桌</div>
              </div>
              <div class="infoItem">
                <div class="label">酒水：</div>
                <div class="val v1">{{ previewData.banquet.drink }}</div>
              </div>
              <div class="infoItem">
                <div class="label">下午茶：</div>
                <div class="val v2">{{ previewData.banquet.afternoonTea }}</div>
              </div>
              <div class="infoItem">
                <div class="label">附加：</div>
                <div class="val v1">{{ previewData.banquet.extraTip }}</div>
              </div>
            </div>
            <div class="menuBox">
              <div class="posterImgItem">
                <img :src="previewData.coverPath" class="posterImg" v-show="previewData.coverPath" />
                <img src="@/assets/image/delete_icon.png" class="deleteIcon" @click="removeCurrentCover" />
              </div>
              <div class="menuItem" v-for="(item, index) in previewData.dishList" :key="index">{{ item }}</div>
            </div>
          </div>
          <div class="section3">
            <div class="tit">-场地-</div>
            <div class="infoList">
              <div class="infoItem">{{ previewData.field }}</div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-婚礼布置-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">迎宾区</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.weddingArragement.welcomeGuestsArea }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">仪式区</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.weddingArragement.ceremonyArea }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">婚宴区</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.weddingArragement.banqueArea }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-鲜花装饰-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">新郎</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.flowerDecoration.husband }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">新娘</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.flowerDecoration.wife }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">贵宾</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.flowerDecoration.guests }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-服务团队-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">司仪</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.serviceTeam.emcee.name }}</div>
                  <div class="ctItem">{{ previewData.serviceTeam.emcee.desc }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">化妆</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.serviceTeam.makeUp.name }}</div>
                  <div class="ctItem">{{ previewData.serviceTeam.makeUp.desc }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">摄影</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.serviceTeam.sy.name }}</div>
                  <div class="ctItem">{{ previewData.serviceTeam.sy.desc }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">摄像</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.serviceTeam.sx.name }}</div>
                  <div class="ctItem">{{ previewData.serviceTeam.sx.desc }}</div>
                </div>
              </div>
              <div class="infoItem">
                <div class="label">其他人员</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.serviceTeam.other.name }}</div>
                  <div class="ctItem">{{ previewData.serviceTeam.other.desc }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-仪式-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">宴会仪式</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.ceremony }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-灯光设备-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">灯光设备</div>
                <div class="ct">
                  <div class="ctItem">{{ previewData.lightEquipment }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="section3">
            <div class="tit">-个性制作-</div>
            <div class="infoList">
              <div class="infoItem">
                {{ previewData.personalityProduction }}
              </div>
            </div>
          </div>
          <div class="section4">
            <div class="tit">-附加信息-</div>
            <div class="infoList">
              <div class="infoItem">
                <div class="label">附加信息</div>
                <div class="ct">
                  <div class="ctItem spec">{{ previewData.extraInfo }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- 表单——创建套餐 -->
      <div class="formArea" v-show="createFormVisible">
        <div class="formTit">创建套餐：</div>
        <el-form ref="form" :model="createForm" label-width="80px">
          <div class="formTit2" v-show="createFormStep === 0">套餐基本信息(step1)：</div>
          <el-form-item label="套餐轮播" v-show="createFormStep === 0">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile1"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="名称" v-show="createFormStep === 0">
            <el-input v-model="createForm.name" maxlength="40" @input="onCreateFormNameInput" placeholder="请输入套餐名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" v-show="createFormStep === 0">
            <el-input v-model="createForm.desc" maxlength="40" @input="onCreateFormDescInput" placeholder="请输入套餐描述"></el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 0">
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 1">喜宴(step2)：</div>
          <el-form-item label="每桌价格" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.banquet.pricePerDesk"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onCreateFormPricePerDeskInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="每桌人数" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.banquet.peopleNumPerDesk"
              :precision="0"
              :max="100"
              @input="onCreateFormPeopleNumPerDeskInput"
            ></el-input-number>
            <label class="tip2">人</label>
          </el-form-item>
          <el-form-item label="桌数" v-show="createFormStep === 1">
            <el-input-number
              v-model="createForm.banquet.deskNum"
              :precision="0"
              :max="100"
              @input="onCreateFormDeskNumInput"
            ></el-input-number>
            <label class="tip2">桌</label>
          </el-form-item>
          <el-form-item label="酒水" v-show="createFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="createForm.banquet.drink" maxlength="120" @input="onCreateFormDrinkInput">
            </el-input>
          </el-form-item>
          <el-form-item label="下午茶" v-show="createFormStep === 1">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.banquet.afternoonTea"
              maxlength="120"
              @input="onCreateFormAfternoonTeaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="补充说明" v-show="createFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="createForm.banquet.extraTip" maxlength="120" @input="onCreateFormExtraTipInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 1">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 2">菜单(step3)：</div>
          <el-form-item label="菜单封面" v-show="createFormStep === 2">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile2"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜单" v-show="createFormStep === 2">
            <el-input type="textarea" :rows="12" v-model="createForm.dishList" maxlength="300" @input="onCreateFormDishListInput">
            </el-input>
            <label class="tip3">每道菜用分号(;)隔开</label>
          </el-form-item>
          <el-form-item v-show="createFormStep === 2">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 3">场地(step4)：</div>
          <el-form-item label="场地" v-show="createFormStep === 3">
            <el-input type="textarea" :rows="12" v-model="createForm.field" maxlength="120" @input="onCreateFormFieldInput"> </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 3">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 4">婚礼布置(step5)：</div>
          <el-form-item label="迎宾区" v-show="createFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.weddingArragement.welcomeGuestsArea"
              maxlength="120"
              @input="onCreateFormWelcomeGuestsAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="仪式区" v-show="createFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.weddingArragement.ceremonyArea"
              maxlength="120"
              @input="onCreateFormCeremonyAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="婚宴区" v-show="createFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.weddingArragement.banqueArea"
              maxlength="120"
              @input="onCreateFormBanqueAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 4">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 5">鲜花装饰(step6)：</div>
          <el-form-item label="新郎" v-show="createFormStep === 5">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.flowerDecoration.husband"
              maxlength="120"
              @input="onCreateFormHusbandInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="新娘" v-show="createFormStep === 5">
            <el-input type="textarea" :rows="4" v-model="createForm.flowerDecoration.wife" maxlength="120" @input="onCreateFormWifeInput">
            </el-input>
          </el-form-item>
          <el-form-item label="贵宾" v-show="createFormStep === 5">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.flowerDecoration.guests"
              maxlength="120"
              @input="onCreateFormGuestsInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 5">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 6">服务团队(step7)：</div>
          <el-form-item label="司仪名称" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.emcee.name" maxlength="40" @input="onCreateFormEmceeNameInput"></el-input>
          </el-form-item>
          <el-form-item label="司仪描述" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.emcee.desc" maxlength="40" @input="onCreateFormEmceeDescInput"></el-input>
          </el-form-item>
          <el-form-item label="化妆名称" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.makeUp.name" maxlength="40" @input="onCreateFormMakeUpNameInput"></el-input>
          </el-form-item>
          <el-form-item label="化妆描述" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.makeUp.desc" maxlength="40" @input="onCreateFormMakeUpDescInput"></el-input>
          </el-form-item>
          <el-form-item label="摄影名称" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.sy.name" maxlength="40" @input="onCreateFormSyNameInput"></el-input>
          </el-form-item>
          <el-form-item label="摄影描述" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.sy.desc" maxlength="40" @input="onCreateFormSyDescInput"></el-input>
          </el-form-item>
          <el-form-item label="摄像名称" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.sx.name" maxlength="40" @input="onCreateFormSxNameInput"></el-input>
          </el-form-item>
          <el-form-item label="摄像描述" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.sx.desc" maxlength="40" @input="onCreateFormSxDescInput"></el-input>
          </el-form-item>
          <el-form-item label="其他人员名称" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.other.name" maxlength="40" @input="onCreateFormOtherNameInput"></el-input>
          </el-form-item>
          <el-form-item label="其他人员描述" v-show="createFormStep === 6">
            <el-input v-model="createForm.serviceTeam.other.desc" maxlength="40" @input="onCreateFormOtherDescInput"></el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 6">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="createFormStep === 7">仪式(step8)：</div>
          <el-form-item label="仪式" v-show="createFormStep === 7">
            <el-input type="textarea" :rows="4" v-model="createForm.ceremony" maxlength="120" @input="onCreateFormCeremonyInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 7">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="createFormStep === 8">灯光设备(step9)：</div>
          <el-form-item label="灯光设备" v-show="createFormStep === 8">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.lightEquipment"
              maxlength="120"
              @input="onCreateFormLightEquipmentInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 8">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="createFormStep === 9">个性制作(step10)：</div>
          <el-form-item label="个性制作" v-show="createFormStep === 9">
            <el-input
              type="textarea"
              :rows="4"
              v-model="createForm.personalityProduction"
              maxlength="120"
              @input="onCreateFormPersonalityProductionInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 9">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextCreateForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="createFormStep === 10">附加信息(step11)：</div>
          <el-form-item label="附加信息" v-show="createFormStep === 10">
            <el-input type="textarea" :rows="4" v-model="createForm.extraInfo" maxlength="120" @input="onCreateFormExtraInfoInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="createFormStep === 10">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>
            <el-button type="primary" @click="submitCreateForm">立即创建</el-button>
            <el-button @click="cancelCreateForm">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表单——编辑套餐 -->
      <div class="formArea" v-show="editFormVisible">
        <div class="formTit">编辑套餐：</div>
        <el-form ref="form" :model="editForm" label-width="80px">
          <div class="formTit2" v-show="editFormStep === 0">套餐基本信息(step1)：</div>
          <el-form-item label="套餐轮播" v-show="editFormStep === 0">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile1"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="名称" v-show="editFormStep === 0">
            <el-input v-model="editForm.name" maxlength="40" @input="onEditFormNameInput" placeholder="请输入套餐名称"></el-input>
          </el-form-item>
          <el-form-item label="描述" v-show="editFormStep === 0">
            <el-input v-model="editForm.desc" maxlength="40" @input="onEditFormDescInput" placeholder="请输入套餐描述"></el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 0">
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 1">喜宴(step2)：</div>
          <el-form-item label="每桌价格" v-show="editFormStep === 1">
            <el-input-number
              v-model="editForm.banquet.pricePerDesk"
              :precision="2"
              :step="0.1"
              :max="10000"
              @input="onEditFormPricePerDeskInput"
            ></el-input-number>
            <label class="tip2">元/桌</label>
          </el-form-item>
          <el-form-item label="每桌人数" v-show="editFormStep === 1">
            <el-input-number
              v-model="editForm.banquet.peopleNumPerDesk"
              :precision="0"
              :max="100"
              @input="onEditFormPeopleNumPerDeskInput"
            ></el-input-number>
            <label class="tip2">人</label>
          </el-form-item>
          <el-form-item label="桌数" v-show="editFormStep === 1">
            <el-input-number v-model="editForm.banquet.deskNum" :precision="0" :max="100" @input="onEditFormDeskNumInput"></el-input-number>
            <label class="tip2">桌</label>
          </el-form-item>
          <el-form-item label="酒水" v-show="editFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="editForm.banquet.drink" maxlength="120" @input="onEditFormDrinkInput"> </el-input>
          </el-form-item>
          <el-form-item label="下午茶" v-show="editFormStep === 1">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.banquet.afternoonTea"
              maxlength="120"
              @input="onEditFormAfternoonTeaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="补充说明" v-show="editFormStep === 1">
            <el-input type="textarea" :rows="4" v-model="editForm.banquet.extraTip" maxlength="120" @input="onEditFormExtraTipInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 1">
            <el-button type="primary" @click="previousCreateForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 2">菜单(step3)：</div>
          <el-form-item label="菜单封面" v-show="editFormStep === 2">
            <el-upload
              drag
              action
              multiple
              :http-request="handleFormImgFile2"
              list-type="picture"
              :show-file-list="false"
              class="uploadImg"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过20M</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜单" v-show="editFormStep === 2">
            <el-input type="textarea" :rows="12" v-model="editForm.dishList" maxlength="300" @input="onEditFormDishListInput"> </el-input>
            <label class="tip3">每道菜用分号(;)隔开</label>
          </el-form-item>
          <el-form-item v-show="editFormStep === 2">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 3">场地(step4)：</div>
          <el-form-item label="场地" v-show="editFormStep === 3">
            <el-input type="textarea" :rows="12" v-model="editForm.field" maxlength="120" @input="onEditFormFieldInput"> </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 3">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 4">婚礼布置(step5)：</div>
          <el-form-item label="迎宾区" v-show="editFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.weddingArragement.welcomeGuestsArea"
              maxlength="120"
              @input="onEditFormWelcomeGuestsAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="仪式区" v-show="editFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.weddingArragement.ceremonyArea"
              maxlength="120"
              @input="onEditFormCeremonyAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="婚宴区" v-show="editFormStep === 4">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.weddingArragement.banqueArea"
              maxlength="120"
              @input="onEditFormBanqueAreaInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 4">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 5">鲜花装饰(step6)：</div>
          <el-form-item label="新郎" v-show="editFormStep === 5">
            <el-input type="textarea" :rows="4" v-model="editForm.flowerDecoration.husband" maxlength="120" @input="onEditFormHusbandInput">
            </el-input>
          </el-form-item>
          <el-form-item label="新娘" v-show="editFormStep === 5">
            <el-input type="textarea" :rows="4" v-model="editForm.flowerDecoration.wife" maxlength="120" @input="onEditFormWifeInput">
            </el-input>
          </el-form-item>
          <el-form-item label="贵宾" v-show="editFormStep === 5">
            <el-input type="textarea" :rows="4" v-model="editForm.flowerDecoration.guests" maxlength="120" @input="onEditFormGuestsInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 5">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 6">服务团队(step7)：</div>
          <el-form-item label="司仪名称" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.emcee.name" maxlength="40" @input="onEditFormEmceeNameInput"></el-input>
          </el-form-item>
          <el-form-item label="司仪描述" v-show="createFormStep === 6">
            <el-input v-model="editForm.serviceTeam.emcee.desc" maxlength="40" @input="onEditFormEmceeDescInput"></el-input>
          </el-form-item>
          <el-form-item label="化妆名称" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.makeUp.name" maxlength="40" @input="onEditFormMakeUpNameInput"></el-input>
          </el-form-item>
          <el-form-item label="化妆描述" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.makeUp.desc" maxlength="40" @input="onEditFormMakeUpDescInput"></el-input>
          </el-form-item>
          <el-form-item label="摄影名称" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.sy.name" maxlength="40" @input="onEditFormSyNameInput"></el-input>
          </el-form-item>
          <el-form-item label="摄影描述" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.sy.desc" maxlength="40" @input="onEditFormSyDescInput"></el-input>
          </el-form-item>
          <el-form-item label="摄像名称" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.sx.name" maxlength="40" @input="onEditFormSxNameInput"></el-input>
          </el-form-item>
          <el-form-item label="摄像描述" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.sx.desc" maxlength="40" @input="onEditFormSxDescInput"></el-input>
          </el-form-item>
          <el-form-item label="其他人员名称" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.other.name" maxlength="40" @input="onEditFormOtherNameInput"></el-input>
          </el-form-item>
          <el-form-item label="其他人员描述" v-show="editFormStep === 6">
            <el-input v-model="editForm.serviceTeam.other.desc" maxlength="40" @input="onEditFormOtherDescInput"></el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 6">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>
          <div class="formTit2" v-show="editFormStep === 7">仪式(step8)：</div>
          <el-form-item label="仪式" v-show="editFormStep === 7">
            <el-input type="textarea" :rows="4" v-model="editForm.ceremony" maxlength="120" @input="onEditFormCeremonyInput"> </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 7">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="editFormStep === 8">灯光设备(step9)：</div>
          <el-form-item label="灯光设备" v-show="editFormStep === 8">
            <el-input type="textarea" :rows="4" v-model="editForm.lightEquipment" maxlength="120" @input="onEditFormLightEquipmentInput">
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 8">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="editFormStep === 9">个性制作(step10)：</div>
          <el-form-item label="个性制作" v-show="editFormStep === 9">
            <el-input
              type="textarea"
              :rows="4"
              v-model="editForm.personalityProduction"
              maxlength="120"
              @input="onEditFormPersonalityProductionInput"
            >
            </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 9">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>

            <el-button type="primary" @click="nextEditForm">下一步</el-button>
          </el-form-item>

          <div class="formTit2" v-show="editFormStep === 10">附加信息(step11)：</div>
          <el-form-item label="附加信息" v-show="editFormStep === 10">
            <el-input type="textarea" :rows="4" v-model="editForm.extraInfo" maxlength="120" @input="onEditFormExtraInfoInput"> </el-input>
          </el-form-item>
          <el-form-item v-show="editFormStep === 10">
            <el-button type="primary" @click="previousEditForm">上一步</el-button>
            <el-button type="primary" @click="submitEditForm">确认编辑</el-button>
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
import { getSetMealList, addSetMeal, editSetMeal, deleteSetMeal } from '@/api/hotelReserve/index';

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
      currentSetMealId: '',
      createFormStep: 0,
      editFormStep: 0,
      createFormVisible: false,
      editFormVisible: false,
      previewData: {
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
      },
      createForm: {
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
        dishList: '',
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
      },
      editForm: {
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
        dishList: '',
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
      },
      // 套餐相关内容
      setMealList: [],
    };
  },
  created() {
    if ('7' || this.$store.state.login.hotelId) {
      this.hasNoHotel = false;
      this.getSetMealList();
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
    openAddSetMealForm() {
      this.createFormVisible = true;
      this.previewStatus = 1;
    },
    openEditSetMealForm(setMealId) {
      console.log('打开编辑页面');
      this.currentSetMealId = setMealId;
      const currentSetMeal = this.setMealList.find((item) => item.setMealId === this.currentSetMealId);
      console.log(currentSetMeal);
      this.previewData.carouselList = currentSetMeal.content.carouselList;
      this.previewData.name = currentSetMeal.content.name;
      this.previewData.desc = currentSetMeal.content.desc;
      this.previewData.banquet.pricePerDesk = currentSetMeal.content.banquet.pricePerDesk;
      this.previewData.banquet.peopleNumPerDesk = currentSetMeal.content.banquet.peopleNumPerDesk;
      this.previewData.banquet.deskNum = currentSetMeal.content.banquet.deskNum;
      this.previewData.banquet.drink = currentSetMeal.content.banquet.drink;
      this.previewData.banquet.afternoonTea = currentSetMeal.content.banquet.afternoonTea;
      this.previewData.banquet.extraTip = currentSetMeal.content.banquet.extraTip;
      this.previewData.coverPath = currentSetMeal.content.coverPath;
      this.previewData.dishList = currentSetMeal.content.dishList;
      this.previewData.field = currentSetMeal.content.field;
      this.previewData.weddingArragement.welcomeGuestsArea = currentSetMeal.content.weddingArragement.welcomeGuestsArea;
      this.previewData.weddingArragement.ceremonyArea = currentSetMeal.content.weddingArragement.ceremonyArea;
      this.previewData.weddingArragement.banqueArea = currentSetMeal.content.weddingArragement.banqueArea;
      this.previewData.flowerDecoration.husband = currentSetMeal.content.flowerDecoration.husband;
      this.previewData.flowerDecoration.wife = currentSetMeal.content.flowerDecoration.wife;
      this.previewData.flowerDecoration.guests = currentSetMeal.content.flowerDecoration.guests;
      this.previewData.serviceTeam.emcee.name = currentSetMeal.content.serviceTeam.emcee.name;
      this.previewData.serviceTeam.emcee.desc = currentSetMeal.content.serviceTeam.emcee.desc;
      this.previewData.serviceTeam.makeUp.name = currentSetMeal.content.serviceTeam.makeUp.name;
      this.previewData.serviceTeam.makeUp.desc = currentSetMeal.content.serviceTeam.makeUp.desc;
      this.previewData.serviceTeam.sy.name = currentSetMeal.content.serviceTeam.sy.name;
      this.previewData.serviceTeam.sy.desc = currentSetMeal.content.serviceTeam.sy.desc;
      this.previewData.serviceTeam.sx.name = currentSetMeal.content.serviceTeam.sx.name;
      this.previewData.serviceTeam.sx.desc = currentSetMeal.content.serviceTeam.sx.desc;
      this.previewData.serviceTeam.other.name = currentSetMeal.content.serviceTeam.other.name;
      this.previewData.serviceTeam.other.desc = currentSetMeal.content.serviceTeam.other.desc;
      this.previewData.ceremony = currentSetMeal.content.ceremony;
      this.previewData.lightEquipment = currentSetMeal.content.lightEquipment;
      this.previewData.personalityProduction = currentSetMeal.content.personalityProduction;
      this.previewData.extraInfo = currentSetMeal.content.extraInfo;

      this.editForm.carouselList = currentSetMeal.content.carouselList;
      this.editForm.name = currentSetMeal.content.name;
      this.editForm.desc = currentSetMeal.content.desc;
      this.editForm.banquet.pricePerDesk = currentSetMeal.content.banquet.pricePerDesk;
      this.editForm.banquet.peopleNumPerDesk = currentSetMeal.content.banquet.peopleNumPerDesk;
      this.editForm.banquet.deskNum = currentSetMeal.content.banquet.deskNum;
      this.editForm.banquet.drink = currentSetMeal.content.banquet.drink;
      this.editForm.banquet.afternoonTea = currentSetMeal.content.banquet.afternoonTea;
      this.editForm.banquet.extraTip = currentSetMeal.content.banquet.extraTip;
      this.editForm.coverPath = currentSetMeal.content.coverPath;
      this.editForm.dishList = currentSetMeal.content.dishList.join(';');
      this.editForm.field = currentSetMeal.content.field;
      this.editForm.weddingArragement.welcomeGuestsArea = currentSetMeal.content.weddingArragement.welcomeGuestsArea;
      this.editForm.weddingArragement.ceremonyArea = currentSetMeal.content.weddingArragement.ceremonyArea;
      this.editForm.weddingArragement.banqueArea = currentSetMeal.content.weddingArragement.banqueArea;
      this.editForm.flowerDecoration.husband = currentSetMeal.content.flowerDecoration.husband;
      this.editForm.flowerDecoration.wife = currentSetMeal.content.flowerDecoration.wife;
      this.editForm.flowerDecoration.guests = currentSetMeal.content.flowerDecoration.guests;
      this.editForm.serviceTeam.emcee.name = currentSetMeal.content.serviceTeam.emcee.name;
      this.editForm.serviceTeam.emcee.desc = currentSetMeal.content.serviceTeam.emcee.desc;
      this.editForm.serviceTeam.makeUp.name = currentSetMeal.content.serviceTeam.makeUp.name;
      this.editForm.serviceTeam.makeUp.desc = currentSetMeal.content.serviceTeam.makeUp.desc;
      this.editForm.serviceTeam.sy.name = currentSetMeal.content.serviceTeam.sy.name;
      this.editForm.serviceTeam.sy.desc = currentSetMeal.content.serviceTeam.sy.desc;
      this.editForm.serviceTeam.sx.name = currentSetMeal.content.serviceTeam.sx.name;
      this.editForm.serviceTeam.sx.desc = currentSetMeal.content.serviceTeam.sx.desc;
      this.editForm.serviceTeam.other.name = currentSetMeal.content.serviceTeam.other.name;
      this.editForm.serviceTeam.other.desc = currentSetMeal.content.serviceTeam.other.desc;
      this.editForm.ceremony = currentSetMeal.content.ceremony;
      this.editForm.lightEquipment = currentSetMeal.content.lightEquipment;
      this.editForm.personalityProduction = currentSetMeal.content.personalityProduction;
      this.editForm.extraInfo = currentSetMeal.content.extraInfo;
      this.previewStatus = 1;
      this.editFormVisible = true;
    },
    submitCreateForm() {
      if (this.createForm.carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张套餐轮播图!',
        });
        return;
      }
      if (!this.createForm.name) {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空!',
        });
        return;
      }
      if (!this.createForm.desc) {
        this.$message({
          type: 'warning',
          message: '套餐描述不能为空!',
        });
        return;
      }
      if (!this.createForm.banquet.pricePerDesk && this.createForm.banquet.pricePerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌价格!',
        });
        return;
      }
      if (!this.createForm.banquet.peopleNumPerDesk && this.createForm.banquet.peopleNumPerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌人数!',
        });
        return;
      }
      if (!this.createForm.banquet.deskNum && this.createForm.banquet.deskNum !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴桌数!',
        });
        return;
      }
      if (!this.createForm.banquet.drink) {
        this.$message({
          type: 'warning',
          message: '喜宴酒水不能为空!',
        });
        return;
      }
      if (!this.createForm.banquet.afternoonTea) {
        this.$message({
          type: 'warning',
          message: '喜宴下午茶不能为空!',
        });
        return;
      }
      if (!this.createForm.banquet.extraTip) {
        this.$message({
          type: 'warning',
          message: '喜宴补充说明不能为空!',
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
      if (!this.createForm.field) {
        this.$message({
          type: 'warning',
          message: '场地不能为空!',
        });
        return;
      }
      if (!this.createForm.weddingArragement.welcomeGuestsArea) {
        this.$message({
          type: 'warning',
          message: '迎宾区不能为空!',
        });
        return;
      }
      if (!this.createForm.weddingArragement.ceremonyArea) {
        this.$message({
          type: 'warning',
          message: '仪式区不能为空!',
        });
        return;
      }
      if (!this.createForm.weddingArragement.banqueArea) {
        this.$message({
          type: 'warning',
          message: '婚宴区不能为空!',
        });
        return;
      }
      if (!this.createForm.flowerDecoration.husband) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新郎不能为空!',
        });
        return;
      }
      if (!this.createForm.flowerDecoration.wife) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新娘不能为空!',
        });
        return;
      }
      if (!this.createForm.flowerDecoration.guests) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰贵宾不能为空!',
        });
        return;
      }

      if (!this.createForm.serviceTeam.emcee.name) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪名称不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.emcee.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪描述不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.makeUp.name) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆名称不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.makeUp.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆描述不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.sy.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影名称不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.sy.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影描述不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.sx.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像名称不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.sx.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像描述不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.other.name) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员名称不能为空!',
        });
        return;
      }
      if (!this.createForm.serviceTeam.other.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员描述不能为空!',
        });
        return;
      }
      if (!this.createForm.ceremony) {
        this.$message({
          type: 'warning',
          message: '仪式不能为空!',
        });
        return;
      }
      if (!this.createForm.lightEquipment) {
        this.$message({
          type: 'warning',
          message: '灯光设备不能为空!',
        });
        return;
      }
      if (!this.createForm.personalityProduction) {
        this.$message({
          type: 'warning',
          message: '个性制作不能为空!',
        });
        return;
      }
      if (!this.createForm.extraInfo) {
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
      addSetMeal('7' || this.$store.state.login.hotelId, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.cancelCreateForm();
          this.getSetMealList();
          this.$message.success('创建成功!');
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('创建失败!');
        });
    },
    submitEditForm() {
      if (this.editForm.carouselList.length === 0) {
        this.$message({
          type: 'warning',
          message: '至少上传一张套餐轮播图!',
        });
        return;
      }
      if (!this.editForm.name) {
        this.$message({
          type: 'warning',
          message: '套餐名称不能为空!',
        });
        return;
      }
      if (!this.editForm.desc) {
        this.$message({
          type: 'warning',
          message: '套餐描述不能为空!',
        });
        return;
      }
      if (!this.editForm.banquet.pricePerDesk && this.editForm.banquet.pricePerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌价格!',
        });
        return;
      }
      if (!this.editForm.banquet.peopleNumPerDesk && this.editForm.banquet.peopleNumPerDesk !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴每桌人数!',
        });
        return;
      }
      if (!this.editForm.banquet.deskNum && this.editForm.banquet.deskNum !== 0) {
        this.$message({
          type: 'warning',
          message: '请输入正确的喜宴桌数!',
        });
        return;
      }
      if (!this.editForm.banquet.drink) {
        this.$message({
          type: 'warning',
          message: '喜宴酒水不能为空!',
        });
        return;
      }
      if (!this.editForm.banquet.afternoonTea) {
        this.$message({
          type: 'warning',
          message: '喜宴下午茶不能为空!',
        });
        return;
      }
      if (!this.editForm.banquet.extraTip) {
        this.$message({
          type: 'warning',
          message: '喜宴补充说明不能为空!',
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
      if (!this.editForm.field) {
        this.$message({
          type: 'warning',
          message: '场地不能为空!',
        });
        return;
      }
      if (!this.editForm.weddingArragement.welcomeGuestsArea) {
        this.$message({
          type: 'warning',
          message: '迎宾区不能为空!',
        });
        return;
      }
      if (!this.editForm.weddingArragement.ceremonyArea) {
        this.$message({
          type: 'warning',
          message: '仪式区不能为空!',
        });
        return;
      }
      if (!this.editForm.weddingArragement.banqueArea) {
        this.$message({
          type: 'warning',
          message: '婚宴区不能为空!',
        });
        return;
      }
      if (!this.editForm.flowerDecoration.husband) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新郎不能为空!',
        });
        return;
      }
      if (!this.editForm.flowerDecoration.wife) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰新娘不能为空!',
        });
        return;
      }
      if (!this.editForm.flowerDecoration.guests) {
        this.$message({
          type: 'warning',
          message: '鲜花装饰贵宾不能为空!',
        });
        return;
      }

      if (!this.editForm.serviceTeam.emcee.name) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪名称不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.emcee.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队司仪描述不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.makeUp.name) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆名称不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.makeUp.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队化妆描述不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.sy.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影名称不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.sy.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄影描述不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.sx.name) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像名称不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.sx.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队摄像描述不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.other.name) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员名称不能为空!',
        });
        return;
      }
      if (!this.editForm.serviceTeam.other.desc) {
        this.$message({
          type: 'warning',
          message: '服务团队其他人员描述不能为空!',
        });
        return;
      }
      if (!this.editForm.ceremony) {
        this.$message({
          type: 'warning',
          message: '仪式不能为空!',
        });
        return;
      }
      if (!this.editForm.lightEquipment) {
        this.$message({
          type: 'warning',
          message: '灯光设备不能为空!',
        });
        return;
      }
      if (!this.editForm.personalityProduction) {
        this.$message({
          type: 'warning',
          message: '个性制作不能为空!',
        });
        return;
      }
      if (!this.editForm.extraInfo) {
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
      editSetMeal(this.currentSetMealId, JSON.stringify(tempForm))
        .then((res) => {
          console.log(res);
          this.cancelEditForm();
          this.getSetMealList();
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
      this.currentSetMealId = '';
      this.editForm.carouselList = [];
      this.editForm.name = '';
      this.editForm.desc = '';
      this.editForm.banquet.pricePerDesk = '';
      this.editForm.banquet.peopleNumPerDesk = '';
      this.editForm.banquet.deskNum = '';
      this.editForm.banquet.drink = '';
      this.editForm.banquet.afternoonTea = '';
      this.editForm.banquet.extraTip = '';
      this.editForm.coverPath = '';
      this.editForm.dishList = '';
      this.editForm.field = '';
      this.editForm.weddingArragement.welcomeGuestsArea = '';
      this.editForm.weddingArragement.ceremonyArea = '';
      this.editForm.weddingArragement.banqueArea = '';
      this.editForm.flowerDecoration.husband = '';
      this.editForm.flowerDecoration.wife = '';
      this.editForm.flowerDecoration.guests = '';
      this.editForm.serviceTeam.emcee.name = '';
      this.editForm.serviceTeam.emcee.desc = '';
      this.editForm.serviceTeam.makeUp.name = '';
      this.editForm.serviceTeam.makeUp.desc = '';
      this.editForm.serviceTeam.sy.name = '';
      this.editForm.serviceTeam.sy.desc = '';
      this.editForm.serviceTeam.sx.name = '';
      this.editForm.serviceTeam.sx.desc = '';
      this.editForm.serviceTeam.other.name = '';
      this.editForm.serviceTeam.other.desc = '';
      this.editForm.ceremony = '';
      this.editForm.lightEquipment = '';
      this.editForm.personalityProduction = '';
      this.editForm.extraInfo = '';
      this.previewData.carouselList = [];
      this.previewData.name = '';
      this.previewData.desc = '';
      this.previewData.banquet.pricePerDesk = '';
      this.previewData.banquet.peopleNumPerDesk = '';
      this.previewData.banquet.deskNum = '';
      this.previewData.banquet.drink = '';
      this.previewData.banquet.afternoonTea = '';
      this.previewData.banquet.extraTip = '';
      this.previewData.coverPath = '';
      this.previewData.dishList = [];
      this.previewData.field = '';
      this.previewData.weddingArragement.welcomeGuestsArea = '';
      this.previewData.weddingArragement.ceremonyArea = '';
      this.previewData.weddingArragement.banqueArea = '';
      this.previewData.flowerDecoration.husband = '';
      this.previewData.flowerDecoration.wife = '';
      this.previewData.flowerDecoration.guests = '';
      this.previewData.serviceTeam.emcee.name = '';
      this.previewData.serviceTeam.emcee.desc = '';
      this.previewData.serviceTeam.makeUp.name = '';
      this.previewData.serviceTeam.makeUp.desc = '';
      this.previewData.serviceTeam.sy.name = '';
      this.previewData.serviceTeam.sy.desc = '';
      this.previewData.serviceTeam.sx.name = '';
      this.previewData.serviceTeam.sx.desc = '';
      this.previewData.serviceTeam.other.name = '';
      this.previewData.serviceTeam.other.desc = '';
      this.previewData.ceremony = '';
      this.previewData.lightEquipment = '';
      this.previewData.personalityProduction = '';
      this.previewData.extraInfo = '';
    },
    cancelCreateForm() {
      this.createFormVisible = false;
      this.previewStatus = 0;
      this.createFormStep = 0;
      this.createForm.carouselList = [];
      this.createForm.name = '';
      this.createForm.desc = '';
      this.createForm.banquet.pricePerDesk = '';
      this.createForm.banquet.peopleNumPerDesk = '';
      this.createForm.banquet.deskNum = '';
      this.createForm.banquet.drink = '';
      this.createForm.banquet.afternoonTea = '';
      this.createForm.banquet.extraTip = '';
      this.createForm.coverPath = '';
      this.createForm.dishList = '';
      this.createForm.field = '';
      this.createForm.weddingArragement.welcomeGuestsArea = '';
      this.createForm.weddingArragement.ceremonyArea = '';
      this.createForm.weddingArragement.banqueArea = '';
      this.createForm.flowerDecoration.husband = '';
      this.createForm.flowerDecoration.wife = '';
      this.createForm.flowerDecoration.guests = '';
      this.createForm.serviceTeam.emcee.name = '';
      this.createForm.serviceTeam.emcee.desc = '';
      this.createForm.serviceTeam.makeUp.name = '';
      this.createForm.serviceTeam.makeUp.desc = '';
      this.createForm.serviceTeam.sy.name = '';
      this.createForm.serviceTeam.sy.desc = '';
      this.createForm.serviceTeam.sx.name = '';
      this.createForm.serviceTeam.sx.desc = '';
      this.createForm.serviceTeam.other.name = '';
      this.createForm.serviceTeam.other.desc = '';
      this.createForm.ceremony = '';
      this.createForm.lightEquipment = '';
      this.createForm.personalityProduction = '';
      this.createForm.extraInfo = '';
      this.previewData.carouselList = [];
      this.previewData.name = '';
      this.previewData.desc = '';
      this.previewData.banquet.pricePerDesk = '';
      this.previewData.banquet.peopleNumPerDesk = '';
      this.previewData.banquet.deskNum = '';
      this.previewData.banquet.drink = '';
      this.previewData.banquet.afternoonTea = '';
      this.previewData.banquet.extraTip = '';
      this.previewData.coverPath = '';
      this.previewData.dishList = [];
      this.previewData.field = '';
      this.previewData.weddingArragement.welcomeGuestsArea = '';
      this.previewData.weddingArragement.ceremonyArea = '';
      this.previewData.weddingArragement.banqueArea = '';
      this.previewData.flowerDecoration.husband = '';
      this.previewData.flowerDecoration.wife = '';
      this.previewData.flowerDecoration.guests = '';
      this.previewData.serviceTeam.emcee.name = '';
      this.previewData.serviceTeam.emcee.desc = '';
      this.previewData.serviceTeam.makeUp.name = '';
      this.previewData.serviceTeam.makeUp.desc = '';
      this.previewData.serviceTeam.sy.name = '';
      this.previewData.serviceTeam.sy.desc = '';
      this.previewData.serviceTeam.sx.name = '';
      this.previewData.serviceTeam.sx.desc = '';
      this.previewData.serviceTeam.other.name = '';
      this.previewData.serviceTeam.other.desc = '';
      this.previewData.ceremony = '';
      this.previewData.lightEquipment = '';
      this.previewData.personalityProduction = '';
      this.previewData.extraInfo = '';
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
      this.requestUploadImg1(e.file);
    },
    requestUploadImg1(tmpFile) {
      const formData = new FormData();
      formData.append('file', tmpFile);
      request
        .post('/beiJing/shangchuanTomcat', formData)
        .then((res) => {
          console.log('图片地址', res);
          this.previewData.carouselList.push(res.data.filePath);
          this.editForm.carouselList = this.previewData.carouselList;
          if (this.createFormVisible) {
            this.createForm.carouselList.push(res.data.filePath);
          }
        })
        .catch((err) => {
          console.log(err);
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
      console.log('打印图片');
      console.log(e.file);
      this.requestUploadImg2(e.file);
    },
    requestUploadImg2(tmpFile) {
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
      if (this.createFormStep === 10) {
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
      if (this.editFormStep === 10) {
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
    removeCurrentCarousel(imgPath) {
      this.previewData.carouselList = this.previewData.carouselList.filter((item) => item !== imgPath);
      if (this.createFormVisible) {
        this.createForm.carouselList = this.createForm.carouselList.filter((item) => item !== imgPath);
      } else if (this.editFormVisible) {
        this.editForm.carouselList = this.editForm.carouselList.filter((item) => item !== imgPath);
      }
    },
    removeCurrentCover() {
      this.previewData.coverPath = '';
      if (this.createFormVisible) {
        this.createForm.coverPath = '';
      } else if (this.editFormVisible) {
        this.editForm.coverPath = '';
      }
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
    getSetMealList() {
      getSetMealList('7' || this.$store.state.login.hotelId)
        .then((res) => {
          console.log(res.data.list);
          if (res.data.list.length > 0) {
            this.setMealList = res.data.list.map((item) => ({
              setMealId: item.wedding_package_id,
              content: JSON.parse(item.json_data),
            }));
          } else {
            this.setMealList = [];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onCreateFormNameInput(val) {
      this.previewData.name = val;
    },
    onCreateFormDescInput(val) {
      this.previewData.desc = val;
    },
    onCreateFormPricePerDeskInput(val) {
      this.previewData.banquet.pricePerDesk = val;
    },
    onCreateFormPeopleNumPerDeskInput(val) {
      this.previewData.banquet.peopleNumPerDesk = val;
    },
    onCreateFormDeskNumInput(val) {
      this.previewData.banquet.deskNum = val;
    },
    onCreateFormDrinkInput(val) {
      this.previewData.banquet.drink = val;
    },
    onCreateFormAfternoonTeaInput(val) {
      this.previewData.banquet.afternoonTea = val;
    },
    onCreateFormExtraTipInput(val) {
      this.previewData.banquet.extraTip = val;
    },
    onCreateFormDishListInput(val) {
      if (val.indexOf(';') > -1) {
        this.previewData.dishList = val.split(';');
      } else if (val.indexOf('；') > -1) {
        this.previewData.dishList = val.split('；');
      }
    },
    onCreateFormFieldInput(val) {
      this.previewData.field = val;
    },
    onCreateFormWelcomeGuestsAreaInput(val) {
      this.previewData.weddingArragement.welcomeGuestsArea = val;
    },
    onCreateFormCeremonyAreaInput(val) {
      this.previewData.weddingArragement.ceremonyArea = val;
    },
    onCreateFormBanqueAreaInput(val) {
      this.previewData.weddingArragement.banqueArea = val;
    },
    onCreateFormHusbandInput(val) {
      this.previewData.flowerDecoration.husband = val;
    },
    onCreateFormWifeInput(val) {
      this.previewData.flowerDecoration.wife = val;
    },
    onCreateFormGuestsInput(val) {
      this.previewData.flowerDecoration.guests = val;
    },
    onCreateFormEmceeNameInput(val) {
      this.previewData.serviceTeam.emcee.name = val;
    },
    onCreateFormEmceeDescInput(val) {
      this.previewData.serviceTeam.emcee.desc = val;
    },
    onCreateFormMakeUpNameInput(val) {
      this.previewData.serviceTeam.makeUp.name = val;
    },
    onCreateFormMakeUpDescInput(val) {
      this.previewData.serviceTeam.makeUp.desc = val;
    },
    onCreateFormSyNameInput(val) {
      this.previewData.serviceTeam.sy.name = val;
    },
    onCreateFormSyDescInput(val) {
      this.previewData.serviceTeam.sy.desc = val;
    },
    onCreateFormSxNameInput(val) {
      this.previewData.serviceTeam.sx.name = val;
    },
    onCreateFormSxDescInput(val) {
      this.previewData.serviceTeam.sx.desc = val;
    },
    onCreateFormOtherNameInput(val) {
      this.previewData.serviceTeam.other.name = val;
    },
    onCreateFormOtherDescInput(val) {
      this.previewData.serviceTeam.other.desc = val;
    },
    onCreateFormCeremonyInput(val) {
      this.previewData.ceremony = val;
    },
    onCreateFormLightEquipmentInput(val) {
      this.previewData.lightEquipment = val;
    },
    onCreateFormPersonalityProductionInput(val) {
      this.previewData.personalityProduction = val;
    },
    onCreateFormExtraInfoInput(val) {
      this.previewData.extraInfo = val;
    },
    onEditFormNameInput(val) {
      this.previewData.name = val;
    },
    onEditFormDescInput(val) {
      this.previewData.desc = val;
    },
    onEditFormPricePerDeskInput(val) {
      this.previewData.banquet.pricePerDesk = val;
    },
    onEditFormPeopleNumPerDeskInput(val) {
      this.previewData.banquet.peopleNumPerDesk = val;
    },
    onEditFormDeskNumInput(val) {
      this.previewData.banquet.deskNum = val;
    },
    onEditFormDrinkInput(val) {
      this.previewData.banquet.drink = val;
    },
    onEditFormAfternoonTeaInput(val) {
      this.previewData.banquet.afternoonTea = val;
    },
    onEditFormExtraTipInput(val) {
      this.previewData.banquet.extraTip = val;
    },
    onEditFormDishListInput(val) {
      if (val.indexOf(';') > -1) {
        this.previewData.dishList = val.split(';');
      } else if (val.indexOf('；') > -1) {
        this.previewData.dishList = val.split('；');
      }
    },
    onEditFormFieldInput(val) {
      this.previewData.field = val;
    },
    onEditFormWelcomeGuestsAreaInput(val) {
      this.previewData.weddingArragement.welcomeGuestsArea = val;
    },
    onEditFormCeremonyAreaInput(val) {
      this.previewData.weddingArragement.ceremonyArea = val;
    },
    onEditFormBanqueAreaInput(val) {
      this.previewData.weddingArragement.banqueArea = val;
    },
    onEditFormHusbandInput(val) {
      this.previewData.flowerDecoration.husband = val;
    },
    onEditFormWifeInput(val) {
      this.previewData.flowerDecoration.wife = val;
    },
    onEditFormGuestsInput(val) {
      this.previewData.flowerDecoration.guests = val;
    },
    onEditFormEmceeNameInput(val) {
      this.previewData.serviceTeam.emcee.name = val;
    },
    onEditFormEmceeDescInput(val) {
      this.previewData.serviceTeam.emcee.desc = val;
    },
    onEditFormMakeUpNameInput(val) {
      this.previewData.serviceTeam.makeUp.name = val;
    },
    onEditFormMakeUpDescInput(val) {
      this.previewData.serviceTeam.makeUp.desc = val;
    },
    onEditFormSyNameInput(val) {
      this.previewData.serviceTeam.sy.name = val;
    },
    onEditFormSyDescInput(val) {
      this.previewData.serviceTeam.sy.desc = val;
    },
    onEditFormSxNameInput(val) {
      this.previewData.serviceTeam.sx.name = val;
    },
    onEditFormSxDescInput(val) {
      this.previewData.serviceTeam.sx.desc = val;
    },
    onEditFormOtherNameInput(val) {
      this.previewData.serviceTeam.other.name = val;
    },
    onEditFormOtherDescInput(val) {
      this.previewData.serviceTeam.other.desc = val;
    },
    onEditFormCeremonyInput(val) {
      this.previewData.ceremony = val;
    },
    onEditFormLightEquipmentInput(val) {
      this.previewData.lightEquipment = val;
    },
    onEditFormPersonalityProductionInput(val) {
      this.previewData.personalityProduction = val;
    },
    onEditFormExtraInfoInput(val) {
      this.previewData.extraInfo = val;
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
    background-color: #f7f6f2;
    .section1 {
      background-color: #ffffff;
      padding-bottom: 16px;
      .hotelCarousel {
        .cImgBox {
          position: relative;
          height: 100%;
          width: 100%;
          .cImg {
            height: 100%;
            width: 100%;
            border-radius: 15px;
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
      padding-top: 12px;
      margin-top: 8px;
      padding-bottom: 6px;
      position: relative;
      .tit {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
        text-align: center;
      }
      .infoList {
        margin-top: 16px;
        .infoItem {
          padding-left: 11px;
          padding-right: 6px;
          position: relative;
          margin-bottom: 16px;
          display: flex;
          .label {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.4);
          }
          .val {
            font-size: 14px;
            font-weight: 400;
            color: #333333;
            width: 245px;
            &.v1 {
              margin-left: 26px;
            }
            &.v2 {
              margin-left: 11px;
            }
          }
        }
      }
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        margin-top: 46px;
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
      .operateArea {
        justify-content: space-between;
        padding-left: 26px;
        padding-right: 15px;
        .price {
          font-weight: 400;
          color: rgba(0, 0, 0, 0.4);
          font-size: 9px;
          .unit {
            color: #ff457a;
            font-size: 12px;
          }
          .price {
            color: #ff457a;
            font-size: 18px;
          }
        }
        .contactBtn {
          width: 96px;
          height: 38px;
          background: #ff457a;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
        }
      }
      .menuBox {
        text-align: center;
        width: 343px;
        border: 1px solid #dddddd;
        margin: 0 auto;
        margin-top: 46px;
        padding-bottom: 20px;
        .posterImg {
          width: 343px;
          height: 125px;
          margin-bottom: 20px;
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
    .section3 {
      background: #fff;
      padding-top: 12px;
      margin-top: 8px;
      padding-bottom: 6px;
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
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          margin-bottom: 4px;
        }
      }
    }
    .section4 {
      background: #fff;
      padding-top: 12px;
      margin-top: 16px;
      padding-bottom: 6px;
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
            width: 257px;
            &.spe {
              width: 240px;
            }
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
