const COL_COUNT = 30;
const MARGIN = 40;
const RED_BOX_H = 5;
const SPLIT_DIS = 2;
const COL_DIS = 3;

let col_dis;
let red_box_h;
let split_dis;
let full_h;
let grd;

class Column {
  constructor(ctx, w, h, x, y) {
    this.w = w;
    this.h = h;
    this.rh = 0;
    this.x = x;
    this.y = y;
    this.power = 0;
    this.dy = y;
    this.ctx = ctx;
  }

  update(power) {
    this.power = this.h * power / 256;
    this.rh = (~~(this.power / full_h)) * full_h;

    // update position
    const nh = this.dy + red_box_h;
    if (this.power >= this.y - nh) {
      this.dy = this.y - this.power - red_box_h - (this.power === 0 ? 0 : 1);
    } else if (nh > this.y) {
      this.dy = this.y - red_box_h;
    } else {
      this.dy += 1;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = grd;
    ctx.fillRect(this.x, this.y - this.rh, this.w, this.rh);
  }

  drawLater() {
    this.ctx.fillStyle = '#950000';
    this.ctx.fillRect(this.x, ~~this.dy, this.w, red_box_h);
  }
}

export default {
  init(canvas, w_ratio, h_ratio) {
    this.columnList = [];
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvas.width;
    this._canvas.height = canvas.height / 2;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._ctx = this._canvas.getContext('2d');
    this.per = Math.ceil(950 / COL_COUNT);

    col_dis = Math.round(COL_DIS * w_ratio);
    red_box_h = Math.round(RED_BOX_H * h_ratio);
    split_dis = Math.round(SPLIT_DIS * h_ratio);
    full_h = red_box_h + split_dis;

    // calculate width
    const aw = (canvas.width - 2 * MARGIN) / COL_COUNT;
    const w = aw - col_dis;

    // calculate height
    const imgHeight = canvas.height / 2;
    this.num = ~~((imgHeight - 100) / full_h);
    const columnHeight = this.num * full_h;
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
        MARGIN + i * aw,
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

    // draw column
    for (let i = 0, j = 0; i < this.columnList.length; i++, j += this.per) {
      const rt = this.columnList[i];
      rt.update(array[j]);
      rt.draw();
    }

    // split column
    for (let i = 0; i < this.num; i++) {
      this._ctx.clearRect(
        0, this.start + i * full_h - 0.1,
        this.canvas.width, split_dis + 0.1
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
