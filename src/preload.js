const { contextBridge, ipcRenderer } = require('electron');
const { readdirSync } = require('fs');

const api = require('./api.js');

contextBridge.exposeInMainWorld('api', {

  on_data_dir: callback => ipcRenderer.on('data_directory', (e, v) => callback(v)),

  list_videos: api.listVideos,
  get_video_info: api.getVideoInfo,
  save_video_info: api.saveVideoInfo,

});
