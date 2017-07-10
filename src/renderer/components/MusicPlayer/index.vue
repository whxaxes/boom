<template>
  <div class="music-player">
    <canvas ref="canvas"></canvas>
    <audio ref="audio"
           :src="url"
           crossorigin="anonymous"></audio>
    <div class="controll">
      <div class="audio-state">
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
        <div class="progress">
          <div class="progress-bar"
               :style="progress"></div>
        </div>
        <div class="btn mute-button">
          <i class="iconfont"
             @click="mute"
             :class="{
              'icon-notificationforbidfill': audioStatus.muted,
              'icon-notificationfill': !audioStatus.muted,
             }"
          ></i>
        </div>
        <div class="btn loop-button">
          <i class="iconfont icon-repeat"
             @click="loop"
             :class="{ active: audioStatus.loop }"></i>
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

    .progress {
      width: 200px;
      height: 3px;
      float: left;
      margin: 0 10px;
      background-color: #000;

      .progress-bar {
        width: 0;
        height: 100%;
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

    .loop-button,
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
