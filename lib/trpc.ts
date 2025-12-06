import { createTRPCReact } from "@trpc/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import Constants from "expo-constants";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const PROJECT_BASE_URL = 'https://d8v7u672uumlfpscvnbps.rork.live';

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

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const [hostname] = hostUri.split(':');
    if (isLocalHost(hostname)) {
      const normalizedHost = hostUri.startsWith('http') ? hostUri : `http://${hostUri}`;
      console.log('[tRPC] Using Expo hostUri:', normalizedHost);
      return normalizedHost.replace(/\/?$/, '');
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
