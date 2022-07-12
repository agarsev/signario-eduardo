const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path');

const { importRecordings, importAutocuts } = require('./api.js');

function MainWindow (dir) {
  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    role: 'fileMenu',
    submenu: [{
      label: 'Cambiar destino',
      click: changeDataDir
    }, {
      label: 'Importar grabaciones',
      click: importRecordingsDialog
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
      type: 'separator'
    }, {
      role: 'toggleDevTools',
    }]
  }]));
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      spellcheck: false,
    },
  });
  win.loadFile('dist/index.html')
}

async function changeDataDir (_, win) {
  const res = await dialog.showOpenDialog(win, {
    title: "Seleccionar direcory de trabajo",
    properties: ['openDirectory'],
  });
  if (!res.canceled) {
    win.webContents.send('data_directory', res.filePaths[0]);
  }
}

async function importRecordingsDialog (_, win) {
  const res = await dialog.showOpenDialog(win, {
    title: "Seleccionar directorio de grabaciones",
    properties: ['openDirectory'],
  });
  if (!res.canceled) {
    let aborter = new AbortController();
    const msg = dialog.showMessageBox(win, {
      signal: aborter.signal,
      title: "Importando grabaciones",
      message: "Importando... por favor espera o ve a la pradera.",
      buttons: [ "Terminar" ]
    });
    const data_dir = await win.webContents.executeJavaScript("localStorage.getItem('data_directory')");
    const cancel = { cancelled: false };
    const importPromise = importRecordings(res.filePaths[0], data_dir, cancel);
    const who = await Promise.race([msg, importPromise]);
    if (typeof who == 'object') {
      cancel.cancelled = true;
      aborter = new AbortController();
      dialog.showMessageBox(win, {
        signal: aborter.signal,
        title: "Importando grabaciones",
        message: "Abortando... por favor espera a que se acabe de importar el vídeo en progreso.",
        buttons: [],
      });
    }
    const num = await importPromise;
    aborter.abort();
    await dialog.showMessageBox(win, {
      title: "Importando grabaciones",
      message: `${num} grabaciones importadas.`,
    });
    win.reload();
  }
}

ipcMain.handle('import_autocuts', async (_, video_dir) =>
  await importAutocuts(video_dir));


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
  .then(MainWindow);
