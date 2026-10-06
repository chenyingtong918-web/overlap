import {test,expect,type Page} from '@playwright/test';

async function openReplies(page:Page){await page.getByRole('button',{name:'Mock reply',exact:true}).click();return page.getByRole('region',{name:'Simulated meal replies',exact:true});}
async function pendingMeal(page:Page){await page.goto('/');await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Meal invitation',exact:true}).click();}

test('See the invitation stays waiting; group acceptance and messages are deliberate',async({page})=>{
 test.setTimeout(55000);
 await page.goto('/');await page.getByRole('button',{name:'Demo flows',exact:true}).click();await page.getByRole('button',{name:'Meal draw — Chat',exact:true}).click();
 await page.getByRole('button',{name:'Noodles',exact:true}).click();await page.getByRole('button',{name:'3 people',exact:true}).click();await page.getByRole('button',{name:'12:00',exact:true}).click();
 await page.getByRole('button',{name:'Draw my lunch card',exact:true}).click();await page.getByRole('button',{name:'Invite this table',exact:true}).click({timeout:8000});await page.getByRole('button',{name:'Send invitation',exact:true}).click();
 await page.getByRole('button',{name:'See the invitation',exact:true}).waitFor();await page.waitForTimeout(4800);await page.getByRole('button',{name:'See the invitation',exact:true}).click();
 await expect(page.locator('.meal-flow-status')).toHaveText('Waiting');await expect(page.getByRole('button',{name:'I’m here',exact:true})).toHaveCount(0);
 await expect(page.getByText('Demo scenarios',{exact:true})).toHaveCount(0);
 const trigger=page.getByRole('button',{name:'Mock reply',exact:true});
 const position=await trigger.boundingBox();const phone=await page.locator('.phone-device').boundingBox();
 expect(position!.height).toBe(34);expect(position!.x+position!.width).toBeLessThan(phone!.x);expect(position!.y).toBeGreaterThan(page.viewportSize()!.height-60);
 const panel=await openReplies(page);expect(await panel.evaluate(el=>el.closest('.overlap-app')===null)).toBe(true);
 await panel.getByRole('button',{name:'“Let me check my schedule”',exact:true}).click();await expect(page.locator('.other-bubble').last()).toContainText('Let me check my schedule');await expect(page.locator('.meal-flow-status')).toHaveText('Waiting');
 await panel.getByRole('button',{name:'Accept invitation',exact:true}).click();await expect(page.locator('.meal-flow-status')).toHaveText('Waiting');await expect(panel.getByText('Reply as Noah Yu',{exact:true})).toBeVisible();
 await panel.getByRole('button',{name:'Accept invitation',exact:true}).click();await expect(page.locator('.meal-flow-status')).toHaveText('Confirmed');await expect(page.getByRole('button',{name:'I’m here',exact:true})).toBeVisible();
 await panel.getByLabel('Simulated sender').selectOption('Noah Yu');await panel.getByLabel('Simulated message').fill('I’ll wait beside the café door.');await panel.getByRole('button',{name:'Send reply',exact:true}).click();await expect(page.locator('.other-bubble').last()).toContainText('Noah Yu');await expect(page.locator('.other-bubble').last()).toContainText('I’ll wait beside the café door.');
 await expect.poll(async()=>{const bubble=await page.locator('.other-bubble').last().boundingBox();const composer=await page.locator('.human-composer').boundingBox();return !!bubble&&!!composer&&bubble.y+bubble.height<=composer.y+1}).toBe(true);await page.mouse.move(0,0);await page.screenshot({path:'test-results/meal-reply-simulator.png'});
 await page.keyboard.press('Escape');await expect(panel).toHaveCount(0);await page.getByRole('button',{name:'Go back',exact:true}).click();await expect(page.getByRole('button',{name:'Mock reply',exact:true})).toHaveCount(0);
});

test('counterproposal and edited details require explicit agreement',async({page})=>{
 await pendingMeal(page);const panel=await openReplies(page);await panel.getByRole('button',{name:'Suggest 30 minutes later',exact:true}).click();await expect(page.getByRole('button',{name:'Agree to 12:30',exact:true})).toBeVisible();await expect(page.locator('.meal-flow-status')).toHaveText('Making plans');
 await page.getByRole('button',{name:'Change time or meeting point',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'13:00',exact:true}).click();await page.getByRole('button',{name:'Suggest these details',exact:true}).click();await page.waitForTimeout(4800);await expect(page.locator('.meal-flow-status')).toHaveText('Making plans');
 await openReplies(page);await panel.getByRole('button',{name:'Agree to your new details',exact:true}).click();await expect(page.locator('.meal-flow-status')).toHaveText('Confirmed');await expect(page.locator('.meal-compact-facts')).toContainText('13:00');await expect(page.locator('.other-bubble').last()).toContainText('That works for me. See you there!');
});

test('declining closes simulation actions without a delayed acceptance',async({page})=>{
 await pendingMeal(page);const panel=await openReplies(page);await panel.getByRole('button',{name:'Decline invitation',exact:true}).click();await expect(page.locator('.meal-flow-status')).toHaveText('Declined');await expect(panel.getByRole('button',{name:'Accept invitation',exact:true})).toHaveCount(0);await expect(panel.getByLabel('Simulated message')).toHaveCount(0);await page.waitForTimeout(4800);await expect(page.locator('.meal-flow-status')).toHaveText('Declined');
});
