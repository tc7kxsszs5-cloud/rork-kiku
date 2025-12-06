import { MutableRefObject, useEffect, useRef } from 'react';

export function useIsMounted(): MutableRefObject<boolean> {
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
}
