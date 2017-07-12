<template>
  <div class="music-list">
    <div class="music-scroller">
      <div class="music-item"
           v-for="item in musicList"
           :class="{ playing: currentId === item.id }"
           @click="select(item.id)">
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
        'currentId',
        'musicList',
      ]),
    },
    methods: {
      select(id) {
        this.$store.commit(SELECT_MUSIC, id);
      },
    },
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .music-list {
    height: 100%;
    overflow: hidden;
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
    transform: translateY(30px);
    border-bottom: 30px solid transparent;
  }

  .music-item {
    display: block;
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-right: 20px;
    text-indent: 10px;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
</style>
