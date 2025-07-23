<template>
  <sub-page>
    <main-card>
      <card-top-info title="自定义礼物价格"></card-top-info>
      <div class="formBox">
        <div class="formItem">
          <div class="key">互动版本:</div>
          <el-select v-model="activeSceneId" placeholder="请选择互动版本" @change="handleSceneSelectChange">
            <el-option v-for="item in sceneList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="formItem spec">
          <div class="key">祝福上墙(经典):</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in giftListClassic" :key="item.id">
              <img :src="item.img" class="giftImg" />
              <div class="iptItem">
                <div class="key">礼物名:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
              <div class="iptItem">
                <div class="key">排序:</div>
                <el-input-number
                  v-model="item.orderBy"
                  :precision="0"
                  :step="1"
                  label="排序"
                  class="giftPrice"
                  :min="1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">祝福上墙(华丽):</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in giftListGorgeous" :key="item.id">
              <img :src="item.img" class="giftImg" />
              <div class="iptItem">
                <div class="key">礼物名:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
              <div class="iptItem">
                <div class="key">排序:</div>
                <el-input-number
                  v-model="item.orderBy"
                  :precision="0"
                  :step="1"
                  label="排序"
                  class="giftPrice"
                  :min="1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">祝福上墙(嘉年华):</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in giftListCarnival" :key="item.id">
              <img :src="item.img" class="giftImg" />
              <div class="iptItem">
                <div class="key">礼物名:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
              <div class="iptItem">
                <div class="key">排序:</div>
                <el-input-number
                  v-model="item.orderBy"
                  :precision="0"
                  :step="1"
                  label="排序"
                  class="giftPrice"
                  :min="1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">霸气弹幕:</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in danmu" :key="item.id">
              <div class="iptItem">
                <div class="key">礼物名:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">祝福横幅:</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in bapin" :key="item.id">
              <div class="iptItem">
                <div class="key">礼物名:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">现场照片:</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in photo" :key="item.id">
              <div class="iptItem">
                <div class="key">礼物:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <div class="formItem spec">
          <div class="key">全屏特效:</div>
          <div class="gitListWrap">
            <div class="giftListItem" v-for="item in superDanmu" :key="item.id">
              <div class="iptItem">
                <div class="key">礼物:</div>
                <el-input v-model="item.name" placeholder="礼物名" class="giftName" @blur="handleBlur(item)"></el-input>
              </div>
              <div class="iptItem">
                <div class="key">价格:</div>
                <el-input-number
                  v-model="item.price"
                  :precision="2"
                  :step="0.1"
                  label="价格"
                  class="giftPrice"
                  :min="0.1"
                  @blur="handleBlur(item)"
                ></el-input-number>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';
import { getCustomGiftList, eidtCustomGift } from '@/api/app/gift';

const SCENE = [
  {
    id: '0',
    label: '婚礼版',
  },
  {
    id: '1',
    label: '企业版',
  },
  {
    id: '2',
    label: '生日版(通用)',
  },
  {
    id: '21',
    label: '宝宝宴',
  },
  {
    id: '22',
    label: '寿宴',
  },
  {
    id: '23',
    label: '成人礼',
  },
  {
    id: '24',
    label: '百露宴',
  },
  {
    id: '25',
    label: '满月宴',
  },
  {
    id: '41',
    label: '毕业典礼',
  },
  {
    id: '42',
    label: '谢师宴',
  },
  {
    id: '43',
    label: '金榜题名',
  },
  {
    id: '51',
    label: '同学会',
  },
  {
    id: '52',
    label: '乔迁宴',
  },
  {
    id: '53',
    label: '会销',
  },
];
export default {
  name: 'giftPriceCustom',
  components: {
    MainCard,
    SubPage,
    CardTopInfo,
  },
  data() {
    return {
      sceneList: SCENE,
      activeSceneId: '0',
      giftListClassic: [],
      giftListGorgeous: [],
      giftListCarnival: [],
      danmu: [],
      bapin: [],
      photo: [],
      superDanmu: [],
    };
  },
  methods: {
    handleBlur(e) {
      console.log(e);
      eidtCustomGift({
        id: e.id,
        giftprice: e.price,
        giftname: e.name,
        order_by: e.orderBy || '',
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: '修改成功',
            type: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSceneSelectChange() {
      this.getCustomGiftListBySceneType();
    },
    getCustomGiftListBySceneType() {
      this.giftListClassic.splice(0);
      this.giftListGorgeous.splice(0);
      this.giftListCarnival.splice(0);
      this.danmu.splice(0);
      this.bapin.splice(0);
      this.photo.splice(0);
      this.superDanmu.splice(0);
      getCustomGiftList({
        scenario: this.activeSceneId,
      })
        .then((res) => {
          console.log(res);
          this.giftListClassic = res.data.list1.map((item) => {
            return {
              id: item.id,
              img: item.imglink,
              name: item.giftname,
              price: item.giftprice,
              orderBy: item.order_by,
            };
          });
          this.giftListGorgeous = res.data.list5.map((item) => {
            return {
              id: item.id,
              img: item.imglink,
              name: item.giftname,
              price: item.giftprice,
              orderBy: item.order_by,
            };
          });
          this.giftListCarnival = res.data.list6.map((item) => {
            return {
              id: item.id,
              img: item.imglink,
              name: item.giftname,
              price: item.giftprice,
              orderBy: item.order_by,
            };
          });
          this.danmu = res.data.list2.map((item) => {
            return {
              id: item.id,
              name: item.giftname,
              price: item.giftprice,
            };
          });
          this.bapin = res.data.list3.map((item) => {
            return {
              id: item.id,
              name: item.giftname,
              price: item.giftprice,
            };
          });
          this.photo = res.data.list4.map((item) => {
            return {
              id: item.id,
              name: item.giftname,
              price: item.giftprice,
            };
          });
          this.superDanmu = res.data.list667.map((item) => {
            return {
              id: item.id,
              name: item.giftname,
              price: item.giftprice,
            };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getCustomGiftListBySceneType();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.formBox {
  padding: 40px;
  .formItem {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .key {
      color: rgba(24, 17, 17, 0.85);
      font-size: 18px;
      font-weight: 600;
      margin-right: 20px;
    }
    &.spec {
      display: block;
      .key {
        margin-bottom: 40px;
      }
    }
    .gitListWrap {
      display: flex;
      flex-wrap: wrap;
      .giftListItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
        margin-right: 38px;
        .giftImg {
          width: 80px;
        }
        .iptItem {
          display: flex;
          align-items: center;
          .key {
            color: #262626;
            font-size: 13px;
            margin-right: 20px;
            margin-bottom: unset;
          }
          .giftName {
            color: #262626;
            font-size: 13px;
            margin-top: 5px;
            width: 175px;
          }
          .giftPrice {
            color: #262626;
            font-size: 13px;
            margin-top: 5px;
            width: 175px;
          }
        }
      }
    }
  }
}
</style>
