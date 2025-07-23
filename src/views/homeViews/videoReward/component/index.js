import Vue from 'vue';
import popup from './popup.vue';

export default function use() {
  const c = new (Vue.extend(popup))({ propsData: {} });
  c.$mount();
  document.body.appendChild(c.$el);
}
