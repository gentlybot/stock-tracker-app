/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_KNOCK_PUBLIC_API_KEY: string;
  readonly VITE_KNOCK_FEED_CHANNEL_ID: string;
  readonly VITE_LAUNCHDARKLY_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
