const { contextBridge, ipcRenderer } = require('electron');
const { readdirSync } = require('fs');

const api = require('./api.js');

contextBridge.exposeInMainWorld('api', {

  on_data_dir: callback => {
    ipcRenderer.removeAllListeners('data_directory');
    ipcRenderer.on('data_directory', (e, v) => callback(v));
  },
  on_undo: callback => {
    ipcRenderer.removeAllListeners('do_undo');
    ipcRenderer.on('do_undo', callback);
  },

  list_videos: api.listVideos,
  get_video_info: api.getVideoInfo,
  save_video_info: api.saveVideoInfo,

  import_autocuts: video_dir => ipcRenderer.invoke('import_autocuts', video_dir),
  import_glosses: video_dir => ipcRenderer.invoke('import_glosses', video_dir),
  set_undo_enabled: enabled => ipcRenderer.invoke('set_undo_enabled', enabled),

});
