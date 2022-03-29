"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const api = {
    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.Main.sayHello`
     */
    sendMessage: (message) => {
        electron_1.ipcRenderer.send('message', message);
    },
    send: (message, ...args) => {
        electron_1.ipcRenderer.send(message, ...args);
    },
    invoke: (message, ...args) => {
        return electron_1.ipcRenderer.invoke(message, ...args);
    },
    Minimize: () => {
        electron_1.ipcRenderer.send('minimize');
    },
    Maximize: () => {
        electron_1.ipcRenderer.send('maximize');
    },
    Close: () => {
        electron_1.ipcRenderer.send('close');
    },
    /**
     * Provide an easier way to listen to events
     */
    on: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, (_, data) => callback(data));
    }
};
electron_1.contextBridge.exposeInMainWorld('Main', api);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', electron_1.ipcRenderer);
