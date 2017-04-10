const electron = require('electron');
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const IS_PROD = process.mainModule.filename.includes('app.asar');
// TODO: Windows replaces : to ; in env variables (or maybe cross-env)? Anyway, I was flabbergasted and just wanted to get it over with.
const ELECTRON_START_URL = process.env.ELECTRON_START_URL ? process.env.ELECTRON_START_URL.replace(/;/g, ':') : '';

let mainWindow;

function onClosed() {
    mainWindow = null;
}

function createWindow() {
    const win = new BrowserWindow({
        // When devving it is frustrating to have fullscreen mode on.
        // When explicitly set to false it will not allow fullscreen at all, so we use undefined.
        fullscreen: IS_PROD ? true : undefined,
        webPreferences: {
            // Okay this looks pretty stupid, but disabling webSecurity allows us to load files from the filesystem in an <img> directy.
            // It is also possible to do that with nativeImage and `toDataURL()`, but that is _very_ slow.
            webSecurity: false,
        },
    });

    if (!IS_PROD) {
        win.maximize();
    }

    const startUrl = ELECTRON_START_URL ||
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
