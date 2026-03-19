# Auto Scroll Extension

A Chrome extension that enables keyboard-controlled auto-scrolling on web pages.

## Features

- Toggle auto-scroll behavior on/off from the popup.
- Press `ArrowDown` to auto-scroll down.
- Press `ArrowUp` to auto-scroll up.
- Press any other key to stop scrolling.
- Disabling the extension immediately stops scrolling.

## Project Files

- `manifest.json` - Extension configuration (Manifest V3).
- `scroll.html` - Popup UI.
- `popup.js` - Popup logic, state persistence, and tab messaging.
- `content.js` - In-page keyboard listener and scrolling behavior.
- `scroll_extension.png` - Extension icon.

## Installation (Load Unpacked)

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select this project folder: `auto-scroll-extension`.
5. Click the extension icon and pin it if needed.

## How To Use

1. Open any normal webpage (`http://` or `https://`).
2. Click the extension icon.
3. Turn **Enabled** on.
4. Focus the webpage and press:
   - `ArrowDown` to start scrolling down
   - `ArrowUp` to start scrolling up
   - Any other key to stop

## Notes

- Auto-scroll works only when the page is focused.
- Chrome internal pages (like `chrome://extensions`) do not allow content scripts.
- If behavior does not update right away, reload the extension once from `chrome://extensions`.
