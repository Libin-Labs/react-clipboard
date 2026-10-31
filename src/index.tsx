'use client';
import { useEffect, useRef, useState } from 'react';
export function useClipboard({
  maxLength = 1048576,
  resetAfter = 2000,
}: {
  maxLength?: number;
  resetAfter?: number;
} = {}) {
  if (
    !Number.isInteger(maxLength) ||
    maxLength < 1 ||
    maxLength > 1048576 ||
    !Number.isFinite(resetAfter) ||
    resetAfter < 0 ||
    resetAfter > 60000
  )
    throw new RangeError('Invalid clipboard limits.');
  const [status, setStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [permission, setPermission] = useState<PermissionState | 'unknown'>('unknown');
  const alive = useRef(false);
  const token = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      token.current += 1;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  const copy = async (text: string): Promise<boolean> => {
    const attempt = ++token.current;
    if (timer.current) clearTimeout(timer.current);
    setStatus('copying');
    setError(null);
    try {
      if (typeof text !== 'string' || text.length > maxLength)
        throw new RangeError('Clipboard text exceeds its limit.');
      if (
        typeof window === 'undefined' ||
        window.isSecureContext === false ||
        !navigator.clipboard?.writeText
      )
        throw new Error(
          'Clipboard writes require a secure context, user activation and browser support.',
        );
      await navigator.clipboard.writeText(text);
      if (!alive.current || token.current !== attempt) return false;
      setStatus('success');
      if (resetAfter)
        timer.current = setTimeout(() => {
          if (alive.current) setStatus('idle');
        }, resetAfter);
      return true;
    } catch (failure) {
      if (alive.current && token.current === attempt) {
        setStatus('error');
        setError(failure instanceof Error ? failure : new Error(String(failure)));
      }
      return false;
    }
  };
  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName,
      });
      if (alive.current) setPermission(result.state);
      return result.state;
    } catch {
      if (alive.current) setPermission('unknown');
      return 'unknown' as const;
    }
  };
  return {
    copy,
    status,
    error,
    permission,
    checkPermission,
    reset: () => {
      token.current += 1;
      if (timer.current) clearTimeout(timer.current);
      setStatus('idle');
      setError(null);
    },
  };
}
export default useClipboard;
