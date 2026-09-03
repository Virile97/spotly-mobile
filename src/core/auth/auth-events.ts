type AuthEvent = 'unauthorized' | 'logout';
type AuthEventListener = () => void;

const listeners = new Map<AuthEvent, Set<AuthEventListener>>();

export const authEvents = {
  on(event: AuthEvent, listener: AuthEventListener): () => void {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(listener);
    return () => listeners.get(event)?.delete(listener);
  },
  emit(event: AuthEvent): void {
    listeners.get(event)?.forEach((listener) => listener());
  },
};
