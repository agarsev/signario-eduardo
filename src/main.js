const { app, BrowserWindow, Menu, MenuItem, dialog, ipcMain } = require('electron')
const path = require('path');

const { importRecordings, importAutocuts, importGlosses, exportZip } = require('./api.js');

const undoMenu = new MenuItem({
  label: 'Deshacer',
  accelerator: "CmdOrCtrl+Z",
  click: sendUndo
});

ipcMain.handle('set_undo_enabled', async (_, enabled) => {
  undoMenu.enabled = enabled;
});

async function sendUndo (e, win) {
  // work around electron bug, listen to Ctrl+z in renderer too
  if (!e.triggeredByAccelerator) {
    win.webContents.send('do_undo');
  }
}

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
      label: 'Exportar zip',
      click: exportZipDialog
    }, {
      type: 'separator'
    }, {
      role: 'quit'
    }]
  },{
    role: 'editMenu',
    submenu: [
      undoMenu,
    {
      type: 'separator'
    }, {
      role: 'cut',
    }, {
      role: 'copy',
    }, {
      role: 'paste',
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
    const data_dir = JSON.parse(await win.webContents.executeJavaScript("localStorage.getItem('data_directory')"));
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

function formatDate() {
  const fecha = new Date();
  const mes = fecha.getMonth()+1;
  const dia = fecha.getDate();
  return ("0"+mes).slice(-2)+("0"+dia).slice(-2);
}

async function exportZipDialog (_, win) {
  const res = await dialog.showSaveDialog(win, {
    title: "Exportar a fichero zip",
    defaultPath: `CortesVideosSignario_${formatDate()}.zip`,
    filters: [
      { name: 'Fichero zip', extensions: ["zip"] },
      { name: 'Todos', extensions: ['*'] }
    ],
    properties: ['showOverwriteConfirmation'],
  });
  if (!res.canceled) {
    const data_dir = JSON.parse(await win.webContents.executeJavaScript("localStorage.getItem('data_directory')"));
    await exportZip(data_dir, res.filePath);
    await dialog.showMessageBox(win, {
      title: "Exportando zip",
      message: "Zip exportado con éxito",
    });
  }
}

ipcMain.handle('import_autocuts', async (_, video_dir) =>
  await importAutocuts(video_dir));

ipcMain.handle('import_glosses', async (_, video_dir) =>
  await importGlosses(video_dir));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady()
  .then(MainWindow);
