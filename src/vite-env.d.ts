/// <reference types="vite/client" />

// Define global types for Vite-injected constants
declare const __APP_VERSION__: string;

// Extend ImportMetaEnv to include our custom env variable
interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
