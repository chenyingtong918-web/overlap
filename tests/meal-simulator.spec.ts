import {test,expect,type Page} from '@playwright/test';

async function pendingMeal(page:Page){await page.goto('/');await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Meal invitation',exact:true}).click();}

test('See the invitation stays waiting; group acceptance and messages are deliberate',async({page})=>{
 test.setTimeout(55000);
 await page.goto('/');await page.getByRole('button',{name:'Demo flows',exact:true}).click();await page.getByRole('button',{name:'Meal draw — Chat',exact:true}).click();
 await page.getByRole('button',{name:'Noodles',exact:true}).click();await page.getByRole('button',{name:'3 people',exact:true}).click();await page.getByRole('button',{name:'12:00',exact:true}).click();
 await page.getByRole('button',{name:'Draw my lunch card',exact:true}).click();await page.getByRole('button',{name:'Invite this table',exact:true}).click({timeout:8000});await page.getByRole('button',{name:'Send invitation',exact:true}).click();
 await page.getByRole('button',{name:'See the invitation',exact:true}).waitFor();await page.waitForTimeout(4800);await page.getByRole('button',{name:'See the invitation',exact:true}).click();
 await expect(page.locator('.meal-flow-status')).toHaveText('Waiting');await expect(page.getByRole('button',{name:'I’m here',exact:true})).toHaveCount(0);
 await expect(page.getByText('Demo scenarios',{exact:true})).toHaveCount(0);
 const trigger=page.getByRole('button',{name:'Mock 同意',exact:true});
 const position=await trigger.boundingBox();const phone=await page.locator('.phone-device').boundingBox();
 expect(position!.height).toBe(34);expect(position!.x+position!.width).toBeLessThan(phone!.x);expect(position!.y).toBeGreaterThan(page.viewportSize()!.height-60);
 await trigger.click();
 await expect(page.locator('.meal-flow-status')).toHaveText('Confirmed');await expect(page.locator('.meal-step[aria-current="step"]')).toHaveText('Meet');
 await expect(page.getByRole('button',{name:'I’m here',exact:true})).toBeVisible();
 await expect(page.locator('.meal-thread-messages .other-bubble')).toHaveCount(2);
 for(const reply of await page.locator('.meal-thread-messages .other-bubble').all())await expect(reply).toContainText('I’m in! Looking forward to it.');
 await expect(page.getByRole('button',{name:'Mock 已同意',exact:true})).toBeDisabled();
 await expect(page.locator('.meal-simulator-panel')).toHaveCount(0);
 await page.mouse.move(0,0);await page.screenshot({path:'test-results/meal-mock-accept.png'});
 await page.getByRole('button',{name:'Go back',exact:true}).click();await expect(page.locator('.meal-simulator')).toHaveCount(0);
});

test('one click confirms the same invitation and cannot append duplicate replies',async({page})=>{
 await pendingMeal(page);const invitation=await page.locator('.meal-thread-messages .user-bubble').innerText();
 await page.getByRole('button',{name:'Mock 同意',exact:true}).dblclick();
 await expect(page.locator('.meal-flow-status')).toHaveText('Confirmed');
 await expect(page.locator('.meal-step[aria-current="step"]')).toHaveText('Meet');
 await expect(page.locator('.meal-thread-messages .user-bubble')).toHaveText(invitation);
 await expect(page.locator('.meal-thread-messages .other-bubble')).toHaveCount(1);
 await expect(page.locator('.meal-thread-messages .other-bubble')).toContainText('Noah Yu');
 await expect(page.getByRole('button',{name:'Mock 已同意',exact:true})).toBeDisabled();
 await expect(page.locator('.human-composer')).toBeVisible();
});

test('withdrawing hides mock acceptance and never reopens the invitation',async({page})=>{
 await pendingMeal(page);await page.getByRole('button',{name:'Expand lunch plan details',exact:true}).click();
 await page.getByRole('button',{name:'Withdraw invitation',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Withdraw invitation',exact:true}).click();
 await expect(page.locator('.meal-flow-status')).toHaveText('Cancelled');await expect(page.locator('.meal-simulator')).toHaveCount(0);
 await page.waitForTimeout(4800);await expect(page.locator('.meal-flow-status')).toHaveText('Cancelled');await expect(page.locator('.meal-thread-messages .other-bubble')).toHaveCount(0);
});
