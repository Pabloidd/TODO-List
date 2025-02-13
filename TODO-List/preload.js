const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app'),
    sendMessage: (message) => ipcRenderer.send('my-channel', message),
    onReceiveData: (callback) => ipcRenderer.on('data-from-main', (event, ...args) => callback(...args))
});
