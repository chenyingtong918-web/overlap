import { test, expect, type Page } from '@playwright/test';

async function demo(page:Page){await page.goto('/');await page.getByRole('button',{name:'Explore the demo',exact:true}).click();}
async function scenario(page:Page,name:string){await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name,exact:true}).click();}
async function assertNoHorizontalOverflow(page:Page){expect(await page.locator('.content').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);}

test('avatar generation remains optional and leads into all four onboarding steps',async({page})=>{
 await demo(page);await scenario(page,'Avatar onboarding');await expect(page.getByLabel('Step 1 of 4')).toBeVisible();await expect(page.locator('.onboarding-title')).toHaveCSS('font-size','24px');
 await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Create my AI avatar',exact:true}).click();
 await expect(page.getByRole('button',{name:'Please wait'})).toBeDisabled();await page.getByRole('button',{name:'Use this avatar',exact:true}).click();
 await expect(page.getByLabel('Step 2 of 4')).toBeVisible();await expect(page.getByRole('button',{name:'Add a profile photo'})).toHaveCount(0);
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByLabel('Step 3 of 4')).toBeVisible();
 await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.getByLabel('Step 4 of 4')).toBeVisible();
 await expect(page.locator('.onboarding-card-avatar img')).toHaveAttribute('src','/figma/cartoon.png');await assertNoHorizontalOverflow(page);
});

test('coffee notes are selected, edited, saved, and available during a demo call',async({page})=>{
 await demo(page);await scenario(page,'Confirmed coffee chat');await page.getByRole('button',{name:/Prepare with Overlap/}).click();
 await page.getByRole('button',{name:'Create a note',exact:true}).click();await page.getByRole('button',{name:'Explore my topics',exact:true}).click();
 await page.getByLabel('Select A first step in my role',{exact:true}).click();
 await page.getByRole('button',{name:'Build my notes',exact:true}).click();await page.getByRole('button',{name:'Save my note',exact:true}).click();
 await expect(page.getByText('Only you can see these')).toBeVisible();await page.getByRole('button',{name:'Go back',exact:true}).click();
 await page.getByRole('button',{name:'Join chat',exact:true}).click();await page.getByRole('button',{name:'Join chat',exact:true}).click();
 await page.getByRole('button',{name:'Notes',exact:true}).click();await expect(page.getByRole('heading',{name:'Your chat notes',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Was there a moment when product started to feel right?',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Back to the chat',exact:true}).click();await page.getByRole('button',{name:'End call',exact:true}).click();
 await expect(page.getByRole('button',{name:/Write feedback/})).toBeVisible();
});

test('meal reflection can be saved with choices only and no free-text note',async({page})=>{
 await demo(page);await scenario(page,'Meal invitation');await page.getByRole('button',{name:'Confirm',exact:true}).click();await page.getByRole('button',{name:'Reflection',exact:true}).click();
 await page.getByRole('button',{name:'Write feedback',exact:true}).click();await expect(page.getByRole('button',{name:'Save feedback',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Great',exact:true}).click();await page.getByRole('button',{name:'Easy conversation',exact:true}).click();
 await page.getByRole('button',{name:'Yes',exact:true}).click();await page.getByRole('button',{name:'Save feedback',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByText('Feedback saved',{exact:true})).toBeVisible();
});

test('casual activities need shared approval before confirmation, then support photo memories',async({page})=>{
 await demo(page);await scenario(page,'Confirmed casual plan');await page.getByRole('button',{name:/Explore together More ideas/}).click();
 await page.getByRole('button',{name:'Add to our list',exact:true}).first().click();await page.getByRole('button',{name:'Confirm selection',exact:true}).click();
 await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeDisabled();await expect(page.getByText('Awaiting Alex',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Confirm A little tea break',exact:true}).click();await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeEnabled();await page.getByRole('button',{name:'Confirm plan',exact:true}).click();
 await page.getByRole('button',{name:'I’m here',exact:true}).click();await page.getByRole('button',{name:/Our map Our shared places/}).click();
 await page.getByLabel('Add a shared place',{exact:true}).click();await page.getByRole('button',{name:'Add our moment',exact:true}).click();
 await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Add to our map',exact:true}).click();
 await expect(page.getByText('3 places lit up',{exact:true})).toBeVisible();await page.getByLabel('Open tree-lined path memory').click();
 await expect(page.getByRole('dialog')).toBeVisible();
});

test('little-list discoveries unlock a voucher and remain saved on return',async({page})=>{
 await demo(page);await page.getByRole('button',{name:'Open profile',exact:true}).click();await page.getByRole('button',{name:/Save a conversation starter/}).click();
 await page.getByLabel('Your thought',{exact:true}).fill('How did you find your way into design?');await page.getByRole('button',{name:'Save my thought',exact:true}).click();
 await page.getByRole('button',{name:'Claim a little treat',exact:true}).click();await page.getByRole('button',{name:'Add to my vouchers',exact:true}).click();await expect(page.getByText('Ready to use',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Back to my profile',exact:true}).click();await page.getByRole('button',{name:'Discoveries',exact:true}).click();await expect(page.getByRole('heading',{name:'How did you find your way into design?',exact:true})).toBeVisible();
});

test('friend requests and private messages survive leaving Messages',async({page})=>{
 await demo(page);await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'Messages',exact:true}).click();
 await page.getByRole('button',{name:'Friends',exact:true}).click();await page.getByRole('button',{name:'Friend requests 1',exact:true}).click();await page.getByRole('button',{name:'Accept request',exact:true}).click();await page.getByRole('button',{name:'Close sheet',exact:true}).click();
 await page.getByRole('button',{name:/Leo Chen Friend/}).click();await page.getByLabel('Message Leo Chen',{exact:true}).fill('See you at the café.');await page.getByLabel('Send private message').click();
 await page.getByRole('button',{name:'Go back',exact:true}).click();await page.getByRole('button',{name:'Go back',exact:true}).click();
 await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('button',{name:'Messages',exact:true}).click();await page.getByRole('button',{name:/Leo Chen Friend/}).click();await expect(page.getByText('See you at the café.',{exact:true})).toBeVisible();
});

test('group voting stays in Plan and requires a choice before confirming',async({page})=>{
 await demo(page);await scenario(page,'Group casual plan');await page.getByRole('button',{name:/Explore together More ideas/}).click();await page.getByRole('button',{name:/A photo stop together/}).click();await page.getByRole('button',{name:'Confirm selection',exact:true}).click();
 await expect(page.getByText('1 of 3 responded',{exact:true})).toBeVisible();await expect(page.getByText('3 of 3 responded',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/Your pick/}).click();await expect(page.getByRole('button',{name:'Confirm plan',exact:true})).toBeDisabled();await page.getByRole('button',{name:/Vote for this/}).click();await page.getByRole('button',{name:'Confirm plan',exact:true}).click();await expect(page.getByRole('button',{name:'I’m here',exact:true})).toBeVisible();
});

test('Pixel retains native chrome and keeps the avatar footer outside scrolling content',async({page})=>{
 await demo(page);await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByText('Pixel 10',{exact:true}).click();await scenario(page,'Avatar onboarding');
 await assertNoHorizontalOverflow(page);await expect(page.getByRole('button',{name:'Take photo',exact:true})).toBeVisible();
 expect(await page.locator('.sync-fixed-actions').evaluate(el=>el.closest('.mobile-scroll')===null)).toBe(true);
});

test('a withdrawn invitation cannot be revived by the simulated reply timer',async({page})=>{
 await demo(page);await scenario(page,'Meal invitation');await page.getByRole('button',{name:'Expand lunch plan details',exact:true}).click();await page.getByRole('button',{name:'Withdraw invitation',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'Withdraw invitation',exact:true}).click();await page.waitForTimeout(4800);
 await expect(page.getByText('Cancelled',{exact:true}).first()).toBeVisible();await expect(page.getByRole('button',{name:'I’m here',exact:true})).toHaveCount(0);
});

test('meal confirmation requires explicit simulation and current screens have no missing assets',async({page})=>{
 await demo(page);await scenario(page,'Meal invitation');await page.waitForTimeout(4800);await expect(page.getByRole('button',{name:'I’m here',exact:true})).toHaveCount(0);await page.getByRole('button',{name:'Confirm',exact:true}).click();await expect(page.getByRole('button',{name:'I’m here',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Go back',exact:true}).click();await scenario(page,'Avatar onboarding');await expect(page.locator('.avatar-empty img')).toBeVisible();await page.screenshot({path:'test-results/latest-avatar-onboarding.png'});
 await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Create my AI avatar',exact:true}).click();await expect(page.getByRole('button',{name:'Use this avatar',exact:true})).toBeVisible();
 expect(await page.locator('.avatar-capture-frame>img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 await scenario(page,'Confirmed casual plan');await page.getByRole('button',{name:/Our map Our shared places/}).click();await page.getByLabel('Add a shared place',{exact:true}).click();await page.screenshot({path:'test-results/latest-shared-map.png'});
});
