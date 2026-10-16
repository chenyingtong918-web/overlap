import { test, expect, type Page } from '@playwright/test';
async function demo(page:Page){await page.goto('/');await page.getByRole('button',{name:'Explore the demo',exact:true}).click();}
async function menu(page:Page,name:string){await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name,exact:true}).click();}

test('messages search, unread state and friend lookup stay connected',async({page})=>{
 await demo(page);await menu(page,'Messages');
 await expect(page.locator('.hub-message-time i')).toHaveText('2');
 await page.getByLabel('Search messages',{exact:true}).fill('example');
 await expect(page.locator('.hub-message-row')).toHaveCount(1);
 await page.getByRole('button',{name:'Open conversation with Zoe Lin',exact:true}).click();
 await page.getByRole('button',{name:'Go back',exact:true}).click();
 await expect(page.locator('.hub-message-time i')).toHaveCount(0);
 await page.getByLabel('Search messages',{exact:true}).fill('');
 await page.getByRole('button',{name:'Friends',exact:true}).click();
 await page.getByRole('button',{name:'Add friends',exact:true}).click();
 await page.getByRole('button',{name:'Find by phone number',exact:true}).click();
 await expect(page.getByRole('button',{name:'Find person',exact:true})).toBeDisabled();
 await page.getByLabel('Friend phone number').fill('138 0000 1234');
 await page.getByRole('button',{name:'Find person',exact:true}).click();
 await page.getByRole('button',{name:'Add friend',exact:true}).click();
 await expect(page.getByRole('button',{name:'Request sent',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Clear phone number',exact:true}).click();
 await expect(page.getByText('1 person found',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Go back',exact:true}).click();
 await expect(page.getByRole('button',{name:'Request sent to Mia Chen',exact:true})).toBeDisabled();
});

test('calendar follows actual month boundaries and opens the existing pending plan',async({page})=>{
 await page.clock.install({time:new Date('2026-01-31T12:00:00')});await demo(page);await menu(page,'My plans');
 await expect(page.getByRole('heading',{name:'January 2026',exact:true})).toBeVisible();
 await expect(page.locator('.hub-month-grid button')).toHaveCount(31);
 await page.getByRole('button',{name:'Next month',exact:true}).click();
 await expect(page.getByRole('button',{name:'February 2026 28',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.hub-month-grid button')).toHaveCount(28);
 await page.getByRole('button',{name:'February 2026 1',exact:true}).click();
 await expect(page.locator('.hub-calendar-plan')).toHaveCount(1);
 await expect(page.locator('.hub-calendar-plan')).toContainText('Pending');
 await page.locator('.hub-calendar-plan').click();
 await page.getByRole('button',{name:/Coffee chat Waiting Chat with Ryan Xu/}).click();
 await expect(page.getByRole('button',{name:'Accept this time',exact:true})).toBeVisible();
});

for(const device of ['iPhone','Pixel 10'])test(`${device}: QR action clears device chrome and fixed message tabs stay outside scrolling content`,async({page})=>{
 await demo(page);if(device==='Pixel 10'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByText('Pixel 10',{exact:true}).click();}
 await menu(page,'Messages');
 expect(await page.locator('.hub-tabs').evaluate(el=>el.closest('.mobile-scroll')===null)).toBe(true);
 await page.getByRole('button',{name:'New message',exact:true}).click();await page.getByRole('button',{name:'My QR code',exact:true}).click();
 await expect(page.locator('.hub-qr-card img')).toHaveJSProperty('naturalWidth',232);
 expect(await page.locator('.hub-qr-card img').evaluate(el=>Math.round(el.getBoundingClientRect().width)/Math.round(el.getBoundingClientRect().height))).toBe(1);
 expect(await page.locator('.content').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 expect(await page.locator('.sync-fixed-actions').evaluate(el=>el.closest('.mobile-scroll')===null)).toBe(true);
 await page.getByRole('button',{name:'Scan a friend’s code',exact:true}).click();await expect(page.getByText('Code recognized · View profile')).toBeVisible();
});

for(const device of ['iPhone','Pixel 10'])test(`${device}: menu matches Figma spacing without nested scrolling`,async({page})=>{
 await demo(page);if(device==='Pixel 10'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByText('Pixel 10',{exact:true}).click();}
 await page.getByRole('button',{name:'Open menu',exact:true}).click();
 const panel=page.getByRole('dialog',{name:'Menu',exact:true});
 await expect(panel).toBeVisible();
 expect(await panel.evaluate(el=>el.clientHeight)).toBe(372);
 expect(await panel.locator('.sheet-content').evaluateAll(els=>els.every(el=>el.scrollHeight<=el.clientHeight))).toBe(true);
 expect(await panel.locator('.sheet-title').evaluate(el=>getComputedStyle(el).fontSize)).toBe('20px');
 expect(await panel.locator('.menu-item').evaluateAll(els=>els.every(el=>el.offsetHeight===56))).toBe(true);
 expect(await panel.locator('img').evaluateAll(els=>els.every(el=>(el as HTMLImageElement).naturalWidth===el.clientWidth))).toBe(true);
 await page.getByRole('button',{name:'Close sheet',exact:true}).click();await expect(panel).toHaveCount(0);
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'My plans',exact:true}).click();await expect(page.locator('.hub-calendar')).toBeVisible();
});
