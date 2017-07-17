const DIS = 10;

export default {
  init(canvas, w_ratio, h_ratio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round';
    this.maxHg = this.canvas.height * h_ratio / 2;
    this.maxLen = 50 * w_ratio;
    this.perLen = (this.canvas.width - 2 * DIS) / (this.maxLen * 2);
    this.per = Math.ceil(1000 / this.maxLen);
    this.lines = [];
    this.ctx.strokeStyle = '#00E800';

    for (let i = 1; i < this.maxLen; i++) {
      const o = i % 2 === 0;
      this.lines.push({
        x: this.canvas.width / 2 + (o ? -1 : 1) * (i + (o ? 0 : -1)) * this.perLen,
      });
    }
  },

  destroyed() {
    this.lines.length = 0;
  },

  update(array) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.beginPath();
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const h = this.maxHg * array[i * this.per] / 256;
      const s = (this.canvas.height - h) / 2;
      ctx.moveTo(line.x, s);
      ctx.lineTo(line.x, s + h);
    }
    ctx.stroke();
  },
};
