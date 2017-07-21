<template>
  <div id="app"
       :class="{ 'fullscreen': isFullScreen, 'simple-mode': simpleMode }">
    <div class="poster"
         :style="{ backgroundImage: `url(${music.posterUrl})` }"></div>
    <div class="title-bar"></div>
    <div class="fake-left-side"></div>
    <music-list class="left-side"></music-list>
    <music-player class="right-side"></music-player>
    <preferences v-if="showPreference"
                 @close="showPreference = false"
                 class="config-side"></preferences>
  </div>
</template>

<script>
  import fs from 'fs';
  import { ipcRenderer, remote } from 'electron';
  import { mapState, mapGetters } from 'vuex';
  import {
    UPDATE_PATH_ACT,
    UPDATE_FULL_SCREEN,
  } from './store';
  import constant from 'constant';
  import MusicList from '~/components/MusicList';
  import MusicPlayer from '~/components/MusicPlayer';
  import Preferences from '~/components/Preferences';
  const win = remote.getCurrentWindow();

  export default {
    name: 'boom',
    data() {
      return {
        showDialog: false,
        musicPath: '',
        showPreference: false,
      };
    },
    components: {
      MusicList,
      MusicPlayer,
      Preferences,
    },
    computed: {
      ...mapState([
        'sourceConfig',
        'simpleMode',
        'isFullScreen',
      ]),
      ...mapGetters([
        'music',
      ]),
    },
    methods: {
      listen() {
        ipcRenderer.on(constant.PREFERENCES, () => {
          this.showPreference = true;
        });

        win.on('enter-full-screen', this.onFullScreen.bind(this, true));
        win.on('leave-full-screen', this.onFullScreen.bind(this, false));
      },

      onFullScreen(isFullscreen) {
        this.$store.commit(UPDATE_FULL_SCREEN, isFullscreen);
      },
    },
    mounted() {
      this.listen();
    },
    destroyed() {
      win.removeListener('enter-full-screen', this.onFullScreen.bind(this, true));
      win.removeListener('leave-full-screen', this.onFullScreen.bind(this, false));
      window.removeEventListener('keyup', this.onKeyUp.bind(this));
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import 'global';
  @import 'variable';
  
  .title-bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    z-index: 999;
    -webkit-app-region: drag;
  }
  
  #app {
    position: absolute;
    background-color: #000;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  
    .poster {
      position: absolute;
      width: 100%;
      height: 100%;
      background: no-repeat center center;
      background-size: cover;
      opacity: .08;
    }
  }
  
  .left-side,
  .fake-left-side {
    position: absolute;
    width: $menuWidth;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(255, 255, 255, .1);
    z-index: 2;
    transition: transform .3s;
  }
  
  .fake-left-side {
    // use to show left-side in simple-mode
    pointer-events: none;
    background-color: transparent;
  }
  
  .config-side {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, .9);
    z-index: 3;
  }
  
  .right-side {
    margin-left: $menuWidth;
    height: 100%;
    transition: transform .3s;
  }
  
  .simple-mode {
    .left-side {
      transform: translateX(-$menuWidth);
  
      &:hover {
        transform: translateX(0);
      }
    }
  
    .fake-left-side {
      pointer-events: auto;
  
      &:hover+.left-side {
        transition: transform .3s .3s;
        transform: translateX(0);
      }
    }
  
    .right-side {
      transform: translateX(-$menuWidth/2);
    }
  }
  
  .config-dialog {
    .input {
      display: block;
      margin-bottom: 20px;
      height: 40px;
  
      input {
        width: 100%;
        height: 100%;
        font-size: 18px;
        color: #ccc;
        border: none;
        box-sizing: border-box;
        text-align: center;
        outline: none;
        background-color: #444;
      }
    }
  
    button {
      display: block;
      width: 200px;
      height: 40px;
      margin: auto;
      font-size: 18px;
      color: #ccc;
      border: none;
      background-color: #444;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color .3s;
  
      &:hover {
        background-color: #666;
      }
    }
  }
</style>
