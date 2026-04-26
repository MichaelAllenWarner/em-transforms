import { QueryParameterKey } from './QueryParamKey';

/**
 * Returns true if the URL has params but no version param — indicating
 * it was generated before the physics-convention spherical coordinate change.
 */
export const isLegacyUrl = (params: URLSearchParams) =>
  params.toString() !== '' && !params.has(QueryParameterKey.version);

/**
 * Wrapper around `window.history.replaceState` that sets the `v` query parameter to '2',
 * just so we don't have to remember to manage it manually in every place we set query params.
 */
export const replaceUrlParams = (params: URLSearchParams) => {
  params.set(QueryParameterKey.version, '2');
  window.history.replaceState({}, '', `?${params.toString()}`);
};
