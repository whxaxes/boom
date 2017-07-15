export default {
  name: 'Dialog',
  data() {
    return {
      showDialog: false,
    };
  },
  watch: {
    showDialog(val) {
      this.$emit('input', val);
    },

    value(val) {
      this.showDialog = val;
    },
  },
  props: {
    value: Boolean,
    title: String,
    maskClickClose: {
      type: Boolean,
      default: true,
    },
    escClose: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [ String, Number ],
      default: '500',
    },
    height: {
      type: [ String, Number ],
      default: '300',
    },
  },
  methods: {},
  mounted() {
    this.showDialog = this.value;
    if (this.escClose) {
      window.addEventListener('keyup', e => {
        if (e.keyCode === 27) {
          this.showDialog = false;
        }
      });
    }
  },
};
