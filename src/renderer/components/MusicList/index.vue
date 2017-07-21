<template>
  <div class="music-list">
    <div class="music-control">
      <!-- <i class="iconfont icon-directory"></i> -->
      <!-- <i class="iconfont icon-plus"></i> -->
    </div>
    <div class="music-scroller"
         ref="musicScroller"
         @wheel.passive="clearScrollAnimate">
      <div class="music-item"
           :title="item.name"
           ref="musicItem"
           v-for="item in musicList"
           :key="item.id"
           :class="{ playing: currentId === item.id }"
           @click="select(item.id)">
        <div class="music-name">
          <i class="iconfont icon-heart"
             @click.stop="like(item.id, !item.liked)"
             :class="{ active: item.liked }"></i>
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import vm from './vm';
  export default vm;
</script>

<style lang="scss" rel="stylesheet/scss">
  $topSize: 50px;
  .music-list {
    height: 100%;
    overflow: hidden;
  }

  .music-control {
    position: absolute;
    width: 100%;
    height: $topSize;
    color: #fff;
    text-align: right;
    box-sizing: border-box;
    padding: 30px 5px 0 30px;
  
    .iconfont {
      float: right;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  
    .icon-plus {
      font-size: 20px;
    }
  
    .icon-directory {
      font-size: 14px;
      opacity: .3;
    }
  
    .active {
      opacity: 1;
    }
  }
  
  .fullscreen {
    .music-scroller {
      transform: translateY(0);
      border-bottom: 0;
    }
  }
  
  .music-scroller {
    width: 100%;
    height: 100%;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform .3s;
    transform: translateY($topSize);
    border-bottom: $topSize solid transparent;
  }
  
  .music-item {
    position: relative;
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-right: 20px;
    font-size: 12px;
    cursor: pointer;
    color: rgba(255, 255, 255, .4);
    -webkit-transition: background-color .3s, padding .3s;
    transition: background-color .3s, padding .3s;
  
    &:nth-child(2n) {
      background-color: rgba(0, 0, 0, .2);
    }
  
    &:hover {
      padding-left: 5px;
      color: #fff;
    }
  
    &.playing {
      color: #fff;
      background-color: rgba(0, 0, 0, .8);
    }
  }
  
  .music-name {
    position: relative;
    text-indent: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  
    .icon-heart {
      display: inline-block;
      opacity: .5;
      font-size: 14px;
      width: 34px;
      height: 100%;
      color: rgba(255, 255, 255, .4);
  
      &.active {
        color: #f00;
      }
    }
  }
</style>
