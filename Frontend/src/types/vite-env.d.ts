/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other Vite environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
