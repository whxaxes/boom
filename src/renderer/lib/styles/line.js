const DIS = 20;
const COLOR_START = 150;
const MAX_WIDTH = 5;
let max_width;

export default {
  init(canvas, w_ratio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.shadowBlur = 10;
    this.midY = this.canvas.height / 2;
    this.maxHg = this.canvas.height / 2;
    this.maxLen = 50 * w_ratio;
    this.perLen = (this.canvas.width - 2 * DIS) / (this.maxLen * 2);
    this.per = Math.ceil(950 / this.maxLen);
    this.lines = [];
    this.colors = [ COLOR_START, COLOR_START, COLOR_START ];
    this.colorIndex = 0;
    this.direction = true;
    max_width = MAX_WIDTH * w_ratio;

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
    let count = 0;
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const ratio = array[i * this.per] / 256;
      count += ratio;
      const h = this.maxHg * ratio;
      const s = (this.canvas.height - h) / 2;
      ctx.moveTo(line.x, s);
      ctx.lineTo(line.x, s + h);
    }
    const ratioAverage = count / this.lines.length;
    const color = this.colors[this.colorIndex] += this.direction ? 1 : -1;
    if ((this.direction && color >= 255) || (!this.direction && color <= COLOR_START)) {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;
      this.direction = !this.direction;
    }
    this.ctx.lineWidth = 2 + max_width * ratioAverage;
    this.ctx.shadowColor = this.ctx.strokeStyle = `rgb(${this.colors.join(',')})`;
    ctx.stroke();
  },
};
