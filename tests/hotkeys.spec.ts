import { test, expect, Locator } from '@playwright/test';
import { isProxy } from 'util/types';
import { hotkeys as _hotkeys } from '../helpers/hotkeys';
import { testUp, testDown, deepStringValsOf, isObject } from './helpers';

/*
  TODO (if feasible): test camera-reset hotkey (`hotkeys.oneKey.resetCamera`)
    - I think would require snapshot-comparison and some canvas-click/dragging?
  TODO: improve flip/reset tests
  TODO: can (and should) we combine spherical and cartesian sets?
*/

type Fieldset = { fieldset: Locator };
type Input = { input: Locator; initialValue: number };
type Checkbox = { checkbox: Locator; initialChecked: boolean };

/**
 * Initially includes all hotkeys. When a hotkey is tested,
 * it gets removed. At the end of testing, will only
 * contain those hotkeys that weren't tested at all.
 * (See final test at bottom of file.)
 */
const untestedHotkeys = new Set(deepStringValsOf(_hotkeys));

/** Automates the removal of hotkeys from `untestedHotkeys` on property-access. */
const proxyHandler: ProxyHandler<object> = {
  get(target, propKey) {
    let propValue = Reflect.get(target, propKey);

    if (typeof propValue === 'string' && untestedHotkeys.has(propValue)) {
      untestedHotkeys.delete(propValue);
    } else if (isObject(propValue) && !isProxy(propValue)) {
      Reflect.set(target, propKey, new Proxy(propValue, proxyHandler));
      propValue = Reflect.get(target, propKey);
    }

    return propValue;
  },
};

const hotkeys = new Proxy<typeof _hotkeys>(_hotkeys, proxyHandler);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

// velocity-vectors (spherical components)

for (const { fieldsetName, vectorObjectKey } of [
  { fieldsetName: 'boost velocity', vectorObjectKey: 'v' },
  { fieldsetName: 'original particle velocity', vectorObjectKey: 'u' },
] as const) {
  const fieldsetTest = test.extend<Fieldset>({
    fieldset: ({ page }, use) =>
      use(page.getByRole('group', { name: fieldsetName })),
  });

  fieldsetTest.describe(`Fieldset '${fieldsetName}'`, () => {
    fieldsetTest('is visible.', async ({ fieldset }) => {
      await expect(fieldset).toBeVisible();
    });

    for (const { inputLabel, compObjectKey } of [
      { inputLabel: 'r', compObjectKey: 'r' },
      { inputLabel: 'φ', compObjectKey: 'p' },
      { inputLabel: 'θ', compObjectKey: 't' },
    ] as const) {
      const inputTest = fieldsetTest.extend<Input>({
        input: ({ fieldset }, use) =>
          use(fieldset.getByRole('spinbutton', { name: inputLabel })),
        initialValue: async ({ fieldset }, use) => {
          const initialValue = await fieldset
            .getByRole('spinbutton', { name: inputLabel })
            .inputValue();
          await use(Number(initialValue));
        },
      });

      inputTest.describe(`has input '${inputLabel}'`, () => {
        inputTest('that is visible and enabled.', async ({ input }) => {
          await expect(input).toBeVisible();
          await expect(input).toBeEnabled();
        });

        const up = hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowUp;
        inputTest(`that increments with hotkey '${up}'.`, testUp(up));

        const down =
          hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowDown;
        inputTest(`that decrements with hotkey '${down}'.`, testDown(down, up));
      });
    }

    // flip and reset tests at fieldset level (need all three inputs)

    const flip = hotkeys.vectorFlip[vectorObjectKey];
    const reset = hotkeys.vectorReset[vectorObjectKey];
    const phiUp = hotkeys.vectorComp[vectorObjectKey].p.ArrowUp;
    const thetaUp = hotkeys.vectorComp[vectorObjectKey].t.ArrowUp;

    fieldsetTest(
      `"flips" direction with hotkey '${flip}'.`,
      async ({ page, fieldset }) => {
        const rInput = fieldset.getByRole('spinbutton', { name: 'r' });
        const phiInput = fieldset.getByRole('spinbutton', { name: 'φ' });
        const thetaInput = fieldset.getByRole('spinbutton', { name: 'θ' });

        const initialR = Number(await rInput.inputValue());
        const initialPhi = Number(await phiInput.inputValue());

        // step theta away from 90° so its flip is non-trivial
        await page.keyboard.press(thetaUp);
        const thetaBeforeFlip = Number(await thetaInput.inputValue());

        await page.keyboard.press(flip);

        expect(Number(await rInput.inputValue())).toEqual(initialR);
        expect(Number(await phiInput.inputValue())).toBeCloseTo(
          (initialPhi + 180) % 360,
          0,
        );
        expect(Number(await thetaInput.inputValue())).toBeCloseTo(
          180 - thetaBeforeFlip,
          0,
        );
      },
    );

    fieldsetTest(
      `resets direction with hotkey '${reset}'.`,
      async ({ page, fieldset }) => {
        const rInput = fieldset.getByRole('spinbutton', { name: 'r' });
        const phiInput = fieldset.getByRole('spinbutton', { name: 'φ' });
        const thetaInput = fieldset.getByRole('spinbutton', { name: 'θ' });

        const initialR = Number(await rInput.inputValue());
        const initialPhi = Number(await phiInput.inputValue());
        const initialTheta = Number(await thetaInput.inputValue());

        // dirty phi and theta independently (no reliance on flip)
        await page.keyboard.press(phiUp);
        await page.keyboard.press(thetaUp);
        expect(Number(await phiInput.inputValue())).not.toEqual(initialPhi);
        expect(Number(await thetaInput.inputValue())).not.toEqual(initialTheta);

        await page.keyboard.press(reset);

        expect(Number(await rInput.inputValue())).toEqual(initialR);
        expect(Number(await phiInput.inputValue())).toEqual(initialPhi);
        expect(Number(await thetaInput.inputValue())).toEqual(initialTheta);
      },
    );
  });
}

// field-vectors (Cartesian components)

for (const { fieldsetName, vectorObjectKey } of [
  { fieldsetName: 'original electric field', vectorObjectKey: 'e' },
  { fieldsetName: 'original magnetic field', vectorObjectKey: 'b' },
] as const) {
  const fieldsetTest = test.extend<Fieldset>({
    fieldset: ({ page }, use) =>
      use(page.getByRole('group', { name: fieldsetName })),
  });

  fieldsetTest.describe(`Fieldset '${fieldsetName}'`, () => {
    fieldsetTest('is visible.', async ({ fieldset }) => {
      await expect(fieldset).toBeVisible();
    });

    for (const { inputLabel, compObjectKey } of [
      { inputLabel: 'x', compObjectKey: 'x' },
      { inputLabel: 'y', compObjectKey: 'y' },
      { inputLabel: 'z', compObjectKey: 'z' },
    ] as const) {
      const inputTest = fieldsetTest.extend<Input>({
        input: ({ fieldset }, use) =>
          use(fieldset.getByRole('spinbutton', { name: inputLabel })),
        initialValue: async ({ fieldset }, use) => {
          const initialValue = await fieldset
            .getByRole('spinbutton', { name: inputLabel })
            .inputValue();
          await use(Number(initialValue));
        },
      });

      inputTest.describe(`has input '${inputLabel}'`, () => {
        inputTest('that is visible and enabled.', async ({ input }) => {
          await expect(input).toBeVisible();
          await expect(input).toBeEnabled();
        });

        const up = hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowUp;
        inputTest(`that increments with hotkey '${up}'.`, testUp(up));

        const down =
          hotkeys.vectorComp[vectorObjectKey][compObjectKey].ArrowDown;
        inputTest(`that decrements with hotkey '${down}'.`, testDown(down, up));
      });
    }
  });
}

// particle charge and mass

const particleFieldsetName = 'charge and mass';

const particleFieldsetTest = test.extend<Fieldset>({
  fieldset: ({ page }, use) =>
    use(page.getByRole('group', { name: particleFieldsetName })),
});

particleFieldsetTest.describe(`Fieldset '${particleFieldsetName}'`, () => {
  particleFieldsetTest('is visible.', async ({ fieldset }) => {
    await expect(fieldset).toBeVisible();
  });

  for (const { inputLabel, objectKey } of [
    { inputLabel: 'q', objectKey: 'q' },
    { inputLabel: 'm', objectKey: 'm' },
  ] as const) {
    const inputTest = particleFieldsetTest.extend<Input>({
      input: ({ fieldset }, use) =>
        use(fieldset.getByRole('spinbutton', { name: inputLabel })),
      initialValue: async ({ fieldset }, use) => {
        const initialValue = await fieldset
          .getByRole('spinbutton', { name: inputLabel })
          .inputValue();
        await use(Number(initialValue));
      },
    });

    inputTest.describe(`has input '${inputLabel}'`, () => {
      inputTest('that is visible and enabled.', async ({ input }) => {
        await expect(input).toBeVisible();
        await expect(input).toBeEnabled();
      });

      const up = hotkeys.particle[objectKey].ArrowUp;
      inputTest(`that increments with hotkey '${up}'.`, testUp(up));

      const down = hotkeys.particle[objectKey].ArrowDown;
      inputTest(`that decrements with hotkey '${down}'.`, testDown(down, up));
    });
  }
});

// options

const optionsFieldsetName = 'options';

const optionsFieldsetTest = test.extend<Fieldset>({
  fieldset: async ({ page }, use) => {
    // 'options' are hidden in `details`/`summary`, which must be opened first
    const summary = page.locator('summary').filter({ hasText: 'options' });
    await summary.click();
    await use(page.getByRole('group', { name: optionsFieldsetName }));
  },
});

optionsFieldsetTest.describe(`Fieldset '${optionsFieldsetName}'`, () => {
  optionsFieldsetTest('is visible.', async ({ fieldset }) => {
    await expect(fieldset).toBeVisible();
  });

  for (const { checkboxLabel, objectKey } of [
    { checkboxLabel: 'show component-vectors', objectKey: 'toggleComps' },
    { checkboxLabel: 'show the poynting vector', objectKey: 'toggleS' },
    { checkboxLabel: 'show the particle velocity', objectKey: 'toggleU' },
    { checkboxLabel: 'show the lorentz force', objectKey: 'toggleF' },
    { checkboxLabel: `show the particle's acceleration`, objectKey: 'toggleA' },
    { checkboxLabel: 'hide the boost-velocity', objectKey: 'toggleV' },
    { checkboxLabel: 'hide the field-vectors', objectKey: 'toggleEandB' },
  ] as const) {
    const checkboxTest = optionsFieldsetTest.extend<Checkbox>({
      checkbox: ({ fieldset }, use) => use(fieldset.getByLabel(checkboxLabel)),
      initialChecked: async ({ fieldset }, use) => {
        const initialChecked = await fieldset
          .getByLabel(checkboxLabel)
          .isChecked();
        await use(initialChecked);
      },
    });

    checkboxTest.describe(`has checkbox '${checkboxLabel}'`, () => {
      checkboxTest('that is visible and enabled.', async ({ checkbox }) => {
        await expect(checkbox).toBeVisible();
        await expect(checkbox).toBeEnabled();
      });

      const toggle = hotkeys.oneKey[objectKey];
      checkboxTest(
        `that toggles with hotkey '${toggle}'.`,
        async ({ page, checkbox, initialChecked }) => {
          await page.keyboard.press(toggle);
          const newChecked = await checkbox.isChecked();
          expect(newChecked).not.toEqual(initialChecked);
        },
      );
    });
  }
});

test('All hotkeys were tested. (This test is allowed to fail; see logs for results.)', async () => {
  const message = `The following hotkeys weren't tested: ${[
    ...untestedHotkeys.values(),
  ]
    .map((e) => `'${e}'`)
    .join(', ')}.`;

  if (untestedHotkeys.size > 0) {
    console.warn(`Note: ${message}`);
    test.fail();
  }

  expect(untestedHotkeys.size, message).toEqual(0);
});
