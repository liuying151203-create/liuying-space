const externalUrlPattern = /^(?:[a-z][a-z\d+\-.]*:|#)/i;

export function withBase(path: string) {
  if (!path || externalUrlPattern.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}
