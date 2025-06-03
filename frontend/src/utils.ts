export function debounce(callback, delay = 250) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  }
};

export const q = {
  post: (url: string, data: any) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  get: (url: string) =>
    fetch(url).then(res => res.json()),

  delete: (url: string) =>
    fetch(url, { method: 'DELETE' }).then(res => res.json()),
};