const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
import jsmediatags from 'jsmediatags';

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
    return chokidar
      .watch(dir, { depth })
      .on('add', callback)
      .on('unlink', callback)
      .on('change', callback);
  },

  // get picture from mp3 file
  getPicture(realPath, callback) {
    new jsmediatags.Reader(realPath).setTagsToRead([ 'picture' ]).read({
      onSuccess(tag) {
        const picture = tag.tags.picture;
        const imgData = picture.data;
        let base64String = '';
        for (let i = 0; i < imgData.length; i++) {
          base64String += String.fromCharCode(imgData[i]);
        }
        callback(
          null,
          `data:${picture.format};base64,${window.btoa(base64String)}`
        );
      },
      onError(e) {
        callback(e, '');
      },
    });
  },
};
