const { contextBridge } = require('electron');
const { readdirSync } = require('fs');

const videos = readdirSync('../data').map(f => {
  const [date, num] = f.trim().split('_');
  return {date, num};
});

contextBridge.exposeInMainWorld('videos', videos);
