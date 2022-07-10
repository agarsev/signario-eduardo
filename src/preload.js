const { contextBridge, ipcRenderer } = require('electron');
const { readdirSync } = require('fs');

contextBridge.exposeInMainWorld('api', {

  on_data_dir: callback => ipcRenderer.on('data_directory', (e, v) => callback(v)),

  list_videos: data_dir => {
    const videos = readdirSync(data_dir).map(f => {
      const [date, num] = f.trim().split('_');
      return {date, num};
    });
    return videos;
  },

});
