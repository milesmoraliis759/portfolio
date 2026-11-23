"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "harsh-local-storage-change";

function subscribe(callback: () => void) {
  const notify = () => callback();
  window.addEventListener("storage", notify);
  window.addEventListener(STORAGE_CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(STORAGE_CHANGE_EVENT, notify);
  };
}

export function useLocalStorageSnapshot(key: string) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? "[]";
    } catch {
      return "[]";
    }
  }, [key]);
  const getServerSnapshot = useCallback(() => null, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function writeLocalStorageSnapshot(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  } catch {
    // The current page remains usable when browser storage is unavailable.
  }
}
