import{j as t}from"./chakra-LCOuRCmM.js";import{r as v}from"./react-_H4gDEjW.js";import{ba as b,u as S,S as R,H as h,bb as _,bc as T}from"./index-1dYa2EpP.js";import{S as C,a as J,c as B,g as Z,b as q}from"./share-uq4GbNbx.js";import{g as K,S as Q,r as tt,l as et}from"./mtr-lDj2QmZ4.js";import{w as nt}from"./param-manager-utils-uawUnHTC.js";const V=v.memo(function(){return t.jsx("rect",{fill:"var(--rmg-theme-colour)",height:20,style:{width:"var(--rmg-svg-width)",transform:"translateY(calc(var(--rmg-svg-height) - 20px))"}})}),st=v.memo(function(e){const{num:n}=e;return t.jsxs(t.Fragment,{children:[t.jsx("circle",{cx:0,cy:0,r:60,fill:"var(--rmg-theme-colour)"}),t.jsx("text",{className:"rmg-name__zh",dy:0,textAnchor:"middle",fontSize:100,fill:"#fff",children:n})]})},(s,e)=>s.num===e.num),G=b.Destination;function rt(){const{canvasScale:s}=S(i=>i.app),{svgWidth:e,svg_height:n,theme:r}=S(i=>i.param),a=e[G];return t.jsxs(C,{type:G,svgWidth:a,svgHeight:n,canvasScale:s,theme:r,children:[t.jsx(at,{}),t.jsx(V,{}),t.jsx(it,{})]})}const at=v.memo(function(){return t.jsx("defs",{children:t.jsx("path",{id:"arrow",d:"M60,60L0,0L60-60H100L55-15H160V15H55L100,60z",fill:"var(--rmg-black,#000)"})})}),it=()=>{const s=S(l=>l.helper.routes),e=S(l=>l.param.svgWidth),n=S(l=>l.param.direction),r=S(l=>l.param.customiseMTRDest),a=S(l=>l.param.platform_num),i=S(l=>l.param.line_name),o=S(l=>l.param.current_stn_idx),g=S(l=>l.param.stn_list);let m;if(r.terminal!==!1)m=r.terminal;else{const l=[...new Set(s.filter(p=>p.includes(o)).map(p=>p.filter(k=>!["linestart","lineend"].includes(k)).slice(n===R.left?0:-1)[0]).filter(p=>p!==o))];m=[l.map(p=>g[p].name[0]).join("/"),l.map(p=>g[p].name[1]).join("/").replace("\\"," ")]}const d=v.useRef(null),[f,c]=v.useState({width:0});v.useEffect(()=>{d.current&&c(d.current.getBBox())},[m.toString(),r.isLegacy]);const x=246+f.width+30+60,u=(e[b.Destination]-(n===R.left?1:-1)*x)/2,y=u+(n===R.left?1:-1)*246,j=y+(n===R.left?1:-1)*90;return t.jsxs("g",{style:{transform:"translateY(calc(var(--rmg-svg-height) / 2 - 5px))"},children:[t.jsx("use",{xlinkHref:"#arrow",transform:"translate(".concat(u,",0)scale(0.8)rotate(").concat(n===R.left?0:180,")")}),t.jsx("g",{transform:"translate(".concat(y,",0)"),children:t.jsx(st,{num:a})}),t.jsxs("g",{ref:d,textAnchor:n===R.left?"start":"end",transform:"translate(".concat(j,",-25)"),fill:"var(--rmg-black)",children:[t.jsx("text",{className:"rmg-name__zh",fontSize:72,letterSpacing:1.5,children:(r.isLegacy?i[0]:"")+"往"+m[0]}),t.jsx("text",{className:"rmg-name__en",fontSize:42,dy:66,children:(r.isLegacy?i[1]+" ":"")+"to "+m[1]})]})]})};function ot(s){const{interchangeInfo:{theme:e,name:n,facility:r},isPassed:a,position:i,repel:o,repelOffset:g}=s,m=n[0].split("\\"),d=n[1].split("\\"),f=10*(m.length-1)+7*(d.length-1),c=(o===h.left?-1:o===h.right?1:0)*(g!=null?g:3),x=i===_.LEFT||o===h.left?"end":i===_.RIGHT||o===h.right||r?"start":"middle",u={[_.LEFT]:{path:{rotate:90},use:{x:-32,y:-8},g:{x:(r?-42:-24)+c,y:6-(20+f-1)/2}},[_.RIGHT]:{path:{rotate:-90},use:{x:32,y:-8},g:{x:(r?42:24)+c,y:6-(20+f-1)/2}},[_.UP]:{path:{rotate:180},use:{x:0,y:-41},g:{x:(r?o===h.left?-14:o===h.right?14:10:0)+c,y:-36-f}},[_.DOWN]:{path:{rotate:0},use:{x:0,y:26},g:{x:(r?o===h.left?-14:o===h.right?14:10:0)+c,y:31}}}[i];return t.jsxs(t.Fragment,{children:[t.jsx("path",{d:"M0,0v17",strokeLinecap:"round",stroke:a?"var(--rmg-grey)":e==null?void 0:e[2],strokeWidth:8,transform:"rotate(".concat(u.path.rotate,")")}),r&&t.jsx("use",{xlinkHref:"#"+r,fill:a?"var(--rmg-grey)":"var(--rmg-black)",transform:"translate(".concat(u.use.x,",").concat(u.use.y,")scale(0.45)")}),t.jsxs("g",{textAnchor:x,transform:"translate(".concat(u.g.x,",").concat(u.g.y,")"),fill:a?"var(--rmg-grey)":"var(--rmg-black)",children:[m.map((y,j)=>t.jsx("text",{dy:10*j,className:"rmg-name__zh",fontSize:10,children:y},j)),d.map((y,j)=>t.jsx("text",{dy:m.length*10-1+6*j,className:"rmg-name__en",fontSize:6,children:y},m.length+j))]})]})}const D=v.memo(ot,(s,e)=>JSON.stringify(s.interchangeInfo)===JSON.stringify(e.interchangeInfo)&&s.isPassed===e.isPassed&&s.position===e.position&&s.repel===e.repel);function X(s){const{length:e,isPassed:n,isReversed:r}=s;return t.jsx("path",{d:"M-8,0 v".concat(e," a8,8 0 0,0 16,0 v-").concat(e," a8,8 0 0,0 -16,0Z"),className:"rmg-stn__mtr",stroke:n?"var(--rmg-grey)":"var(--rmg-black)",transform:"scale(1,".concat(r?-1:1,")")})}function ct(s){const{interchangeInfoList:e,direction:n,isPassed:r,isReversed:a,repel:i}=s,o=e.length<=1?0:18*e.length;return t.jsxs("g",{children:[e.length===1&&t.jsx(D,{interchangeInfo:e[0],isPassed:r,position:a?_.UP:_.DOWN,repel:i}),e.length>1&&e.map((g,m)=>t.jsx("g",{transform:"translate(0,".concat(a?-18*(m+1):18*(m+1),")"),children:t.jsx(D,{interchangeInfo:g,isPassed:r,position:n===h.right?_.RIGHT:_.LEFT})},m)),t.jsx(X,{length:o,isPassed:r,isReversed:a})]})}function lt(s){var f,c,x,u,y;const{interchangeGroup:{name:e,lines:n},direction:r,isPassed:a,isReversed:i,isTerminal:o}=s,g=(x=(c=(f=e==null?void 0:e[1])==null?void 0:f.split("\\"))==null?void 0:c.length)!=null?x:1,m=18*(((n==null?void 0:n.length)||0)-1),d={name:{x:o?0:(n==null?void 0:n.length)===1?r===h.left?-13:13:r===h.left?13:-13,y:o?i?19:-28:-4+(i?-9:9)*(((n==null?void 0:n.length)||0)-1)-5*(g-1)}};return t.jsxs("g",{children:[n==null?void 0:n.map((j,l,p)=>t.jsx("g",{transform:"translate(0,".concat(i?-18*l:18*l,")"),children:t.jsx(D,{interchangeInfo:j,isPassed:a,position:p.length===1?i?_.UP:_.DOWN:r===h.right?_.RIGHT:_.LEFT,repel:o?r:void 0,repelOffset:o&&p.length===1?-4:0})},l)),t.jsx(X,{length:m,isPassed:a,isReversed:i}),t.jsxs("g",{textAnchor:d.name.x===0?"middle":d.name.x>0?"start":"end",fill:a?"var(--rmg-grey)":"var(--rmg-black)",transform:"translate(".concat(d.name.x,",").concat(d.name.y,")"),children:[t.jsx("text",{className:"rmg-name__zh",fontSize:14,children:e==null?void 0:e[0]}),(y=(u=e==null?void 0:e[1])==null?void 0:u.split("\\"))==null?void 0:y.map((j,l)=>t.jsx("text",{className:"rmg-name__en",fontSize:8.5,dy:13+10*l,children:j},l))]})]})}const ht=async()=>{let s=3;for(;s--;){const n=(await document.fonts.ready).values();for(;;){const r=n.next();if(r.done)break;if(r.value.family==="GenYoMin TW")return}console.log("GenYoMin is NOT ready. Retry attempts remaining: "+s+" ..."),await nt(500)}throw new Error("Failed to load GenYoMin after 3 attempts")},gt=v.memo(function(e){const{stnName:n,onUpdate:r,align:a}=e,i=v.useRef(null),o=()=>{i.current&&r&&r(i.current.getBBox())};v.useEffect(()=>{o(),ht().then().catch(console.log).finally(o)},[n.toString(),a]);const g=d=>{switch(d){case h.left:return"start";case h.right:return"end";default:return"middle"}},m=d=>16+10*d;return t.jsxs("g",{ref:i,textAnchor:g(a),children:[t.jsx("text",{className:"rmg-name__zh",fontSize:18,transform:"scale(1,0.97)",children:n[0]}),n[1].split("\\").map((d,f)=>t.jsx("text",{className:"rmg-name__en",fontSize:10,dy:m(f),children:d},f))]})},(s,e)=>s.stnName.toString()===e.stnName.toString()&&s.align===e.align),P=-10.8125,mt=-8,dt=13.21875,ft=16,M=-P+ft+dt+mt,Y=14;function xt(s){const{stationName:e,stationState:n,lower:r,align:a,facility:i,...o}=s,[g,m]=v.useState({x:0,width:0}),d=x=>{switch(x){case T.PASSED:return"var(--rmg-grey)";case T.CURRENT:return"#fff";case T.FUTURE:return"var(--rmg-black)"}},f=e[1].split("\\").length,c={g:{x:a?a===h.right?-3:3:0,y:(r?Y-P:-Y-P-M-11*(f-1))+(a?r?10:-10:0)},rect:{x:g.x-3+(i?a?a===h.right?-3-M:0:(M+5)/2-3-M:0),y:P-1,width:g.width+6+(i?M+3:0),height:M+2+11*(f-1)},use:{x:a?a===h.right?-(M+2)/2-g.width-3:(M+2)/2-2:-(g.width+3)/2,y:P-1+5.5*(f-1)},StationName:{x:i?a?a===h.right?0:M+3:(M+5)/2:0,y:0}};return t.jsx("g",{...o,children:t.jsxs("g",{fill:d(n),transform:"translate(".concat(c.g.x,",").concat(c.g.y,")"),children:[n===T.CURRENT&&t.jsx("rect",{x:c.rect.x,y:c.rect.y,width:c.rect.width,height:c.rect.height,fill:"var(--rmg-black)"}),i&&t.jsx("use",{xlinkHref:"#".concat(i),fill:n===T.PASSED?"var(--rmg-grey)":"var(--rmg-black)",x:c.use.x,y:c.use.y}),t.jsx("g",{transform:"translate(".concat(c.StationName.x,",").concat(c.StationName.y,")"),children:t.jsx(gt,{stnName:e,onUpdate:m,align:a})})]})})}function ut(s){var j,l,p,k,O,E;const{stationId:e,stationState:n,isReversed:r}=s,{name:a,parents:i,children:o,transfer:{groups:g,tick_direc:m,paid_area:d},facility:f}=S(z=>z.param.stn_list[e]),c=(j=g[0].lines)!=null&&j.length?i.includes("linestart")?h.left:o.includes("lineend")?h.right:void 0:void 0,x=!!((p=(l=g[1])==null?void 0:l.lines)!=null&&p.length),u=x&&!c,y={link:{scaleX:c===h.left?-1:1,scaleY:r?-1:1},osi:{x:c?c===h.left?-41:41:0,y:c?0:r?-26:26}};return t.jsxs("g",{"data-testid":"station-icon-wrapper",children:[x&&t.jsx("path",{d:c&&((k=g[0].lines)!=null&&k.length)?"M0,0H41":"M0,0V26",strokeWidth:2.69,strokeDasharray:d?0:2.5,stroke:n===T.PASSED?"var(--rmg-grey)":"var(--rmg-black)",transform:"scale(".concat(y.link.scaleX,",").concat(y.link.scaleY,")")}),t.jsx(ct,{interchangeInfoList:(O=g[0].lines)!=null?O:[],direction:m===R.right?h.right:h.left,isPassed:n===T.PASSED,isReversed:u?!r:r,repel:u?m===R.right?h.right:h.left:void 0}),x&&t.jsx("g",{transform:"translate(".concat(y.osi.x,",").concat(y.osi.y,")"),children:t.jsx(lt,{interchangeGroup:g[1],direction:c||(m===R.right?h.right:h.left),isPassed:n===T.PASSED,isReversed:c?!r:r,isTerminal:!!c})}),t.jsx(xt,{stationName:a,stationState:n,facility:f,lower:r,align:(E=g[0].lines)!=null&&E.length&&u?m===R.left?h.left:h.right:void 0})]})}const pt=(s,e,{isStagger:n,isFlip:r})=>{if(!n)return r;let a;if(e[0].includes(s))a=e[0].indexOf(s)%2;else{const i=e.filter(o=>o.includes(s))[0];a=(e[0].indexOf(i[0])+i.indexOf(s)+1)%2}return a===0?r:!r},vt=()=>{const{branches:s,routes:e,depsStr:n}=S(N=>N.helper),{svgWidth:r,svg_height:a,y_pc:i,padding:o,branchSpacingPct:g,direction:m,namePosMTR:d,current_stn_idx:f,stn_list:c}=S(N=>N.param),x=J(c,et,tt),u=v.useMemo(()=>B("linestart","lineend",x),[JSON.stringify(x)]),y=v.useMemo(()=>B(u.nodes[1],u.nodes.slice(-2)[0],x),[JSON.stringify(x)]),j=v.useMemo(()=>(console.log("computing x shares"),Object.keys(c).reduce((N,w)=>({...N,[w]:Z(w,x,s)}),{})),[s.toString(),JSON.stringify(x)]),l=[r[b.RailMap]*o/100,r[b.RailMap]*(1-o/100)],p=Object.keys(j).reduce((N,w)=>({...N,[w]:l[0]+j[w]/y.len*(l[1]-l[0])}),{}),k=v.useMemo(()=>Object.keys(c).reduce((N,w)=>({...N,[w]:K(w,s,c)*g*a/200}),{}),[n,g,a]),O=v.useMemo(()=>q(f,e,m),[f,m,e.toString()]),E=Object.keys(c).reduce((N,w)=>({...N,[w]:pt(w,s,d)}),{}),z=Q.drawLine(s,O,c,l,p,k,g*a/200,u);return t.jsxs("g",{id:"main",style:{"--y-percentage":i,transform:"translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))"},children:[t.jsx(jt,{paths:z}),t.jsx(yt,{xs:p,ys:k,stnStates:O,namePoss:E})]})},jt=v.memo(function(e){return t.jsxs("g",{fill:"none",strokeWidth:9.68,children:[t.jsxs("g",{stroke:"var(--rmg-grey)",children:[e.paths.pass.map((n,r)=>t.jsx("path",{d:n},r)),e.paths.sidingPass.map((n,r)=>{var a;return t.jsx("path",{d:n,strokeDasharray:((a=n.match(/a/g))==null?void 0:a.length)===4?"10 4":void 0},r)})]}),t.jsxs("g",{stroke:"var(--rmg-theme-colour)",children:[e.paths.main.map((n,r)=>t.jsx("path",{d:n},r)),e.paths.sidingMain.map((n,r)=>{var a;return t.jsx("path",{d:n,strokeDasharray:((a=n.match(/a/g))==null?void 0:a.length)===4?"10 4":void 0},r)})]})]})},(s,e)=>JSON.stringify(s.paths)===JSON.stringify(e.paths)),yt=s=>{const{xs:e,ys:n,stnStates:r,namePoss:a}=s,i=S(o=>o.param.stn_list);return t.jsx("g",{id:"stn_icons",children:Object.keys(i).filter(o=>!["linestart","lineend"].includes(o)).map(o=>t.jsx("g",{style:{transform:"translate(".concat(e[o],"px,").concat(n[o],"px)")},children:t.jsx(ut,{stationId:o,stationState:r[o],isReversed:a[o]})},o))})};var L="#012639",H=function(){return H=Object.assign||function(s){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=e[a])}return s},H.apply(this,arguments)};function St(s){return t.jsxs("svg",H({xmlns:"http://www.w3.org/2000/svg",viewBox:"-29.339 0 58.678 58.678",width:50,height:50,fill:L},s,{children:[t.jsx("path",{d:"M-29.35 0h58.7v58.7h-58.7z"}),t.jsx("path",{fill:"#fff",d:"M.007 6.745c1.711.013 3.111 2.532 3.111 4.24v10.338s17.106 15.435 17.358 15.666a1.145 1.145 0 0 1 .488 1.152v2.833c0 .65-.45.61-.695.467-.334-.12-17.15-8.863-17.15-8.863-.005 1.458-.798 9.006-1.327 13.304 0 0 4.61 2.457 4.7 2.52.333.269.351.36.351.853v2c0 .478-.352.429-.51.325L.64 49.659a2.56 2.56 0 0 0-.633-.127 2.317 2.317 0 0 0-.666.127s-5.477 1.859-5.672 1.92c-.185.105-.523.154-.523-.323v-2.001c0-.493.03-.584.367-.852.086-.064 4.678-2.521 4.678-2.521-.524-4.298-1.307-11.846-1.325-13.304 0 0-16.822 8.744-17.148 8.863-.217.143-.69.184-.69-.467V38.14a1.162 1.162 0 0 1 .473-1.152c.276-.231 17.365-15.666 17.365-15.666V10.986c0-1.71 1.403-4.228 3.141-4.241"})]}))}var I=function(){return I=Object.assign||function(s){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=e[a])}return s},I.apply(this,arguments)};function _t(s){return t.jsxs("svg",I({xmlns:"http://www.w3.org/2000/svg",viewBox:"-29.339 0 58.678 58.678",width:50,height:50,fill:L},s,{children:[t.jsx("path",{d:"M-29.35 0h58.7v58.7h-58.7z"}),t.jsx("path",{fill:"#fff",d:"M16.646 7.984a9.802 9.802 0 0 0-9.8 9.801 9.7 9.7 0 0 0 .342 2.582c.002.026.002.055.002.093a.318.318 0 0 1-.315.318.677.677 0 0 1-.128-.02 15.715 15.715 0 0 0-13.498 0 .61.61 0 0 1-.122.02.318.318 0 0 1-.322-.318v-.067a9.626 9.626 0 0 0 .357-2.608 9.803 9.803 0 1 0-9.797 9.8 10.104 10.104 0 0 0 2.308-.27h.054a.311.311 0 0 1 .315.317.324.324 0 0 1-.02.12 15.726 15.726 0 1 0 29.704 7.216 15.837 15.837 0 0 0-1.746-7.23.184.184 0 0 1-.028-.106.316.316 0 0 1 .32-.318h.058a10.16 10.16 0 0 0 2.316.271 9.8 9.8 0 0 0 0-19.6"})]}))}var W=function(){return W=Object.assign||function(s){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=e[a])}return s},W.apply(this,arguments)};function Nt(s){return t.jsxs("svg",W({xmlns:"http://www.w3.org/2000/svg",viewBox:"-29.339 0 58.678 58.678",width:50,height:50,fill:L},s,{children:[t.jsx("path",{d:"M-29.339 0h58.678v58.678h-58.678z"}),t.jsx("path",{fill:"#fff",d:"M-28.657 40.339 24.74 9.309l.493.847-53.398 31.03z"}),t.jsx("path",{fill:"#fff",d:"M-23.568 48.99c-2.174-3.894 2.57-10.526 4.85-13.725l.173-.248a83.008 83.008 0 0 1 7.393-9.285A97.384 97.384 0 0 1-.07 15.774C6.981 9.73 15.762 9.898 16.377 9.88l11.785-.957.276 17.42L16.911 36.93c-.36.394-5.553 5.863-18.102 11.035-6.752 2.783-11.877 4.146-15.66 4.146-3.301 0-5.561-1.049-6.717-3.12m51.682-19.377L3.087 58.31l3.156.199 22.002-28.076-.131-.819z"}),t.jsx("path",{d:"M19.708 11.63a.943.943 0 0 0-.175-.227c-.752-.937-2.988-1.259-5.933-.793a25.984 25.984 0 0 0-9.996 3.032 98.53 98.53 0 0 0-12.22 10.072c-3.176 3.487-4.646 6.388-3.623 7.584 1.84 2.166 13.753.716 22.007-6.066 9.035-7.42 10.718-11.577 9.94-13.602"}),t.jsx("path",{fill:"#fff",d:"M5.313 13.828c5.66-2.842 11.28-2.856 12.15-1.213.883 1.652-2.998 5.303-8.656 8.128-5.648 2.837-10.947 3.805-11.82 2.15-.873-1.64 2.668-6.237 8.326-9.065"}),t.jsx("path",{d:"M28.77 25.051C11.938 45.759-11.96 51.089-11.96 51.089c11-6.73 12.769-8.111 18.968-18.01 8.364-13.351 21.778-21.549 21.912-21.63 0 0-.068 13.5-.15 13.602"}),t.jsx("path",{fill:"#fff",d:"m-2.152 26.712 9.705-2.814a6.228 6.228 0 0 1-1.994 2.759 25.573 25.573 0 0 1-6.697 3.405 11.782 11.782 0 0 1-5.5.783Zm-7.598-.719a18.377 18.377 0 0 1 3.891-3.976 6.665 6.665 0 0 0-.309 2.213l-4.39 4.83a6.182 6.182 0 0 1 .808-3.067m3.567 32.318 34.307-31.565-.067-.889-35.814 32.75 1.574-.296zm37-45.935a68.678 68.678 0 0 0-12.602 9.542c-8.15 7.745-12.11 15.26-9.855 16.091 2.248.816 10.678-4.782 18.836-12.543a94.322 94.322 0 0 0 4.926-5.024Z"}),t.jsx("path",{d:"M33.737 11.843a40.87 40.87 0 0 0-10 7.096c-5.904 5.437-9.486 11.105-7.848 11.742 1.657.631 8.289-3.955 14.188-9.401a61.766 61.766 0 0 0 4.617-4.705ZM-16.66 42.956a9.87 9.87 0 0 0-5.754-1.895c-.113.22-.223.44-.33.662a9.45 9.45 0 0 1 5.695 1.75 6.279 6.279 0 0 1 2.61 6.304 10.165 10.165 0 0 1-.598 2.228c.238-.023.481-.053.725-.087.783-2.249 1.394-6.184-2.348-8.962"})]}))}var F=function(){return F=Object.assign||function(s){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(s[a]=e[a])}return s},F.apply(this,arguments)};function wt(s){return t.jsxs("svg",F({xmlns:"http://www.w3.org/2000/svg",viewBox:"270.1 270.4 58.678 58.678",width:50,height:50,fill:L},s,{children:[t.jsx("path",{d:"M270.1 270.4h58.7v58.7h-58.7z"}),t.jsx("path",{fill:"#FFF",d:"m277.2 274.7 20.2 5.4v-1.5l-20.2-5.4zm24.2 6.5 20.3 5.4v-1.5l-20.3-5.4z"}),t.jsx("path",{fill:"#FFF",d:"M312.4 326c0 .1-.2.2-.3.2H311c-.2 0-.3-.1-.3-.3v-.1l.8-2.4h-23.9l.8 2.4v.1c0 .2-.1.3-.3.3H287c-.1 0-.3-.1-.3-.2l-3.8-13.9c-1-3.6-.3-8.2.4-10.5l4.7-14.9c.2-.8.5-.9.8-.9h1.2l-.4 1.2h8.7v-10.2c0-.2.2-.4.4-.4h1.8c.2 0 .4.2.4.4V287h8.7l-.4-1.2h1.2c.3 0 .6.1.8.9l4.7 14.9c.7 2.3 1.4 6.8.4 10.5l-3.9 13.9z"}),t.jsx("path",{d:"M288.4 289.9v19c0 .3-.2.5-.5.5h-4c-.3-3.2.4-6 1-8.3l3.5-11.2zm22.1 0v19c0 .3.2.5.5.5h4c.3-3.2-.4-6-1-8.3l-3.5-11.2zm-20.1 0h7.7c.3 0 .5.2.5.5v18.5c0 .3-.2.5-.5.5h-7.7c-.3 0-.5-.2-.5-.5v-18.5c0-.2.3-.5.5-.5m10.3 0h7.8c.3 0 .5.2.5.5v18.5c0 .3-.2.5-.5.5h-7.8c-.3 0-.5-.2-.5-.5v-18.5c0-.2.2-.5.5-.5"})]}))}const U=b.RailMap;function Mt(){const{canvasScale:s}=S(i=>i.app),{svgWidth:e,svg_height:n,theme:r}=S(i=>i.param),a=e[U];return t.jsxs(C,{type:U,svgWidth:a,svgHeight:n,canvasScale:s,theme:r,children:[t.jsx(Rt,{}),t.jsx(V,{}),t.jsx(vt,{})]})}const A=34.03125,$={width:A,height:A,x:-A/2,fill:void 0},Rt=v.memo(function(){return t.jsxs("defs",{children:[t.jsx(St,{id:"airport",...$}),t.jsx(_t,{id:"disney",...$}),t.jsx(Nt,{id:"hsr",...$}),t.jsx(wt,{id:"np360",...$}),t.jsx("path",{id:"inttick",d:"M0,0v17",strokeLinecap:"round"})]})}),$t={destination:t.jsx(rt,{}),railmap:t.jsx(Mt,{})};export{$t as default};