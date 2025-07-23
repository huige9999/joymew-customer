const state = {
  cachedTags: [], // 缓存的标签
  user: {},
  caches: [],
};

const getters = {};

const mutations = {
  changeCachedTag(state, view) {
    if (state.cachedTags.some((v) => v.path === view.path)) return;
    state.cachedTags.push({ ...view, title: view.title || 'no-name' });
    if (view.parent) {
      state.caches.push(view.parent);
    }
    state.caches.push(view.cpnName);
  },
  delCachedTag(state, view) {
    let target = -1;
    let delName = '';
    state.cachedTags.forEach((tag, index) => {
      if (tag.name === view) {
        target = index;
        delName = tag.cpnName;
      }
    });
    let target2 = -1;
    state.caches.forEach((tag, index) => {
      if (tag === delName) {
        target2 = index;
      }
    });
    if (target > -1) {
      state.cachedTags.splice(target, 1);
    }
    if (target2 > -1) {
      state.caches.splice(target2, 1);
    }
  },
  delAllTag(state) {
    state.cachedTags = [];
    state.caches = [];
  },
  changeUserInfo(state, payload) {
    state.user = JSON.parse(JSON.stringify(payload));
  },
};

const actions = {
  addCachedTag({ commit }, view) {
    commit('changeCachedTag', view);
  },
  removeCachedTag({ commit }, name) {
    commit('delCachedTag', name);
  },
  removeAllTag({ commit }) {
    commit('delAllTag');
  },
  changeUserInfo({ commit }, payload) {
    console.log('用户数据：', payload);
    commit('changeUserInfo', payload);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
