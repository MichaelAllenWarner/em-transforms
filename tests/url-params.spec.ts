import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const getParams = (url: string) => new URLSearchParams(new URL(url).search);

// ─── v2 URL → state ───────────────────────────────────────────────────────────

test('loads cartesian field values from v2 URL', async ({ page }) => {
  await page.goto('/?v=2&eX=2&eY=-3&eZ=1&bX=0&bY=1&bZ=-2');

  const eGroup = page.getByRole('group', { name: 'original electric field' });
  await expect(eGroup.getByRole('spinbutton', { name: 'x' })).toHaveValue('2');
  await expect(eGroup.getByRole('spinbutton', { name: 'y' })).toHaveValue('-3');
  await expect(eGroup.getByRole('spinbutton', { name: 'z' })).toHaveValue('1');

  const bGroup = page.getByRole('group', { name: 'original magnetic field' });
  await expect(bGroup.getByRole('spinbutton', { name: 'x' })).toHaveValue('0');
  await expect(bGroup.getByRole('spinbutton', { name: 'y' })).toHaveValue('1');
  await expect(bGroup.getByRole('spinbutton', { name: 'z' })).toHaveValue('-2');
});

test('loads spherical velocity values from v2 URL', async ({ page }) => {
  // phi=π/2 (90°), theta=π/4 (45°)
  await page.goto('/?v=2&vR=0.7&vPhi=1.5707963267948966&vTheta=0.7853981633974483');

  const vGroup = page.getByRole('group', { name: 'boost velocity' });
  await expect(vGroup.getByRole('spinbutton', { name: 'r' })).toHaveValue('0.7');
  await expect(vGroup.getByRole('spinbutton', { name: 'φ' })).toHaveValue('90');
  await expect(vGroup.getByRole('spinbutton', { name: 'θ' })).toHaveValue('45');
});

test('loads boolean options from v2 URL', async ({ page }) => {
  await page.goto('/?v=2&showComps=true&showS=true');

  // Options panel is inside a <details>, must open it
  await page.locator('summary').filter({ hasText: 'options' }).click();
  const fieldset = page.getByRole('group', { name: 'options' });
  await expect(fieldset.getByLabel('show component-vectors')).toBeChecked();
  await expect(fieldset.getByLabel('show the poynting vector')).toBeChecked();
  await expect(fieldset.getByLabel('show the lorentz force')).not.toBeChecked();
});

// ─── Legacy URL → state ───────────────────────────────────────────────────────

test('converts legacy (v1) spherical phi/theta to physics convention', async ({ page }) => {
  // Three.js convention: phi=π/2, theta=π/2 → vector along +x
  // Physics convention equivalent: phi=0 (azimuthal), theta=π/2 (polar)
  // So UI should show φ=0°, θ=90°
  await page.goto('/?vR=0.5&vPhi=1.5707963267948966&vTheta=1.5707963267948966');

  const vGroup = page.getByRole('group', { name: 'boost velocity' });
  await expect(vGroup.getByRole('spinbutton', { name: 'φ' })).toHaveValue('0');
  await expect(vGroup.getByRole('spinbutton', { name: 'θ' })).toHaveValue('90');
});

test('normalizes out-of-range theta in v2 URL', async ({ page }) => {
  // theta = 7π/4 ≈ 5.497 rad (> π), phi = π/4
  // sin(7π/4) < 0, so canonical: theta' = acos(cos(7π/4)) = π/4 = 45°, phi' = π/4 + π = 225°
  const theta = 7 * Math.PI / 4;
  const phi = Math.PI / 4;

  await page.goto(`/?v=2&vR=0.5&vPhi=${phi}&vTheta=${theta}`);

  const vGroup = page.getByRole('group', { name: 'boost velocity' });
  await expect(vGroup.getByRole('spinbutton', { name: 'θ' })).toHaveValue('45');
  await expect(vGroup.getByRole('spinbutton', { name: 'φ' })).toHaveValue('225');
});

test('upgrades legacy URL to v2 on load', async ({ page }) => {
  await page.goto('/?eX=1&eY=0&eZ=0');

  // Any state change triggers URL write — change a field to force it
  await page.getByRole('group', { name: 'original electric field' })
    .getByRole('spinbutton', { name: 'x' })
    .fill('2');
  await page.getByRole('group', { name: 'original electric field' })
    .getByRole('spinbutton', { name: 'x' })
    .dispatchEvent('input');

  await page.waitForFunction(() => new URLSearchParams(window.location.search).has('v'));
  expect(getParams(page.url()).get('v')).toBe('2');
});

// ─── State → URL ──────────────────────────────────────────────────────────────

test('writes field values to URL on state change', async ({ page }) => {
  const xInput = page.getByRole('group', { name: 'original electric field' })
    .getByRole('spinbutton', { name: 'x' });

  await xInput.fill('3');
  await xInput.dispatchEvent('input');

  await page.waitForFunction(() => new URLSearchParams(window.location.search).get('eX') === '3');
  const params = getParams(page.url());
  expect(Number(params.get('eX'))).toBeCloseTo(3, 1);
  expect(params.get('v')).toBe('2');
});

// ─── Full round-trip ──────────────────────────────────────────────────────────

test('round-trips: state change → URL → reload → same state', async ({ page }) => {
  const xInput = page.getByRole('group', { name: 'original electric field' })
    .getByRole('spinbutton', { name: 'x' });

  await xInput.fill('4');
  await xInput.dispatchEvent('input');

  await page.waitForFunction(() => new URLSearchParams(window.location.search).get('eX') === '4');
  const url = page.url();

  await page.goto(url);

  await expect(
    page.getByRole('group', { name: 'original electric field' })
      .getByRole('spinbutton', { name: 'x' })
  ).toHaveValue('4');
});
