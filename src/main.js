const { app, BrowserWindow, dialog } = require('electron')
const path = require('path');

function MainWindow (dir) {
  const win = new BrowserWindow({
    //autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [ dir ],
    },
  });
  win.loadFile('dist/index.html')
}

function FolderPicker () {
  return dialog.showOpenDialog({
    properties: ['openDirectory'],
  }).then(res => res.filePaths[0]);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
  .then(FolderPicker)
  .then(MainWindow);
