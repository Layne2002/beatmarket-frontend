export interface AlbumLastfm {
    name: string;
    artist: string;
    url: string;
    image: { '#text': string; size: string }[];
    wiki?: {
      published: string;
      summary: string;
      content: string;
    };
  }