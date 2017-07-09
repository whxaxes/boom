<template>
  <div class="music-list">
    <div class="music-scroller">
      <div class="music-item"
           v-for="item, index in musicList"
           :class="{ playing: selectIndex === index }"
           @click="select(index)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import { SELECT_MUSIC } from '~/store';
  import { mapState } from 'vuex';
  export default {
    name: 'music-list',
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'selectIndex',
        'musicList',
      ]),
    },
    methods: {
      select(index) {
        this.$store.commit(SELECT_MUSIC, index);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .music-list {
    height: 100%;
    overflow: hidden;
  }
  
  .music-scroller {
    width: 100%;
    height: 100%;
    padding-right: 20px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .music-item {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-right: 20px;
    text-indent: 10px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgba(255, 255, 255, .4);
    -webkit-transition: background-color .3s, padding .3s;
    transition: background-color .3s, padding .3s;

    &:hover {
      padding-left: 5px;
      color: #fff;
    }

    &.playing {
      color: #fff;
      background-color: #000;
    }
  }
</style>
