import debounce from 'lodash/debounce';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

/**
 * Uses `useEffect` on server and `useLayoutEffect` on client,
 * really just to silence the console warning about using
 * `useLayoutEffect` on the server.
 */
const useIsomorphicEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * This hook uses the Lodash debounce-function under the hood.
 * The returned value will always be a stable reference to the
 * debounced function. For information about the return-value
 * and the second and third parameters (`wait` and `options`),
 * you should consult the Lodash documentation:
 * https://lodash.com/docs/#debounce.
 *
 * The first parameter (`callback`), however, is *not* passed directly
 * to the Lodash debounce-function. Rather, an "in-between" function
 * created by the hook is passed in, and this "in-between" function
 * will always call the most recently supplied value of `callback` when
 * it executes. This makes it easy to deal with situations where your
 * callback-logic must depend on props or state that may change: instead
 * of having to prepare a memoized function that accepts the relevant
 * prop/state values as arguments, you can just pass in a non-memoized
 * function that uses those values directly. Every time the hook is
 * called, it will update the debounced callback-logic if `callback`
 * has changed, but it will always return the same stable reference to
 * the debounced function. This works even if `callback` changes during
 * a debounce wait-period. The basic idea for this mechanism comes from
 * these two articles:
 *
 * - https://epicreact.dev/the-latest-ref-pattern-in-react/
 * - https://www.developerway.com/posts/debouncing-in-react#part3
 *
 * By default, the debounced-function will be "canceled" on unmount.
 * This is usually a good idea, because otherwise the function may
 * execute *after* unmount and try to access things in the owning
 * component that no longer exist. However, if you know that that's
 * not a concern in your use-case and would like to allow the function
 * to run even after unmount (or if for some reason you'd like to handle
 * the cancel-on-unmount mechanism yourself), then you can override this
 * default behavior by passing `true` for `suppressUnmountCancel`
 * (the 4th argument).
 *
 * Unlike `callback`, the other arguments cannot be changed after the
 * hook-instance is initialized. Passing in new values for `wait`,
 * `options`, or `suppressUnmountCancel` will have no effect.
 * The `wait` and `options` arguments in particular are prevented from
 * being updated because allowing them to change is mutually exclusive
 * with guaranteeing that the returned function is a stable reference.
 */
export const useDebounced = <
  T extends (...args: Parameters<T>) => ReturnType<T>,
>(
  callback: T,
  wait?: Parameters<typeof debounce>[1],
  options?: Parameters<typeof debounce>[2],
  suppressUnmountCancel?: boolean,
) => {
  // put all the args in a ref so that they can be excluded from dependency arrays
  const ref = useRef({ callback, wait, options, suppressUnmountCancel });

  // update `callback` in the ref if it changes
  useIsomorphicEffect(() => {
    ref.current.callback = callback;
  }, [callback]);

  // stable reference (b/c empty dependency array)
  const debouncedCallback = useMemo(() => {
    // will always use the latest `callback` when called
    const fn = (...args: Parameters<T>) => ref.current.callback(...args);
    return debounce(fn, ref.current.wait, ref.current.options);
  }, []);

  // cancel the debounce on unmount (unless the user has opted out)
  useEffect(() => {
    if (ref.current.suppressUnmountCancel) return;
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]); // stable reference, so clean-up will only run on unmount

  return debouncedCallback;
};
