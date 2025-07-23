import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import App from './App';
import './plugins/element';
import router from './router';
import store from './store';

Vue.use(vuescroll);
Vue.use(VueClipboard);
Vue.config.productionTip = false;

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

export default app;
