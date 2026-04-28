export const isBrowser = typeof window !== "undefined";

export const safeLocalStorageGet = (key: string): string | null => {
  if (!isBrowser || typeof window.localStorage === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
};

export const safeLocalStorageSet = (key: string, value: string): void => {
  if (!isBrowser || typeof window.localStorage === "undefined") {
    return;
  }
  window.localStorage.setItem(key, value);
};

export const safeLocalStorageRemove = (key: string): void => {
  if (!isBrowser || typeof window.localStorage === "undefined") {
    return;
  }
  window.localStorage.removeItem(key);
};

export const isNavigatorAvailable = typeof navigator !== "undefined";
