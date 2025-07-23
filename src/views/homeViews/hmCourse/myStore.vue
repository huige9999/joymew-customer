<template>
  <sub-page>
    <main-card>
      <div class="myStore">
        <div class="noti">
          嗨喵知识付费平台将根据《中华人民共和国电子商务法》要求，收集入驻商家信息，请选择您的店铺信息并准备相应认证材料：
        </div>
        <card-top-info title="主题类型"> </card-top-info>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="个人" name="first"> </el-tab-pane>
          <el-tab-pane label="个体工商户" name="second"> </el-tab-pane>
          <el-tab-pane label="企业" name="third"> </el-tab-pane>
          <el-tab-pane label="党政、机关及事业单位" name="fourth"> </el-tab-pane>
          <el-tab-pane label="其他组织" name="fifth"> </el-tab-pane>
        </el-tabs>
        <div class="info">
          可参考营业执照中的“类型”： [企业] 在营业执照上一般为：有限公司、有限责任公司等； [个体工商户] <br />
          <br />
          在营业执照上一般为：个体户、个体工商户、个体经营； [党政、机关及事业单位] <br />
          <br />
          在营业执照上一般为：国内各类政府、事业单位，如公安、市政、党团等； [其他组织] <br />
          <br />
          一般为：社会团体、民办非企业、农民专业合作社、基金会等； [个人] 为根据法律法规和相关规定免于办理工商登记，无营业执照的商家。
          <br />
          <br />
        </div>
        <card-top-info title="所需材料"> </card-top-info>
        <div class="needInfo">
          1、证明店铺归属人的材料：法人手持证件照、法人身份证正反面照片； <br /><br />

          2、提供真实合法的经营信息：营业执照，如有线下门店则需提供店铺门头，店铺内景，收银台照片；<br /><br />

          3、照片规则：照片需四角完整，清晰可辨，若加水印需保证照片重要信息清晰可辨；可提交复印件，每张复印件均需加盖完整红色公章；<br /><br />

          <!-- 4、如有涉及实物售卖则需要提供相关经营类目的资质，详情请看《商品类目资质须知》，请事先检查是否包含自己店铺主体可售卖的实物范围。<br><br> -->
        </div>

        <el-button class="btn" type="primary" @click="noti">开始认证</el-button>
      </div>
    </main-card>
  </sub-page>
</template>

<script>
import SubPage from '@/components/subPage';
import MainCard from '@/components/mainCard';
import CardTopInfo from '@/components/cardTopInfo';

export default {
  components: {
    SubPage,
    MainCard,
    CardTopInfo,
  },
  data() {
    return {
      activeName: '',
    };
  },
  methods: {
    handleClick() {},
    noti() {
      this.$message('您的等级尚未达到导师级别');
    },
  },
};
</script>

<style lang="less" scoped>
.myStore {
  padding: 20px;
  .noti {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #353535;
    line-height: 28px;
  }
}
.needInfo {
  padding: 20px;
}
</style>
