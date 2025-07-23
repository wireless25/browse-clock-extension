# ⏰ ChronoTab
> Chrome extension to track time spent on tabs

![Preview of the extension](https://raw.githubusercontent.com/wireless25/chrome-ext-surf-duration/main/preview.jpg)

## Development
### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets (mainly for `manifest.json`).
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

### Development

```bash
pnpm dev
```

To preview the extension, open `chrome://extensions/` in Chrome or `about:debugging#/runtime/this-firefox` in Firefox, and load the `extension/` folder as an unpacked extension. Make sure dev mode is enabled.

For Firefox development:

```bash
pnpm dev-firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommended for cleaner hard reloading.

### Build

To build the extension, run

```bash
pnpm build
```

And then pack files under `extension`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.

## Credits
[Vitesse-Webext](https://github.com/antfu-collective/vitesse-webext) was used as a base for this extension.
