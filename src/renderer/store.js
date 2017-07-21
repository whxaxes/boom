import fs from 'fs';
import path from 'path';
import Vue from 'vue';
import Vuex from 'vuex';
import promisify from 'es6-promisify';
import { ipcRenderer, remote } from 'electron';
import constant from 'constant';
import utils from '~utils';
import defaultConfig from '~/lib/default';
import styles from '~/lib/styles';

const AC = new window.AudioContext();
const readFile = promisify(fs.readFile);
const isFullScreen = remote.getCurrentWindow().isFullScreen();
const posterCache = {};

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
export const UPDATE_PLAY_STYLE = 'updatePlayStyle';
export const UPDATE_POSTER_URL = 'updatePosterUrl';

// actions
export const UPDATE_PATH_ACT = 'updatePathAction';
export const LIKE_MUSIC_ACT = 'likeMusicAction';
export const SELECT_MUSIC_ACT = 'selectMusicAction';
export const UPDATE_PLAY_STYLE_ACT = 'updatePlayStyleAction';
export const UPDATE_POSTER_URL_ACT = 'updatePosterUrlAction';

// init store
export const initStore = config => {
  let watcher;
  const store = new Vuex.Store({
    state: {
      currentId: config[constant.CURRENT_ID],
      version: remote.app.getVersion(),
      musicList: [],
      musicPath: '',
      playStyle: '',
      sourceConfig: config,
      simpleMode: isFullScreen,
      isFullScreen,
    },
    getters: {
      music(state) {
        const id = state.currentId;
        return state.musicList.find(item => item.id === id) || {};
      },

      musicIndex(state) {
        const id = state.currentId;
        return state.musicList.findIndex(item => item.id === id);
      },
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

      [UPDATE_POSTER_URL](state, { music, url }) {
        music.posterUrl = url;
      },

      [UPDATE_PATH](state, newPath) {
        if (!fs.existsSync(newPath)) {
          return;
        }

        state.musicPath = newPath;
      },

      [UPDATE_MUSIC_LIST](state) {
        const config = state.sourceConfig;
        const likedList = config[constant.LIKED_LIST] || [];
        state.musicList = utils
          .readDirSync(state.musicPath)
          .filter(f => config.allowKeys.indexOf(path.extname(f)) >= 0)
          .map(f => ({
            id: f,
            url: `http://127.0.0.1:${config.port}/${path
              .relative(state.musicPath, f)
              .replace(/\\/g, '/')}`,
            realPath: f,
            name: path.basename(f, path.extname(f)),
            liked: likedList.indexOf(f) >= 0,
            posterUrl: posterCache[f],
          }));
      },

      [UPDATE_CONFIG](state, { key, value }) {
        state.sourceConfig[key] = value;
        ipcRenderer.send(constant.SAVE_CONFIG, { key, value });
      },

      [UPDATE_SIMPLE_MODE](state, mode) {
        state.simpleMode = mode;
      },

      [UPDATE_PLAY_STYLE](state, style) {
        state.playStyle = style;
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

      [SELECT_MUSIC_ACT]({ state, commit, dispatch }, arg) {
        commit(SELECT_MUSIC, arg);
        commit(UPDATE_CONFIG, {
          key: constant.CURRENT_ID,
          value: state.currentId,
        });
        dispatch(UPDATE_POSTER_URL_ACT);
      },

      [UPDATE_POSTER_URL_ACT]({ commit, getters }) {
        const music = getters.music;
        if (music.posterUrl !== undefined && music.posterUrl !== null) {
          return;
        }

        utils.getPicture(music.realPath, (e, url) => {
          posterCache[music.id] = url;
          commit(UPDATE_POSTER_URL, {
            music,
            url,
          });
        });
      },

      [UPDATE_PLAY_STYLE_ACT]({ state, commit }, arg) {
        commit(UPDATE_PLAY_STYLE, arg);
        commit(UPDATE_CONFIG, {
          key: constant.PLAY_STYLE,
          value: state.playStyle,
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

  store.dispatch(
    UPDATE_PATH_ACT,
    config[constant.MUSIC_PATH] || defaultConfig.musicPath
  );
  store.dispatch(
    UPDATE_PLAY_STYLE_ACT,
    config[constant.PLAY_STYLE] || defaultConfig.playStyle
  );
  store.dispatch(UPDATE_POSTER_URL_ACT);
  return store;
};
