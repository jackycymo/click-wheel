export interface Track {
  src: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  source: string;
  license: string;
  licenseUrl: string;
}

export const MUSIC_ARTIST = {
  name: "HoliznaCC0",
  url: "https://holiznacc0.bandcamp.com/",
  album: "Lofi And Chill",
  albumUrl: "https://holiznacc0.bandcamp.com/album/lofi-and-chill",
};

const albumCredit = {
  artist: MUSIC_ARTIST.name,
  album: MUSIC_ARTIST.album,
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

export const TRACKS: Track[] = [
  {
    ...albumCredit,
    src: "/audio/morning-coffee.mp3",
    title: "Morning Coffee",
    duration: 192,
    source: "https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/morning-coffee/",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    ...albumCredit,
    src: "/audio/vintage.mp3",
    title: "Vintage",
    duration: 174.027755,
    source: "https://holiznacc0.bandcamp.com/track/vintage",
  },
  {
    ...albumCredit,
    src: "/audio/mundane.mp3",
    title: "Mundane",
    duration: 158.119184,
    source: "https://holiznacc0.bandcamp.com/track/mundane",
  },
  {
    ...albumCredit,
    src: "/audio/something-in-the-air.mp3",
    title: "Something In The Air",
    duration: 132.022857,
    source: "https://holiznacc0.bandcamp.com/track/something-in-the-air",
  },
  {
    ...albumCredit,
    src: "/audio/a-little-shade.mp3",
    title: "A Little Shade",
    duration: 178.599184,
    source: "https://holiznacc0.bandcamp.com/track/a-little-shade",
  },
  {
    ...albumCredit,
    src: "/audio/laundry-day.mp3",
    title: "Laundry Day",
    duration: 180.035918,
    source: "https://holiznacc0.bandcamp.com/track/laundry-day",
  },
];
