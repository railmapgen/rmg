import{j as e}from"./jsx-runtime-ffb262ed.js";import{R as o}from"./rmg-select-0320fcb3.js";import{r as l}from"./index-76fb7be0.js";import{B as g}from"./chunk-PULVB27S-030175da.js";import{T as c}from"./chunk-2OOHT3W5-a8e3452a.js";import{B as f}from"./chunk-UVUR7MCU-5ad2b195.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./_commonjsHelpers-de833af9.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./chunk-XRMX4GAI-f266e033.js";import"./index-7abe7895.js";import"./index-17e33fe9.js";import"./emotion-react.browser.esm-583f468d.js";const z={title:"RmgSelect",component:o},n=()=>{const[s,i]=l.useState("undefined"),[r,a]=l.useState("en"),m={undefined:"Please select...",opt1:"Option 1",opt2:"Option 2"},h={"Main languages":{en:"English",zh:"Chinese"},"Other languages":{ja:"Japanese"}};return e.jsxs(g,{children:[e.jsx(o,{defaultValue:s,options:m,disabledOptions:["undefined"],onChange:({target:{value:t}})=>i(t)}),e.jsxs(c,{children:["Your selection: ",s]}),e.jsx(o,{defaultValue:r,options:h,disabledOptions:["zh"],onChange:({target:{value:t}})=>a(t)}),e.jsxs(c,{children:["Your selection: ",r]}),e.jsx(f,{onClick:()=>{i("undefined"),a("en")},children:"Reset"})]})};var p,u,d;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`() => {
  const [selection, setSelection] = useState('undefined');
  const [selectionWithGroup, setSelectionWithGroup] = useState('en');
  const options = {
    undefined: 'Please select...',
    opt1: 'Option 1',
    opt2: 'Option 2'
  };
  const optionsWithGroup: Record<string, Record<string, string>> = {
    'Main languages': {
      en: 'English',
      zh: 'Chinese'
    },
    'Other languages': {
      ja: 'Japanese'
    }
  };
  return <Box>
            <RmgSelect defaultValue={selection} options={options} disabledOptions={['undefined']} onChange={({
      target: {
        value
      }
    }) => setSelection(value)} />
            <Text>Your selection: {selection}</Text>

            <RmgSelect defaultValue={selectionWithGroup} options={optionsWithGroup} disabledOptions={['zh']} onChange={({
      target: {
        value
      }
    }) => setSelectionWithGroup(value)} />
            <Text>Your selection: {selectionWithGroup}</Text>

            <Button onClick={() => {
      setSelection('undefined');
      setSelectionWithGroup('en');
    }}>
                Reset
            </Button>
        </Box>;
}`,...(d=(u=n.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};const V=["Basic"];export{n as Basic,V as __namedExportsOrder,z as default};
//# sourceMappingURL=rmg-select.stories-1600e13c.js.map
