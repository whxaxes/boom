// animation stage

export default {
  _vmList: [],
  _animating: false,
  _pause: false,

  add(vm) {
    // animate vm must need animate function
    if (typeof vm.animate !== 'function') {
      console.warn('vm has no animate function');
      return;
    }

    this._vmList.push(vm);

    // start loop
    if (!this._animating) {
      this.loop();
    }
  },

  remove(vm) {
    const index = this._vmList.indexOf(vm);
    if (index >= 0) {
      this._vmList.splice(index, 1);
    }
  },

  close() {
    this._vmList.length = 0;
    this._pause = this._animating = false;
  },

  play() {
    if (!this._pause) {
      return;
    }

    this._pause = false;
    setTimeout(() => this.loop());
  },

  pause() {
    this._pause = true;
  },

  loop() {
    if (this._pause) {
      return;
    }

    if (!this._vmList.length) {
      this._animating = false;
      return;
    }

    this._animating = true;

    // auto remove destroyed vm
    this._vmList = this._vmList
      .filter(vm => {
        if (vm._isBeingDestroyed || vm._isDestroyed) {
          return false;
        }

        vm.animate();
        return true;
      });

    window.requestAnimationFrame(() => {
      this.loop();
    });
  },
};
