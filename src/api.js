const path = require('path');
const fsconst = require('fs').constants;
const fs = require('fs/promises');

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
