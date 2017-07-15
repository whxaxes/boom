const fs = require('fs');
import { mapState } from 'vuex';
import styles from '~/lib/styles';
import defaultConfig from '~/lib/default';
import {
  UPDATE_PATH_ACT,
  UPDATE_PLAY_STYLE_ACT,
} from '~/store';

export default {
  name: 'Preperences',
  data() {
    return {
      styles: Object.keys(styles),
      menu: '',
      menuList: {
        core: 'Core',
        about: 'About',
      },
      form: {
        musicPath: '',
        playStyle: '',
      },
    };
  },
  computed: {
    ...mapState([
      'musicPath',
      'playStyle',
      'version',
    ]),
  },
  methods: {
    close() {
      this.$emit('close');
    },

    reset(isDefault) {
      const obj = isDefault ? defaultConfig : this;
      Object.keys(this.form).forEach(key => {
        if (obj[key]) {
          this.form[key] = obj[key];
        }
      });
    },

    save() {
      if (!this.form.musicPath) {
        this.reset();
        this.$refs.musicPath.focus();
        return alert('Music dir cant be empty!');
      } else if (!fs.existsSync(this.form.musicPath)) {
        this.$refs.musicPath.focus();
        return alert('Music dir was not exists, please change another one!');
      }

      if (this.form.musicPath !== this.musicPath) {
        this.$store.dispatch(UPDATE_PATH_ACT, this.form.musicPath);
      }
      this.$store.dispatch(UPDATE_PLAY_STYLE_ACT, this.form.playStyle);
      this.close();
    },
  },
  mounted() {
    this.menu = this.menuList.core;
    this.reset();
  },
};
