import { test, expect } from '@playwright/test';

for (const device of ['iPhone', 'Pixel 10']) {
 test(`MBTI choices stay usable above onboarding actions on ${device}`, async ({page}) => {
  await page.goto('/');
  if (device === 'Pixel 10') {
   await page.getByRole('button', {name:'Preview device: iPhone', exact:true}).click();
   await page.getByRole('menuitemradio', {name:'Pixel 10', exact:true}).click();
  }
  await page.getByRole('button', {name:'Demo flows', exact:true}).click();
  await page.getByRole('button', {name:'Onboarding', exact:true}).click();
  await page.getByRole('button', {name:'Skip', exact:true}).click();
  await expect(page.getByLabel('Step 2 of 4')).toBeVisible();
  await page.screenshot({path:`test-results/onboarding-footer-${device}.png`});
  await page.getByRole('button', {name:'Continue', exact:true}).click();
  const trigger = page.getByRole('button', {name:'Select if you know it', exact:true});
  await trigger.click();
  const dialog=page.getByRole('dialog', {name:'Your MBTI',exact:true});
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', {name:'ESFP',exact:true})).toBeVisible();
  // Ordinary clicks must work on the last row without a fixed Continue button intercepting them.
  await dialog.getByRole('button', {name:'ESFP',exact:true}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator('.onboarding-mbti .onboarding-select')).toHaveText('ESFP');
  await page.locator('.onboarding-mbti .onboarding-select').click();
  await expect(dialog.getByRole('button', {name:'ESFP',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect.poll(()=>dialog.evaluate(el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(1);
  await page.screenshot({path:`test-results/onboarding-mbti-${device}.png`});
  await dialog.getByRole('button', {name:'Prefer not to say',exact:true}).click();
  await expect(trigger).toBeVisible();
  await trigger.click();
  await dialog.getByRole('button', {name:'Close MBTI options',exact:true}).click();
  await expect(trigger).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button', {name:'Continue',exact:true}).click();
  await expect(page.getByLabel('Step 4 of 4')).toBeVisible();
 });
}

test('social-card review retains profile edits and privacy choices', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await page.getByRole('button',{name:'Onboarding',exact:true}).click();
 await page.getByRole('button',{name:'Take photo',exact:true}).click();
 await page.getByRole('button',{name:'Create my AI avatar',exact:true}).click();
 await page.getByRole('button',{name:'Use this avatar',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 const bio='I enjoy quiet coffee chats, design, and small groups. Happy to share product ideas.';
 await page.getByRole('textbox',{name:'Your social preferences',exact:true}).fill(bio);
 await page.getByRole('button',{name:'Select if you know it',exact:true}).click();
 await page.getByRole('button',{name:'INFP',exact:true}).click();
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.locator('.onboarding-card-quote')).toHaveText(`“${bio}”`);
 await expect(page.getByRole('heading',{name:'Your social card',exact:true})).toBeInViewport();
 await expect(page.locator('.onboarding-social-card')).toHaveCSS('background-color','rgb(255, 255, 255)');
 await expect(page.locator('.onboarding-card-avatar')).toHaveCSS('width','48px');
 await page.evaluate(()=>document.fonts.ready);
 console.log('Social-card typography',await page.locator('.onboarding-card-quote').evaluate(el=>{const s=getComputedStyle(el);return {font:s.fontFamily,size:s.fontSize,line:s.lineHeight,spacing:s.letterSpacing,width:el.clientWidth}}));
 await expect(page.locator('.onboarding-progress .active')).toHaveCount(4);
 await expect(page.locator('.onboarding-progress .active').last()).toHaveCSS('background-color','rgb(7, 159, 212)');
 await expect(page.locator('.onboarding-card-quote')).toHaveCSS('letter-spacing','normal');
 await page.screenshot({path:'test-results/social-card-review-top.png'});
 const hidden=page.getByRole('button',{name:'Hidden',exact:true});
 await hidden.click();
 await expect(page.getByRole('switch',{name:/Direct invitations/})).toBeDisabled();
 await page.getByRole('button',{name:'Connections',exact:true}).click();
 await page.getByRole('switch',{name:/Direct invitations/}).click();
 await expect(page.getByRole('switch',{name:/Direct invitations/})).toHaveAttribute('aria-checked','true');
 await page.getByRole('switch',{name:/Share campus only/}).click();
 await expect(page.getByRole('switch',{name:/Share campus only/})).toHaveAttribute('aria-checked','false');
 await page.locator('.onboarding-privacy>p').scrollIntoViewIfNeeded();
 await page.screenshot({path:'test-results/social-card-review-privacy.png'});
 await page.getByRole('button',{name:'Edit social card',exact:true}).click();
 await page.getByRole('textbox',{name:'Edit your card description',exact:true}).fill('I enjoy design and quiet walks.');
 await page.getByRole('button',{name:'Save social card edits',exact:true}).click();
 await expect(page.locator('.onboarding-card-quote')).toHaveText('“I enjoy design and quiet walks.”');
 const assets=await page.locator('.social-card-review img, .onboarding-footer img').evaluateAll(images=>images.map(image=>{const i=image as HTMLImageElement;return {src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.width,height:i.height}}));
 expect(assets.every(asset=>asset.loaded)).toBe(true);
 console.log('Social-card asset geometry',assets);
 await page.getByRole('button',{name:'Continue',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Message Overlap',exact:true})).toBeVisible();
});
