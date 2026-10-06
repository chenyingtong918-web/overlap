import { test, expect } from '@playwright/test';

for (const device of ['iPhone', 'Pixel 10']) {
 test(`welcome uses the Figma assets and both account entries on ${device}`, async ({ page }) => {
  await page.goto('/');
  if (device === 'Pixel 10') {
   await page.getByRole('button', { name: 'Preview device: iPhone' }).click();
   await page.getByRole('menuitemradio', { name: 'Pixel 10', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Welcome to overlap.' })).toBeVisible();
  const geometry = await page.locator('.auth-welcome').evaluate(el => {
   const screen = el.getBoundingClientRect();
   const assets = [...el.querySelectorAll<HTMLImageElement>('img')].map(image => ({ loaded: image.complete && image.naturalWidth > 0, width: image.width, height: image.height }));
   const actions = el.querySelector('.auth-welcome-actions')!.getBoundingClientRect();
   const terms = el.querySelector('.auth-welcome-terms')!.getBoundingClientRect();
   return { assets, gutter: actions.left - screen.left, width: actions.width, screenWidth: screen.width, buttonHeight: el.querySelector('.auth-secondary')!.getBoundingClientRect().height, bottomClearance: screen.bottom - terms.bottom, mask: getComputedStyle(el.querySelector('.auth-welcome-art')!).maskImage };
  });
  expect(geometry.assets.every(asset => asset.loaded)).toBe(true);
  expect(geometry.assets[0]).toMatchObject({width:390,height:300});
  expect(geometry.assets[1].width).toBeCloseTo(112, 0);
  expect(geometry.mask).toContain('/auth/welcome-mask.svg');
  expect(geometry.gutter).toBeCloseTo(24, 0);
  expect(geometry.width).toBeCloseTo(geometry.screenWidth - 48, 0);
  expect(geometry.buttonHeight).toBeCloseTo(48, 0);
  expect(geometry.bottomClearance).toBeGreaterThanOrEqual(61);
  await page.screenshot({path:`test-results/auth-welcome-${device.replace(' ', '-')}.png`});
  await page.getByRole('button', {name:'Sign up',exact:true}).click();
  await expect(page.getByRole('tab', {name:'Sign up',exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByRole('button', {name:'Back to welcome'}).click();
  await page.getByRole('button', {name:'Continue with phone or email'}).click();
  await expect(page.getByRole('tab', {name:'Log in',exact:true})).toHaveAttribute('aria-selected','true');
 });
}

test('login validates either email or phone and keeps password visibility usable', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button',{name:'Continue with phone or email'}).click();
 await page.getByRole('button',{name:'Log in',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('valid phone number or email');
 await page.getByLabel('Phone or email', {exact:true}).fill('+44 7700 900123');
 await page.getByLabel('Password', {exact:true}).fill('demo-password');
 await page.getByRole('button',{name:'Show password'}).click();
 await expect(page.getByLabel('Password',{exact:true})).toHaveAttribute('type','text');
 await page.getByRole('button',{name:'Hide password'}).click();
 await expect(page.getByLabel('Password',{exact:true})).toHaveAttribute('type','password');
 await page.getByRole('button',{name:'Log in',exact:true}).click();
 await expect(page.getByRole('tab',{name:'Chat',exact:true})).toBeVisible();
});

test('email signup carries the name into the avatar-first onboarding',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Sign up',exact:true}).click();
 await page.getByLabel('Your name',{exact:true}).fill('Robin Demo');
 await page.getByLabel('Phone or email',{exact:true}).fill('robin@example.com');
 await page.getByLabel('Password',{exact:true}).fill('preview-only');
 await page.getByRole('button',{name:'Create account',exact:true}).click();
 await expect(page.getByLabel('Step 1 of 4')).toBeVisible();
 await page.getByRole('button',{name:'Skip',exact:true}).click();
 await expect(page.getByLabel('Step 2 of 4')).toBeVisible();
 await expect(page.getByLabel('Name',{exact:true})).toHaveValue('Robin Demo');
});

test('recovery previews the email step and returns to login',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Continue with phone or email'}).click();
 await page.getByRole('button',{name:'Forgot password?'}).click();
 await page.getByLabel('Email',{exact:true}).fill('preview@example.com');
 await page.getByRole('button',{name:'Preview reset link'}).click();
 await expect(page.getByText('This is a preview of the password recovery step. No email has been sent.')).toBeVisible();
 await page.getByRole('button',{name:'Back to log in',exact:true}).last().click();
 await expect(page.getByRole('heading',{name:'Good to see you.'})).toBeVisible();
 await expect(page.getByLabel('Password',{exact:true})).toHaveValue('');
});
