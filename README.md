# Lovingly

Yours Lovingly is a simple memory-page builder for personal event microsites.

## Current Prototype

- Minimal centered home page
- Demo Google login button
- User dashboard at `/user`
- Dashboard with 3 active event limit
- Event creation and editor flow
- Multiple messages
- Photo upload limit UI with browser compression
- Theme colors and elements
- Public memory page at `/page/:slug`
- Samples page at `/samples`

## Brand Direction

- Main app theme: neon pink, warm beige, and light sky blue
- Home headline: Lovingly
- Subtitle: Event microsite builder
- Focus first on a polished builder, samples, templates, public page design, and mobile responsiveness.

## Later Feature Notes

- Google Drive publishing is not part of the immediate MVP.
- Later option: save each published event as a creator-owned Drive JSON file and use Drive sharing permissions for private, restricted, or link-viewable pages.
- Spotify is not part of MVP.
- Later option: add one optional Spotify song or playlist link field.
- Public page can render an official Spotify embed with a manual play action.
- Do not build background autoplay music with Spotify because of browser, account, and policy restrictions.

## Development

```bash
npm install
npm run dev
npm run build
```
