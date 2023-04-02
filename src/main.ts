const {app, BrowserWindow} = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        usePreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
    console.log(`Creating window...`);
    createWindow()
    console.log(`Created.`)
});

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
        console.log(`Quit called.`);
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});