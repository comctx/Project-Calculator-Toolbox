// Run with: node tests/calculators.test.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Calculator script exists');
const names=['calcMeasure','calcPaint','calcFloor','calcConcrete','calcLumber','calcMath','calcRoof','calcStairs','calcRoofingMaterials','calcDrywall'];
const sandbox={};vm.createContext(sandbox);
const prelude=source.slice(0,source.indexOf('function renderGeometryDiagram'));
vm.runInContext(prelude,sandbox);
for(const name of names)assert.equal(typeof sandbox[name],'function',name+' exists');
const test=(name,fn)=>{try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,e.message);process.exitCode=1}};
test('roof angle and rafter',()=>{const r=sandbox.calcRoof({run:'12',pitch:'6',overhang:'0'},'us');assert.equal(r.heading,'26.57°');assert.ok(r.rows.some(x=>x[1]==='13.416 ft'))});
test('stairs risers',()=>{const r=sandbox.calcStairs({total:'108',max:'7.75',tread:'10'},'us');assert.equal(r.heading,'14 risers');assert.ok(r.rows.some(x=>x[1]==='130 in'))});
test('roofing bundles',()=>{const r=sandbox.calcRoofingMaterials({length:'30',run:'12',pitch:'6',waste:'10',coverage:'33.3',sides:'2'},'us');assert.equal(r.heading,'885.48 sq ft');assert.ok(r.rows.some(x=>x[1]==='27'))});
test('drywall sheets',()=>{const r=sandbox.calcDrywall({length:'12',width:'10',height:'8',openings:'20',ceiling:'1',waste:'10',sheetArea:'32'},'us');assert.equal(r.heading,'16 sheets')});
test('invalid inputs rejected',()=>{assert.equal(sandbox.calcRoof({run:'-1',pitch:'6',overhang:'0'},'us'),null);assert.equal(sandbox.calcStairs({total:'0',max:'7.75',tread:'10'},'us'),null)});
console.log('Calculator smoke tests finished.');
