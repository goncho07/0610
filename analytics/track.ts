/**
 * A simple analytics tracking function.
 * This is a lightweight wrapper around a potential global analytics object.
 * @param event The name of the event to track.
 * @param props An optional object of properties to associate with the event.
 */
export function track(event: string, props?: Record<string, any>) {
  (window as any).analytics?.track?.(event, props);
}
