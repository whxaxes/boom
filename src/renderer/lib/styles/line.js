const DIS = 40;

export default {
  init(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.midy = this.canvas.height / 2;
    this.max = this.midy - 100;
    this.maxLen = 512;
  },

  update(array) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    ctx.moveTo(DIS, this.midy);
    const per = Math.ceil(array.length / this.maxLen);
    const len = (this.canvas.width - 2 * DIS) / this.maxLen;
    for (let i = 0; i < this.maxLen; i++) {
      ctx.lineTo(DIS + i * len, this.midy + (this.max * array[i * per] / 256) * (i % 2 === 0 ? -1 : 1));
    }
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  },
};
