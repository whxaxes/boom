import { mapState } from 'vuex';
import { SELECT_MUSIC, UPDATE_SIMPLE_MODE } from '~/store';
import styles from './styles';
const AC = new window.AudioContext();
const analyser = AC.createAnalyser();
const gainnode = AC.createGain();
let loopVm;
gainnode.gain.value = 1;

export default {
  name: 'music-player',
  data() {
    return {
      audioSource: null,
      bufferSource: null,
      audioStatus: {
        currentTime: 0,
        duration: 0,
        playing: false,
        loop: false,
        muted: false,
      },
      url: '',
    };
  },
  computed: {
    ...mapState([
      'currentId',
      'musicList',
      'playStyle',
      'simpleMode',
    ]),

    progress() {
      const status = this.audioStatus;
      return {
        width: status.currentTime
          ? Math.ceil((status.currentTime / status.duration) * 100) + '%'
          : '0',
      };
    },
  },
  watch: {
    currentId(id) {
      this.currentMusic = this.musicList
        .filter(item => item.id === id)[0];
      this.playMusic();
    },
  },
  methods: {
    playMusic() {
      this.url = this.currentMusic.url;
      this.$nextTick(() => {
        this.$refs.audio.load();
        this.$refs.audio.play();
      });
    },

    play() {
      if (!this.$refs.audio.currentSrc) {
        if (this.musicList.length) {
          const index = ~~(this.musicList.length * Math.random());
          this.$store.commit(
            SELECT_MUSIC,
            this.musicList[index].id,
          );
        }

        return;
      }

      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },

    next() {
      const index = this.musicList.findIndex(item => item.id === this.currentId) + 1;
      this.$store.commit(
        SELECT_MUSIC,
        this.musicList[index >= this.musicList.length ? 0 : index].id,
      );
    },

    prev() {
      const index = this.musicList.findIndex(item => item.id === this.currentId) - 1;
      this.$store.commit(
        SELECT_MUSIC,
        this.musicList[index < 0 ? this.musicList.length - 1 : index].id,
      );
    },

    loop() {
      this.$refs.audio.loop = this.audioStatus.loop = !this.audioStatus.loop;
    },

    mute() {
      this.$refs.audio.muted = this.audioStatus.muted = !this.audioStatus.muted;
    },

    simple() {
      this.$store.commit(UPDATE_SIMPLE_MODE, !this.simpleMode);
    },

    animate() {
      const arrayLength = analyser.frequencyBinCount;
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

      audio.onended = () => {
        this.next();
      };

      audio.ontimeupdate = () => {
        this.audioStatus.currentTime = audio.currentTime;
      };

      audio.onplaying = () => {
        this.audioStatus.playing = true;
        this.audioStatus.duration = audio.duration;
      };

      audio.onpause = () => {
        this.audioStatus.playing = false;
      };
    },
  },
  mounted() {
    this.initAudio();
    const canvas = this.$refs.canvas;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    styles[this.playStyle].init(canvas);
    loop(loopVm = this);
  },
  destroyed() {
    if (this.bufferSource) {
      this.bufferSource.stop();
    }

    loopVm = null;
  },
};

function loop() {
  if (!loopVm) {
    return;
  }

  loopVm.animate();
  window.requestAnimationFrame(loop);
}
