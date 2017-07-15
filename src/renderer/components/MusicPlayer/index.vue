<template>
  <div class="music-player">
    <canvas ref="canvas"></canvas>
    <audio ref="audio"
           preload
           :src="url"
           crossorigin="anonymous"></audio>
    <div class="controll">
      <div class="audio-state">
        <div class="music-name">{{ name }}</div>
        <div class="btn">
          <i class="iconfont icon-backwardfill"
             @click="prev"></i>
        </div>
        <div class="btn play-button">
          <i class="iconfont"
             :class="{
              'icon-playfill': !audioStatus.playing,
              'icon-stop': audioStatus.playing 
              }"
             @click="play"></i>
        </div>
        <div class="btn">
          <i class="iconfont icon-play_forward_fill"
             @click="next"></i>
        </div>
        <div class="progress"
             @click="changeTime">
          <div class="progress-bar"
               :style="progress"></div>
        </div>
        <div class="btn mute-button">
          <i class="iconfont"
             @click="mute"
             :class="{
              'icon-notificationforbidfill': audioStatus.muted,
              'icon-notificationfill': !audioStatus.muted,
              }"></i>
        </div>
        <div class="btn loop-button">
          <i class="iconfont icon-repeat"
             @click="loop"></i>
          <span class="single-symbol"
                v-if="audioStatus.loop === loopTypes.single">1
          </span>
          <i class="iconfont icon-heart"
             v-if="audioStatus.loop === loopTypes.like"></i>
        </div>
        <div class="btn simple-button">
          <i class="iconfont icon-simple"
             @click="simple"
             :class="{ active: simpleMode }"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" rel="stylesheet/scss">
  @import "./index.scss";
</style>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>
