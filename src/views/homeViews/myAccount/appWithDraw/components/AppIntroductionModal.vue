<template>
  <div class="op" v-if="show">
    <div class="mask"></div>
    <transition name="slide">
      <dianfengsai @close="closeModal"></dianfengsai>
    </transition>
  </div>
</template>

<script>
import { reqHasAddQyWeixin } from '@/api/login';
import dianfengsai from './dianfengsai.vue';

const newAppShowKeys = [
  'modal-20240712',
  'modal-20240713',
  'modal-20240714',
  'modal-20240715',
  'modal-20240716',
  'modal-20240717',
  'modal-20240718',
  'modal-20240719',
  'modal-20240720',
  'modal-20240721',
  'modal-20240722',
  'modal-20240723',
  'modal-20240724',
  'modal-20240725',
  'modal-20240726',
  'modal-20240727',
  'modal-20240728',
  'modal-20240729',
  'modal-20240730',
  'modal-20240731',
  'modal-20240801',
  'modal-20240802',
  'modal-20240803',
  'modal-20240804',
  'modal-20240805',
  'modal-20240806',
  'modal-20240807',
  'modal-20240808',
  'modal-20240809',
  'modal-20240810',
  'modal-20240811',
  'modal-20240812',
  'modal-20240813',
  'modal-20240814',
  'modal-20240815',
  'modal-20240816',
  'modal-20240817',
  'modal-20240818',
  'modal-20240819',
  'modal-20240820',
  'modal-20240821',
  'modal-20240822',
  'modal-20240823',
  'modal-20240824',
  'modal-20240825',
  'modal-20240826',
  'modal-20240827',
  'modal-20240828',
  'modal-20240829',
  'modal-20240830',
  'modal-20240831',
  'modal-20240901',
  'modal-20240902',
  'modal-20240903',
  'modal-20240904',
  'modal-20240905',
  'modal-20240906',
  'modal-20240907',
  'modal-20240908',
  'modal-20240909',
  'modal-20240910',
  'modal-20240911',
  'modal-20240912',
  'modal-20240913',
  'modal-20240914',
  'modal-20240915',
  'modal-20240916',
  'modal-20240917',
  'modal-20240918',
  'modal-20240919',
  'modal-20240920',
  'modal-20240921',
  'modal-20240922',
  'modal-20240923',
  'modal-20240924',
  'modal-20240925',
  'modal-20240926',
  'modal-20240927',
  'modal-20240928',
  'modal-20240929',
];

export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    dianfengsai,
  },
  computed: {},
  watch: {},

  mounted() {
    this.initModal();
  },
  methods: {
    async initModal() {
      const today = this.getCurrentDateString();
      console.log('today', today);
      const modalKey = `modal-${today}`;
      // 不在目标日期范围内，清除缓存
      if (!newAppShowKeys.includes(modalKey)) {
        localStorage.removeItem('lastShow');
        return;
      }
      const joinRes = await reqHasAddQyWeixin();
      // 获取localStorage中的modalKey的值,判断是否弹窗了
      const modalValue = localStorage.getItem('lastShow');
      if (modalValue !== modalKey && !joinRes.data) {
        this.show = true;
        localStorage.setItem('lastShow', modalKey);
      }
    },
    closeModal() {
      this.show = false;
    },
    // 获取当前年月日字符串(如20230603)
    getCurrentDateString() {
      const today = new Date(); // 获取当前日期和时间
      const dd = String(today.getDate()).padStart(2, '0'); // 获取日，并补零
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // 获取月，并补零，注意月份是从0开始的
      const yyyy = today.getFullYear(); // 获取年
      return `${yyyy}${mm}${dd}`;
    },
  },
};
</script>

<style lang="less" scoped>
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(0, 100%, 0);
  }
}
.op {
  width: 100vw;
  min-height: 100vh;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    width: 100vw;
    min-height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.6);
    overflow-y: scroll;
    top: 0;
    left: 0;
  }
}
</style>
