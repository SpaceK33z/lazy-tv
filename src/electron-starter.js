const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const IS_PROD = process.env.NODE_ENV === 'production';

let mainWindow;

function onClosed() {
    mainWindow = null;
}

function createWindow() {
    const win = new BrowserWindow({
        // When devving it is frustrating to have fullscreen mode on.
        // When explicitly set to false it will not allow fullscreen at all, so we use undefined.
        fullscreen: IS_PROD ? true : undefined,
    });

    if (!IS_PROD) {
        win.maximize();
    }

    const startUrl = process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../browser-build/index.html'),
            protocol: 'file:',
            slashes: true,
        });
    win.loadURL(startUrl);
    if (!IS_PROD) {
        win.webContents.openDevTools();
    }

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
