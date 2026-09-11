/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly WEB_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
