const { contextBridge } = require('electron');
const { readdirSync } = require('fs');

const data_dir = process.argv.pop();

contextBridge.exposeInMainWorld('api', {
  list_videos: () => {
    const videos = readdirSync(data_dir).map(f => {
      const [date, num] = f.trim().split('_');
      return {date, num};
    });
    return videos;
  },
});
