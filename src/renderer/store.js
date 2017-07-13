import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import Vuex from 'vuex';
import promisify from 'es6-promisify';
import { ipcRenderer, remote } from 'electron';
import constant from 'constant';
import utils from '~utils';

const AC = new window.AudioContext();
const readFile = promisify(fs.readFile);
const isFullScreen = remote.getCurrentWindow().isFullScreen();

Vue.use(Vuex);

// mutations
export const SELECT_MUSIC = 'selectMusic';
export const LIKE_MUSIC = 'likeMusic';
export const DECODE_MUSIC = 'decodeMusic';
export const UPDATE_PATH = 'updatePath';
export const UPDATE_CONFIG = 'updateConfig';
export const UPDATE_SIMPLE_MODE = 'updateSimpleMode';
export const UPDATE_FULL_SCREEN = 'updateFullScreen';
export const UPDATE_MUSIC_LIST = 'updateMusicList';

// actions
export const UPDATE_PATH_ACT = 'updatePathAction';
export const LIKE_MUSIC_ACT = 'likeMusicAction';
export const SELECT_MUSIC_ACT = 'selectMusicAction';

// init store
export const initStore = config => {
  let watcher;
  const store = new Vuex.Store({
    state: {
      currentId: config[constant.CURRENT_ID],
      musicList: [],
      playStyle: 'column',
      sourceConfig: config,
      simpleMode: isFullScreen,
      isFullScreen,
    },
    mutations: {
      [SELECT_MUSIC](state, id) {
        state.currentId = id;
      },

      [LIKE_MUSIC](state, { id, liked }) {
        const music = state.musicList.find(item => item.id === id);
        if (music) {
          music.liked = liked;
        }
      },

      [UPDATE_PATH](state, newPath) {
        if (!fs.existsSync(newPath)) {
          return;
        }

        state.musicPath = newPath;
      },

      [UPDATE_MUSIC_LIST](state) {
        const config = state.sourceConfig;
        const likedList = state.sourceConfig[constant.LIKED_LIST] || [];
        state.musicList = utils.readDirSync(state.musicPath)
          .filter(f => (
            config.allowKeys.indexOf(path.extname(f)) >= 0
          )).map(f => ({
            id: f,
            url: `http://127.0.0.1:${config.port}/${path.relative(state.musicPath, f).replace(/\\/g, '/')}`,
            name: path.basename(f, path.extname(f)),
            liked: likedList.indexOf(f) >= 0,
          }));
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

      [UPDATE_PATH_ACT]({ state, commit }, filePath) {
        commit(UPDATE_PATH, filePath);
        if (state.musicPath !== filePath) {
          return;
        }

        if (watcher) {
          watcher.close();
        }

        commit(UPDATE_CONFIG, { key: constant.MUSIC_PATH, value: filePath });
        commit(UPDATE_MUSIC_LIST);

        // if watcher already exist, close it.
        // make sure there is only one watcher
        if (watcher) {
          watcher.close();
        }

        // watch and update file list
        watcher = utils.watch(filePath, () => {
          commit(UPDATE_MUSIC_LIST);
        });
      },

      [SELECT_MUSIC_ACT]({ state, commit }, arg) {
        commit(SELECT_MUSIC, arg);
        commit(UPDATE_CONFIG, {
          key: constant.CURRENT_ID,
          value: state.currentId,
        });
      },

      [LIKE_MUSIC_ACT]({ state, commit }, arg) {
        commit(LIKE_MUSIC, arg);

        // update liked list
        commit(UPDATE_CONFIG, {
          key: constant.LIKED_LIST,
          value: state.musicList
            .filter(item => item.liked)
            .map(item => item.id),
        });
      },
    },
  });

  return store;
};
