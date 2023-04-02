var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
function createWindow() {
    var win = new BrowserWindow({
        width: 800,
        height: 600,
        usePreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('./src/index.html');
}
app.whenReady().then(function () {
    console.log("Creating window...");
    createWindow();
    console.log("Created.");
});
app.on('window-all-closed', function () {
    if (process.platform !== "darwin") {
        app.quit();
        console.log("Quit called.");
    }
});
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
