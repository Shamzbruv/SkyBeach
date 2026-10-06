/**
 * Content for the "Live Performances" page (/live).
 *
 * Everything on that page is driven from this file: to add a performance, add
 * an entry to `liveVideos` and list its id in one of the `liveSections`.
 *
 * Stories are written only from what can be verified: the YouTube titles,
 * descriptions and dates, the original captions of the video files, and what is
 * visible in the footage itself. Keep that standard when adding more.
 */

export type YouTubeSource = {
  kind: "youtube";
  id: string;
  /** Second at which the silent hover preview begins (long concerts start mid-show). */
  previewStart: number;
  channel: string;
  channelUrl: string;
};

export type FileSource = {
  kind: "file";
  /** The full video, under /public/videos/live. */
  src: string;
  /** A ~6 second silent loop used for the hover preview. */
  preview: string;
};

export type LiveVideo = {
  id: string;
  title: string;
  /** Short line above the title: the occasion, the date, the artist. */
  kicker: string;
  story: string;
  quote?: { text: string; source: string };
  tags: string[];
  poster: string;
  posterAlt: string;
  /** Native pixel size: sets the player's shape and stops low-res clips being over-enlarged. */
  width: number;
  height: number;
  durationSeconds: number;
  /** ISO date the video was published (YouTube videos only). */
  publishedAt?: string;
  source: YouTubeSource | FileSource;
  link?: { href: string; label: string };
};

export type LiveLayout = "pair" | "features" | "stage";

export type LiveSection = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  layout: LiveLayout;
  videoIds: string[];
};

const hezronChannel = {
  channel: "Hezron Official",
  channelUrl: "https://www.youtube.com/@HezronOfficial",
};

export const liveVideos: LiveVideo[] = [
  {
    id: "cant-tek-di-pressure",
    title: "Can’t Tek Di Pressure",
    kicker: "Hezron’s Sky Beach Show · A birthday for Mrs. Mack",
    story:
      "A song for anyone who has carried a heavy load and kept walking. Hezron sings it live at Sky Beach on a night that doubled as a birthday celebration for Mrs. Mack, a keyboardist at his shoulder and his eyes closed through the verses.",
    quote: {
      text: "The strongest people aren’t those who’ve never faced pressure—they’re the ones who kept going through it.",
      source: "From the video’s description",
    },
    tags: ["Live at Sky Beach", "Roots reggae"],
    poster: "/images/live/cant-tek-di-pressure.webp",
    posterAlt: "Hezron singing with his eyes closed into a microphone, a keyboardist in headphones behind him",
    width: 1920,
    height: 1080,
    durationSeconds: 295,
    publishedAt: "2026-08-01",
    source: { kind: "youtube", id: "8VhC71yXBvY", previewStart: 15, ...hezronChannel },
  },
  {
    id: "smile-today",
    title: "Smile Today",
    kicker: "Live at Sky Beach · A tribute to Mrs. Mack",
    story:
      "Arms wide, a full band at his back and fairy lights strung along the stage posts: Hezron performs ‘Smile Today’ live at Sky Beach as a tribute to Mrs. Mack.",
    tags: ["Full band", "Live at Sky Beach"],
    poster: "/images/live/smile-today.webp",
    posterAlt: "Hezron on the Sky Beach stage at night, arms outstretched, with a full band behind him",
    width: 1276,
    height: 718,
    durationSeconds: 90,
    source: { kind: "file", src: "/videos/live/smile-today.mp4", preview: "/videos/live/smile-today.preview.mp4" },
  },
  {
    id: "mothers-day-2024",
    title: "A Mother’s Day Celebration",
    kicker: "Hezron + Noddy Virtue · Sunday 12 May 2024",
    story:
      "A musical treat dedicated to mothers everywhere. Beneath an arch dressed in gold ribbon and string lights, Noddy Virtue and Hezron share the front of the stage for soulful, heartfelt renditions, backed by the Hardshield One Drop Band. Showtime was 7 p.m.; the full recording runs 2 hours 37 minutes.",
    tags: ["Full concert", "Live band"],
    poster: "/images/live/mothers-day-2024.webp",
    posterAlt: "Hezron in a floral shirt and blue cap, one arm raised, singing beside a guitarist with an orange electric guitar",
    width: 1920,
    height: 1080,
    durationSeconds: 9414,
    publishedAt: "2024-05-13",
    source: { kind: "youtube", id: "s6JHF3IpAWo", previewStart: 3480, ...hezronChannel },
  },
  {
    id: "valentines-2017",
    title: "The Valentine’s Concert",
    kicker: "Sky Beach presents Hezron & Friends · February 2017",
    story:
      "The video opens on a title card: Sky Beach presents Hezron & Friends. What follows is a Valentine’s Day concert, with Hezron, “the soulful reggae singer”, performing many of his hits beneath a canopy-covered stage, a live band and a saxophonist behind him and a giant screen carrying his face.",
    tags: ["Full concert", "Live band"],
    poster: "/images/live/valentines-2017.webp",
    posterAlt: "Hezron in a grey beanie singing in front of a giant video screen showing his face",
    width: 1920,
    height: 1080,
    durationSeconds: 6164,
    publishedAt: "2017-02-22",
    source: {
      kind: "youtube",
      id: "JlE9im35BSw",
      previewStart: 960,
      channel: "Rico Vibes",
      channelUrl: "https://www.youtube.com/@RicoVibes",
    },
  },
  {
    id: "blame-it-on-the-wine",
    title: "Blame It On The Wine",
    kicker: "Live at Sky Beach · Official video out now",
    story:
      "A full-band moment from the Sky Beach stage: Hezron mid-song with a cup held high, backing vocalists beside him and a drum kit glowing behind. The official video for ‘Blame It On The Wine’ is out now on Hezron’s channel.",
    tags: ["Full band", "Live at Sky Beach"],
    poster: "/images/live/blame-it-on-the-wine.webp",
    posterAlt: "Hezron raising a cup mid-song on the Sky Beach stage, backing vocalists and a drum kit behind him",
    width: 1276,
    height: 718,
    durationSeconds: 51,
    source: {
      kind: "file",
      src: "/videos/live/blame-it-on-the-wine.mp4",
      preview: "/videos/live/blame-it-on-the-wine.preview.mp4",
    },
    link: { href: "https://www.youtube.com/@HezronOfficial", label: "See more on Hezron Official" },
  },
  {
    id: "holding-on",
    title: "Holding On",
    kicker: "Live at Sky Beach",
    story:
      "Shot vertically on a phone, close to the stage: Hezron in white and a patterned cap, fist raised, his backing vocalists behind him beneath a blue arch strung with lights.",
    tags: ["Full band", "Live at Sky Beach"],
    poster: "/images/live/holding-on.webp",
    posterAlt: "Hezron in white with a raised fist on a wooden stage beneath a blue arch of lights, backing vocalists behind him",
    width: 720,
    height: 1280,
    durationSeconds: 89,
    source: { kind: "file", src: "/videos/live/holding-on.mp4", preview: "/videos/live/holding-on.preview.mp4" },
  },
  {
    id: "fathers-day",
    title: "A Father’s Day Thank-You",
    kicker: "Father’s Day",
    story:
      "A Father’s Day night washed in purple and green stage light, filmed from among the audience. The original caption thanks @ritesideofred1 for having the artist perform.",
    tags: ["Live band", "Father’s Day"],
    poster: "/images/live/fathers-day.webp",
    posterAlt: "A singer in a white cap performing under purple stage lights with a band, filmed from the audience",
    width: 720,
    height: 1280,
    durationSeconds: 59,
    source: { kind: "file", src: "/videos/live/fathers-day.mp4", preview: "/videos/live/fathers-day.preview.mp4" },
  },
  {
    id: "acoustics-in-paradise",
    title: "Acoustics in Paradise",
    kicker: "Unplugged · Live at Sky Beach",
    story:
      "Strip the band back and the night gets closer: Hezron on acoustic guitar, hand drums, keys and backing vocals under an open sky, with colored lights washing the wall behind. The set features ‘Taxi Driver’.",
    tags: ["Acoustic", "Live at Sky Beach"],
    poster: "/images/live/acoustics-in-paradise.webp",
    posterAlt: "An acoustic ensemble on a night-time stage: a guitarist in a white head wrap, hand drums, keys and backing vocalists",
    width: 426,
    height: 234,
    durationSeconds: 152,
    source: {
      kind: "file",
      src: "/videos/live/acoustics-in-paradise.mp4",
      preview: "/videos/live/acoustics-in-paradise.preview.mp4",
    },
  },
  {
    id: "in-concert",
    title: "In Concert, Unplugged",
    kicker: "Unplugged · Shared by Jbell Ent TV",
    story:
      "Ten quiet minutes in white against the dark: Hezron on guitar, a second musician beside him, nothing between the music and the night but a few lights.",
    tags: ["Acoustic", "Full set"],
    poster: "/images/live/in-concert.webp",
    posterAlt: "Hezron in white with an acoustic guitar singing at a microphone, a musician in red beside him",
    width: 426,
    height: 240,
    durationSeconds: 614,
    source: { kind: "file", src: "/videos/live/in-concert.mp4", preview: "/videos/live/in-concert.preview.mp4" },
  },
];

export const liveSections: LiveSection[] = [
  {
    id: "mrs-mack",
    eyebrow: "Hezron’s Sky Beach Show",
    title: "Two songs for Mrs. Mack.",
    text: "Some nights are bigger than the setlist. Here are two performances dedicated to Mrs. Mack: a birthday celebration, and a tribute, both sung at Sky Beach.",
    layout: "pair",
    videoIds: ["cant-tek-di-pressure", "smile-today"],
  },
  {
    id: "concerts",
    eyebrow: "Full concert nights",
    title: "Settle in for the whole evening.",
    text: "Two complete concerts, filmed at Sky Beach years apart: a Valentine’s show in 2017 and a Mother’s Day celebration in 2024.",
    layout: "features",
    videoIds: ["mothers-day-2024", "valentines-2017"],
  },
  {
    id: "stage",
    eyebrow: "On the Sky Beach stage",
    title: "Band, backing vocals and a sky full of lights.",
    text: "Shorter moments from the stage, a few of them shot on phones from right beside the action.",
    layout: "stage",
    videoIds: ["blame-it-on-the-wine", "holding-on", "fathers-day"],
  },
  {
    id: "unplugged",
    eyebrow: "Unplugged",
    title: "Turn the volume down and the night gets closer.",
    text: "Acoustic guitars, hand drums and voices, nothing in the way. These two sets were captured on simple cameras, so the picture is soft and the music is the point.",
    layout: "pair",
    videoIds: ["acoustics-in-paradise", "in-concert"],
  },
];

/* ── helpers ── */

export const liveVideoById = (id: string) => liveVideos.find((video) => video.id === id);

export const isPortrait = (video: LiveVideo) => video.height > video.width;

/** 295 → "4:55", 9414 → "2:36:54" */
export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/** 16928 → "4 h 42 m" */
export function formatTotalDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours} h ${minutes} m` : `${minutes} m`;
}

/** ISO 8601 duration for structured data: 9414 → "PT2H36M54S" */
export function isoDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds || (!hours && !minutes) ? `${seconds}S` : ""}`;
}

/** "2026-08-01" → "Aug 2026" */
export function formatMonthYear(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

type EmbedMode = "player" | "preview";

/**
 * youtube-nocookie.com embed URL. "preview" is the silent, chrome-less loop
 * shown on hover; "player" is the full player opened in the lightbox.
 * `origin` is only needed for the preview (it listens for the player's
 * "now playing" signal over postMessage).
 */
export function youtubeEmbedUrl(source: YouTubeSource, mode: EmbedMode, origin?: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    playsinline: "1",
    modestbranding: "1",
    iv_load_policy: "3",
  });
  if (mode === "preview") {
    params.set("mute", "1");
    params.set("controls", "0");
    params.set("disablekb", "1");
    params.set("fs", "0");
    params.set("start", String(source.previewStart));
    params.set("enablejsapi", "1");
    if (origin) params.set("origin", origin);
  }
  return `https://www.youtube-nocookie.com/embed/${source.id}?${params.toString()}`;
}
