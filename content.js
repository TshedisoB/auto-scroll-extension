if (!window.__autoScrollExtensionLoaded) {
  window.__autoScrollExtensionLoaded = true;

  let enabled = false;
  let scrollSpeed = 0;
  let scrollTimer = null;
  const SCROLL_STEP = 0.6;

  const RIGHT_CLICK_SEQUENCE_END_MS = 500;
  let rightClickCount = 0;
  let rightClickSequenceTimer = null;

  function clearRightClickSequenceTimer() {
    if (rightClickSequenceTimer !== null) {
      window.clearTimeout(rightClickSequenceTimer);
      rightClickSequenceTimer = null;
    }
  }

  function applyRightClickSequence() {
    rightClickSequenceTimer = null;
    const n = rightClickCount;
    rightClickCount = 0;
    if (!enabled) {
      return;
    }
    if (n === 1) {
      stopAutoScroll();
    } else if (n === 2) {
      startAutoScroll(SCROLL_STEP);
    } else if (n >= 3) {
      startAutoScroll(-SCROLL_STEP);
    }
  }

  function startAutoScroll(speed) {
    scrollSpeed = speed;
    if (scrollTimer !== null) {
      return;
    }

    scrollTimer = window.setInterval(() => {
      if (!enabled || scrollSpeed === 0) {
        stopAutoScroll();
        return;
      }
      window.scrollBy(0, scrollSpeed);
    }, 16);
  }

  function stopAutoScroll() {
    scrollSpeed = 0;
    if (scrollTimer !== null) {
      window.clearInterval(scrollTimer);
      scrollTimer = null;
    }
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    if (!enabled) {
      stopAutoScroll();
      clearRightClickSequenceTimer();
      rightClickCount = 0;
    }
  }

  chrome.storage.local.get({ autoScrollEnabled: false }, (result) => {
    setEnabled(result.autoScrollEnabled);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes.autoScrollEnabled) {
      return;
    }
    setEnabled(changes.autoScrollEnabled.newValue);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === "AUTO_SCROLL_SET_ENABLED") {
      setEnabled(message.enabled);
    }
  });

  window.addEventListener(
    "keydown",
    (event) => {
      if (!enabled) {
        return;
      }

      const isDown = event.key === "ArrowDown" || event.code === "ArrowDown";
      const isUp = event.key === "ArrowUp" || event.code === "ArrowUp";

      if (isDown) {
        startAutoScroll(SCROLL_STEP);
        return;
      }

      if (isUp) {
        startAutoScroll(-SCROLL_STEP);
        return;
      }

      stopAutoScroll();
    },
    true
  );

  window.addEventListener(
    "mousedown",
    (event) => {
      if (!enabled || event.button !== 2) {
        return;
      }
      event.preventDefault();
      rightClickCount += 1;
      clearRightClickSequenceTimer();
      rightClickSequenceTimer = window.setTimeout(
        applyRightClickSequence,
        RIGHT_CLICK_SEQUENCE_END_MS
      );
    },
    true
  );

  window.addEventListener(
    "contextmenu",
    (event) => {
      if (!enabled) {
        return;
      }
      event.preventDefault();
    },
    true
  );
}
