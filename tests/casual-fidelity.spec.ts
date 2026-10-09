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
 await expect(page.getByText('3 places lit up',{exact:true})).toBeVisible();await expect(page.locator('.our-map-memory-panel img')).toHaveCount(2);await expect(page.locator('.our-map-memory-panel')).toContainText('The light made us stop.');
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
 await page.getByRole('button',{name:'Confirm A photo stop together',exact:true}).click();await page.getByRole('button',{name:'Confirm plan',exact:true}).click();await expect(page.getByLabel('Casual progress: Meet')).toBeVisible();await expect(page.locator('.casual-added-plan')).toContainText('A little tea break');
});
