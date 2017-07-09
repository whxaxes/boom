const ColumnCount = 30;
const ColumnList = [];
const distance = 40;
const RedDivHeight = 5;
let grd;

class Column {
  constructor(ctx, w, h, x, y) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.jg = 3;
    this.power = 0;
    this.dy = y;
    this.num = 0;
    this.ctx = ctx;
  }

  update(power) {
    this.power = this.h * power / 256;
    this.num = ~~(this.power / RedDivHeight + 0.5);

    // update position
    const nh = this.dy + RedDivHeight;
    if (this.power >= this.y - nh) {
      this.dy = this.y - this.power - RedDivHeight - (this.power === 0 ? 0 : 1);
    } else if (nh > this.y) {
      this.dy = this.y - RedDivHeight;
    } else {
      this.dy += 1;
    }

    this.draw();
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = grd;
    const h = (~~(this.power / (RedDivHeight + this.jg))) * (RedDivHeight + this.jg);
    ctx.fillRect(this.x, this.y - h, this.w, h);
    for (let i = 0; i < this.num; i++) {
      const y = this.y - i * (RedDivHeight + this.jg);
      ctx.clearRect(this.x - 1, y, this.w + 2, this.jg);
    }
    ctx.fillStyle = '#950000';
    ctx.fillRect(this.x, ~~this.dy, this.w, RedDivHeight);
  }
}

export default {
  init(canvas) {
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvas.width;
    this._canvas.height = canvas.height / 2;

    const aw = (canvas.width - 2 * distance) / ColumnCount;
    const w = aw - 5;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._ctx = this._canvas.getContext('2d');
    const imgHeight = canvas.height / 2;
    const columnHeight = imgHeight - 100;
    grd = this._ctx.createLinearGradient(
      canvas.width / 2, imgHeight - columnHeight,
      canvas.width / 2, canvas.height / 2
    );
    grd.addColorStop(0.3, '#FF0000');
    grd.addColorStop(0.5, '#FFFF00');
    grd.addColorStop(1, '#00E800');

    for (let i = 0; i < ColumnCount; i++) {
      ColumnList.push(new Column(
        this._ctx,
        w, columnHeight,
        distance + i * aw,
        imgHeight
      ));
    }
  },

  update(array) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const ratio = array.length / this.canvas.width;

    for (let i = 0; i < ColumnList.length; i++) {
      const rt = ColumnList[i];
      rt.index = ('index' in rt) ? rt.index : ~~(rt.x * ratio);
      rt.update(array[rt.index]);
    }

    this.copy();
  },

  copy() {
    this.ctx.drawImage(this._canvas, 0, 0);
    this.ctx.save();
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate(Math.PI);
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(this._canvas, -this.canvas.width / 2, -this.canvas.height / 2);
    this.ctx.restore();
    this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
    this.ctx.fillRect(0, this.canvas.height / 2, this.canvas.width, this.canvas.height / 2);
  },
};
