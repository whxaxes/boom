const COL_COUNT = 30;
const COL_DIS = 40;
const RED_BOX_H = 5;
const SPLIT_DIS = 3;
const FULL_H = RED_BOX_H + SPLIT_DIS;
let grd;

class Column {
  constructor(ctx, w, h, x, y) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
    this.power = 0;
    this.dy = y;
    this.ctx = ctx;
  }

  update(power) {
    this.power = this.h * power / 256;

    // update position
    const nh = this.dy + RED_BOX_H;
    if (this.power >= this.y - nh) {
      this.dy = this.y - this.power - RED_BOX_H - (this.power === 0 ? 0 : 1);
    } else if (nh > this.y) {
      this.dy = this.y - RED_BOX_H;
    } else {
      this.dy += 1;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = grd;
    const h = (~~(this.power / FULL_H)) * FULL_H;
    ctx.fillRect(this.x, this.y - h, this.w, h);
  }

  drawLater() {
    this.ctx.fillStyle = '#950000';
    this.ctx.fillRect(this.x, ~~this.dy, this.w, RED_BOX_H);
  }
}

export default {
  init(canvas) {
    this.columnList = [];
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvas.width;
    this._canvas.height = canvas.height / 2;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._ctx = this._canvas.getContext('2d');

    // calculate width
    const aw = (canvas.width - 2 * COL_DIS) / COL_COUNT;
    const w = aw - 5;

    // calculate height
    const imgHeight = canvas.height / 2;
    this.num = ~~((imgHeight - 100) / FULL_H);
    const columnHeight = this.num * FULL_H;
    this.start = imgHeight - columnHeight;

    // gradient color
    grd = this._ctx.createLinearGradient(
      canvas.width / 2, imgHeight - columnHeight,
      canvas.width / 2, canvas.height / 2
    );
    grd.addColorStop(0.3, '#FF0000');
    grd.addColorStop(0.5, '#FFFF00');
    grd.addColorStop(1, '#00E800');

    // generate columns
    for (let i = 0; i < COL_COUNT; i++) {
      this.columnList.push(new Column(
        this._ctx,
        w, columnHeight,
        COL_DIS + i * aw,
        imgHeight
      ));
    }
  },

  destroyed() {
    this.columnList.length = 0;
  },

  update(array) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const len = ~~(array.length / this.columnList.length) - 2;

    // draw column
    for (let i = 0, j = 0; i < this.columnList.length; i++, j += len) {
      const rt = this.columnList[i];
      rt.update(array[j]);
      rt.draw();
    }

    // split column
    for (let i = 0; i < this.num; i++) {
      this._ctx.clearRect(
        0, this.start + i * FULL_H - 0.1,
        this.canvas.width, SPLIT_DIS + 0.1
      );
    }

    // draw red box
    for (let i = 0; i < this.columnList.length; i++) {
      this.columnList[i].drawLater();
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
