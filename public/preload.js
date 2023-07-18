const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electron', {
    clickOnLink: (link) => {
        ipcRenderer.send('link:open', link)
    },
    setTheme: (theme) => {
        ipcRenderer.send('theme:set', theme)
    }
})

window.onload = () => {
    console.log('ELECTRON LOADED')
    const theme = ipcRenderer.sendSync('theme:get')
    document.querySelector('html').classList.add('duration-500')
    document.querySelector('html').classList.add('ease-in-out')
    document.querySelector('html').style.transitionProperty = 'background-color, color'
document.querySelector('html').setAttribute('data-theme', theme || 'dark')
}