const fetch = require('node-fetch');
const DOMParser = require('jsdom').JSDOM;

class YouTube {
  get ytOrigin() {
    return 'https://www.youtube.com';
  }

  async getVideo(id) {
    const videoRes = await fetch(`https://www.youtube.com/watch?v=${id}`);
    const videoValue = await videoRes.text();
    const videoDoc = new DOMParser(videoValue).window.document;

    if (videoDoc.getElementById('unavailable-message')) return null;

    const videoChannelID = videoDoc.querySelector('meta[itemprop="channelId"]').content;
    const videoChannelAvatarURL = videoDoc.querySelector('#watch7-user-header img').getAttribute('data-thumb').split('=')[0];
    const videoChannelName = videoDoc.querySelector('#watch7-user-header img').alt;
    const videoChannelURL = `${this.ytOrigin}${videoDoc.querySelector('#watch7-user-header a').href}`;

    const videoID = id;
    const videoURL = `${this.ytOrigin}/watch?v=${id}`;
    const videoThumbnailURL = videoDoc.querySelector('link[itemprop="thumbnailUrl"]').href;
    const videoDuration = videoDoc.querySelector('meta[itemprop="duration"]').content.match(/\d+/g).join(':');
    const videoTitle = videoDoc.querySelector('meta[itemprop="name"]').content;
    const videoViews = videoDoc.querySelector('.watch-view-count').innerHTML.match(/\d+/g).join('.');
    const videoDatePublished = videoDoc.querySelector('meta[itemprop="datePublished"]').content;
    const videoUploadDate = videoDoc.querySelector('meta[itemprop="uploadDate"]').content;
    const videoLikes = videoDoc.querySelector('.like-button-renderer-like-button .yt-uix-button-content') ? videoDoc.querySelector('.like-button-renderer-like-button .yt-uix-button-content').innerHTML : '??';
    const videoDislikes = videoDoc.querySelector('.like-button-renderer-dislike-button .yt-uix-button-content') ? videoDoc.querySelector('.like-button-renderer-dislike-button .yt-uix-button-content').innerHTML : '??';
    const videoShortDescription = videoDoc.querySelector('meta[itemprop="description"]').content;

    return {
      channel: {
        id: videoChannelID,
        avatar_url: videoChannelAvatarURL,
        name: videoChannelName,
        url: videoChannelURL
      },
      id: videoID,
      url: videoURL,
      thumbnail_url: videoThumbnailURL,
      duration: videoDuration,
      title: videoTitle,
      views: videoViews,
      date_published: videoDatePublished,
      upload_date: videoUploadDate,
      likes: videoLikes,
      dislikes: videoDislikes,
      short_description: videoShortDescription
    }
  }

  async searchVideos(value, searchLimit) {
    if (!searchLimit) searchLimit = 5;
    if (searchLimit > 10) throw new Error('Search limit excedded, max is 10.');

    const searchRes = await fetch(`${this.ytOrigin}/results?search_query=${value}&sp=EgIQAQ%253D%253D`);
    const searchValue = await searchRes.text();
    const searchDoc = new DOMParser(searchValue).window.document;

    const results = [];
    let limit = 0;

    for (let result of searchDoc.querySelectorAll('.yt-lockup-dismissable')) {
      if (limit === searchLimit) break;

      const channelName = result.querySelector('.yt-lockup-byline a').innerHTML;
      const channelURL = `${this.ytOrigin}${result.querySelector('.yt-lockup-byline a').href}`;

      const id = result.querySelector('.yt-lockup-title a').href.slice(9);
      const url = `${this.ytOrigin}${result.querySelector('.yt-lockup-title a').href}`;
      const duration = result.querySelector('.yt-lockup-thumbnail span.video-time').innerHTML;
      const thumbnailURL = result.querySelector('.yt-lockup-thumbnail img').getAttribute('data-thumb') || result.querySelector('.yt-lockup-thumbnail img').src;
      const title = result.querySelector('.yt-lockup-title a').getAttribute('title');
      const shortDescription = result.querySelector('.yt-lockup-description').innerHTML;
      const views = result.querySelector('.yt-lockup-meta-info').lastElementChild.innerHTML.match(/\d+/g).join('.');

      results.push({
        channel: {
          name: channelName,
          url: channelURL
        },
        id,
        url,
        thumbnail_url: thumbnailURL,
        duration,
        title,
        views,
        short_description: shortDescription
      });

      limit++;
    }

    return results;
  }
}

module.exports = { YouTube };
