import { test, expect, Locator } from '@playwright/test';
import { isProxy } from 'util/types';
import { hotkeys as _hotkeys } from '../helpers/hotkeys';
import { testUp, testDown, deepStringValsOf, isObject } from './helpers';
import {
  defaultCameraPosition,
  defaultCameraTarget,
} from '../components/CameraController';

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

    const flip = hotkeys.fieldFlip[vectorObjectKey];

    fieldsetTest(
      `"flips" with hotkey '${flip}'.`,
      async ({ page, fieldset }) => {
        const xInput = fieldset.getByRole('spinbutton', { name: 'x' });
        const yInput = fieldset.getByRole('spinbutton', { name: 'y' });
        const zInput = fieldset.getByRole('spinbutton', { name: 'z' });

        const initialX = Number(await xInput.inputValue());
        const initialY = Number(await yInput.inputValue());
        const initialZ = Number(await zInput.inputValue());

        await page.keyboard.press(flip);

        expect(Number(await xInput.inputValue())).toBeCloseTo(-initialX, 5);
        expect(Number(await yInput.inputValue())).toBeCloseTo(-initialY, 5);
        expect(Number(await zInput.inputValue())).toBeCloseTo(-initialZ, 5);
      },
    );
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
    { checkboxLabel: 'show particle velocity', objectKey: 'toggleU' },
    { checkboxLabel: 'show lorentz force', objectKey: 'toggleF' },
    { checkboxLabel: `show particle acceleration`, objectKey: 'toggleA' },
    { checkboxLabel: 'show poynting vector', objectKey: 'toggleS' },
    { checkboxLabel: 'hide fields', objectKey: 'toggleEandB' },
    { checkboxLabel: 'show components', objectKey: 'toggleComps' },
    { checkboxLabel: 'hide boost velocity', objectKey: 'toggleV' },
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

// Camera reset — navigate to a URL with non-default camera position,
// press the reset hotkey, and verify the URL params return to the default position.
const resetCamera = hotkeys.oneKey.resetCamera;
test(`Camera resets with hotkey '${resetCamera}'.`, async ({ page }) => {
  const [dx, dy, dz] = defaultCameraPosition;
  const [tx, ty, tz] = defaultCameraTarget;
  const offset = 3;
  await page.goto(
    `/?v=2&x=${dx + offset}&y=${dy + offset}&z=${dz + offset}&targetX=${tx + offset}&targetY=${ty + offset}&targetZ=${tz + offset}`,
  );
  await page.locator('[data-camera-ready]').waitFor({ state: 'attached' });

  const paramsOnLoad = new URLSearchParams(new URL(page.url()).search);
  expect(Number(paramsOnLoad.get('x'))).toBeCloseTo(dx + offset, 1);

  // Press reset — fires 'end' event which writes default camera params to URL
  await page.keyboard.press(resetCamera);
  await page.waitForTimeout(400); // 250ms debounce + margin

  const paramsAfterReset = new URLSearchParams(new URL(page.url()).search);
  expect(Number(paramsAfterReset.get('x'))).toBeCloseTo(dx, 0);
  expect(Number(paramsAfterReset.get('y'))).toBeCloseTo(dy, 0);
  expect(Number(paramsAfterReset.get('z'))).toBeCloseTo(dz, 0);
  expect(Number(paramsAfterReset.get('targetX'))).toBeCloseTo(tx, 0);
  expect(Number(paramsAfterReset.get('targetY'))).toBeCloseTo(ty, 0);
  expect(Number(paramsAfterReset.get('targetZ'))).toBeCloseTo(tz, 0);
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
