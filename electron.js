const electron = require('electron'),
    app = electron.app,
    BrowserWindow = electron.BrowserWindow;

const path = require('path'),
    isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({ width: 1280, height: 720 });
    const appUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow.loadURL(appUrl);
    // mainWindow.webContents.openDevTools();
    // mainWindow.maximize()
    // mainWindow.setFullScreen(true)
    mainWindow.once('ready-to-show', () => mainWindow.show());

    mainWindow.on('closed', () => (mainWindow = null));
};

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady()
    .then(() => {
        createWindow();
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) createWindow();
        });
    })
    .catch(console.log);
