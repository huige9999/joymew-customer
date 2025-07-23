import login from '@/store/modules/login';
import menu from '@/store/modules/menu';
import partner from '@/store/modules/partner';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import { saveGuideToLocalStorage, judgeGuideInLocalStorage, judgeNeedGuideInLocalStorageAll, timeoutTask } from '@/utils/index';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    liveId: '',
    sceneType: '0',
    isTemplate: false,
  },
  mutations: {
    initLiveInfo(state, data) {
      state.liveId = data.liveId || state.liveId;
      state.sceneType = data.sceneType || state.sceneType;
      if (typeof data.isTemplate === 'boolean') {
        state.isTemplate = data.isTemplate;
      }
    },
  },
  modules: {
    login,
    menu,
    partner,
  },
  actions: {},
  plugins: [createPersistedState()], // vuex 持久化存储
});

export default store;
