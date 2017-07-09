<template>
  <div id="app">
    <music-list class="left-side"></music-list>
    <music-player class="right-side"></music-player>
  </div>
</template>

<script>
  import MusicList from '~/components/MusicList';
  import MusicPlayer from '~/components/MusicPlayer';

  export default {
    name: 'boom',
    components: {
      MusicList,
      MusicPlayer,
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  * {
    margin: 0;
    padding: 0;
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

  .left-side {
    position: absolute;
    width: 200px;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    box-sizing: border-box;
    border-top: 16px solid transparent;
    background-color: rgba(255, 255, 255, .1);
    z-index: 2;
  }

  .right-side {
    margin-left: 200px;
    height: 100%;
  }
</style>
