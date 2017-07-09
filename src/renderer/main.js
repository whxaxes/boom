import Vue from 'vue';
import App from './App';
import { remote } from 'electron';
import { store } from './store';

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  render(h) {
    return h(App);
  },
});
