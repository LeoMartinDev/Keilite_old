import { app, BrowserWindow, screen } from 'electron' // eslint-disable-line
import { readFileSync, readFile, writeFileSync } from 'fs';
import * as path from 'path';
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


import { autoUpdater } from 'electron-updater';

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
});

let firstStart = true;

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

console.log('User Data path : ', app.getPath('userData'));

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');
const WINDOW_HEIGHT = (72 * 6) + 56;
const WINDOW_WIDTH = 400;

let config = {};

try {
  config = JSON.parse(readFileSync(SETTINGS_PATH, 'utf8'));
} catch (error) {
  console.error(error);
  if (error.code === 'ENOENT') {
    firstStart = true;
    config = {};
  }
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    height: WINDOW_HEIGHT,
    width: WINDOW_WIDTH,
    useContentSize: true,
    frame: false,
    resizable: false,
    fullscreenable: false,
    x: (config && config.position) ? config.position.x : (WINDOW_WIDTH + width) / 2,
    y: (config && config.position) ? config.position.y : (WINDOW_HEIGHT + height) / 2,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    let position = mainWindow.getBounds();

    writeFileSync(SETTINGS_PATH, Object.merge(config, {
      position,
    }));
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/* app.on('before-quit', () => {
  console.log('before quit');
  let position = mainWindow.getBounds();

  writeFileSync(SETTINGS_PATH, Object.merge(config, {
    position,
  }));
  mainWindow = null;
}); */

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
