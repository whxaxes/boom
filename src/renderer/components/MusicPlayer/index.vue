<template>
  <div class="music-player">
    <canvas ref="canvas"></canvas>
    <audio ref="audio"
           :src="url"
           crossorigin="anonymous"></audio>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss">
  canvas {
    width: 100%;
    height: 100%;
  }
</style>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>
