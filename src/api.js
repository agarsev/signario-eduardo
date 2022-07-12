const path = require('path');
const fsconst = require('fs').constants;
const fs = require('fs/promises');
const { dialog, BrowserWindow } = require('electron');

exports.listVideos = async function(data_dir) {
    const videos = (await fs.readdir(data_dir)).map(f => {
      const [date, num] = f.trim().split('_');
      return {
        dir: path.join(data_dir, f),
        date, num
      };
    });
    return videos;
}

exports.importRecordings = async function(grab_dir, data_dir, cancel) {
  let num = 0;
  for (fecha of await fs.readdir(grab_dir)) {
    const [_, m, d] = fecha.split('-');
    const source = path.join(grab_dir, fecha);
    for (filename of await fs.readdir(source)) {
      try {
        const [vid, _] = filename.split('.');
        const dest = path.join(data_dir, `${m}${d}_${vid}`);
        await fs.mkdir(dest);
        await fs.copyFile(path.join(source, filename), path.join(dest, "raw.mp4"),
          fsconst.COPYFILE_EXCL | fsconst.COPYFILE_FICLONE);
        num++;
        if (cancel.cancelled) break;
      } catch (err) {
        if (err.code != 'EEXIST') throw err;
      }
    }
  }
  return num;
}

exports.getVideoInfo = async function(video_dir) {
  try {
    const text = await fs.readFile(path.join(video_dir, 'info.json'), 'utf8');
    return JSON.parse(text);
  } catch (err) {
    if (err.code != 'ENOENT') throw err;
    return {};
  }
}

exports.saveVideoInfo = async function(video_dir, info) {
  return fs.writeFile(path.join(video_dir, 'info.json'),
    JSON.stringify(info));
}

exports.importAutocuts = async function(video_dir) {
  const det_path = path.join(video_dir, 'detected.txt');
  try {
    await fs.access(det_path, fsconst.R_OK);
  } catch (err) {
    const res = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
      title: "Importar fichero de cortes auto detectados",
      properties: ['openFile'],
      filters: [
         { name: 'Ficheros de texto', extensions: ['txt'] },
         { name: 'Todos', extensions: ['*'] }
      ]
    });
    if (res.canceled) return;
    await fs.copyFile(res.filePaths[0], det_path);
  }
  const text = await fs.readFile(det_path, 'utf8');
  return text.split(/\r?\n/).filter(l => l!=='')
    .map(line => {
      const [num, start, end] = line.split(' ');
      return {gloss: num, start, end};
    });
}

exports.importGlosses = async function(video_dir) {
  const res = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
    title: "Importar fichero de glosas",
    properties: ['openFile'],
  });
  if (res.canceled) return;
  const text = await fs.readFile(res.filePaths[0], 'utf8');
  return text.split(/\r?\n/).filter(l => l!=='');
}
