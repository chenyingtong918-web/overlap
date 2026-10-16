import {test,expect,type Page} from '@playwright/test';
async function start(page:Page,device='iPhone'){
 await page.goto('/');
 if(device!=='iPhone'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByRole('menuitemradio',{name:device,exact:true}).click()}
 await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Confirmed casual plan',exact:true}).click();
}
for(const device of ['iPhone','Pixel 10'])test(`Casual stores multiple photos and authored caption in the shared map on ${device}`,async({page})=>{
 await start(page,device);
 const card=page.locator('.casual-v3-plan');
 await expect(card.locator('.meal-step')).toHaveCount(4);await expect(card.locator('h2')).toHaveCSS('font-size','18px');
 await page.getByRole('button',{name:'Collapse casual plan details'}).click();await expect(page.getByRole('button',{name:'I’m here',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:/Explore together More ideas/})).toHaveCount(0);
 await page.getByRole('button',{name:'Expand casual plan details'}).click();await page.getByRole('button',{name:/Our map Our shared places/}).click();await page.getByLabel('Add a shared place',{exact:true}).click();await page.getByRole('button',{name:'Add our moment',exact:true}).click();
 await expect(page.getByRole('button',{name:'Take photo',exact:true})).toBeInViewport();await page.getByRole('button',{name:'Take photo',exact:true}).click();
 await page.getByLabel('Moment caption',{exact:true}).fill('The light made us stop. Glad we took the long way home.');await page.getByRole('button',{name:'Add photo',exact:true}).click();
 await page.getByRole('button',{name:'Take photo',exact:true}).click();await expect(page.getByLabel('Moment caption',{exact:true})).toHaveValue('The light made us stop. Glad we took the long way home.');
 await expect(page.locator('.casual-attachments img')).toHaveCount(2);await page.getByRole('button',{name:'Remove photo 2',exact:true}).click();await expect(page.locator('.casual-attachments img')).toHaveCount(1);
 await page.getByRole('button',{name:'Add photo',exact:true}).click();await page.getByRole('button',{name:'Take photo',exact:true}).click();
 await expect(page.getByRole('button',{name:'Add to our map',exact:true})).toBeInViewport();await page.getByRole('button',{name:'Add to our map',exact:true}).click();
 await expect(page.getByText('3 places lit up',{exact:true})).toBeVisible();await expect(page.getByText('A new place, together',{exact:true})).toBeVisible();await page.getByRole('button',{name:'View our map',exact:true}).click();await page.getByRole('button',{name:'Open this memory',exact:true}).click();await expect(page.locator('.casual-memory-full img')).toHaveCount(2);await expect(page.getByRole('dialog')).toContainText('The light made us stop.');await page.getByRole('button',{name:'Close sheet',exact:true}).click();
 await page.getByRole('complementary',{name:'Plan demo controls'}).getByRole('button',{name:'Reflection',exact:true}).click();await expect(page.getByText('Our little photo stop',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'View on our map',exact:true}).click();await page.getByLabel('Open tree-lined path memory',{exact:true}).click();await expect(page.getByRole('dialog')).toContainText('The light made us stop.');
 await page.getByRole('button',{name:'Close sheet',exact:true}).click();await page.mouse.move(0,0);await page.screenshot({path:`test-results/casual-memory-${device.replace(' ','-')}.png`});
});
test('Casual deck retains choices across pages and requires both people for each suggestion',async({page})=>{
 await start(page);await page.getByRole('button',{name:/Explore together More ideas/}).click();
 await page.getByRole('button',{name:'Add to our list',exact:true}).first().click();await page.getByRole('button',{name:'Next idea',exact:true}).click();await expect(page.locator('.casual-stacked-deck .is-current h2')).toHaveText('A bite after the walk');
 await page.locator('.casual-stacked-deck .is-current').getByRole('button',{name:'Add to our list',exact:true}).click();await page.getByRole('button',{name:'Previous idea',exact:true}).click();await expect(page.locator('.casual-stacked-deck .is-current').getByRole('button',{name:'Added · Remove',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Confirm selection',exact:true}).click();await expect(page.getByLabel('Casual progress: Plan')).toBeVisible();await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Confirm A little tea break',exact:true}).waitFor();await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Confirm A little tea break',exact:true}).click();await page.getByRole('button',{name:'Unconfirm A photo stop together',exact:true}).click();await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Confirm A photo stop together',exact:true}).click();await page.getByRole('button',{name:'Confirm plan',exact:true}).click();await expect(page.getByLabel('Casual progress: Meet')).toBeVisible();await page.getByRole('button',{name:'Collapse casual plan details',exact:true}).click();await expect(page.locator('.casual-added-plan')).toContainText('A little tea break');
});

for(const device of ['iPhone','Pixel 10'])test(`Casual arrival uses Reflect and the meeting facts on ${device}`,async({page})=>{
 await start(page,device);
 await page.getByRole('button',{name:'I’m here',exact:true}).click();
 await expect(page.getByLabel('Casual progress: Reflect')).toBeVisible();
 await expect(page.locator('.meal-flow-status')).toHaveText('Reflect');
 await expect(page.locator('.casual-plan-facts')).toContainText('Campus A south gate');
 await expect(page.getByRole('button',{name:'I’m here',exact:true})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Our map Our shared places/})).toBeVisible();
 await expect(page.locator('.casual-v3-messages')).toContainText('I’m at the south gate.');
 await page.mouse.move(0,0);await page.screenshot({path:`test-results/casual-arrival-${device.replace(' ','-')}.png`});
});

for(const device of ['iPhone','Pixel 10'])test(`Group options and unanimous result remain usable on ${device}`,async({page})=>{
 await page.goto('/');if(device!=='iPhone'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByRole('menuitemradio',{name:device,exact:true}).click()}
 await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Group casual plan',exact:true}).click();
 await page.getByRole('button',{name:/Explore together More ideas/}).click();
 const options=page.locator('.casual-v3-option');
 for(let i=0;i<3;i++)await options.nth(i).click();
 expect(await page.locator('.casual-option-check').evaluateAll(els=>els.every(el=>{const r=el.getBoundingClientRect();return Math.abs(r.width-r.height)<1}))).toBe(true);
 await expect(page.getByRole('button',{name:'Confirm selection',exact:true})).toBeInViewport();await page.mouse.move(0,0);await page.screenshot({path:`test-results/casual-options-${device.replace(' ','-')}.png`});
 await page.getByRole('button',{name:'Confirm selection',exact:true}).click();await expect(page.getByText('2 of 3 responded',{exact:true})).toBeVisible();
 await expect(page.getByText('3 of 3 responded',{exact:true})).toBeVisible();await expect(page.locator('.casual-group-choice b')).toHaveText(['3','2','1']);
 await page.getByRole('button',{name:'Confirm plan',exact:true}).click();await expect(page.getByLabel('Casual progress: Meet')).toBeVisible();
 await expect(page.locator('.casual-added-plan')).toContainText('A photo stop together');await expect(page.locator('.casual-added-plan')).not.toContainText('A little tea break');
});

for(const device of ['iPhone','Pixel 10'])test(`Casual join sheet and collapsed withdrawal on ${device}`,async({page})=>{
 await page.goto('/');if(device!=='iPhone'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByRole('menuitemradio',{name:device,exact:true}).click()}
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();await page.getByRole('button',{name:'Casual plan — Explore',exact:true}).click();
 await page.locator('.explore-post').filter({hasText:'A slow photo walk'}).getByRole('button',{name:'Ask to join',exact:true}).click();await page.getByRole('button',{name:'Ask to join',exact:true}).click();
 const sheet=page.getByRole('dialog',{name:'Ask to join',exact:true});
 expect(await sheet.evaluate(el=>el.clientHeight)).toBe(444);
 const positions=await sheet.evaluate(el=>{const r=el.getBoundingClientRect(),scale=r.width/el.clientWidth;return ['textarea','.casual-help-write','.casual-v3-sheet-footer>.button'].map(s=>Math.round((el.querySelector(s)!.getBoundingClientRect().y-r.y)/scale))});
 expect(positions).toEqual([114,246,306]);
 await page.getByLabel('Note to join',{exact:true}).fill('Can I bring my camera?');
 await page.getByRole('button',{name:'✦ Help me write',exact:true}).click();await expect(page.getByLabel('Note to join',{exact:true})).toHaveValue('I’d love a slow walk before heading home. Mind if I join?');
 await page.getByRole('button',{name:'Send request',exact:true}).click();await expect(sheet).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Withdraw invitation',exact:true})).toHaveCount(0);
 await expect(page.getByLabel('Casual progress: Confirm')).toBeVisible();await expect(page.locator('.casual-v3-messages .user-bubble')).toHaveCount(1);
 await page.getByRole('button',{name:'Expand casual plan details',exact:true}).click();await expect(page.locator('.casual-v3-plan').getByRole('button',{name:'Withdraw invitation',exact:true})).toBeVisible();
 await expect(page.locator('.casual-v3-thread>.casual-cancel-action')).toHaveCount(0);
 await page.getByRole('button',{name:'Collapse casual plan details',exact:true}).click();await expect(page.getByRole('button',{name:'Withdraw invitation',exact:true})).toHaveCount(0);
});
