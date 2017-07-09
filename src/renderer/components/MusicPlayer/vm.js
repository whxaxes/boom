import { mapState } from 'vuex';
import { SELECT_MUSIC } from '~/store';
import styles from './styles';
const AC = new window.AudioContext();
const analyser = AC.createAnalyser();
const gainnode = AC.createGain();
const RAF = window.requestAnimationFrame;
let loopVm;
gainnode.gain.value = 1;

export default {
  name: 'music-player',
  data() {
    return {
      audioSource: null,
      bufferSource: null,
      url: '',
    };
  },
  computed: {
    ...mapState([
      'selectIndex',
      'musicList',
      'playStyle',
    ]),
  },
  watch: {
    selectIndex() {
      this.playMusic();
    },
  },
  methods: {
    playMusic() {
      this.url = this.musicList[this.selectIndex].url;
      this.$nextTick(() => {
        this.$refs.audio.load();
        this.$refs.audio.play();
      });
    },

    // change audio buffer music
    changeMusic() {
      const currentMusic = this.musicList[this.selectIndex];
      if (!currentMusic.audioBuffer) {
        return;
      }

      if (this.bufferSource) {
        this.bufferSource.stop();
      }

      const bs = this.bufferSource = AC.createBufferSource();
      bs.buffer = currentMusic.audioBuffer;
      bs.connect(analyser);
      analyser.connect(gainnode);
      gainnode.connect(AC.destination);
      bs.start();
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
        this.$store.commit(SELECT_MUSIC, this.selectIndex + 1);
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
  RAF(loop);
}
