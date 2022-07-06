const { app, BrowserWindow } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({});
  win.loadFile('dist/lista.html')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
