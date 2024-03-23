/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_WEBSOCKET_ENDPOINT: string
  readonly VITE_APP_API_URL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}