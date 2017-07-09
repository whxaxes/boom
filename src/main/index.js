import { app, screen, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
import http from 'http';
import path from 'path';
import fs from 'fs';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

const allowFiles = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};
const allowKeys = Object.keys(allowFiles);
const musicPath = '/Users/wanghx/Music/网易云音乐/';
const musicList = fs.readdirSync(musicPath)
  .filter(f => allowKeys.indexOf(path.extname(f)) >= 0);

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    height, width,
    useContentSize: true,
    titleBarStyle: 'hidden',
  });

  startMusicServer(port => {
    ipcMain.on('get-music-list', event => {
      event.sender.send('sync-music-list', musicList.map(f => ({
        url: `http://127.0.0.1:${port}/${f}`,
        name: path.basename(f, path.extname(f)),
      })));
    });

    mainWindow.loadURL(winURL);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startMusicServer(callback) {
  const server = http.createServer((req, res) => {
    const musicUrl = decodeURIComponent(req.url);
    const extname = path.extname(musicUrl);
    if (allowKeys.indexOf(extname) < 0) {
      return notFound(res);
    }

    const filename = path.basename(musicUrl);
    const fileUrl = path.join(musicPath, filename);
    if (!fs.existsSync(fileUrl)) {
      return notFound(res);
    }

    const stat = fs.lstatSync(fileUrl);
    const source = fs.createReadStream(fileUrl);
    res.writeHead(200, {
      'Content-Type': allowFiles[extname],
      'Content-Length': stat.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=' + (365 * 24 * 60 * 60 * 1000),
      'Last-Modified': String(stat.mtime).replace(/\([^\x00-\xff]+\)/g, '').trim(),
    });
    source.pipe(res);
  }).listen(9999, () => {
    callback(server.address().port);
  });

  return server;
}

function notFound(res) {
  res.writeHead(404);
  res.end('not found');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
