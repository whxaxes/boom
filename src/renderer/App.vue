<template>
  <div id="app"
       :class="{
         'fullscreen': isFullScreen,
         'simple-mode': simpleMode
       }">
    <div class="title-bar"></div>
    <div class="fake-left-side"></div>
    <music-list class="left-side"></music-list>
    <music-player class="right-side"></music-player>
    <div class="dialog" v-if="showDialog">
      <div class="dialog-mask"
           @click="showDialog = false"></div>
      <div class="dialog-content">
        <div class="input">
          <input type="text"
                 v-model.trim="musicPath"
                 placeholder="Please input your music dir">
        </div>
        <button @click="confirm">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
  import fs from 'fs';
  import { ipcRenderer } from 'electron';
  import { mapState } from 'vuex';
  import {
      UPDATE_PATH,
      UPDATE_CONFIG,
      UPDATE_FULL_SCREEN,
  } from './store';
  import constant from 'constant';
  import MusicList from '~/components/MusicList';
  import MusicPlayer from '~/components/MusicPlayer';

  export default {
    name: 'boom',
    data() {
      return {
        showDialog: false,
        musicPath: '',
      };
    },
    components: {
      MusicList,
      MusicPlayer,
    },
    computed: {
      ...mapState([
        'sourceConfig',
        'simpleMode',
        'isFullScreen',
      ]),
    },
    watch: {
      showDialog(val) {
        if (val) {
          this.musicPath = this.sourceConfig[constant.MUSIC_PATH];
        }
      },
    },
    methods: {
      confirm() {
        if (!this.musicPath || !fs.existsSync(this.musicPath)) {
          return alert('music dir was not exist!');
        }

        this.showDialog = false;
        if (this.musicPath === this.sourceConfig[constant.MUSIC_PATH]) {
          return;
        }

        this.$store.commit(UPDATE_PATH, this.musicPath);
        this.$store.commit(UPDATE_CONFIG, {
          key: constant.MUSIC_PATH,
          value: this.musicPath,
        });
      },
    },
    mounted() {
      const musicPath = this.sourceConfig[constant.MUSIC_PATH];
      const dirNotExist = musicPath && fs.existsSync(musicPath);
      this.musicPath = musicPath || '';
      if (!musicPath || !dirNotExist) {
        this.showDialog = true;
      } else {
        this.$store.commit(UPDATE_PATH, this.musicPath);
      }

      ipcRenderer.on(constant.PREFERENCES, () => {
        this.showDialog = true;
      });

      ipcRenderer.on(constant.ENTER_FULL_SCREEN, () => {
        this.$store.commit(UPDATE_FULL_SCREEN, true);
      });

      ipcRenderer.on(constant.LEAVE_FULL_SCREEN, () => {
        this.$store.commit(UPDATE_FULL_SCREEN, false);
      });

      window.addEventListener('keyup', e => {
        if (e.keyCode === 27) {
          this.showDialog = false;
        }
      });
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @font-face {
    font-family: "iconfont";
    src: url('./assets/iconfont.woff') format('woff'),
    url('./assets/iconfont.ttf') format('truetype');
  }

  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .icon-simple:before {
    content: "\e600";
  }

  .icon-notificationfill:before {
    content: "\e66a";
  }

  .icon-notificationforbidfill:before {
    content: "\e6db";
  }

  .icon-backwardfill:before {
    content: "\e74d";
  }

  .icon-playfill:before {
    content: "\e74f";
  }

  .icon-stop:before {
    content: "\e750";
  }

  .icon-play_forward_fill:before {
    content: "\e7f5";
  }

  .icon-repeat:before {
    content: "\e6d7";
  }

  * {
    margin: 0;
    padding: 0;
  }

  .title-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    z-index: 999;
    -webkit-app-region: drag;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  #app {
    position: absolute;
    background-color: #000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  $leftWidth: 200px;
  .left-side,
  .fake-left-side {
    position: absolute;
    width: $leftWidth;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(255, 255, 255, .1);
    z-index: 2;
    transition: transform .3s;
  }

  // use to show left-side in simple-mode
  .fake-left-side {
    pointer-events: none;
    background-color: transparent;
  }

  .right-side {
    margin-left: $leftWidth;
    height: 100%;
    transition: transform .3s;
  }

  .simple-mode {
    .left-side {
      transform: translateX(-$leftWidth);

      &:hover {
        transform: translateX(0);
      }
    }

    .fake-left-side {
      pointer-events: auto;

      &:hover + .left-side {
        transition: transform .3s .3s;
        transform: translateX(0);
      }
    }

    .right-side {
      transform: translateX(-$leftWidth/2);
    }
  }

  .dialog {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 100;

    .dialog-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #000;
      opacity: .7;
    }

    .dialog-content {
      position: absolute;
      width: 500px;
      height: 140px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      background-color: #eee;
    }

    .input {
      display: block;
      margin: 20px;
      height: 40px;

      input {
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: #666;
        border: 1px solid #ddd;
        box-sizing: border-box;
        text-align: center;
        outline: none;
      }
    }

    button {
      display: block;
      width: $leftWidth;
      height: 40px;
      margin: auto;
      border: 1px solid #ddd;
      background-color: #fff;
      border-radius: 4px;

      &:hover {
        background-color: #eee;
      }
    }
  }
</style>
