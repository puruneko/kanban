const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    mainWindow.loadURL(url.format({
        pathname: path.resolve(__dirname, '../html/tasks.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 開発ツールを有効化
    mainWindow.webContents.openDevTools();

    Menu.setApplicationMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
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