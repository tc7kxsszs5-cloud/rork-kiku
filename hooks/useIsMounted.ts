import { MutableRefObject, useEffect, useRef } from 'react';

export function useIsMounted(): MutableRefObject<boolean> {
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
