import { expect, Locator, Page } from '@playwright/test';

export const testUp =
  (up: string) =>
  async ({
    page,
    input,
    initialValue,
  }: {
    page: Page;
    input: Locator;
    initialValue: number;
  }) => {
    await page.keyboard.press(up);
    const newValue = Number(await input.inputValue());
    expect(newValue).toBeGreaterThan(initialValue);
  };

export const testDown =
  (down: string) =>
  async ({
    page,
    input,
    initialValue,
  }: {
    page: Page;
    input: Locator;
    initialValue: number;
  }) => {
    await page.keyboard.press(down);
    const newValue = Number(await input.inputValue());
    expect(newValue).toBeLessThan(initialValue);
  };

/** Returns `true` if `candidate` is a JS object (including functions, arrays, etc.). */
export const isObject = (candidate: unknown): candidate is object =>
  Object(candidate) === candidate;

/**
 * Returns all string-values of `obj` and of all its nested object-descendants.
 * Note that "object" here includes all JS objects, such as functions, arrays, etc.
 */
export const deepStringValsOf = (obj: object): string[] =>
  Object.values(obj).flatMap((value) => {
    if (typeof value === 'string') {
      return value;
    }
    if (isObject(value)) {
      return deepStringValsOf(value);
    }
    return [];
  });
