'use client';

import { CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { ReactNode, useMemo, useState } from 'react';
import createCache, { Options as CacheOptions } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { SnackbarProvider } from 'notistack';
import { useServerInsertedHTML } from 'next/navigation';

export interface ThemeRegistryProps {
  readonly children?: ReactNode | ReactNode[];
  readonly options: CacheOptions;
}

export default function ThemeRegistry({ children, options }: ThemeRegistryProps) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }

    let styles = names.map((n) => cache.inserted[n]).join('');

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: options.prepend ? `@layer emotion {${styles}}` : styles,
        }}
      />
    );
  });

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <SnackbarProvider>
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
