# Sky Beach Restaurant & Bar Website

A complete multi-page promotional website for Sky Beach Restaurant & Bar in
Jamaica. The design uses the business's supplied photography and information,
with a tropical coastal visual system, animated hero tabs, organic wave
transitions and mobile-first responsive layouts.

## Pages included

- Home
- About Us
- Venue
- Services
- Menu
- Events & Reservations
- Gallery
- Live Performances
- Careers
- Contact

## Live Performances page

`/live` collects the nights filmed at Sky Beach. Hovering a video plays a silent
preview; clicking or tapping it blacks out the page and plays it with sound.

Everything on the page comes from `lib/live-data.ts`. To add a performance, add
an entry to `liveVideos` (write its story only from facts that can be verified:
the video's title and description, its date, what is visible on screen) and list
its `id` in one of the `liveSections`.

- **YouTube videos** need only the video id, a `previewStart` second for the hover
  preview, and a poster image in `public/images/live/`.
- **Videos hosted on the site** go in `public/videos/live/` as an H.264/AAC MP4 with
  its moov atom first (`ffmpeg -c copy -movflags +faststart`), plus a ~6 second
  silent `*.preview.mp4` loop, and a poster in `public/images/live/`.

Safari and iPhones will only play a video if the server answers HTTP Range
requests. vinext's own static server does not, so `npm start` runs
`scripts/serve.mjs`, which adds Range support for `/videos/*` and hands every
other request to vinext. Keep the host's start command as `npm start`.

## Customer enquiries

Reservation, venue, event and catering forms prepare the customer's details and
open WhatsApp to send the request directly. Contact details can be updated in
`lib/site-data.ts`.

## Run locally

1. Install Node.js 22 or later.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Production build

Run `npm run build` to generate the production-ready site.

## Important handoff note

The supplied business deck contains different telephone numbers on some older
slides. This website uses the contact details repeated on the About slide and
food menu artwork:

- Landline: (876) 956-5006
- Mobile / WhatsApp: (876) 547-3971
- Email: skybeach24@gmail.com

Confirm these details with the client before connecting the website to the live
domain.
