import {test,expect,type Page} from '@playwright/test';
async function openCoffee(page:Page,device='iPhone'){
 await page.goto('/');
 if(device!=='iPhone'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByRole('menuitemradio',{name:device,exact:true}).click();}
 await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Confirmed coffee chat',exact:true}).click();
}
for(const device of ['iPhone','Pixel 10'])test(`coffee preflight and in-call notes preserve controls, selected topics and safe areas on ${device}`,async({page})=>{
 await openCoffee(page,device);await page.getByRole('button',{name:/Prepare with Overlap/}).click();
 await expect(page.locator('.prep-empty-notebook')).toHaveCSS('width','112px');await expect(page.locator('.prep-empty-notebook')).toHaveCSS('height','116px');
 await page.getByRole('button',{name:'Create a note',exact:true}).click();await page.getByRole('button',{name:'Explore my topics',exact:true}).click();
 await page.getByLabel('Select Zoe’s path into product',{exact:true}).click();await page.getByRole('button',{name:'Build my notes',exact:true}).click();await page.getByRole('button',{name:'Save my note',exact:true}).click();await page.getByRole('button',{name:'Go back',exact:true}).click();
 await page.getByRole('button',{name:'Join chat',exact:true}).click();await expect(page.getByRole('heading',{name:'Ready to join Zoe?'})).toBeVisible();
 await expect(page.getByRole('switch',{name:'Use preparation notes'})).toBeChecked();
 await page.getByRole('button',{name:/Your preparation notes/}).click();await expect(page.getByRole('heading',{name:'Your notes',exact:true})).toBeVisible();await page.getByRole('button',{name:'Go back',exact:true}).click();await expect(page.getByRole('heading',{name:'Ready to join Zoe?'})).toBeVisible();
 const join=await page.getByRole('button',{name:'Join chat',exact:true}).boundingBox();const screen=await page.locator('[data-phone-screen]').boundingBox();const video=await page.locator('.coffee-video').boundingBox();
 expect(join!.y+join!.height).toBeLessThan(screen!.y+screen!.height-20);expect(join!.width).toBeCloseTo(video!.width,0);
 await page.getByRole('button',{name:'Mic',exact:true}).click();await page.getByRole('button',{name:'Camera',exact:true}).click();
 await page.getByRole('button',{name:'Join chat',exact:true}).click();await expect(page.locator('.coffee-preview-header')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Mic',exact:true})).toHaveAttribute('aria-pressed','false');await expect(page.getByLabel('Your camera is off',{exact:true})).toBeVisible();await expect(page.getByAltText('Zoe Lin demo video')).toBeVisible();
 await expect(page.getByLabel('Your current chat note')).toContainText('Design skills in product');await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toContainText('A first step in my role');
 await page.getByRole('button',{name:'Notes',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toHaveCount(0);await page.getByRole('button',{name:'Notes',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toContainText('A first step in my role');
 const card=await page.locator('.coffee-live-note').boundingBox(),controls=await page.locator('.coffee-room-controls').boundingBox();expect(card!.y+card!.height).toBeLessThan(controls!.y);expect(controls!.y+controls!.height).toBeLessThan(screen!.y+screen!.height-20);
 await page.getByRole('button',{name:'Expand note',exact:true}).click();await expect(page.getByRole('button',{name:'Collapse note',exact:true})).toHaveAttribute('aria-expanded','true');
 await expect(page.getByText('A small product task to try',{exact:true})).toBeVisible();await expect(page.getByText('New skills she had to develop',{exact:true})).toHaveCount(0);
 await expect(page.getByLabel('Your current chat note')).toContainText('Where I want to get involved and what holds me back.');
 await expect(page.getByRole('dialog')).toHaveCount(0);
 const expandedVideo=await page.locator('.coffee-video').boundingBox(),expandedCard=await page.locator('.coffee-live-note').boundingBox();expect(expandedVideo!.width).toBeCloseTo(expandedVideo!.height,0);expect(expandedVideo!.x+expandedVideo!.width/2).toBeCloseTo(screen!.x+screen!.width/2,0);expect(expandedCard!.y+expandedCard!.height).toBeLessThan(controls!.y);
 await page.getByRole('button',{name:'Collapse note',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toContainText('A first step in my role');
 await page.getByRole('button',{name:'Expand note',exact:true}).click();
 await page.getByRole('button',{name:'Next',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toContainText('One thing I’ll take from today is');await expect(page.locator('.coffee-note-points')).toHaveCount(0);await page.getByRole('button',{name:'Collapse note',exact:true}).click();
 await page.getByRole('button',{name:'End call',exact:true}).click();await expect(page.getByRole('button',{name:'Jot something down',exact:true})).toBeVisible();
});
test('a coffee call without preparation has no invented notes and can still toggle its notes view',async({page})=>{
 await openCoffee(page);await page.getByRole('button',{name:'Join chat',exact:true}).click();await expect(page.getByRole('switch',{name:'Use preparation notes'})).toBeDisabled();await page.getByRole('button',{name:'Join chat',exact:true}).click();
 await expect(page.getByLabel('Your current chat note')).toHaveCount(0);await page.getByRole('button',{name:'Notes',exact:true}).click();await expect(page.getByLabel('Your current chat note')).toContainText('You haven’t saved any notes yet');await expect(page.getByRole('button',{name:'Next',exact:true})).toHaveCount(0);
});
