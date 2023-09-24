import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';

/**
 * This hook uses the lodash debounce-function under the hood. It will
 * work even if `callback` changes during the debounce wait-period
 * (which can happen if `callback` depends on props, say). When the
 * wait-period ends, only the most recently supplied `callback` will
 * be executed. I got the basic idea from the very bottom of this
 * article: https://www.developerway.com/posts/debouncing-in-react#part3
 *
 * @param callback — The function you'd like to debounce. Can be updated during the wait-period.
 * @param wait — The number of milliseconds to delay.
 * @param options — The options object.
 * @param options.leading — Specify invoking on the leading edge of the timeout.
 * @param options.maxWait — The maximum time func is allowed to be delayed before it’s invoked.
 * @param options.trailing — Specify invoking on the trailing edge of the timeout.
 * @return — Returns the new debounced function.
 */
export const useDebounced = <
  T extends (...args: Parameters<T>) => ReturnType<T>
>(
  callback: T,
  wait?: Parameters<typeof debounce>[1],
  options?: Parameters<typeof debounce>[2]
) => {
  // put all the args in a ref so that the `useMemo()` can be dependency-free
  const ref = useRef({ callback, wait, options });

  // update `callback` in the ref if it changes
  useEffect(() => {
    ref.current.callback = callback;
  }, [callback]);

  // will only run on mount (b/c empty dependency-array)
  const debouncedCallback = useMemo(() => {
    // will always use the latest `callback` when called
    const fn = (...args: Parameters<T>) => ref.current.callback(...args);

    return debounce(fn, ref.current.wait, ref.current.options);
  }, []);

  /*
    clean-up (cancel debounce, in case it's mid-wait);
    will only run on unmount (b/c `debouncedCallback` never changes before then)
  */
  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};
