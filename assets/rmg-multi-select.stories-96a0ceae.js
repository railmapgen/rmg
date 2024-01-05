import{j as e}from"./jsx-runtime-ffb262ed.js";import{R as i}from"./rmg-multi-select-6defc985.js";import{r as m}from"./index-76fb7be0.js";import{R as p}from"./rmg-label-85d4b295.js";import{B as n}from"./chunk-PULVB27S-030175da.js";import{T as u}from"./chunk-2OOHT3W5-a8e3452a.js";import"./chunk-RMJG37OC-ea3654d6.js";import"./chunk-24I2HV4N-aa87085e.js";import"./index-82c2af04.js";import"./index-eaa72e81.js";import"./index-3e7aa64e.js";import"./index-17e33fe9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./_commonjsHelpers-de833af9.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./index-7abe7895.js";import"./motion-d7628447.js";import"./chunk-DY5QRMBO-fb8d2a8e.js";import"./chunk-2GBDXOMA-39401b6c.js";import"./index-e1b4ee4c.js";import"./chunk-Z6RXEUPO-3dcc51cd.js";import"./chunk-7D6N5TE5-e6032d33.js";import"./chunk-XRMX4GAI-f266e033.js";import"./emotion-react.browser.esm-583f468d.js";const z={title:"RmgMultiSelect",component:i},t=()=>{const[r,a]=m.useState(["local"]),c=[{label:"Local",value:"local"},{label:"Express",value:"express"},{label:"Direct",value:"direct"}];return e.jsxs(n,{children:[e.jsx(p,{label:"Service",children:e.jsx(i,{displayValue:"Select services",selections:c,defaultValue:r,onChange:a})}),e.jsxs(u,{children:["Selected: ",r.join(",")]})]})};var s,o,l;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const [services, setServices] = useState(['local']);
  const selections = [{
    label: 'Local',
    value: 'local'
  }, {
    label: 'Express',
    value: 'express'
  }, {
    label: 'Direct',
    value: 'direct'
  }];
  return <Box>
            <RmgLabel label="Service">
                <RmgMultiSelect displayValue="Select services" selections={selections} defaultValue={services} onChange={setServices} />
            </RmgLabel>

            <Text>Selected: {services.join(',')}</Text>
        </Box>;
}`,...(l=(o=t.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};const A=["Basic"];export{t as Basic,A as __namedExportsOrder,z as default};
//# sourceMappingURL=rmg-multi-select.stories-96a0ceae.js.map
