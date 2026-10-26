import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html = readFileSync(new URL('../public/review/521bd1f0bc332d1a91b5818d4b630a50e249.html', import.meta.url),'utf8');
const script = html.split('<script>')[1].split('</script>')[0];
function workspace(){
  const nodes=new Map();
  const node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',dataset:{},style:{},checked:false,focus(){}});return nodes.get(id);};
  const document={getElementById:node,querySelector:()=>node('dialog'),addEventListener(){},body:{style:{},classList:{add(){},remove(){}}}};
  const context=vm.createContext({document,location:{hash:'#restaurant'},window:{addEventListener(){},scrollTo(){}},setTimeout(){},clearTimeout(){},setInterval(){},performance:{now:()=>0},fetch:async()=>({ok:false})});
  vm.runInContext(script,context);
  return {run:code=>vm.runInContext(code,context),nodes};
}
test('individual and selected batch apply only reviewed items after approval',()=>{
 const w=workspace();
 w.run('draftPrices={0:3300,1:6600,2:2300}; selectedMenu.add(0); selectedMenu.add(2); reviewPrices("selected")');
 assert.match(w.nodes.get('dialog-body').innerHTML,/Escovitch fish/);
 assert.doesNotMatch(w.nodes.get('dialog-body').innerHTML,/Grilled lobster/);
 w.run('applyReviewedPrices()');
 assert.equal(w.run('state.menu[0].price'),3200,'switch must be on');
 w.run("document.getElementById('approve-price-changes').checked=true");
 w.run('applyReviewedPrices()');
 assert.equal(w.run('state.menu[0].price'),3300);
 assert.equal(w.run('state.menu[2].price'),2300);
 assert.equal(w.run('state.menu[1].price'),6500);
 assert.equal(w.run('draftPrices[1]'),6600);
 w.run('reviewPrices("1"); applyReviewedPrices()');
 assert.equal(w.run('state.menu[1].price'),6600);
 assert.equal(w.run('pendingMenuIds().length'),0);
});
test('apply all includes edits hidden by search, and invalid batches never partly apply',()=>{
 const w=workspace();
 w.run('draftPrices={0:3400,1:0}; searchTerm="pasta"; reviewPrices("all")');
 assert.equal(w.run('pendingApply.length'),0);
 assert.equal(w.run('state.menu[0].price'),3200);
 w.run('draftPrices[1]=6700; reviewPrices("all")');
 assert.equal(w.run('pendingApply.length'),2);
 w.run("document.getElementById('approve-price-changes').checked=true");
 w.run('applyReviewedPrices()');
 assert.equal(w.run('state.menu[0].price'),3400);
 assert.equal(w.run('state.menu[1].price'),6700);
 assert.equal(w.run('draftPrices[4]'),undefined);
 assert.match(w.run('restaurant()'),/Rasta Pasta/);
});
