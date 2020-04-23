declare module 'yutub' {
  interface YouTubeVideo {
    channel: {
      id: string,
      avatar_url: string,
      name: string,
      url: string
    },
    id: string,
    url: string,
    thumbnail_url: string,
    duration: string,
    title: string,
    views: string,
    date_published: string,
    upload_date: string,
    likes: string,
    dislikes: string,
    short_description: string
  }

  interface YouTubeVideoSearch {
    channel: {
      name: string,
      url: string
    },
    id: string,
    url: string
    thumbnail_url: string,
    duration: string,
    title: string,
    views: string,
    short_description: string,
  }

  class YouTube {
    public getVideo(id: string): Promise<YouTubeVideo>
    public searchVideos(value: string, searchLimit?: number): Promise<Array<YouTubeVideoSearch>>
  }
}
