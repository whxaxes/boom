import fs from 'fs';
import Vue from 'vue';
import Vuex from 'vuex';
import promisify from 'es6-promisify';
import { ipcRenderer } from 'electron';

const AC = new window.AudioContext();
const readFile = promisify(fs.readFile);

Vue.use(Vuex);
export const SELECT_MUSIC = 'selectMusic';
export const DECODE_MUSIC = 'decodeMusic';
const UPDATE_MUSIC = 'updateMusic';
export const store = new Vuex.Store({
  state: {
    selectIndex: null,
    musicList: [],
    playStyle: 'column',
  },
  mutations: {
    [SELECT_MUSIC](state, index) {
      const len = state.musicList.length;
      if (!len) {
        return;
      }

      if (index < 0) {
        index = len - 1;
      } else if (index > len) {
        index = 0;
      }

      state.selectIndex = index;
    },

    [UPDATE_MUSIC](state, music) {
      state.musicList = state.musicList.concat(music);
    },
  },
  actions: {
    // decode music which is local file( file://xxx )
    [DECODE_MUSIC]({ state }, index) {
      let uint8Buffer;
      const music = state.musicList[index];
      return readFile(music.url.replace(/^file:\//, ''))
        .then(buf => {
          uint8Buffer = Uint8Array.from(buf);
          return AC.decodeAudioData(uint8Buffer.buffer);
        })
        .then(audioBuffer => {
          return Promise.resolve({ index, uint8Buffer, audioBuffer });
        })
        .catch(e => {
          console.log(`decode error：${e.message}`);
        });
    },
  },
});

// sync music list from main process
ipcRenderer.send('get-music-list');
ipcRenderer.on('sync-music-list', (event, arg) => {
  store.commit(UPDATE_MUSIC, arg);
});
