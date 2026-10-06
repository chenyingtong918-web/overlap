import { test, expect } from '@playwright/test';

for (const device of ['iPhone', 'Pixel 10']) {
 test(`Explore header has no bright seam when scaled on ${device}`, async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1100, height: 1001 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto('/');
  await page.getByRole('button', { name: 'Explore the demo', exact: true }).click();
  await page.getByRole('tab', { name: 'Explore', exact: true }).click();
  if (device === 'Pixel 10') {
   await page.getByRole('button', { name: 'Preview device: iPhone', exact: true }).click();
   await page.getByRole('menuitemradio', { name: 'Pixel 10', exact: true }).click();
  }
  for (const width of [1100, 768]) {
   await page.setViewportSize({ width, height: 1001 });
   for (const offset of [600, 950.5]) {
    await page.locator('.overlap-scroll .mobile-scroll').evaluate((el, top) => el.scrollTo({ top, behavior: 'instant' }), offset);
    await expect(page.locator('.explore-controls')).toHaveClass(/explore-controls-pinned/);
    await page.mouse.move(0, 0);
    const bounds = await page.locator('.overlap-scroll .mobile-scroll').boundingBox();
    if (!bounds) throw new Error('Missing Explore scroll viewport');
    const png = await page.screenshot({ clip: { x: bounds.x + 24, y: bounds.y - 2, width: bounds.width - 48, height: 4 } });
    // Inspect the rendered join, including the compositor's fractional-pixel edges.
    const contrast = await page.evaluate(async (data) => {
     const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
     const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
     const ctx = canvas.getContext('2d')!; ctx.drawImage(image, 0, 0);
     const pixels = ctx.getImageData(0, 0, image.width, image.height).data;
     let brightening = 0, darkening = 0;
     for (let i = 0; i < pixels.length; i += 4) {
      for (const [channel, sky] of [185, 231, 250].entries()) {
       brightening = Math.max(brightening, pixels[i + channel] - sky);
       darkening = Math.max(darkening, sky - pixels[i + channel]);
      }
     }
     return {brightening, darkening};
    }, png.toString('base64'));
    expect(contrast.brightening, `bright seam at ${width}px / scroll ${offset}`).toBeLessThanOrEqual(1);
    // Existing navigation shadows can darken the sky slightly; no contrasting line.
    expect(contrast.darkening).toBeLessThanOrEqual(3);
   }
  }
  await page.screenshot({ path: `test-results/explore-header-${device.replace(' ', '-')}.png` });
  await page.getByRole('tab', { name: 'Chat', exact: true }).click();
  await expect(page.locator('.overlap-app')).not.toHaveClass(/explore-screen/);
  await context.close();
 });
}
