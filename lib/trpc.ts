import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const PROJECT_BASE_URL = 'https://d8v7u672uumlfpscvnbps.rork.live';

type ExpoExtra = {
  rork?: { apiBaseUrl?: string };
  devServer?: { url?: string };
  expoGo?: {
    debuggerHost?: string;
    metroServerUrl?: string;
  };
};

const isLocalHost = (host?: string | null) => {
  if (!host) {
    return false;
  }

  const normalized = host.toLowerCase();
  return (
    normalized.includes('localhost') ||
    normalized.startsWith('127.') ||
    normalized.startsWith('10.') ||
    normalized.startsWith('192.168.') ||
    normalized.endsWith('.local')
  );
};

const normalizeDevServerUrl = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const sanitized = trimmed
    .replace(/^exp:\/\//i, 'http://')
    .replace(/^ws:\/\//i, 'http://')
    .replace(/^wss:\/\//i, 'https://');

  if (sanitized.startsWith('http://') || sanitized.startsWith('https://')) {
    return sanitized.replace(/\/$/, '');
  }

  return `http://${sanitized}`.replace(/\/$/, '');
};

const getDevServerFromExtras = () => {
  const extra = Constants.expoConfig?.extra as ExpoExtra | undefined;
  if (!extra) {
    return null;
  }

  const candidates = [
    extra.rork?.apiBaseUrl,
    extra.devServer?.url,
    extra.expoGo?.metroServerUrl,
    extra.expoGo?.debuggerHost,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeDevServerUrl(candidate);
    if (!normalized) {
      continue;
    }

    try {
      const parsed = new URL(normalized);
      if (isLocalHost(parsed.hostname)) {
        console.log('[tRPC] Using Expo extra host:', normalized);
        return normalized;
      }
    } catch (error) {
      console.warn('[tRPC] Failed to parse extra host candidate:', candidate, error);
    }
  }

  return null;
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('[tRPC] Using base URL from env:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;
    if (isLocalHost(hostname)) {
      console.log('[tRPC] Using window origin:', origin);
      return origin;
    }
  }

  const extraHost = getDevServerFromExtras();
  if (extraHost) {
    return extraHost;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const normalizedHost = normalizeDevServerUrl(hostUri);
    if (normalizedHost) {
      try {
        const parsed = new URL(normalizedHost);
        if (isLocalHost(parsed.hostname)) {
          console.log('[tRPC] Using Expo hostUri:', normalizedHost);
          return normalizedHost;
        }
      } catch (error) {
        console.warn('[tRPC] Failed to parse hostUri:', hostUri, error);
      }
    }
  }

  console.log('[tRPC] Falling back to project domain:', PROJECT_BASE_URL);
  return PROJECT_BASE_URL;
};

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});

export const trpcVanillaClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
