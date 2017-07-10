import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import Vuex from 'vuex';
import promisify from 'es6-promisify';
import { ipcRenderer } from 'electron';
import constant from 'constant';

const AC = new window.AudioContext();
const readFile = promisify(fs.readFile);

Vue.use(Vuex);
export const SELECT_MUSIC = 'selectMusic';
export const DECODE_MUSIC = 'decodeMusic';
export const UPDATE_PATH = 'updatePath';
export const UPDATE_MUSIC = 'updateMusic';
export const UPDATE_CONFIG = 'updateConfig';
export const UPDATE_SIMPLE_MODE = 'updateSimpleMode';
export const UPDATE_FULL_SCREEN = 'updateFullScreen';
export const initStore = config => {
  return new Vuex.Store({
    state: {
      selectIndex: null,
      currentId: null,
      musicList: [],
      playStyle: 'column',
      sourceConfig: config,
      simpleMode: false,
      isFullScreen: false,
    },
    mutations: {
      [SELECT_MUSIC](state, id) {
        state.currentId = id;
      },

      [UPDATE_PATH](state, newPath) {
        if (!fs.existsSync(newPath)) {
          return false;
        }

        const config = state.sourceConfig;
        state.musicPath = newPath;
        state.musicList = fs.readdirSync(newPath).filter(f => (
          config.allowKeys.indexOf(path.extname(f)) >= 0
        )).map(f => ({
          id: f,
          url: `http://127.0.0.1:${config.port}/${f}`,
          name: path.basename(f, path.extname(f)),
        }));
      },

      [UPDATE_MUSIC](state, music) {
        state.musicList = state.musicList.concat(music);
      },

      [UPDATE_CONFIG](state, { key, value }) {
        state.sourceConfig[key] = value;
        ipcRenderer.send(constant.SAVE_CONFIG, { key, value });
      },

      [UPDATE_SIMPLE_MODE](state, mode) {
        state.simpleMode = mode;
      },

      [UPDATE_FULL_SCREEN](state, isFullScreen) {
        state.isFullScreen = isFullScreen;
        state.simpleMode = isFullScreen;
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
};
