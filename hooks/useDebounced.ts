import { debounce } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';

type GenericCallback = (...args: unknown[]) => void;

export const useDebounced = (callback: GenericCallback, delay?: number) => {
  const callbackRef = useRef<GenericCallback>();
  const delayRef = useRef<number>(delay ?? 250);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const fn = () => {
      callbackRef.current?.();
    };

    return debounce(fn, delayRef.current);
  }, []);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
