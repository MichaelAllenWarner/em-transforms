import { test, expect } from '@playwright/test';
import { hotkeys } from '../helpers/hotkeys';

// TODO (if feasible): test camera-reset hotkey (`hotkeys.oneKey.resetCamera`)

test('Velocity-vector hotkeys should affect the corresponding input values', async ({
  page,
}) => {
  await page.goto('/');

  const vFieldset = page.getByRole('group', { name: 'boost velocity' });

  const uFieldset = page.getByRole('group', {
    name: 'original particle velocity',
  });

  for (const { fieldset, vectorObjectKey } of [
    { fieldset: vFieldset, vectorObjectKey: 'v' },
    { fieldset: uFieldset, vectorObjectKey: 'u' },
  ] as const) {
    await expect(fieldset).toBeVisible();

    const rInput = fieldset.getByLabel('r');
    const φInput = fieldset.getByLabel('φ');
    const θInput = fieldset.getByLabel('θ');

    const φValue1 = Number(await φInput.inputValue());

    // flip
    await page.keyboard.press(hotkeys.vectorFlip[vectorObjectKey]);
    const φValue2 = Number(await φInput.inputValue());
    expect(φValue2).not.toEqual(φValue1);

    // reset
    await page.keyboard.press(hotkeys.vectorReset[vectorObjectKey]);
    const φValue3 = Number(await φInput.inputValue());
    expect(φValue3).toEqual(φValue1);

    for (const { input, compObjectKey } of [
      { input: rInput, compObjectKey: 'r' },
      { input: φInput, compObjectKey: 'p' },
      { input: θInput, compObjectKey: 't' },
    ] as const) {
      await expect(input).toBeVisible();
      const value1 = Number(await input.inputValue());

      // up
      await page.keyboard.press(
        hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowUp
      );
      const value2 = Number(await input.inputValue());
      expect(value2).toBeGreaterThan(value1);

      // down
      await page.keyboard.press(
        hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowDown
      );
      const value3 = Number(await input.inputValue());
      expect(value3).toBeLessThan(value2);
    }
  }
});

test('Field-vector hotkeys should affect the corresponding input values', async ({
  page,
}) => {
  await page.goto('/');

  const eFieldset = page.getByRole('group', {
    name: 'original electric field',
  });

  const bFieldset = page.getByRole('group', {
    name: 'original magnetic field',
  });

  for (const { fieldset, vectorObjectKey } of [
    { fieldset: eFieldset, vectorObjectKey: 'e' },
    { fieldset: bFieldset, vectorObjectKey: 'b' },
  ] as const) {
    await expect(fieldset).toBeVisible();

    const xInput = fieldset.getByLabel('x');
    const yInput = fieldset.getByLabel('y');
    const zInput = fieldset.getByLabel('z');

    for (const { input, compObjectKey } of [
      { input: xInput, compObjectKey: 'x' },
      { input: yInput, compObjectKey: 'y' },
      { input: zInput, compObjectKey: 'z' },
    ] as const) {
      await expect(input).toBeVisible();
      const value1 = Number(await input.inputValue());

      // up
      await page.keyboard.press(
        hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowUp
      );
      const value2 = Number(await input.inputValue());
      expect(value2).toBeGreaterThan(value1);

      // down
      await page.keyboard.press(
        hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowDown
      );
      const value3 = Number(await input.inputValue());
      expect(value3).toBeLessThan(value2);
    }
  }
});

test('Charge and mass hotkeys should affect the corresponding input values', async ({
  page,
}) => {
  await page.goto('/');

  const fieldset = page.getByRole('group', {
    name: 'charge and mass',
  });

  await expect(fieldset).toBeVisible();

  const qInput = fieldset.getByLabel('q');
  const mInput = fieldset.getByLabel('m');

  for (const { input, objectKey } of [
    { input: qInput, objectKey: 'q' },
    { input: mInput, objectKey: 'm' },
  ] as const) {
    await expect(input).toBeVisible();
    const value1 = Number(await input.inputValue());

    // up
    await page.keyboard.press(hotkeys.particle[objectKey].ArrowUp);
    const value2 = Number(await input.inputValue());
    expect(value2).toBeGreaterThan(value1);

    // down
    await page.keyboard.press(hotkeys.particle[objectKey].ArrowDown);
    const value3 = Number(await input.inputValue());
    expect(value3).toBeLessThan(value2);
  }
});

test('Show/hide hotkeys should toggle the corresponding checkboxes', async ({
  page,
}) => {
  await page.goto('/');

  // first open the "Options" details/summary
  const summary = page.locator('summary').filter({ hasText: 'options' });
  await expect(summary).toBeVisible();
  await summary.click();

  const fieldset = page.getByRole('group', {
    name: 'options',
  });

  await expect(fieldset).toBeVisible();

  const toggleCompsInput = fieldset.getByLabel('show component-vectors');
  const toggleSInput = fieldset.getByLabel('show the poynting vector');
  const toggleUInput = fieldset.getByLabel('show the particle velocity');
  const toggleFInput = fieldset.getByLabel('show the lorentz force');
  const toggleAInput = fieldset.getByLabel(`show the particle's acceleration`);
  const toggleVInput = fieldset.getByLabel('hide the boost-velocity');

  for (const { input, objectKey } of [
    { input: toggleCompsInput, objectKey: 'toggleComps' },
    { input: toggleSInput, objectKey: 'toggleS' },
    { input: toggleUInput, objectKey: 'toggleU' },
    { input: toggleFInput, objectKey: 'toggleF' },
    { input: toggleAInput, objectKey: 'toggleA' },
    { input: toggleVInput, objectKey: 'toggleV' },
  ] as const) {
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();

    const isChecked1 = await input.isChecked();

    // toggle checkbox
    await page.keyboard.press(hotkeys.oneKey[objectKey]);
    const isChecked2 = await input.isChecked();
    expect(isChecked2).not.toEqual(isChecked1);
  }
});
