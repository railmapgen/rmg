import{j as e}from"./jsx-runtime-ffb262ed.js";import{R as m}from"./rmg-data-table-50dd74a7.js";import{B as d}from"./chunk-Z6RXEUPO-3dcc51cd.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./index-7abe7895.js";const f={title:"RmgDataTable",component:m},a=()=>{const r=[{id:"001",name:"Alice",age:18},{id:"002",name:"Benjamin",age:20},{id:"003",name:"Charlie",age:19}],l=[{label:"ID",displayHandler:s=>e.jsx(d,{children:s.id})},{label:"Name",key:"name"},{label:"Age",key:"age"}];return e.jsx(m,{data:r,fields:l})};var n,t,i;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const data: RmgDataTableDataType[] = [{
    id: '001',
    name: 'Alice',
    age: 18
  }, {
    id: '002',
    name: 'Benjamin',
    age: 20
  }, {
    id: '003',
    name: 'Charlie',
    age: 19
  }];
  const fields: RmgDataTableFieldType<RmgDataTableDataType>[] = [{
    label: 'ID',
    displayHandler: item => <Badge>{item.id}</Badge>
  }, {
    label: 'Name',
    key: 'name'
  }, {
    label: 'Age',
    key: 'age'
  }];
  return <RmgDataTable data={data} fields={fields} />;
}`,...(i=(t=a.parameters)==null?void 0:t.docs)==null?void 0:i.source}}};const B=["Basic"];export{a as Basic,B as __namedExportsOrder,f as default};
//# sourceMappingURL=rmg-data-table.stories-fe96245a.js.map
