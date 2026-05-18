/// <reference types="vite/client" />

import type { AppBridge } from '../../preload'

declare global {
  interface Window {
    chararium: AppBridge
  }
}

export {}
