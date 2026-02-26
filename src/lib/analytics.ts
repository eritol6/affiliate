export function trackEvent(eventName: string, payload?: Record<string, string>) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics placeholder]", eventName, payload ?? {});
  }
}
