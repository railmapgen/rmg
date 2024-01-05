import{j as t}from"./jsx-runtime-ffb262ed.js";import{R as m}from"./rmg-auto-complete-c89b5d24.js";import{B as l}from"./chunk-PULVB27S-030175da.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./rmg-debounced-input-ab04b406.js";import"./chunk-QJA5SDDN-601f6f7e.js";import"./chunk-XRMX4GAI-f266e033.js";import"./index-7abe7895.js";import"./index-17e33fe9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./chunk-RMJG37OC-ea3654d6.js";import"./chunk-24I2HV4N-aa87085e.js";import"./index-82c2af04.js";import"./index-eaa72e81.js";import"./index-3e7aa64e.js";import"./motion-d7628447.js";import"./chunk-DY5QRMBO-fb8d2a8e.js";import"./chunk-2GBDXOMA-39401b6c.js";import"./index-e1b4ee4c.js";import"./chunk-UVUR7MCU-5ad2b195.js";import"./emotion-react.browser.esm-583f468d.js";const E={title:"RmgAutoComplete",component:m},a=()=>{const u=[{id:"gz",value:"Guangzhou",additionalValue:"廣州"},{id:"hk",value:"Hong Kong",additionalValue:"香港"},{id:"sh",value:"Shanghai",additionalValue:"上海"}];return t.jsx(l,{children:t.jsx(m,{data:u,displayValue:o=>o.value+" ("+o.value[0]+")",predicate:(o,e)=>o.value.toLowerCase().includes(e.toLowerCase())||o.additionalValue.toLowerCase().includes(e.toLowerCase())})})};var i,r,n;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
  const data = [{
    id: 'gz',
    value: 'Guangzhou',
    additionalValue: '廣州'
  }, {
    id: 'hk',
    value: 'Hong Kong',
    additionalValue: '香港'
  }, {
    id: 'sh',
    value: 'Shanghai',
    additionalValue: '上海'
  }];
  return <Box>
            <RmgAutoComplete data={data} displayValue={item => item.value + ' (' + item.value[0] + ')'} // Guangzhou (G)
    predicate={(item, input) => item.value.toLowerCase().includes(input.toLowerCase()) || item.additionalValue.toLowerCase().includes(input.toLowerCase())} />
        </Box>;
}`,...(n=(r=a.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const H=["Basic"];export{a as Basic,H as __namedExportsOrder,E as default};
//# sourceMappingURL=rmg-auto-complete.stories-01f31fd3.js.map
