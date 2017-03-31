const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function onClosed() {
    mainWindow = null;
}

function createWindow() {
    // TODO: Launch full width and height by default
    const win = new BrowserWindow({ width: 800, height: 600 });

    const startUrl = process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../browser-build/index.html'),
            protocol: 'file:',
            slashes: true,
        });
    win.loadURL(startUrl);
    // TODO: I guess this should only be done in dev?
    win.webContents.openDevTools();

    win.on('closed', onClosed);

    return win;
}

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (!mainWindow) {
        mainWindow = createWindow();
    }
});

app.on('ready', () => {
    mainWindow = createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
