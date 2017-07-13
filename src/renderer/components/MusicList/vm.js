import { SELECT_MUSIC_ACT, LIKE_MUSIC_ACT } from '~/store';
import { mapState } from 'vuex';
import stage from '~/lib/stage';

export default {
  name: 'music-list',
  data() {
    return {
      scrollTo: null,
    };
  },
  computed: {
    ...mapState([
      'currentId',
      'musicList',
    ]),
  },
  watch: {
    currentId() {
      this.updatePosition();
    },
  },
  methods: {
    updatePosition(isMiddle, rightNow) {
      const index = this.musicList.findIndex(item => item.id === this.currentId);
      if (index < 0) {
        return;
      }

      const rect = this.$refs.musicItem[index].getBoundingClientRect();
      const scroller = this.$refs.musicScroller;
      const srect = scroller.getBoundingClientRect();
      const sheight = scroller.clientHeight - 30;
      const topDis = rect.top - srect.top;
      let scrollTo = null;

      if (isMiddle) {
        // move to middle position
        scrollTo = scroller.scrollTop + topDis - (sheight - rect.height) / 2;
      } else {
        // auto calculate visible position
        const min = rect.height * 2;
        const max = sheight - rect.height * 3;
        if (topDis < min) {
          scrollTo = scroller.scrollTop + topDis - min;
        } else if (topDis > max) {
          scrollTo = scroller.scrollTop + topDis - max;
        }
      }

      if (scrollTo === null) {
        return;
      }

      if (rightNow) {
        scroller.scrollTop = scrollTo;
      } else {
        this.scrollTo = scrollTo;
      }
    },

    animate() {
      const scroller = this.$refs.musicScroller;
      // stop animation while scrollTo was null,
      // or scrollTop never change (it means the scroller has scrolled to the top or the end)
      if (this.scrollTo === null || this.oldScrollTop === scroller.scrollTop) {
        this.clearScrollAnimate();
        return;
      }

      const dis = this.scrollTo - scroller.scrollTop;
      this.oldScrollTop = scroller.scrollTop;
      if (Math.abs(dis) < 10) {
        scroller.scrollTop = this.scrollTo;
        this.scrollTo = null;
      } else {
        scroller.scrollTop += dis * 0.2;
      }
    },

    select(id) {
      this.$store.dispatch(SELECT_MUSIC_ACT, id);
    },

    like(id, liked) {
      this.$store.dispatch(LIKE_MUSIC_ACT, { id, liked });
    },

    clearScrollAnimate() {
      this.scrollTo = null;
      this.oldScrollTop = null;
    },
  },
  mounted() {
    stage.add(this);
    setTimeout(() => {
      this.updatePosition(true, true);
    });
  },
};
