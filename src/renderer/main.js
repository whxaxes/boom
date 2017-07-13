import Vue from 'vue';
import App from './App.vue';
import constant from 'constant';
import { ipcRenderer } from 'electron';
import { initStore } from './store';

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}

Vue.config.productionTip = false;

// sync music list from main process
ipcRenderer.send(constant.VIEW_READY);
ipcRenderer.on(constant.INIT_CONFIG, (event, config) => {
  new Vue({
    el: '#app',
    store: initStore(config),
    render(h) {
      return h(App);
    },
  });
});
