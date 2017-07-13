const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

export default {
  readDirSync(dirPath, depth = 3) {
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    depth--;
    let fileList = [];
    fs.readdirSync(dirPath).forEach(item => {
      if (item.match(/^\./)) {
        return;
      }

      const newPath = path.join(dirPath, item);
      if (fs.lstatSync(newPath).isDirectory()) {
        if (depth > 0) {
          fileList = fileList.concat(this.readDirSync(newPath, depth));
        }
      } else {
        fileList.push(newPath);
      }
    });

    return fileList;
  },

  watch(dir, callback, depth = 3) {
    return chokidar.watch(dir, { depth })
      .on('add', callback)
      .on('unlink', callback)
      .on('change', callback);
  },
};
