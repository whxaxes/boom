import { mapState, mapGetters } from 'vuex';
import { remote } from 'electron';
import {
  SELECT_MUSIC_ACT,
  UPDATE_SIMPLE_MODE,
  UPDATE_CONFIG,
  LIKE_MUSIC_ACT,
} from '~/store';
import styles from '~/lib/styles';
import stage from '~/lib/stage';
const win = remote.getCurrentWindow();
const AC = new window.AudioContext();
const analyser = AC.createAnalyser();
const gainnode = AC.createGain();
const loopTypes = { normal: 0, single: 1, like: 2 };
const loopCount = Object.keys(loopTypes).length;
gainnode.gain.value = 1;

export default {
  name: 'music-player',
  data() {
    return {
      audioSource: null,
      bufferSource: null,
      loopTypes,
      audioStatus: {
        currentTime: 0,
        duration: 0,
        playing: false,
        loop: loopTypes.like,
        muted: false,
      },
    };
  },
  computed: {
    ...mapState([
      'currentId',
      'musicList',
      'playStyle',
      'simpleMode',
      'sourceConfig',
    ]),

    ...mapGetters([ 'music', 'musicIndex' ]),

    progress() {
      const status = this.audioStatus;
      return {
        width: status.currentTime
          ? Math.ceil(status.currentTime / status.duration * 100) + '%'
          : '0',
      };
    },
  },
  watch: {
    currentId() {
      this.$nextTick(() => {
        this.$refs.audio.load();
        this.$refs.audio.play();
      });
    },

    playStyle(newValue, oldValue) {
      if (styles[oldValue].destroyed) {
        styles[oldValue].destroyed();
      }
      this.initCanvas();
    },
  },
  methods: {
    play() {
      if (!this.music.url) {
        return this.next();
      }

      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },

    // like music
    like() {
      this.$store.dispatch(LIKE_MUSIC_ACT, {
        id: this.currentId,
        liked: !this.music.liked,
      });
    },

    // next music
    next() {
      const index = this.musicIndex + 1;
      this.$store.dispatch(
        SELECT_MUSIC_ACT,
        this.musicList[index >= this.musicList.length ? 0 : index].id
      );
    },

    // next liked music
    nextLike() {
      const index = this.musicIndex;
      const len = this.musicList.length;
      let i = index;
      // found next liked music
      while (++i !== index) {
        if (this.musicList[(i = i >= len ? 0 : i)].liked) {
          break;
        }
      }

      if (i === index) {
        // replay music if can't found next liked music
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this.$store.dispatch(SELECT_MUSIC_ACT, this.musicList[i].id);
      }
    },

    // prev music
    prev() {
      const index = this.musicIndex - 1;
      this.$store.dispatch(
        SELECT_MUSIC_ACT,
        this.musicList[index < 0 ? this.musicList.length - 1 : index].id
      );
    },

    loop() {
      this.audioStatus.loop = (this.audioStatus.loop + 1) % loopCount;
      this.$refs.audio.loop = this.audioStatus.loop === loopTypes.single;
      this.$store.commit(UPDATE_CONFIG, {
        key: 'musicStatus.loop',
        value: this.audioStatus.loop,
      });
    },

    mute() {
      this.$refs.audio.muted = this.audioStatus.muted = !this.audioStatus.muted;
      this.$store.commit(UPDATE_CONFIG, {
        key: 'musicStatus.muted',
        value: this.audioStatus.muted,
      });
    },

    simple() {
      this.$store.commit(UPDATE_SIMPLE_MODE, !this.simpleMode);
    },

    // change play time
    changeTime(e) {
      if (!this.music.url) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const len = e.pageX - rect.left;
      const ratio = len / rect.width;
      this.$refs.audio.play();
      // use timeout to make sure audio has playing
      setTimeout(() => {
        this.$refs.audio.currentTime = ratio * this.audioStatus.duration;
      });
    },

    // executed in every animation frame
    animate() {
      const arrayLength = analyser.frequencyBinCount;
      // get frequency from analyser node
      // frequency value is 0 ~ 255
      const array = new Uint8Array(arrayLength);
      analyser.getByteFrequencyData(array);
      styles[this.playStyle].update(array);
    },

    initAudio() {
      // connect audio to the destination
      const audio = this.$refs.audio;
      const source = AC.createMediaElementSource(this.$refs.audio);
      source.connect(analyser);
      analyser.connect(gainnode);
      gainnode.connect(AC.destination);

      let endTimeout;
      const onEnd = () => {
        clearTimeout(endTimeout);
        if (this.audioStatus.loop === loopTypes.normal) {
          this.next();
        } else if (this.audioStatus.loop === loopTypes.like) {
          this.nextLike();
        }
      };

      audio.onended = () => {
        onEnd();
      };

      audio.ontimeupdate = () => {
        clearTimeout(endTimeout);
        this.audioStatus.currentTime = audio.currentTime;
        const lessTime =
          this.audioStatus.duration - this.audioStatus.currentTime;
        // end event would not be fired while currentTime changed
        // so use timeout to fire end event.
        if (this.audioStatus.duration && lessTime < 5) {
          endTimeout = setTimeout(() => {
            onEnd();
          }, lessTime * 1000 + 100);
        }
      };

      audio.oncanplay = () => {
        this.audioStatus.duration = audio.duration;
      };

      audio.onplaying = () => {
        this.audioStatus.playing = true;
      };

      audio.onpause = () => {
        clearTimeout(endTimeout);
        this.audioStatus.playing = false;
      };
    },

    initCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      styles[this.playStyle].init(
        canvas,
        canvas.width / 800,
        canvas.height / 600
      );
    },

    onResize() {
      // recalculate canvas size while window's size changed
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.initCanvas();
      }, 400);
    },

    syncStatus() {
      // read play status from cache
      Object.keys(this.audioStatus).forEach(key => {
        const statusKey = `musicStatus.${key}`;
        if (this.sourceConfig.hasOwnProperty(statusKey)) {
          this.audioStatus[key] = this.sourceConfig[statusKey];
        }
      });
    },
  },
  mounted() {
    this.initAudio();
    this.initCanvas();
    this.syncStatus();
    stage.add(this);
    win.on('resize', this.onResize.bind(this));
  },
  destroyed() {
    if (this.bufferSource) {
      this.bufferSource.stop();
    }

    win.removeListener('resize', this.onResize.bind(this));
  },
};
