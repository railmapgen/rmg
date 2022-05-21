"use strict";(self.webpackChunkrmg=self.webpackChunkrmg||[]).push([[9586],{4074:function(n,t,e){e.r(t);var r=e(9439),i=e(3433),a=e(2791),c=e(6169),o=e(8306),s=e(184);t.default=(0,a.memo)((function(){return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(l,{}),(0,s.jsx)(u,{})]})}));var l=(0,a.memo)((function(){return(0,s.jsx)("defs",{children:(0,s.jsx)("marker",{id:"slope",viewBox:"-1.5 0 3 1.5",refY:.5,children:(0,s.jsx)("path",{d:"M0,0L1,1H-1z",fill:"var(--rmg-theme-colour)"})})})})),u=function(){var n=(0,c.CG)((function(n){return n.helper})),t=n.routes,e=n.branches,l=(0,c.CG)((function(n){return n.param})),u=l.line_name,g=l.current_stn_idx,x=l.direction,j=l.stn_list,p=l.platform_num,v=l.info_panel_type,_=l.svgWidth,z=l.svg_height,w=l.loop,S=w?(0,o.f2)(e,x,j,g):function(n,t,e){return(0,i.Z)(new Set(n.filter((function(n){return n.includes(e)})).map((function(n){var e=n.filter((function(n){return!["linestart","lineend"].includes(n)}));return"l"===t?e[0]:e.reverse()[0]}))))}(t,x,g),Z=w||"sh2020"===v?S.map((function(n){return j[n].name.map((function(n){return n.replace("\\"," ")}))})):[[S.map((function(n){return j[n].name[0]})).join("\uff0c"),S.map((function(n){return j[n].name[1]})).join(", ").replace("\\"," ")]],N=(0,a.useRef)(null),k=(0,a.useState)({width:0}),b=(0,r.Z)(k,2),M=b[0],E=b[1];(0,a.useEffect)((function(){return E(N.current.getBBox())}),[JSON.stringify(Z),JSON.stringify(g)]);var y=_.destination/2,B=y-10-36-M.width>=162.5&&y-10-36-264>=162.5?y:"l"===x?(_.destination+M.width-264)/2:(_.destination-M.width+264)/2;return(0,s.jsxs)("g",{transform:"translate(0,".concat(z-300,")"),children:[(0,s.jsx)("path",{stroke:"var(--rmg-theme-colour)",strokeWidth:12,d:"l"===x?"M".concat(_.destination-24,",16 H 36"):"M24,16 H ".concat(_.destination-36),transform:"translate(0,220)",markerEnd:"url(#slope)"}),(0,s.jsx)(f,{ref:N,destNames:Z}),""!==p&&(0,s.jsx)("g",{transform:"translate(".concat(B,",0)"),children:(0,s.jsx)(h,{})}),u[0].match(/^[\w\d]+/)?(0,s.jsx)(d,{}):(0,s.jsx)(m,{})]})},f=(0,a.forwardRef)((function(n,t){var e=n.destNames,r=(0,c.CG)((function(n){return n.param})),i=r.direction,o=r.svgWidth;return(0,s.jsxs)("g",{ref:t,transform:"translate(".concat("l"===i?36:o.destination-36,",145)"),children:[(0,s.jsx)("g",{transform:"translate(0,".concat(2===e.length?-20:20,")"),children:(0,s.jsx)("path",{d:"M60,60L0,0L60-60H100L55-15H160V15H55L100,60z",fill:"black",transform:"rotate(".concat("l"===i?0:180,")scale(0.8)")})}),(0,s.jsx)("g",{textAnchor:"l"===i?"start":"end",transform:"translate(".concat("l"===i?148:-148,",25)"),children:e.map((function(n,t){return(0,s.jsxs)(a.Fragment,{children:[(0,s.jsx)("text",{className:"rmg-name__zh",fontSize:70,dy:-100*t+7,children:"\u5f80"+n[0]},"zh".concat(t)),(0,s.jsx)("text",{className:"rmg-name__en",fontSize:25,dy:-100*t+40,children:"To "+n[1]},"en".concat(t))]},t)}))})]})})),h=function(){var n=(0,c.CG)((function(n){return n.param})).platform_num;return(0,a.useMemo)((function(){return(0,s.jsxs)("g",{transform:"translate(".concat(-102.5,",150)"),children:[(0,s.jsx)("circle",{r:60,fill:"none",stroke:"black",strokeWidth:2}),(0,s.jsx)("text",{className:"rmg-name__en",dominantBaseline:"central",fontSize:120,textAnchor:"middle",children:n}),(0,s.jsx)("text",{className:"rmg-name__zh",fontSize:100,dominantBaseline:"central",x:65,children:"\u7ad9\u53f0"})]})}),[n])},m=function(){var n=(0,c.CG)((function(n){return n.param})),t=n.line_name,e=n.direction,o=n.svgWidth,l="l"===e?o.destination-42:42,u=(0,a.useRef)(null),f=a.useState({width:0}),h=(0,r.Z)(f,2),m=h[0],d=h[1];a.useEffect((function(){return d(u.current.getBBox())}),(0,i.Z)(t));var g=("l"===e?-m.width:0)-6,x=("l"===e?-1:1)*m.width/2;return(0,a.useMemo)((function(){return(0,s.jsxs)("g",{transform:"translate(".concat(l,",92)"),children:[(0,s.jsx)("rect",{fill:"var(--rmg-theme-colour)",x:g,width:m.width+10,height:120}),(0,s.jsxs)("g",{textAnchor:"r"===e?"start":"end",transform:"translate(0,68)",fill:"var(--rmg-theme-fg)",children:[(0,s.jsx)("g",{ref:u,children:(0,s.jsx)("text",{className:"rmg-name__zh",fontSize:68,children:t[0]})}),(0,s.jsx)("text",{className:"rmg-name__en",fontSize:30,textAnchor:"middle",x:x,dy:42,children:t[1]})]})]})}),[m,l,e,t])},d=function(){var n=(0,c.CG)((function(n){return n.param})),t=n.line_name,e=n.direction,o=n.svgWidth,l=t[0].match(/^[\w\d]+|.+/g),u=(0,r.Z)(l,2),f=u[0],h=u[1],m="l"===e?o.destination-36-210:90;return(0,a.useMemo)((function(){return(0,s.jsxs)("g",{transform:"translate(".concat(m,",92)"),children:[(0,s.jsx)("rect",{fill:"var(--rmg-theme-colour)",x:-54,width:108,height:120}),(0,s.jsx)("text",{className:"rmg-name__zh",fill:"var(--rmg-theme-fg)",fontSize:96,textAnchor:"middle",dominantBaseline:"central",transform:"translate(0,60)",letterSpacing:-5,children:f}),(0,s.jsxs)("g",{textAnchor:"start",transform:"translate(74,68)",children:[(0,s.jsx)("text",{className:"rmg-name__zh",fontSize:68,children:h}),(0,s.jsx)("text",{className:"rmg-name__en",fontSize:30,dy:42,children:t[1]})]})]})}),[m].concat((0,i.Z)(t),[e,o.destination]))}},8306:function(n,t,e){e.d(t,{cX:function(){return a},Xt:function(){return c},zS:function(){return o},Ft:function(){return s},f2:function(){return l}});var r=e(9439),i=e(3433),a=function(n,t,e,r){var a=n.length-2*r-e,c=n.findIndex((function(n){return n===t})),o=[].concat((0,i.Z)(n),(0,i.Z)(n),(0,i.Z)(n)),s=n.length+c-Math.floor(a/2)+(a%2===0?1:0),l=n.length+c+Math.floor(a/2);return{top:o.slice(s,l+1),left:o.slice(s-r,s),right:o.slice(l+1,l+1+r),bottom:o.slice(l+1+r,l+1+r+e)}},c=function(n,t,e,r){var a=n.length-2*r-e,c=[].concat((0,i.Z)(n),(0,i.Z)(n),(0,i.Z)(n)),o=n.length+n.findIndex((function(n){return n===t})),s=c[o+a-1],l=n.length+n.findIndex((function(n){return n===s}))+(o+a>2*n.length?n.length:0);return{top:c.slice(o,l+1),left:c.slice(o-r,o),right:c.slice(l+1,l+1+r),bottom:c.slice(l+1+r,l+1+r+e)}},o=function(n,t,e,i){var a=n.findIndex((function(n){return n===t[0]})),o=n.findIndex((function(n){return n===t[1]})),s=a>o?[o,a,t[1],t[0]]:[a,o,t[0],t[1]],l=(0,r.Z)(s,4);a=l[0],o=l[1],t[0]=l[2],t[1]=l[3];var u=n.slice(a,o+1),f=n.filter((function(n){return!u.filter((function(n){return!t.includes(n)})).includes(n)})),h=n.length-("major"===i?Math.max:Math.min)(u.length,f.length)-2*e,m="major"===i?u.length>f.length?t[0]:t[1]:u.length>f.length?t[1]:t[0];return c(n,m,h,e)},s=function(n,t){var e=Object.fromEntries(n.map((function(n){return[n,-1]}))),r=Object.fromEntries(n.map((function(n){return[n,-1]})));return t.top.forEach((function(n,i){e[n]=0+1/(t.top.length+1)*(i+1),r[n]=0})),t.right.forEach((function(n,i){e[n]=1,r[n]=0+1/(t.right.length+1)*(i+1)})),t.bottom.forEach((function(n,i){e[n]=1-1/(t.bottom.length+1)*(i+1),r[n]=1})),t.left.forEach((function(n,i){e[n]=0,r[n]=1-1/(t.left.length+1)*(i+1)})),{x_shares:e,y_shares:r}},l=function(n,t,e,r){var a=n[0].filter((function(n){return!["linestart","lineend"].includes(n)})),c=[].concat((0,i.Z)(a),(0,i.Z)(a),(0,i.Z)(a)),o="r"===t?c:c.reverse(),s=o.findIndex((function(n){return r===n}))+a.length;return o.slice(s+1).filter((function(n){return e[n].loop_pivot})).slice(void 0,2)}}}]);
//# sourceMappingURL=destinationSHMetro.057820bf.chunk.js.map