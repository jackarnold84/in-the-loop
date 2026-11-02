export const normalizePath = (path: string, prefix = ''): string => {
  const url = new URL(path, 'https://in-the-loop.local');
  let pathname = url.pathname;
  const cleanPrefix = prefix.replace(/\/$/, '');
  if (cleanPrefix && (pathname === cleanPrefix || pathname.startsWith(`${cleanPrefix}/`))) {
    pathname = pathname.slice(cleanPrefix.length);
  }
  pathname = `/${pathname.replace(/^\/+|\/+$/g, '')}`;
  url.searchParams.sort();
  const search = url.searchParams.toString();
  return `${pathname}${search ? `?${search}` : ''}`;
};

export const nearbyBackPath = (source?: string, prefix = '') => {
  if (!source) return { to: '/nearby', text: 'Back to Nearby Stops' };
  const normalized = normalizePath(source, prefix);
  const url = new URL(normalized, 'https://in-the-loop.local');
  if (url.pathname !== '/nearby') return { to: '/nearby', text: 'Back to Nearby Stops' };
  return {
    to: normalized,
    text: url.searchParams.has('stop') ? 'Back to Transfers' : 'Back to Nearby Stops',
  };
};
