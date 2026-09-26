// LocalStorage, SessionStorage, Cookies, Cross-Tab Broadcast, and Undo History

// --- Cookie Utilities ---
export function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(typeof value === "object" ? JSON.stringify(value) : String(value))}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {
    // Cookie access denied or unavailable in sandboxed environment
  }
}

export function getCookie(name, defaultValue = null) {
  try {
    const nameEQ = encodeURIComponent(name) + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) {
        const raw = decodeURIComponent(c.substring(nameEQ.length));
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      }
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

export function deleteCookie(name) {
  try {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch {
    // Cookie removal ignored
  }
}

// --- Cross-Tab Real-time Broadcast Channel ---
const broadcastChannel = typeof window !== "undefined" && "BroadcastChannel" in window
  ? new BroadcastChannel("hire_ecosystem_sync")
  : null;

export function broadcastAction(actionType, data = null) {
  const payload = { type: actionType, data, timestamp: Date.now() };

  // 1. BroadcastChannel for instant 0ms cross-tab delivery
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch {
      // Ignored if channel is closed
    }
  }

  // 2. LocalStorage trigger so native window "storage" event triggers in other tabs
  try {
    localStorage.setItem("hire_sync_trigger", JSON.stringify(payload));
  } catch {
    // Storage access issue
  }

  // 3. Set cookie timestamp for session sync audit
  setCookie("hire_last_sync", payload.timestamp, 1);

  // 4. In-tab custom event
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hire_local_sync", { detail: payload }));
  }
}

// --- Subscription Helper for React Components ---
export function subscribeToSync(onSync) {
  if (typeof window === "undefined") {
    return function() {};
  }

  function handleBroadcast(event) {
    if (event && event.data) {
      onSync(event.data);
    }
  }

  function handleStorage(event) {
    if (event.key && event.key.startsWith("hire_")) {
      try {
        const payload = event.key === "hire_sync_trigger" && event.newValue
          ? JSON.parse(event.newValue)
          : { type: "STORAGE_CHANGE", key: event.key, timestamp: Date.now() };
        onSync(payload);
      } catch {
        onSync({ type: "STORAGE_CHANGE", key: event.key, timestamp: Date.now() });
      }
    }
  }

  function handleLocal(event) {
    if (event && event.detail) {
      onSync(event.detail);
    }
  }

  function handleFocus() {
    onSync({ type: "TAB_FOCUSED", timestamp: Date.now() });
  }

  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcast);
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener("hire_local_sync", handleLocal);
  window.addEventListener("focus", handleFocus);

  return function unsubscribe() {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcast);
    }
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("hire_local_sync", handleLocal);
    window.removeEventListener("focus", handleFocus);
  };
}

// --- Undo History Management ---
const UNDO_KEY = "hire_undo_history";

export function recordUndoSnapshot(actionLabel, snapshotData) {
  try {
    const existing = getShared(UNDO_KEY, []);
    const entry = {
      id: Date.now(),
      label: actionLabel,
      timestamp: new Date().toLocaleTimeString(),
      snapshot: snapshotData
    };
    // Keep max 25 historical snapshots
    const nextList = [entry, ...existing].slice(0, 25);
    setShared(UNDO_KEY, nextList, false);
    broadcastAction("UNDO_HISTORY_UPDATED", { count: nextList.length });
  } catch {
    // Snapshot save failure ignored
  }
}

export function getUndoHistory() {
  return getShared(UNDO_KEY, []);
}

export function undoLastAction() {
  try {
    const history = getShared(UNDO_KEY, []);
    if (history.length === 0) return null;

    const [latest, ...remaining] = history;
    const snapshot = latest.snapshot;

    // Restore snapshots for included state keys
    if (snapshot.properties) {
      localStorage.setItem("hire_properties", JSON.stringify(snapshot.properties));
    }
    if (snapshot.users) {
      localStorage.setItem("hire_users", JSON.stringify(snapshot.users));
    }
    if (snapshot.reports) {
      localStorage.setItem("hire_reports", JSON.stringify(snapshot.reports));
    }
    if (snapshot.reviews) {
      localStorage.setItem("hire_reviews", JSON.stringify(snapshot.reviews));
    }

    setShared(UNDO_KEY, remaining, false);
    broadcastAction("STATE_RESTORED", { undoneLabel: latest.label });
    return latest;
  } catch {
    return null;
  }
}

export function clearUndoHistory() {
  try {
    localStorage.removeItem(UNDO_KEY);
    broadcastAction("UNDO_HISTORY_CLEARED");
  } catch {
    // Ignored
  }
}

// --- Shared (LocalStorage) Storage Access ---
export function getShared(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setShared(key, value, notify = true) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    setCookie(key + "_updated", Date.now(), 7);
    if (notify) {
      broadcastAction("STORAGE_SET", { key, value });
    }
  } catch {
    // Storage quota exceeded or disabled
  }
}

// --- Session (SessionStorage) Storage Access ---
export function getSession(key, defaultValue) {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // SessionStorage write error
  }
}
