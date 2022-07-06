const { app, BrowserWindow } = require('electron')
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'lista_preload.js'),
    },
  });
  win.loadFile('dist/lista.html')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
