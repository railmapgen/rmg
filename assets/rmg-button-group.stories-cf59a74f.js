import{j as e}from"./jsx-runtime-ffb262ed.js";import{r}from"./index-76fb7be0.js";import{R as l}from"./rmg-button-group-9066c1f7.js";import{F as g}from"./chunk-KRPLQIP4-f719b7f6.js";import{B as i}from"./chunk-PULVB27S-030175da.js";import{T as a}from"./chunk-2OOHT3W5-a8e3452a.js";import"./_commonjsHelpers-de833af9.js";import"./chunk-UVUR7MCU-5ad2b195.js";import"./index-7abe7895.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./emotion-react.browser.esm-583f468d.js";import"./index-17e33fe9.js";const C={title:"RmgButtonGroup",component:l},t=()=>{const[s,S]=r.useState("gzmtr"),[n,p]=r.useState(["gzmtr"]),o=[{label:"MTR",value:"mtr",disabled:!0},{label:"GZMTR",value:"gzmtr"},{label:"SHMetro",value:"shmetro"}];return e.jsxs(g,{children:[e.jsxs(i,{w:200,mr:2,children:[e.jsx(l,{selections:o,defaultValue:s,onChange:S}),e.jsx(l,{selections:o,defaultValue:n,onChange:p,multiSelect:!0})]}),e.jsxs(i,{children:[e.jsxs(a,{children:["Single select: ",s]}),e.jsxs(a,{children:["Multi select: ",n.join(",")]})]})]})};var c,m,u;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [singleSelect, setSingleSelect] = useState('gzmtr');
  const [multiSelect, setMultiSelect] = useState(['gzmtr']);
  const selections = [{
    label: 'MTR',
    value: 'mtr',
    disabled: true
  }, {
    label: 'GZMTR',
    value: 'gzmtr'
  }, {
    label: 'SHMetro',
    value: 'shmetro'
  }];
  return <Flex>
            <Box w={200} mr={2}>
                <RmgButtonGroup selections={selections} defaultValue={singleSelect} onChange={setSingleSelect} />
                <RmgButtonGroup selections={selections} defaultValue={multiSelect} onChange={setMultiSelect} multiSelect />
            </Box>

            <Box>
                <Text>Single select: {singleSelect}</Text>
                <Text>Multi select: {multiSelect.join(',')}</Text>
            </Box>
        </Flex>;
}`,...(u=(m=t.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};const F=["Basic"];export{t as Basic,F as __namedExportsOrder,C as default};
//# sourceMappingURL=rmg-button-group.stories-cf59a74f.js.map
