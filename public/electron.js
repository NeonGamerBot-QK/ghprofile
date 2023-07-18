const { app, ipcMain, shell, BrowserWindow } = require('electron')
const Store = require('electron-store')
const store = new Store()
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev');
ipcMain.on('link:open', (event, arg) => {
    shell.openExternal(arg)
})
ipcMain.on('theme:get', (event, arg) => {
   event.returnValue = store.get('theme') || 'dark'
})
ipcMain.on('theme:set', (event, arg) => {
   store.set('theme', arg)
 })
let win

function createWindow () {

    win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
    } })
if( !isDev ) {
    win.loadFile('build/index.html', {userAgent: 'Electron'})
} else {
    win.loadURL('http://localhost:3000', {userAgent: 'Electron'})
win.webContents.openDevTools()
}
win.on('closed', () => {
    win = null
})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}
)
app.on('activate', () => {

    if (win === null) {
        createWindow()
    }
})