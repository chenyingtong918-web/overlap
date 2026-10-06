import { test, expect } from '@playwright/test';

test('all process shortcuts open their first screen, including from login', async ({ page }) => {
 await page.goto('/');
 await expect(page.getByRole('button',{name:'Demo flows',exact:true})).toHaveAttribute('aria-expanded','false');
 const nav=page.getByRole('complementary',{name:'Demo process navigation'});
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await nav.getByRole('button',{name:'Onboarding',exact:true}).click();
 await expect(page.getByLabel('Step 1 of 4')).toBeVisible();
 await page.getByRole('button',{name:'Take photo',exact:true}).click();
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await nav.getByRole('button',{name:'Onboarding',exact:true}).click();
 await expect(page.locator('.avatar-empty')).toBeVisible();
 for(const [label,category] of [['Meal draw','Meal draws'],['Coffee chat','Coffee chats'],['Casual plan','Casual plans']]){
  await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await nav.getByRole('button',{name:`${label} — Explore`,exact:true}).click();
  await expect(page.getByRole('tab',{name:category,exact:true})).toHaveAttribute('aria-selected','true');
  await page.getByRole('button',{name:'Filter nearby posts',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  // A phone modal hides outside controls from the accessibility tree; the desktop launcher remains pointer-accessible.
  await page.locator('.demo-process-toggle').click();
  await page.locator(`.demo-process-nav button[aria-label="${label} — Chat"]`).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.overlap-app')).toHaveClass(new RegExp(label==='Meal draw'?'lunch-guided':label==='Coffee chat'?'coffee-guided':'casual-guided'));
 }
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await nav.getByRole('button',{name:'Login/Sign up',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Welcome to overlap.'})).toBeVisible();
 await page.waitForTimeout(3200);
 await expect(page.getByRole('heading',{name:'Welcome to overlap.'})).toBeVisible();
 await page.getByRole('button',{name:'Sign up',exact:true}).click();
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await nav.getByRole('button',{name:'Login/Sign up',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Welcome to overlap.'})).toBeVisible();
 await page.screenshot({path:'test-results/demo-flow-navigation.png'});
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'Demo flows',exact:true})).toHaveAttribute('aria-expanded','false');
});

test('restarting guided Chat discards previous answers and retains the first question',async({page})=>{
 await page.goto('/');const entry=page.getByRole('button',{name:'Coffee chat — Chat',exact:true});
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();await entry.click();await expect(page.getByText('What would you love to talk about?',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Moving into product',exact:true}).click();
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();await entry.click();await expect(page.getByText('What would you love to talk about?',{exact:true})).toBeVisible();
 await expect(page.locator('.chat-history')).toHaveCount(0);
});
