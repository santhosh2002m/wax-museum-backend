/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add more env variables here if you need
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
