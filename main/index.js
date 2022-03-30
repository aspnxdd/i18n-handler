"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
// const path = require("path");
// const join = path.join;
const db_1 = __importDefault(require("./db"));
const electron_store_1 = __importDefault(require("electron-store"));
// Packages
const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const store = new electron_store_1.default();
const height = 900;
const width = 750;
function createWindow() {
    // Create the browser window.
    const window = new electron_1.BrowserWindow({
        width,
        height,
        //  change to false to use AppBar
        frame: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js')
        }
    });
    const port = process.env.PORT || 3000;
    const url = electron_is_dev_1.default ? `http://localhost:${port}` : (0, path_1.join)(__dirname, '../src/out/index.html');
    const db = new db_1.default();
    // and load the index.html of the app.
    if (electron_is_dev_1.default) {
        window?.loadURL(url);
    }
    else {
        window?.loadFile(url);
    }
    // Open the DevTools.
    // window.webContents.openDevTools();
    console.log('app rdy');
    electron_1.ipcMain.handle('getTheme', () => {
        console.log('getTheme');
        const theme = store.get('i18nTheme', "dark");
        return theme;
    });
    electron_1.ipcMain.handle('setTheme', (_, arg) => {
        if (!arg)
            return false;
        console.log('setTheme $ ', arg, typeof arg);
        store.set('i18nTheme', arg);
        return true;
    });
    electron_1.ipcMain.handle('getAutoFormatDot', (_, __) => {
        const autoFormatDot = store.get('autoFormatDot');
        console.log('autoFormatDot', autoFormatDot);
        return autoFormatDot || false;
    });
    electron_1.ipcMain.handle('deleteOneProject', (_, id) => {
        db.deleteOneProject(id);
        return true;
    });
    electron_1.ipcMain.handle('setAutoFormatDot', (_, arg) => {
        console.log('x', arg);
        store.delete('autoFormatDot');
        store.set('autoFormatDot', arg);
        console.log('check', store.get('autoFormatDot'));
        return true;
    });
    electron_1.ipcMain.handle('updateContent', (_, arg) => {
        const { id, key, val, prevKey } = arg;
        console.log('u', id, key, val, prevKey);
        // console.log("data", data);
        db.updateContent(id, key, val, prevKey);
        return true;
    });
    electron_1.ipcMain.handle('deleteEntry', (_, arg) => {
        const { id, key } = arg;
        db.deleteEntry(id, key);
        return true;
    });
    electron_1.ipcMain.handle('save', (_, arg) => {
        const { id, data, lang } = arg;
        console.log("null$", typeof lang, lang);
        return db.add(id, data, lang);
    });
    electron_1.ipcMain.handle('newProject', (_, arg) => {
        const { data } = arg;
        db.newProject(data);
        return true;
    });
    electron_1.ipcMain.handle('getProjects', (__, _) => {
        return db.getProjects();
    });
    electron_1.ipcMain.handle('getLangs', (_, id) => {
        return db.getLangs(id);
    });
    electron_1.ipcMain.handle('exportProject', (_, id) => {
        return db.exportProject(id);
    });
    electron_1.ipcMain.handle('getOneProject', (_, id, anotherLang) => {
        if (anotherLang) {
            return db.getRes(id, anotherLang);
        }
        return db.getRes(id);
    });
    window.webContents.openDevTools();
    // }
    window.removeMenu();
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// listen the channel `message` and resend the received message to the renderer process
// ipcMain.on('message', (event: IpcMainEvent, message: any) => {
//   console.log(message);
//   setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
// });
