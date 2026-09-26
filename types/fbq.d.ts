// Global type declarations for the Meta (Facebook) Pixel `fbq` function.
export {};

declare global {
  interface Window {
    fbq?: (
      command: 'init' | 'track' | 'trackCustom' | 'consent',
      eventNameOrId?: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}
