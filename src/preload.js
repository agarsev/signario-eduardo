const { contextBridge } = require('electron');
const { readdirSync } = require('fs');

contextBridge.exposeInMainWorld('api', {
  list_videos: () => {
    const videos = readdirSync('../data').map(f => {
      const [date, num] = f.trim().split('_');
      return {date, num};
    });
    return videos;
  },
});
