import {test,expect,type Page} from '@playwright/test';
const controls=(page:Page)=>page.getByRole('complementary',{name:'Plan demo controls'});
async function shortcut(page:Page,name:string){await page.goto('/');await page.getByRole('button',{name:'Demo flows',exact:true}).click();await page.getByRole('button',{name,exact:true}).click();}

test('coffee waits for Confirm, preserves one thread through Prepare and Reflection',async({page})=>{
 await shortcut(page,'Coffee chat — Explore');
 await page.getByRole('button',{name:'Ask to join',exact:true}).first().click();
 await page.getByRole('button',{name:'Help me write',exact:true}).click();await page.getByRole('button',{name:'Send invitation',exact:true}).click();
 await page.waitForTimeout(4800);await expect(page.locator('.meal-flow-status')).toHaveText('Waiting');
 await expect(controls(page).getByRole('button')).toHaveText(['Confirm','Reflection','Prepare']);
 await expect(page.getByText('Demo scenarios',{exact:true})).toHaveCount(0);await expect(page.locator('.coffee-simulation')).toHaveCount(0);
 await controls(page).getByRole('button',{name:'Confirm',exact:true}).dblclick();await expect(page.getByLabel('Coffee progress: Meet')).toBeVisible();
 await expect(page.locator('.human-messages .other-bubble')).toHaveCount(1);await expect(page.locator('.coffee-compact-meta')).toContainText('15:30');
 const invitation=await page.locator('.human-messages .user-bubble').innerText();
 await controls(page).getByRole('button',{name:'Prepare',exact:true}).click();await page.getByRole('button',{name:'Create a note',exact:true}).click();
 await page.getByRole('button',{name:'Explore my topics',exact:true}).click();await page.getByLabel('Select A first step in my role',{exact:true}).click();await page.getByRole('button',{name:'Build my notes',exact:true}).click();await page.getByRole('button',{name:'Save my note',exact:true}).click();
 await controls(page).getByRole('button',{name:'Reflection',exact:true}).click();await expect(page.getByLabel('Coffee progress: Reflect')).toBeVisible();
 await page.getByRole('button',{name:'Write feedback',exact:true}).click();await page.getByRole('button',{name:'Comfortable',exact:true}).click();await page.getByRole('button',{name:'Save feedback',exact:true}).click();
 await controls(page).getByRole('button',{name:'Prepare',exact:true}).click();await expect(page.getByText('Only you can see these')).toBeVisible();
 await controls(page).getByRole('button',{name:'Confirm',exact:true}).click();await expect(page.locator('.human-messages .user-bubble')).toHaveText(invitation);await expect(page.locator('.human-messages .other-bubble')).toHaveCount(1);
 await page.mouse.move(0,0);await page.screenshot({path:'test-results/coffee-demo-controls.png'});
});

test('Casual controls jump across current plan, exploration, map and private reflection',async({page})=>{
 await shortcut(page,'Casual plan — Explore');
 await page.locator('.explore-post').filter({hasText:'A slow photo walk'}).getByRole('button',{name:'Ask to join',exact:true}).click();
 await page.getByRole('button',{name:'Ask to join',exact:true}).click();await page.getByRole('button',{name:'Send request',exact:true}).click();await page.waitForTimeout(3000);
 await expect(page.locator('.meal-flow-status')).toHaveText('Pending');
 await expect(controls(page).getByRole('button')).toHaveText(['Confirm','Reflection','Explore','Map']);
 await controls(page).getByRole('button',{name:'Confirm',exact:true}).click();await expect(page.getByLabel('Casual progress: Meet')).toBeVisible();
 await expect(page.locator('.casual-v3-messages .other-bubble')).toHaveCount(1);
 await page.getByRole('button',{name:'I’m here',exact:true}).click();await expect(page.getByLabel('Casual progress: Meet')).toBeVisible();
 await controls(page).getByRole('button',{name:'Explore',exact:true}).click();await expect(page.getByLabel('Ideas for your walk')).toBeVisible();
 await controls(page).getByRole('button',{name:'Map',exact:true}).click();await expect(page.getByLabel('Our shared map')).toBeVisible();await page.getByLabel('Add a shared place',{exact:true}).click();
 await page.getByRole('button',{name:'Add our moment',exact:true}).click();await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Light up this place',exact:true}).click();
 await controls(page).getByRole('button',{name:'Reflection',exact:true}).click();await expect(page.getByLabel('Casual progress: Reflect')).toBeVisible();
 await page.getByRole('button',{name:'Write feedback',exact:true}).click();await page.getByRole('button',{name:'Great',exact:true}).click();await page.getByRole('button',{name:'Save feedback',exact:true}).click();
 await controls(page).getByRole('button',{name:'Map',exact:true}).click();await expect(page.getByText('3 places lit up',{exact:true})).toBeVisible();
 await controls(page).getByRole('button',{name:'Reflection',exact:true}).click();await page.getByRole('button',{name:'Edit feedback',exact:true}).click();await expect(page.getByRole('button',{name:'Great',exact:true})).toHaveClass(/selected/);
 await page.getByRole('button',{name:'Close sheet',exact:true}).click();await controls(page).getByRole('button',{name:'Confirm',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('.casual-v3-messages .other-bubble')).toHaveCount(1);
 await page.mouse.move(0,0);await page.screenshot({path:'test-results/casual-demo-controls.png'});
});
