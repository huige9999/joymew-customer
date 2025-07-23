<!--卡牌抽奖-->
<template>
  <sub-page>
    <div class="swing-setting-container">
      <main-card>
        <card-top-info title="卡牌正面内容"></card-top-info>
        <div class="setting-box">
          <!-- 卡牌数量选择 -->
          <div class="select-card-num">
            <span class="select-card-num-text">卡牌数量：</span>
            <el-select v-model="cardNum" placeholder="请选择" size="small" @change="selectCardNumHandle">
              <el-option v-for="item in cardNumOptions" :key="item.value" :label="item.value"
                :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="game-time">
            <div class="card-front-setting" v-for="(item, index) in cardNum" :key="index">
              <div class="tip">卡牌{{ index + 1 }}</div>
              <el-input v-if="!disableCardFrontInputIndexList.includes(index)" type="text"
                v-model="cardFrontList[index]" @change="changeCardFront($event, index)"></el-input>
              <el-tooltip v-else effect="dark" content="该项固定设置为秋香卡牌" placement="top">
                <el-input type="text" disabled placeholder="秋香"></el-input>
              </el-tooltip>
            </div>
          </div>

          <!-- 新增：是否需要洗牌 -->
          <div style="margin-top: 10px; margin-bottom: 20px; display: flex; align-items: center;">
            <span
              style="margin-right: 10px; font-size: 14px; font-family: PingFangSC-Medium, PingFang SC; font-weight: 500; color: rgba(0,0,0,.85);">是否随机洗牌：</span>
            <el-switch v-model="isShuffleCardDraw"></el-switch>
            <el-tooltip content="开启后，卡牌顺序将在游戏开始时被打乱。关闭则卡牌顺序固定（例如，若卡牌正反面内容需一一对应时可关闭此项）。" placement="top"
              style="margin-left: 10px;">
              <i class="el-icon-question" style="color: #909399; cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div class="submit-btn">
            <el-button type="primary" @click="submitSetting">提交</el-button>
          </div>
        </div>
        <card-top-info v-if="!isChineseWedding" title="卡牌样式设置"></card-top-info>
        <div v-if="!isChineseWedding" class="card-setting-part">
          <div class="part-tip">在这里你可以选择设置卡牌背面的封面或成语文案（只可修改其中的一项）</div>
          <div class="select-setting-model">
            <div class="select-label">请选择所需的修改设置：</div>
            <div class="select-item">
              <el-radio-group v-model="cardSettingModel" size="medium">
                <el-radio :label="model.value" v-for="model in settingModels" :key="model.txt">{{ model.txt
                }}</el-radio>
                <el-radio label="3" key="3" v-if="cardNum === 12">12星座模板</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="setting-container">
            <div class="left">
              <!-- 卡牌样式展示 -->
              <div class="card-style-show setting-part">
                <div class="setting-part-title">卡牌样式</div>
                <div class="tmp-part"
                  :class="{ configNum16: targetConfigTxt.length >= 16, configNum25: targetConfigTxt.length >= 25 }"
                  v-if="cardSettingModel === '1' || cardSettingModel === '2'">
                  <div class="card-item" v-for="(txt, index) in targetConfigTxt" :key="index">
                    <div class="card-item-txt" v-if="cardSettingModel === '1' && configCardBg">
                      <img :src="cardSettingModel === '1' && configCardBg ? configCardBg : defaultCardBg"
                        class="card-bg" />
                    </div>
                    <div class="card-item-txt" v-else>
                      {{ txt }}
                      <img :src="cardSettingModel === '1' && configCardBg ? configCardBg : defaultCardBg"
                        class="card-bg" />
                    </div>

                    <div class="card-item-index">{{ index + 1 }}</div>
                  </div>
                </div>
                <div class="tmp-part" v-else>
                  <div class="card-item" v-for="(imgPath, index) in constellationBgInfo.back" :key="index">
                    <div class="card-item-txt">
                      <img :src="imgPath" class="card-bg" />
                    </div>

                    <div class="card-item-index">{{ index + 1 }}</div>
                  </div>
                </div>
              </div>
              <!-- 配置卡牌背景图片 -->
              <div class="card-bg-config setting-part" v-if="cardSettingModel === '1'">
                <div class="setting-part-title">设置卡牌封面</div>
                <img class="config-card-bg-display" :src="configCardBg || defaultCardBg" />
                <div class="config-handler">
                  <div class="handler">
                    更换卡牌封面
                    <el-upload class="handler-btn" :http-request="handlerBgUpload" action
                      :show-file-list="false">自定义</el-upload>
                  </div>
                  <div class="handler"><span class="handler-btn" @click="resetCardBack">恢复默认封面</span></div>
                </div>
                <div class="bg-config-tip">注：建议上传图片比例16:9</div>
              </div>
            </div>
            <div class="right" v-if="cardSettingModel === '2'">
              <div class="setting-part">
                <div class="setting-part-title">设置卡牌封面文案（限4字以内）</div>
                <div class="reset-bg" @click="resetConfigTxt">恢复默认文案</div>
                <div class="txt-input-container">
                  <div class="input-item" v-for="num in defaultConfigCardTxt.length" :key="num">
                    <div class="input-label">{{ `项目${num}：` }}</div>
                    <el-input maxlength="4" :placeholder="defaultConfigCardTxt[num - 1]"
                      v-model="configCardTxt[num - 1]" class="txt-input" clearable></el-input>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="save-btn" @click="submitSetting">提交</div>
        </div>
      </main-card>
    </div>
  </sub-page>
</template>

<script>
import { reqGetCardFrontContent, reqUpdateCardFrontContent } from '@/api/setting/activitySetting/gameSetting';
import CardTopInfo from '@/components/cardTopInfo';
import MainCard from '@/components/mainCard';
import SubPage from '@/components/subPage';
import request from '@/utils/request';
import { mapState } from 'vuex';
import { CONSTELLATIONBGINFO, defaultCardTxt } from './cardDraw-constant';

export default {
  name: 'cardDrawCustom',
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      // 卡牌数量选择
      cardNumOptions: [{ value: 9 }, { value: 12 }, { value: 16 }, { value: 25 }],
      cardNum: 9,
      // 卡牌正面内容
      defaultCardFrontList: ['一等奖', '二等奖', '三等奖', '唱首歌', '罚杯酒', '罚两杯酒', '唱首歌', '罚杯酒', '唱首歌'],
      // 禁止输入的卡牌的索引
      disableCardFrontInputIndexList: [],
      cardFrontList: [],
      // 卡片设置项
      cardSettingModel: '1',
      // 卡片设置的目标
      settingModels: [
        {
          txt: '卡牌封面自定义',
          value: '1',
        },
        {
          txt: '卡牌封面文案自定义',
          value: '2',
        },
      ],
      defaultCardTxt,
      defaultConfigCardTxt: [], // 对应的默认配置文案
      configCardTxt: [], // 自定以配置的文案
      defaultCardBg: 'https://ustatic.hudongmiao.com/joymewCustomer/cardBack.png',
      configCardBg: '',
      constellationBgInfo: CONSTELLATIONBGINFO,
      // 通过后端接口接收到的数据，更新数据时使用
      resData: {
        card_info_json: '',
      },
      isShuffleCardDraw: true, // 控制是否洗牌，默认为true (洗牌)
    };
  },
  watch: {
    cardNum: {
      handler() {
        this.handlerCardTxt();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      liveId: (state) => state.liveId,
      sceneType: (state) => state.sceneType,
    }),
    // 最终的自定义配置文案
    targetConfigTxt() {
      const target = [];
      this.configCardTxt.forEach((item, index) => {
        // 如果配置的数组中的文案为 ''，则去对应位置的默认文案
        if (item === '') {
          target.push(this.defaultConfigCardTxt[index]);
        } else {
          target.push(item);
        }
      });
      return target;
    },
    // 是否是中式婚礼版活动
    isChineseWedding() {
      return this.sceneType === '91';
    },
  },
  created() {
    this.initData();
  },
  methods: {
    // 修改卡牌正面内容时对内容进行处理
    // XXX 这种方法修改内容时，如果Ctrl+Z撤销则不会恢复原内容，而是把原内容添加到当前内容的后面，可以改良
    changeCardFront(value, index) {
      // 如果内容为空，则恢复默认内容
      if (value.length === 0) {
        this.cardFrontList.splice(index, 1, this.defaultCardFrontList[index]);
      }
      // 如果内容超过10个字符，则截取前10个字符
      if (value.length > 10) {
        this.cardFrontList.splice(index, 1, value.slice(0, 10));
      }
    },
    /** 选择卡牌数量事件回调 */
    selectCardNumHandle() {
      // 如果选择的卡牌数量大于当前卡牌数量，则添加卡牌正面内容（默认内容为原最后一项的内容）
      if (this.cardNum > this.cardFrontList.length) {
        const defaultCardFront = this.cardFrontList[this.cardFrontList.length - 1];
        for (let i = this.cardFrontList.length; i < this.cardNum; i++) {
          this.cardFrontList.push(defaultCardFront);
        }
      }
    },
    // 初始化数据
    async initData() {
      const { liveId } = this.$store.state;
      try {
        const res = await reqGetCardFrontContent(liveId);

        this.cardFrontList = res.data?.card_data_json ? JSON.parse(res.data.card_data_json) : this.defaultCardFrontList;
        this.cardNum = this.cardFrontList.length;

        const cardBackConfig = res.data.card_info_json
          ? JSON.parse(res.data.card_info_json)
          : {
            settingModel: '1',
            setting: {
              diyCardBg: '',
              diyCardBackTxt: '',
            },
            isShuffleCardDraw: true, // 默认洗牌
          };
        this.disableCardFrontInputIndexList = cardBackConfig?.setting?.disableCardFrontInputIndexList || [];
        console.log('disableCardFrontInputIndexList', this.disableCardFrontInputIndexList);
        this.cardSettingModel = cardBackConfig.settingModel || '1';

        // 处理 isShuffleCardDraw，兼容旧数据（如果字段不存在，则默认为 true）
        if (typeof cardBackConfig.isShuffleCardDraw === 'boolean') {
          this.isShuffleCardDraw = cardBackConfig.isShuffleCardDraw;
        } else {
          this.isShuffleCardDraw = true; // 默认洗牌
        }

        this.configCardTxt = cardBackConfig.setting.diyCardBackTxt.split(',').length === this.cardNum
          ? cardBackConfig.setting.diyCardBackTxt.split(',')
          : new Array(this.cardNum).fill('');
        this.configCardBg = cardBackConfig.setting.diyCardBg;
      } catch (err) {
        console.log('reqGetCardFrontContent', err);
      }
    },
    // 提交设置
    async submitSetting() {
      if (this.cardNum !== 12 && this.cardSettingModel === '3') {
        this.$message.error('12星座模板的卡牌数量为12张, 不可修改!');
        return;
      }
      const { liveId } = this.$store.state;
      const cardInfo = {
        settingModel: this.cardSettingModel, // 区分设置的模式：1 -> 自定义背景；2 -> 自定义卡牌背面文案 3 -> 12星座模板
        isShuffleCardDraw: this.isShuffleCardDraw,
        setting: {
          diyCardBg: this.configCardBg || '', // 牌背
          diyCardBackTxt: this.targetConfigTxt.join(','),
        },
      };
      // 根据卡牌数量，截取卡牌正面内容
      const cardFrontList = this.cardFrontList.slice(0, this.cardNum);

      try {
        const res = await reqUpdateCardFrontContent(liveId, {
          card_data_json: JSON.stringify(cardFrontList),
          // 中式婚礼暂时无法设置卡牌正面文字以外的其他信息
          card_info_json: this.isChineseWedding ? undefined : JSON.stringify(cardInfo),
        });

        if (res.code !== 200) {
          throw new Error(res.msg);
        }

        this.$message({
          type: 'success',
          message: '修改成功',
        });
      } catch (err) {
        this.$message.error(err.message);
        console.err('reqGetCardFrontContent', err);
      }
    },
    // 处理默认配置的成语
    handlerCardTxt() {
      // 添加
      if (this.cardNum > this.defaultConfigCardTxt.length) {
        while (this.cardNum > this.defaultConfigCardTxt.length) {
          const len = this.defaultConfigCardTxt.length;
          this.defaultConfigCardTxt.push(this.defaultCardTxt[this.sceneType][len]);
          if (this.configCardTxt.length < this.cardNum) {
            this.configCardTxt.push('');
          }
        }
      } else {
        // 减少
        this.defaultConfigCardTxt = this.defaultConfigCardTxt.slice(0, this.cardNum);
        this.configCardTxt = this.configCardTxt.slice(0, this.cardNum);
      }
    },
    // 恢复默认文案
    resetConfigTxt() {
      this.configCardTxt = this.configCardTxt.map(() => '');
      this.$message.success('操作成功');
    },
    // 上传背景的接口
    handlerBgUpload(e) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.file); // 读取照片

      fileReader.onload = () => {
        this.configCardBg = fileReader.result;
        this.requestUploadFileNoCompress(e.file);
      };
    },
    requestUploadFileNoCompress(file) {
      const formData = new FormData();
      formData.append('file', file);
      request
        .post('/beiJing/shangchuanTomcat', formData, { loading: 1 })
        .then((res) => {
          console.log(res);
          this.$message.success('图片上传成功!');
          this.configCardBg = res.data.filePath;
        })
        .catch((err) => {
          console.log(err);
          this.$message.error('图片上传失败!');
        });
    },
    // 重置背景设置
    resetCardBack() {
      this.configCardBg = '';
      this.$message.success('操作成功');
    },
  },
};
</script>

<style lang="less" scoped>
.swing-setting-container {
  .setting-box {
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
    padding-left: 20px;

    &>div {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }

    // 卡牌数量选择
    .select-card-num {
      margin-bottom: 20px;
      margin-top: 20px;

      .select-card-num-text {
        margin-right: 10px;
      }
    }

    .game-time {
      margin-right: 40px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;

      .card-front-setting {
        max-width: 180px;
        margin-bottom: 10px;
        margin-right: 20px;

        .tip {
          margin-bottom: 10px;
          font-size: 18px;
        }
      }
    }
  }

  .card-setting-part {
    padding: 27px;
    padding-top: 0;
    box-sizing: border-box;

    .part-tip {
      width: fit-content;
      margin-bottom: 24px;
      padding: 4px 11px;
      box-sizing: border-box;
      background-color: rgba(30, 135, 240, 0.1);
      border-radius: 3px;
      color: #1e87f0;
    }

    .select-setting-model {
      margin-bottom: 48px;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .select-label {
        margin-left: 15px;
        font-size: 21px;
        position: relative;

        &::before {
          content: '*';
          position: absolute;
          top: 0;
          left: -15px;
          color: red;
        }
      }
    }

    .setting-container {
      width: 100%;
      margin-bottom: 30px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      .left {
        width: 720px;
        flex-shrink: 0;
        margin-right: 70px;

        .card-style-show {
          margin-bottom: 27px;
        }

        .card-bg-config {
          .setting-part-title {
            margin-bottom: 16px;
          }

          .config-card-bg-display {
            width: 377px;
            height: 209px;
            border-radius: 10px;
            margin-bottom: 27px;
            object-fit: cover;
          }

          .config-handler {
            width: 100%;
            margin-bottom: 21px;
            display: flex;
            align-items: center;
            justify-content: center;

            .handler {
              cursor: default;
              display: flex;
              align-items: center;
              justify-content: center;

              .handler-btn {
                color: #1e87f0;
                cursor: pointer;
              }

              &:first-of-type {
                margin-right: 63px;
              }
            }
          }

          .bg-config-tip {
            color: rgba(0, 0, 0, 0.4);
            font-size: 12px;
            letter-spacing: 3px;
            text-indent: 3px;
          }
        }
      }

      .right {
        .setting-part {
          .setting-part-title {
            margin-bottom: 11px;
          }
        }
      }

      .setting-part {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        .setting-part-title {
          margin-bottom: 27px;
          font-size: 24px;
          letter-spacing: 3px;
        }

        .tmp-part {
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          background-color: #e9f3fe;
          border-radius: 11px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: space-around;
          align-content: space-around;

          .card-item {
            flex-shrink: 0;
            margin-top: 13px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            &:nth-of-type(- n + 3) {
              margin-top: 0;
            }

            .card-item-txt {
              width: 200px;
              height: 111px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #ec5c67;
              font-weight: bold;
              font-size: 20px;
              font-family: Source Han Serif CN;
              position: relative;
              z-index: 1;

              .card-bg {
                width: 100%;
                height: 100%;
                border-radius: 10px;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
              }
            }

            .card-item-index {
              color: #1e87f0;
              font-size: 18px;
              font-family: PingFang SC;
            }
          }
        }

        .reset-bg {
          margin-bottom: 27px;
          color: #1e87f0;
          font-size: 14px;
          cursor: pointer;
        }

        .txt-input-container {
          width: 100%;

          .input-item {
            width: 100%;
            margin-bottom: 21px;
            display: flex;
            align-items: center;
            justify-content: center;

            .input-label {
              width: 100px;
              flex-shrink: 0;
              font-size: 20px;
              text-align: right;
            }

            .txt-input {
              width: 150px;
            }

            .txt-input /deep/.el-input__inner {
              width: 150px !important;
            }

            &:last-of-type {
              margin-bottom: 0;
            }
          }
        }

        .configNum16 {
          .card-item {
            .card-item-txt {
              width: 160px;
              height: 85px;
            }

            &:nth-of-type(- n + 4) {
              margin-top: 0;
            }
          }
        }

        .configNum25 {
          .card-item {
            .card-item-txt {
              width: 120px;
              height: 70px;
              font-size: 14px;
            }

            .card-item-index {
              font-size: 12px;
            }

            &:nth-of-type(- n + 5) {
              margin-top: 0;
            }
          }
        }
      }
    }

    .save-btn {
      width: fit-content;
      margin: 0 auto;
      padding: 10px 42px;
      box-sizing: border-box;
      background-color: #1e87f0;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>
