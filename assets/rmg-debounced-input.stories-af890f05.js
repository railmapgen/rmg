import{j as e}from"./jsx-runtime-ffb262ed.js";import{R as a}from"./rmg-debounced-input-ab04b406.js";import{r as l}from"./index-76fb7be0.js";import{R as s}from"./rmg-label-85d4b295.js";import{B as b}from"./chunk-PULVB27S-030175da.js";import{T as n}from"./chunk-2OOHT3W5-a8e3452a.js";import"./chunk-QJA5SDDN-601f6f7e.js";import"./chunk-XRMX4GAI-f266e033.js";import"./index-7abe7895.js";import"./index-17e33fe9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./_commonjsHelpers-de833af9.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";const I={title:"RmgDebouncedInput",component:a},t=()=>{const[i,p]=l.useState(""),[r,g]=l.useState(""),[u,h]=l.useState(""),o=["Guangzhou","Hong Kong","Shanghai"];return e.jsxs(b,{children:[e.jsx(s,{label:"Delay=0ms",children:e.jsx(a,{placeholder:"Enter text in fast speed",defaultValue:i,onDebouncedChange:p,delay:0,optionList:o})}),e.jsx(s,{label:"Delay=500ms",children:e.jsx(a,{placeholder:"Enter text in fast speed",defaultValue:r,onDebouncedChange:g,optionList:o})}),e.jsx(s,{label:"With validator",children:e.jsx(a,{placeholder:"Enter digits only",defaultValue:u,validator:x=>!isNaN(Number(x)),onDebouncedChange:h,optionList:o})}),e.jsxs(n,{children:["Delay=0ms: ",i]}),e.jsxs(n,{children:["Delay=500ms: ",r]}),e.jsxs(n,{children:["With validator: ",u]})]})};var d,m,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const [value0, setValue0] = useState('');
  const [value500, setValue500] = useState('');
  const [digitValue, setDigitValue] = useState('');
  const optionList = ['Guangzhou', 'Hong Kong', 'Shanghai'];
  return <Box>
            <RmgLabel label="Delay=0ms">
                <RmgDebouncedInput placeholder="Enter text in fast speed" defaultValue={value0} onDebouncedChange={setValue0} delay={0} optionList={optionList} />
            </RmgLabel>

            <RmgLabel label="Delay=500ms">
                <RmgDebouncedInput placeholder="Enter text in fast speed" defaultValue={value500} onDebouncedChange={setValue500} optionList={optionList} />
            </RmgLabel>

            <RmgLabel label="With validator">
                <RmgDebouncedInput placeholder="Enter digits only" defaultValue={digitValue} validator={value => !isNaN(Number(value))} onDebouncedChange={setDigitValue} optionList={optionList} />
            </RmgLabel>

            <Text>Delay=0ms: {value0}</Text>
            <Text>Delay=500ms: {value500}</Text>
            <Text>With validator: {digitValue}</Text>
        </Box>;
}`,...(c=(m=t.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const N=["Basic"];export{t as Basic,N as __namedExportsOrder,I as default};
//# sourceMappingURL=rmg-debounced-input.stories-af890f05.js.map
