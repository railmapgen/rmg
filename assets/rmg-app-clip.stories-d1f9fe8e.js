import{j as s}from"./jsx-runtime-ffb262ed.js";import{R as m}from"./rmg-app-clip-eb770caf.js";import{r as p}from"./index-76fb7be0.js";import{B as x}from"./chunk-PULVB27S-030175da.js";import{B as f}from"./chunk-UVUR7MCU-5ad2b195.js";import{C}from"./chunk-37N6GCLA-65667b0d.js";import"./chunk-34PD6CUK-5864d39e.js";import"./index-7abe7895.js";import"./index-3e7aa64e.js";import"./index-d3ea75b5.js";import"./_commonjsHelpers-de833af9.js";import"./chunk-UU5OHSNF-1e068ca9.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./inheritsLoose-c82a83d4.js";import"./index-eaa72e81.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./chunk-RMJG37OC-ea3654d6.js";import"./emotion-react.browser.esm-583f468d.js";import"./index-17e33fe9.js";import"./chunk-2GBDXOMA-39401b6c.js";const F={title:"RmgAppClip",component:m},e=()=>{const[l,t]=p.useState(!1),[a,c]=p.useState("md"),u=["xs","sm","md","lg","xl","full"];return s.jsxs(x,{children:[u.map(o=>s.jsxs(f,{m:4,onClick:()=>{c(o),t(!0)},children:["Open ",o," app clip"]},o)),s.jsxs(m,{size:a,isOpen:l,onClose:()=>t(!1),children:[s.jsx(C,{onClick:()=>t(!1)}),"App clip content goes here"]})]})};var n,r,i;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`() => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState('md');
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
  return <Box>
            {sizes.map(s => <Button key={s} m={4} onClick={() => {
      setSize(s);
      setIsOpen(true);
    }}>
                    Open {s} app clip
                </Button>)}

            <RmgAppClip size={size} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <CloseButton onClick={() => setIsOpen(false)} />
                App clip content goes here
            </RmgAppClip>
        </Box>;
}`,...(i=(r=e.parameters)==null?void 0:r.docs)==null?void 0:i.source}}};const G=["Basic"];export{e as Basic,G as __namedExportsOrder,F as default};
//# sourceMappingURL=rmg-app-clip.stories-d1f9fe8e.js.map
