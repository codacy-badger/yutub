const { YouTube } = require('../src');

const youtube = new YouTube();

youtube.searchVideos('Coisa Nossa', 10)
  .then(console.log)
  .catch(console.error);

youtube.getVideo('424234')
  .then(console.log)
  .catch(console.error);
