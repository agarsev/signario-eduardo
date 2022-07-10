const { app, BrowserWindow, Menu, dialog } = require('electron')
const path = require('path');

function MainWindow (dir) {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    role: 'fileMenu',
    submenu: [{
      label: 'Cambiar destino',
      click: changeDataDir
    }, {
      type: 'separator'
    }, {
      role: 'quit'
    }]
  },{
    role: 'window',
    submenu: [{
      role: 'reload',
    }, {
      role: 'forceReload',
    }, {
      role: 'toggleDevTools',
    }]
  }]));
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('dist/index.html')
}

async function changeDataDir (_, win) {
  const res = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  });
  win.webContents.send('data_directory', res.filePaths[0]);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
  .then(MainWindow);
