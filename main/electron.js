"use strict";
const electron = require("electron");
const { ipcMain } = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const database = require("./db");
const Store = require("electron-store");
const store = new Store();
//=> undefined
let mainWindow;
if (require("electron-squirrel-startup")) {
    app.quit();
} // NEW!
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadURL(isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`);
    const db = new database();
    ipcMain.on("getTheme", (event, arg) => {
        const theme = store.get("theme");
        event.reply("theme", theme || "light");
    });
    ipcMain.on("setTheme", (event, arg) => {
        if (!arg)
            return;
        console.log("setTheme", arg);
        store.delete("theme");
        store.set("theme", arg);
    });
    ipcMain.on("getAutoFormatDot", (event, arg) => {
        const autoFormatDot = store.get("autoFormatDot");
        console.log("autoFormatDot", autoFormatDot);
        event.reply("storedAutoFormatDot", autoFormatDot || false);
    });
    ipcMain.on("deleteOneProject", (event, id) => {
        db.deleteOneProject(id);
        event.reply("confirmDeleteOneProject");
    });
    ipcMain.on("setAutoFormatDot", (event, arg) => {
        console.log("x", arg);
        store.delete("autoFormatDot");
        store.set("autoFormatDot", arg);
        console.log("check", store.get("autoFormatDot"));
    });
    ipcMain.on("updateContent", (event, arg) => {
        const { id, key, val, prevKey } = arg;
        console.log("u", id, key, val, prevKey);
        // console.log("data", data);
        db.updateContent(id, key, val, prevKey);
        event.reply("dbChanges", "updatedContent");
    });
    ipcMain.on("deleteEntry", (event, arg) => {
        const { id, key } = arg;
        db.deleteEntry(id, key);
        event.reply("dbChanges", "entryDeleted");
    });
    ipcMain.on("save", async (event, arg) => {
        try {
            const { id, data } = arg;
            console.log("id", id);
            console.log("data", data);
            await db.add(id, data);
            event.reply("dbChanges", "savedToDb");
        }
        catch (err) {
            event.reply("savedToDb", err);
        }
    });
    ipcMain.on("newproject", (event, arg) => {
        db.newProject(arg);
        event.reply("projectcreated", "projectcreated");
    });
    ipcMain.on("getProjects", (event, arg) => {
        const projects = db.getProjects();
        event.reply("returnProjects", projects);
    });
    ipcMain.on("getOneProject", (event, id) => {
        const data = db.getRes(id);
        console.log(id, data);
        event.reply("returnOneProject", data);
    });
    // if (!isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
    // }
    mainWindow.on("closed", () => (mainWindow = null));
    mainWindow.removeMenu();
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
