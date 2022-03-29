// Native
import { join } from 'path';
// const path = require("path");
// const join = path.join;

import database from "./db";
import Store from "electron-store";

// Packages
import { BrowserWindow, app, ipcMain } from 'electron';
import isDev from 'electron-is-dev';

const store = new Store();
const height = 900;
const width = 750;

function createWindow() {
  // Create the browser window.
  const window = new BrowserWindow({
    width,
    height,
    //  change to false to use AppBar
    frame: true,
    show: true,
    resizable: true,
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  const db = new database();

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }
  // Open the DevTools.
  // window.webContents.openDevTools();
  console.log("app rdy")

  ipcMain.handle("getTheme", () => {
    console.log("getTheme")
    const theme = store.get("theme");
    if (typeof theme == "string") return(theme || "light");
    return "light";
  });

  ipcMain.handle("setTheme", (_, arg) => {
    if (!arg) return false;
    console.log("setTheme", arg);
    store.delete("theme");

    store.set("theme", arg);
    return true;
  });

  ipcMain.handle("getAutoFormatDot", (_, __) => {
    const autoFormatDot = store.get("autoFormatDot");
    console.log("autoFormatDot",autoFormatDot)
    return ( autoFormatDot || false);
  });

  ipcMain.handle("deleteOneProject", (_, id) => {
    db.deleteOneProject(id);
    
    return true;
  });

  ipcMain.handle("setAutoFormatDot", (_, arg) => {
    
    console.log("x",arg)
    store.delete("autoFormatDot");

    store.set("autoFormatDot", arg);
    console.log("check",store.get("autoFormatDot"))
    return true;
  });

  ipcMain.handle("updateContent", (_, arg) => {
    const { id, key, val, prevKey } = arg;
    console.log("u", id, key, val, prevKey);
    // console.log("data", data);
    db.updateContent(id, key, val, prevKey);
    return true;
  });

  ipcMain.handle("deleteEntry", (_, arg) => {
    const { id, key } = arg;
   
    
    db.deleteEntry(id, key);
    
    return true;
  });

  ipcMain.handle("save", async (_, arg) => {
    try {
      const { id, data } = arg;
      console.log("id", id);
      console.log("data", data);
      await db.add(id, data);
      return true;
    } catch (err) {
      return err;
    }
  });

  ipcMain.handle("newproject", (_, arg) => {
    db.newProject(arg);
    return true;
  });

  ipcMain.handle("getProjects", (__, _) => {
    const projects = db.getProjects();
    return projects;
  });

  ipcMain.handle("getOneProject", (_, id) => {
    const data = db.getRes(id);
    console.log(id, data);
    return data;
  });

  window.webContents.openDevTools();
  // }

  window.removeMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
// ipcMain.on('message', (event: IpcMainEvent, message: any) => {
//   console.log(message);
//   setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
// });