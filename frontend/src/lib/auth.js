const TOKEN_KEY = 'techelpdesk_token';
const USER_KEY = 'techelpdesk_user';
const SESSION_EVENT = 'techelpdesk-session';

function isBrowser() {
  return typeof window !== 'undefined';
}

export function saveSession(data) {
  if (!isBrowser()) return;

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  if (!isBrowser()) return null;

  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function logout() {
  if (!isBrowser()) return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getAuthSnapshot() {
  if (!isBrowser()) return 'checking';
  return isAuthenticated() ? 'authenticated' : 'guest';
}

export function subscribeAuth(callback) {
  if (!isBrowser()) return () => {};

  window.addEventListener('storage', callback);
  window.addEventListener(SESSION_EVENT, callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SESSION_EVENT, callback);
  };
}
