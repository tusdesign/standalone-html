/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type WithId<T> = T & { id: number };
