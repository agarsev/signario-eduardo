const { app, BrowserWindow } = require('electron')
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('dist/index.html')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
