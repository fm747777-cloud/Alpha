/**
 * The visitor's project name, typed in the hero. It lives only in this browser tab
 * (sessionStorage) and drives the demo: the 3D screen, the headlines and the form prefill.
 */
const KEY = "alpha-project-name";
const EVENT = "alpha:project-name";
export const MAX_NAME = 26;

export function getProjectName(): string {
  try {
    return (sessionStorage.getItem(KEY) || "").slice(0, MAX_NAME);
  } catch {
    return "";
  }
}

export function setProjectName(value: string) {
  const name = value.replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
  try {
    if (name) sessionStorage.setItem(KEY, name);
    else sessionStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: the name still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}

export function onProjectName(fn: (name: string) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<string>).detail || "");
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
