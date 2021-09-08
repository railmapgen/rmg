const electron = require('electron'),
  app = electron.app,
  BrowserWindow = electron.BrowserWindow;

const path = require('path'),
  isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })
  const appUrl = isDev ? 'http://localhost:3000' :
    `file://${path.join(__dirname, '../build/index.html')}`
  mainWindow.loadURL(appUrl)
  // mainWindow.webContents.openDevTools()
  // mainWindow.maximize()
  // mainWindow.setFullScreen(true)
  mainWindow.on('closed', () => mainWindow = null)
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  // Follow OS convention on whether to quit app when
  // all windows are closed.
  if (process.platform !== 'darwin') { app.quit() }
})
app.on('activate', () => {
  // If the app is still open, but no windows are open,
  // create one when the app comes into focus.
  if (mainWindow === null) { createWindow() }
})
