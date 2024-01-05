import{j as t}from"./jsx-runtime-ffb262ed.js";import{r as o}from"./index-76fb7be0.js";import{R as a}from"./rmg-loader-9cd68361.js";import{R as p}from"./rmg-layout-e6d9739e.js";import"./_commonjsHelpers-de833af9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./emotion-react.browser.esm-583f468d.js";import"./chunk-KRPLQIP4-f719b7f6.js";const P={title:"RmgLoader",component:a},e=()=>t.jsx(p,{w:400,h:300,border:"1px",children:t.jsx(a,{isIndeterminate:!0})}),r=()=>{const[l,g]=o.useState(0);return o.useEffect(()=>{const R=setInterval(()=>{g(n=>n===100?0:n+20)},2e3);return()=>clearInterval(R)},[]),t.jsx(p,{w:400,h:300,border:"1px",children:t.jsx(a,{value:l})})};var s,m,d;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  return <RmgPage w={400} h={300} border="1px">
            <RmgLoader isIndeterminate={true} />
        </RmgPage>;
}`,...(d=(m=e.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var i,u,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`() => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue(prevState => {
        if (prevState === 100) {
          return 0;
        } else {
          return prevState + 20;
        }
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);
  return <RmgPage w={400} h={300} border="1px">
            <RmgLoader value={value} />
        </RmgPage>;
}`,...(c=(u=r.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};const b=["RmgLoaderIndeterminate","RmgLoaderDeterminate"];export{r as RmgLoaderDeterminate,e as RmgLoaderIndeterminate,b as __namedExportsOrder,P as default};
//# sourceMappingURL=rmg-loader.stories-82e5455b.js.map
