const enabledToggle = document.getElementById("enabled");
const statusEl = document.getElementById("status");

function setStatusText(enabled) {
  statusEl.textContent = enabled ? "Status: Enabled" : "Status: Disabled";
}

function notifyActiveTab(enabled) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.id) {
      return;
    }

    const sendState = () => {
      chrome.tabs.sendMessage(activeTab.id, {
        type: "AUTO_SCROLL_SET_ENABLED",
        enabled,
      });
    };

    if (!enabled) {
      sendState();
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: activeTab.id },
        files: ["content.js"],
      },
      () => {
        sendState();
      }
    );
  });
}

chrome.storage.local.get({ autoScrollEnabled: false }, (result) => {
  const enabled = Boolean(result.autoScrollEnabled);
  enabledToggle.checked = enabled;
  setStatusText(enabled);
  notifyActiveTab(enabled);
});

enabledToggle.addEventListener("change", () => {
  const enabled = enabledToggle.checked;
  chrome.storage.local.set({ autoScrollEnabled: enabled }, () => {
    setStatusText(enabled);
    notifyActiveTab(enabled);
  });
});