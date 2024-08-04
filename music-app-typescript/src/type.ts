export type Track = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  preview_url: string;
};

export type SpotifyPoplularSongs = {
  items: {
    track: Track;
  }[];
};

export type SpotifySearchedSongs = {
  tracks: {
    items: Track[];
    next?: string;
    previous?: string;
  };
};
