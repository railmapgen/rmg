import{j as e}from"./jsx-runtime-ffb262ed.js";import{R as o}from"./rmg-env-badge-2a3b2685.js";import{r as i,R as t}from"./index-5ca24e16.js";import{u as g}from"./useUpdatingGetter-33dd251e.js";import{B as d}from"./chunk-PULVB27S-030175da.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./chunk-24I2HV4N-aa87085e.js";import"./index-82c2af04.js";import"./index-eaa72e81.js";import"./index-3e7aa64e.js";import"./index-17e33fe9.js";import"./chunk-ZJJGQIVY-4bd0a974.js";import"./emotion-use-insertion-effect-with-fallbacks.browser.esm-55b21f7f.js";import"./index-7abe7895.js";import"./motion-d7628447.js";import"./chunk-37N6GCLA-65667b0d.js";import"./chunk-2GBDXOMA-39401b6c.js";import"./chunk-Z6RXEUPO-3dcc51cd.js";const m=r=>g(i.ready(),r),_={title:"RmgEnvBadge",component:o},n=()=>{const r=m(i.getEnv),a=m(i.getAppVersion);return e.jsxs(d,{children:[e.jsx(o,{environment:t.DEV,version:"0.1.0",popoverHeader:"You're on DEV environment!",popoverBody:"Please visit PRD environment!"}),e.jsx(o,{environment:t.UAT,version:"0.1.0",popoverHeader:"You're on UAT environment!",popoverBody:"Please visit PRD environment!"}),e.jsx(o,{environment:t.PRD,version:"0.1.0"}),e.jsx(o,{environment:r,version:a})]})};var s,p,v;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`() => {
  const environment = useReadyConfig(rmgRuntime.getEnv);
  const appVersion = useReadyConfig(rmgRuntime.getAppVersion);
  return <Box>
            <RmgEnvBadge environment={RmgEnv.DEV} version="0.1.0" popoverHeader="You're on DEV environment!" popoverBody="Please visit PRD environment!" />
            <RmgEnvBadge environment={RmgEnv.UAT} version="0.1.0" popoverHeader="You're on UAT environment!" popoverBody="Please visit PRD environment!" />
            <RmgEnvBadge environment={RmgEnv.PRD} version="0.1.0" />
            <RmgEnvBadge environment={environment} version={appVersion} />
        </Box>;
}`,...(v=(p=n.parameters)==null?void 0:p.docs)==null?void 0:v.source}}};const h=["Basic"];export{n as Basic,h as __namedExportsOrder,_ as default};
//# sourceMappingURL=rmg-env-badge.stories-6b7d2137.js.map
