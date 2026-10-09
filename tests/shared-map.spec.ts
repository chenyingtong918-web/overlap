import {test,expect,type Page} from '@playwright/test';
async function openMap(page:Page){
 await page.getByText('Demo scenarios',{exact:true}).click();await page.getByRole('button',{name:'Confirmed casual plan',exact:true}).click();
 await page.getByRole('button',{name:/Our map Our shared places/}).click();
}
for(const device of ['iPhone','Pixel 10'])test(`shared map matches the design and selected avatar on ${device}`,async({page})=>{
 await page.goto('/');if(device==='Pixel 10'){await page.getByRole('button',{name:'Preview device: iPhone'}).click();await page.getByRole('menuitemradio',{name:'Pixel 10',exact:true}).click();}
 await page.getByRole('button',{name:'Explore the demo',exact:true}).click();await openMap(page);
 await expect(page.locator('.our-map-companions .avatar').first().locator('img')).toHaveAttribute('src','/figma/cartoon.png');
 await page.getByLabel('Add a shared place',{exact:true}).click();
 await expect(page.locator('.our-map-spot strong')).toHaveCSS('font-size','14px');
 expect(await page.locator('.our-map').evaluate(el=>el.closest('.mobile-scroll')===null)).toBe(true);
 const geometry=await page.locator('.our-map').evaluate(el=>{
  const art=el.querySelector('.our-map-art') as HTMLElement, panel=el.querySelector('.our-map-panel') as HTMLElement, add=el.querySelector('.our-map-add') as HTMLElement;
  return {art:[art.offsetWidth,art.offsetHeight],panelHeight:panel.offsetHeight,add:[add.offsetLeft,add.offsetTop],assets:[...el.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0),overflows:el.scrollWidth>el.clientWidth};
 });expect(geometry).toEqual({art:[390,580],panelHeight:168,add:[211,188],assets:true,overflows:false});
 await page.mouse.move(0,0);await page.waitForTimeout(150);await page.screenshot({path:`test-results/shared-map-${device.replace(' ','-')}.png`});
 await page.getByRole('button',{name:'Close place',exact:true}).click();await expect(page.getByRole('button',{name:'Add our moment',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Demo flows',exact:true}).click();await page.getByRole('button',{name:'Onboarding',exact:true}).click();
 await page.getByRole('button',{name:'Take photo',exact:true}).click();await page.getByRole('button',{name:'Keep my real photo',exact:true}).click();
 await openMap(page);await expect(page.locator('.our-map-companions .avatar').first().locator('img')).toHaveAttribute('src','/figma/portrait.png');
});
