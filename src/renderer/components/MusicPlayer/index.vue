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
  canvas {
    width: 100%;
    height: 100%;
  }
  
  .music-player {
    position: relative;
  }
  
  .controll {
    position: absolute;
    width: 100%;
    height: 220px;
    bottom: 0;
  
    &:hover .audio-state {
      opacity: 1;
    }
  }
  
  .simple-mode {
    .audio-state {
      opacity: 0;
    }
  }
  
  .audio-state {
    position: absolute;
    width: 440px;
    height: 50px;
    bottom: 40px;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, .1);
    display: flex;
    align-items: center;
    opacity: .6;
    transition: opacity .3s;
  
    .music-name {
      position: absolute;
      width: 100%;
      height: 30px;
      line-height: 30px;
      top: -30px;
      color: #666;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  
    .progress {
      position: relative;
      width: 200px;
      height: 10px;
      float: left;
      margin: 0 10px;
      cursor: pointer;
  
      &:before,
      .progress-bar {
        pointer-events: none;
        content: '';
        position: absolute;
        height: 3px;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        background-color: #000;
      }
  
      .progress-bar {
        width: 0;
        right: auto;
        background-color: #333;
      }
    }
  
    .iconfont {
      display: flex;
      font-size: 20px;
      color: #ccc;
      transition: color .3s;
    }
  
    .btn {
      width: 40px;
      height: 40px;
      float: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
  
      &:hover .iconfont {
        color: #fff;
      }
    }
  
    .play-button {
      border: 1px solid #000;
      border-radius: 100%;
      background-color: #000;
  
      .iconfont {
        font-size: 26px;
      }
  
      .icon-playfill {
        position: relative;
        left: 2px;
      }
    }
  
    .loop-button {
      position: relative;
  
      .single-symbol {
        color: #fff;
        font-size: 10px;
      }
  
      .icon-heart {
        font-size: 8px;
      }
    }
  
    .simple-button {
      .iconfont {
        opacity: .3;
      }
  
      .icon-simple {
        position: relative;
        top: -2px;
      }
  
      .active {
        opacity: 1;
      }
    }
  }
</style>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>
