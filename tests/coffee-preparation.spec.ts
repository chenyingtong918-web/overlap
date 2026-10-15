import {test,expect,type Page} from '@playwright/test';
async function openPreparation(page:Page){
 await page.goto('/');await page.getByRole('button',{name:'Explore the demo',exact:true}).click();
 await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Confirmed coffee chat',exact:true}).click();
 await page.getByRole('button',{name:/Prepare with Overlap/}).click();await page.getByRole('button',{name:'Create a note',exact:true}).click();
}
test('preparation retains selected topic identity, edits, and title when reopening and updating a note',async({page})=>{
 await openPreparation(page);
 await page.getByRole('button',{name:'Try another intention',exact:true}).click();await expect(page.getByLabel('Chat purpose')).toHaveValue(/one practical product task/);
 await page.getByRole('button',{name:'Explore my topics',exact:true}).click();
 await page.getByLabel('Select Zoe’s path into product',{exact:true}).click();
 await page.getByRole('button',{name:'Edit',exact:true}).click();await page.getByLabel('Edit topic question').fill('Which design skill should I practise first?');
 await page.getByRole('button',{name:'Done',exact:true}).click();await page.getByRole('button',{name:'Build my notes',exact:true}).click();
 await expect(page.getByRole('heading',{name:'01 Design skills in product'})).toBeVisible();
 await expect(page.locator('.sync-note')).toHaveCount(2);await expect(page.locator('.sync-note').first()).toContainText('New skills she had to develop');
 await page.getByRole('button',{name:'Edit note title',exact:true}).click();await page.getByLabel('Note title',{exact:true}).fill('My practical next step');
 await page.getByRole('button',{name:'Save my note',exact:true}).click();
 await expect(page.locator('.sync-notes-library')).toHaveCount(1);await page.locator('.sync-notes-library').click();
 await expect(page.getByRole('heading',{name:'01 Design skills in product'})).toBeVisible();await expect(page.locator('.sync-note').first()).toContainText('Which design skill should I practise first?');
 await expect(page.locator('.prep-note-title')).toHaveText('“My practical next step”');
 await page.getByRole('button',{name:'Save my note',exact:true}).click();await expect(page.locator('.sync-notes-library')).toHaveCount(1);
 await page.getByRole('button',{name:'Go back',exact:true}).click();await page.getByRole('button',{name:/Prepare with Overlap/}).click();
 await expect(page.locator('.sync-notes-library')).toContainText('My practical next step');
});
test('new notes reset the draft; refreshed topics and empty selections behave independently',async({page})=>{
 await openPreparation(page);await page.getByRole('button',{name:'Explore my topics',exact:true}).click();
 for(const name of ['Zoe’s path into product','Design skills in product','A first step in my role'])await page.getByLabel('Select '+name,{exact:true}).click();
 await expect(page.getByRole('button',{name:'Build my notes',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Try three new topics',exact:true}).click();await expect(page.getByText('3 of 3 topics selected')).toBeVisible();
 await page.getByRole('button',{name:'Build my notes',exact:true}).click();await page.getByRole('button',{name:'Save my note',exact:true}).click();
 await expect(page.locator('.sync-notes-library')).toContainText('The turning point');
 await page.getByRole('button',{name:'Create a new note',exact:true}).click();await expect(page.getByLabel('Chat purpose')).toHaveValue('“Find a small way to try product work in my current role.”');
 await page.getByRole('button',{name:'Explore my topics',exact:true}).click();await expect(page.getByLabel('Select Zoe’s path into product')).toBeVisible();
 await page.getByRole('button',{name:'Build my notes',exact:true}).click();await page.getByRole('button',{name:'Save my note',exact:true}).click();
 await expect(page.locator('.sync-notes-library')).toHaveCount(2);await page.locator('.sync-notes-library').first().click();
 await expect(page.locator('.sync-note').first()).toContainText('The turning point');await expect(page.locator('.sync-note').first()).toContainText('What made you want to try something different?');
});
