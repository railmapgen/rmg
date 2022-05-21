"use strict";(self.webpackChunkrmg=self.webpackChunkrmg||[]).push([[3472],{8359:function(t,n,e){e.d(n,{Z:function(){return c}});var r=e(3144),i=e(5671),a=e(136),s=e(4062),c=function(t){(0,a.Z)(e,t);var n=(0,s.Z)(e);function e(){var t;(0,i.Z)(this,e);for(var r=arguments.length,a=new Array(r),s=0;s<r;s++)a[s]=arguments[s];return(t=n.call.apply(n,[this].concat(a))).leftWideFactor=function(n){var e=0,r=t.stnList[n].transfer,i=r.info.map((function(t){return t.length}));return"l"===r.tick_direc&&(!i[1]&&i[0]>1&&(e+=.8),!i[1]||1===i[0]&&2===i[1]||(e+=.8)),1===i[0]&&2===i[1]&&"linestart"!==t.stnList[n].parents[0]&&"lineend"!==t.stnList[n].children[0]&&(e+=.8),2===t.stnList[n].parents.length&&(e+=.4),2===t.stnList[t.stnList[n].parents[0]].children.length&&(e+=.4),e},t.rightWideFactor=function(n){var e=0,r=t.stnList[n].transfer,i=r.info.map((function(t){return t.length}));return"r"===r.tick_direc&&(!i[1]&&i[0]>1&&(e+=.8),!i[1]||1===i[0]&&2===i[1]||(e+=.8)),1===i[0]&&2===i[1]&&"linestart"!==t.stnList[n].parents[0]&&"lineend"!==t.stnList[n].children[0]&&(e+=.8),2===t.stnList[n].children.length&&(e+=.4),2===t.stnList[t.stnList[n].children[0]].parents.length&&(e+=.4),e},t}return(0,r.Z)(e)}(e(3824).LD)},3824:function(t,n,e){e.d(n,{Az:function(){return u},QE:function(){return d},ML:function(){return f},h6:function(){return g},LD:function(){return m},pS:function(){return p}});var r=e(9439),i=e(5671),a=e(3144),s=e(3433),c=e(7762),l=e(4942),o=e(1413),h=e(713),u=function(t,n,e){return Object.keys(t).reduce((function(r,i){return(0,o.Z)((0,o.Z)({},r),{},(0,l.Z)({},i,t[i].children.reduce((function(r,a){return(0,o.Z)((0,o.Z)({},r),{},(0,l.Z)({},a,1+n(t,a)+e(t,i)))}),{})))}),{})},d=function t(n,e,r){if(n===e)return{len:0,nodes:[n]};var i=[],a=[];Object.keys(r[n]).forEach((function(s){var c=t(s,e,r);c.len<0||(i.push(r[n][s]+c.len),c.nodes.unshift(n),a.push(c.nodes))}));var s=Math.max.apply(Math,i);return{len:s,nodes:a[i.indexOf(s)]}},f=function(t,n,e){var r=d("linestart","lineend",n);if(r.nodes.includes(t))return d(r.nodes[1],t,n).len;for(var i=e.filter((function(n){return n.includes(t)}))[0],a=t;!r.nodes.includes(a);)a=i[i.indexOf(a)-1];for(var s=t;!r.nodes.includes(s);)s=i[i.indexOf(s)+1];var c="linestart"===a,l=[];return c||"lineend"===s?c?(l[0]=0,l[1]=d(r.nodes[1],s,n).len,l[2]=d(i[1],t,n).len,l[3]=d(t,s,n).len):(l[0]=d(r.nodes[1],a,n).len,l[1]=d(a,r.nodes.slice(-2)[0],n).len,l[2]=d(a,t,n).len,l[3]=d(t,i.slice(-2)[0],n).len):(l[0]=d(r.nodes[1],a,n).len,l[1]=d(a,s,n).len,l[2]=d(a,t,n).len,l[3]=d(t,s,n).len),l[0]+l[2]*l[1]/(l[2]+l[3])},g=function(t,n,e){var r;return console.log("computing stations' states"),(0,s.Z)(new Set((r=[]).concat.apply(r,(0,s.Z)(n)))).reduce((function(r,i){return(0,o.Z)((0,o.Z)({},r),{},(0,l.Z)({},i,i===t?0:(e===h.wA.right?function(t,n,e){var r,i=(0,c.Z)(e);try{for(i.s();!(r=i.n()).done;){var a=r.value,s=a.indexOf(t),l=a.indexOf(n);if(-1!==s&&s<l)return!0}}catch(o){i.e(o)}finally{i.f()}return!1}(t,i,n):function(t,n,e){var r,i=(0,c.Z)(e);try{for(i.s();!(r=i.n()).done;){var a=r.value,s=a.indexOf(t),l=a.indexOf(n);if(-1!==l&&l<s)return!0}}catch(o){i.e(o)}finally{i.f()}return!1}(t,i,n))?1:-1))}),{})},m=function(){function t(n){var e=this;(0,i.Z)(this,t),this.yShares={},this.xShares={},this.namePoss={},this.stnList={},this.criticalPath={},this.leftWideFactor=function(t){return 0},this.rightWideFactor=function(t){return 0},this.pathWeight=function(t,n){return e.stnList[t].children.includes(n)?1+e.rightWideFactor(t)+e.leftWideFactor(n):-1/0},this.pathTurnParams=function(t){var n=35-17.5*Math.sqrt(3),e=t-2*n;return{tr:35,dx_a:17.5,dy_a:n,dx_l:e*Math.sqrt(3),dy_l:e}},this.pathTurnSE=function(t){var n=e.pathTurnParams(t),r=n.tr,i=n.dx_a,a=n.dy_a,s=n.dx_l,c=n.dy_l;return"a ".concat(r,",").concat(r," 0 0,1 ").concat(i,",").concat(a," l ").concat(s,",").concat(c," a ").concat(r,",").concat(r," 0 0,0 ").concat(i,",").concat(a)},this.pathTurnNE=function(t){var n=e.pathTurnParams(t),r=n.tr,i=n.dx_a,a=n.dy_a,s=n.dx_l,c=n.dy_l;return"a ".concat(r,",").concat(r," 0 0,0 ").concat(i,",").concat(-a," l ").concat(s,",").concat(-c," a ").concat(r,",").concat(r," 0 0,1 ").concat(i,",").concat(-a)},this.stnList=n.stnList,this.criticalPath=n.criticalPath}return(0,a.Z)(t,[{key:"getYShare",value:function(t,n){if(t in this.yShares)return this.yShares[t];if(["linestart","lineend"].includes(t)||this.stnList[t].parents.length>1||this.stnList[t].children.length>1)return this.yShares[t]=0,0;var e=this.stnList[t].parents[0];if(e){if(1===this.stnList[e].children.length){var r=this.getYShare(e);return this.yShares[t]=r,r}var i=0===this.stnList[e].children.indexOf(t)?1:-1;return this.yShares[t]=i,i}return this.yShares[t]=0,0}},{key:"_linePath",value:function(t,n,e,i,a,s,c,l){var o=this,h=(0,r.Z)([],3),u=h[0],d=h[1],f=h[2],g=[],m=this.pathTurnParams(s),p=m.dx_a+m.dx_l/2,x=(n[1]-n[0])/c.len*2,v=((n[1]-n[0])/c.len-2*p)/2;return v+x<0&&console.warn("SVG width too small! ".concat(v+x)),t.forEach((function(n){var r=i[n],c=a[n];if(!d&&0!==d)return u=n,f=r,d=c,void(1===t.length?g.push("M ".concat(r,",").concat(c)):e[0].includes(n)?e[0].includes(t[1])?g.push("M ".concat(r,",").concat(c)):(i[t[1]]>0&&g.push("M ".concat(r,",").concat(c+l)),a[t[1]]<0&&g.push("M ".concat(r,",").concat(c-l))):g.push("M ".concat(r,",").concat(c)));c>d?(g.push("h ".concat(0===c?r-f-x*o.leftWideFactor(n)-v-2*p:x*o.rightWideFactor(u)+v)),g.push(o.pathTurnSE(s))):c<d&&(g.push("h ".concat(0===c?r-f-x*o.leftWideFactor(n)-v-2*p:x*o.rightWideFactor(u)+v)),g.push(o.pathTurnNE(s))),g.push("H ".concat(r)),u=n,f=r,d=c})),g.join(" ").replace(/( H ([\d.]+))+/g," H $2")}}],[{key:"getYShares",value:function(t,n){console.log("computing y shares");var e=new this({stnList:t});return Object.keys(t).forEach((function(t){["linestart","lineend"].includes(t)||t in e.yShares||e.getYShare(t,n)})),e.yShares}},{key:"drawLine",value:function(t,n,e,r,i,a,s,c){var l=this,o=arguments.length>8&&void 0!==arguments[8]?arguments[8]:0,h={main:[],pass:[]};return t.forEach((function(u,d){var f=(u=u.filter((function(t){return!["linestart","lineend"].includes(t)}))).filter((function(t){return n[t]>=0})),g=u.filter((function(t){return n[t]<=0}));1===f.length&&(g=u),0===f.filter((function(t){return-1!==g.indexOf(t)})).length&&f.length&&(g[0]===u[0]?g.push(f[0]):f[0]===u[0]&&f[f.length-1]===u[u.length-1]&&g.length?(g=u,f=[]):g.unshift(f[f.length-1])),h.main.push(new l({stnList:e,criticalPath:c})._linePath(f,r,t,i,a,s,c,o)),h.pass.push(new l({stnList:e,criticalPath:c})._linePath(g,r,t,i,a,s,c,o))})),h}}]),t}(),p=function(t,n){var e=(t=t.filter((function(t){return!["linestart","lineend"].includes(t)}))).filter((function(t){return n[t]>=0})),r=t.filter((function(t){return n[t]<=0}));return 1===e.length&&(r=t),0===e.filter((function(t){return-1!==r.indexOf(t)})).length&&e.length&&(r[0]===t[0]?r.push(e[0]):e[0]===t[0]&&e[e.length-1]===t[t.length-1]&&r.length?(r=t,e=[]):r.unshift(e[e.length-1])),{main:e,pass:r}}},3542:function(t,n,e){e.r(n),e.d(n,{default:function(){return M}});var r=e(2791),i=e(5459),a=e(4942),s=e(1413),c=e(3824),l=e(8359),o=e(713),h=e(6169),u=e(184),d=function(t){switch(t){case o.Ly.UP:return 180;case o.Ly.DOWN:return 0;case o.Ly.LEFT:return 90;case o.Ly.RIGHT:return-90}};function f(t){var n=t.interchangeInfo,e=t.isPassed,r=t.position,i=t.repel,a=n[4].split("\\").length,s=n[5].split("\\").length,c=r===o.Ly.LEFT||i===o.Nm.left?"end":r===o.Ly.RIGHT||i===o.Nm.right?"start":"middle",l={path:{rotate:d(r)},g:{x:(r===o.Ly.LEFT?-24:r===o.Ly.RIGHT?24:0)+(i===o.Nm.left?-3:i===o.Nm.right?3:0),y:r===o.Ly.UP?-37-10*(a-1)-7*(s-1):r===o.Ly.DOWN?31:6-(20+10*(a-1)+7*(s-1)-1)/2}};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)("path",{d:"M0,0v17",strokeLinecap:"round",stroke:e?"var(--rmg-grey)":n[2],strokeWidth:8,transform:"rotate(".concat(l.path.rotate,")")}),(0,u.jsxs)("g",{textAnchor:c,transform:"translate(".concat(l.g.x,",").concat(l.g.y,")"),fill:e?"var(--rmg-grey)":"var(--rmg-black)",children:[n[4].split("\\").map((function(t,n){return(0,u.jsx)("text",{dy:10*n,className:"rmg-name__zh",fontSize:10,children:t},n)})),n[5].split("\\").map((function(t,n){return(0,u.jsx)("text",{dy:10*a-1+7*n,className:"rmg-name__en",fontSize:7,children:t},a+n)}))]})]})}var g=(0,r.memo)(f,(function(t,n){return t.interchangeInfo.toString()===n.interchangeInfo.toString()&&t.isPassed===n.isPassed&&t.position===n.position&&t.repel===n.repel}));function m(t){var n=t.length,e=t.isPassed,r=t.isReversed;return(0,u.jsx)("path",{d:"M-8,0 v".concat(n," a8,8 0 0,0 16,0 v-").concat(n," a8,8 0 0,0 -16,0Z"),className:"rmg-stn__mtr",stroke:e?"var(--rmg-grey)":"var(--rmg-black)",transform:"scale(1,".concat(r?-1:1,")")})}function p(t){var n=t.interchangeInfoList,e=t.direction,r=t.isPassed,i=t.isReversed,a=t.repel,s=n.length<=1?0:18*n.length;return(0,u.jsxs)("g",{children:[1===n.length&&(0,u.jsx)(g,{interchangeInfo:n[0],isPassed:r,position:i?o.Ly.UP:o.Ly.DOWN,repel:a}),n.length>1&&n.map((function(t,n){return(0,u.jsx)("g",{transform:"translate(0,".concat(i?-18*(n+1):18*(n+1),")"),children:(0,u.jsx)(g,{interchangeInfo:t,isPassed:r,position:e===o.Nm.right?o.Ly.RIGHT:o.Ly.LEFT})},n)})),(0,u.jsx)(m,{length:s,isPassed:r,isReversed:i})]})}function x(t){var n,e,r,i,a,s=t.interchangeInfoList,c=t.direction,l=t.isPassed,h=t.isReversed,d=t.isTerminal,f=t.stationName,p=null!==(n=null===f||void 0===f||null===(e=f[1])||void 0===e||null===(r=e.split("\\"))||void 0===r?void 0:r.length)&&void 0!==n?n:1,x=18*(s.length-1),v={name:{x:d?0:1===s.length?c===o.Nm.left?-13:13:c===o.Nm.left?13:-13,y:d?h?19:-28:(h?-9:9)*(s.length-1)-4-5*(p-1)}};return(0,u.jsxs)("g",{children:[s.map((function(t,n,e){return(0,u.jsx)("g",{transform:"translate(0,".concat(h?-18*n:18*n,")"),children:(0,u.jsx)(g,{interchangeInfo:t,isPassed:l,position:1===e.length?h?o.Ly.UP:o.Ly.DOWN:c===o.Nm.right?o.Ly.RIGHT:o.Ly.LEFT})},n)})),(0,u.jsx)(m,{length:x,isPassed:l,isReversed:h}),(0,u.jsxs)("g",{textAnchor:0===v.name.x?"middle":v.name.x>0?"start":"end",fill:l?"var(--rmg-grey)":"var(--rmg-black)",transform:"translate(".concat(v.name.x,",").concat(v.name.y,")"),children:[(0,u.jsx)("text",{className:"rmg-name__zh",fontSize:14,children:null===f||void 0===f?void 0:f[0]}),null===f||void 0===f||null===(i=f[1])||void 0===i||null===(a=i.split("\\"))||void 0===a?void 0:a.map((function(t,n){return(0,u.jsx)("text",{className:"rmg-name__en",fontSize:9,dy:12+10*n,children:t},n)}))]})]})}var v=e(9439),y=e(5987),j=(0,r.memo)((function(t){var n=t.stnName,e=t.onUpdate,i=t.align,a=(0,r.useRef)(null);(0,r.useEffect)((function(){document.fonts.ready.then((function(){return null===e||void 0===e?void 0:e(a.current.getBBox())}))}),[n.toString(),i]);return(0,u.jsxs)("g",{ref:a,textAnchor:function(t){switch(t){case o.Nm.left:return"start";case o.Nm.right:return"end";default:return"middle"}}(i),children:[(0,u.jsx)("text",{className:"rmg-name__zh rmg-name__mtr--station",children:n[0]}),n[1].split("\\").map((function(t,n){return(0,u.jsx)("text",{className:"rmg-name__en rmg-name__mtr--station",dy:(e=n,17+11*e),children:t},n);var e}))]})}),(function(t,n){return t.stnName.toString()===n.stnName.toString()&&t.align===n.align})),L=["stationName","stationState","lower","align","facility"];function S(t){var n=t.stationName,e=t.stationState,i=t.lower,a=t.align,c=t.facility,l=(0,y.Z)(t,L),h=(0,r.useState)({x:0,width:0}),d=(0,v.Z)(h,2),f=d[0],g=d[1],m=n[1].split("\\").length,p={g:{x:a?a===o.Nm.right?-3:3:0,y:(i?24.8125:-36.21875-11*(m-1))+(a?i?10:-10:0)},rect:{x:f.x-3+(c===o.mV.none?0:a?a===o.Nm.right?-36.03125:0:-17.015625),y:-11.8125,width:f.width+6+(c===o.mV.none?0:36.03125),height:35.03125+11*(m-1)},use:{x:a?a===o.Nm.right?-17.515625-f.width-3:15.515625:-(f.width+3)/2,y:5.5*(m-1)-11.8125},StationName:{x:c===o.mV.none?0:a?a===o.Nm.right?0:36.03125:19.015625,y:0}};return(0,u.jsx)("g",(0,s.Z)((0,s.Z)({},l),{},{children:(0,u.jsxs)("g",{fill:function(t){switch(t){case o.KR.PASSED:return"var(--rmg-grey)";case o.KR.CURRENT:return"#fff";case o.KR.FUTURE:return"var(--rmg-black)"}}(e),transform:"translate(".concat(p.g.x,",").concat(p.g.y,")"),children:[e===o.KR.CURRENT&&(0,u.jsx)("rect",{x:p.rect.x,y:p.rect.y,width:p.rect.width,height:p.rect.height,fill:"var(--rmg-black)"}),c!==o.mV.none&&(0,u.jsx)("use",{xlinkHref:"#".concat(c),fill:e===o.KR.PASSED?"var(--rmg-grey)":"var(--rmg-black)",x:p.use.x,y:p.use.y}),(0,u.jsx)("g",{transform:"translate(".concat(p.StationName.x,",").concat(p.StationName.y,")"),children:(0,u.jsx)(j,{stnName:n,onUpdate:g,align:a})})]})}))}function N(t){var n,e,r,i,a,s,c,l=t.stationId,d=t.stationState,f=t.isReversed,g=(0,h.CG)((function(t){return t.param.stn_list[l]})),m=g.name,v=g.parents,y=g.children,j=g.transfer,L=j.info,N=j.tick_direc,Z=j.osi_names,_=j.paid_area,w=g.facility,k=null!==(n=L[0])&&void 0!==n&&n.length?v.includes("linestart")?o.Nm.left:y.includes("lineend")?o.Nm.right:void 0:void 0,P=Boolean((null===(e=L[1])||void 0===e?void 0:e.length)&&!k),M={link:{scaleX:k===o.Nm.left?-1:1,scaleY:f?-1:1},osi:{x:k?k===o.Nm.left?-41:41:0,y:k?0:f?-26:26}};return(0,u.jsxs)("g",{"data-testid":"station-icon-wrapper",children:[(null===(r=L[1])||void 0===r?void 0:r.length)&&(0,u.jsx)("path",{d:k&&null!==(i=L[0])&&void 0!==i&&i.length?"M0,0H41":"M0,0V26",strokeWidth:2.69,strokeDasharray:_?0:2.5,stroke:d===o.KR.PASSED?"var(--rmg-grey)":"var(--rmg-black)",transform:"scale(".concat(M.link.scaleX,",").concat(M.link.scaleY,")")}),(0,u.jsx)(p,{interchangeInfoList:L[0],direction:N===o.wA.right?o.Nm.right:o.Nm.left,isPassed:d===o.KR.PASSED,isReversed:!k&&null!==(a=L[1])&&void 0!==a&&a.length?!f:f,repel:P?N===o.wA.right?o.Nm.right:o.Nm.left:void 0}),(null===(s=L[1])||void 0===s?void 0:s.length)&&(0,u.jsx)("g",{transform:"translate(".concat(M.osi.x,",").concat(M.osi.y,")"),children:(0,u.jsx)(x,{interchangeInfoList:L[1],direction:k||(N===o.wA.right?o.Nm.right:o.Nm.left),stationName:Z[0],isPassed:d===o.KR.PASSED,isReversed:k?!f:f,isTerminal:Boolean(k)})}),(0,u.jsx)(S,{stationName:m,stationState:d,facility:w,lower:f,align:null!==(c=L[0])&&void 0!==c&&c.length&&P?N===o.wA.left?o.Nm.left:o.Nm.right:void 0})]})}var Z=function(t,n){var e=0,r=t[n].transfer,i=r.info.map((function(t){return t.length}));return"l"===r.tick_direc&&(!i[1]&&i[0]>1&&(e+=.8),!i[1]||1===i[0]&&2===i[1]||(e+=.8)),1===i[0]&&2===i[1]&&"linestart"!==t[n].parents[0]&&"lineend"!==t[n].children[0]&&(e+=.8),2===t[n].parents.length&&(e+=.4),2===t[t[n].parents[0]].children.length&&(e+=.4),e},_=function(t,n){var e=0,r=t[n].transfer,i=r.info.map((function(t){return t.length}));return"r"===r.tick_direc&&(!i[1]&&i[0]>1&&(e+=.8),!i[1]||1===i[0]&&2===i[1]||(e+=.8)),1===i[0]&&2===i[1]&&"linestart"!==t[n].parents[0]&&"lineend"!==t[n].children[0]&&(e+=.8),2===t[n].children.length&&(e+=.4),2===t[t[n].children[0]].parents.length&&(e+=.4),e},w=function(){var t,n=(0,h.CG)((function(t){return t.helper})),e=n.branches,i=n.routes,d=n.depsStr,f=(0,h.CG)((function(t){return t.param.svgWidth})),g=(0,h.CG)((function(t){return t.param.y_pc})),m=(0,h.CG)((function(t){return t.param.padding})),p=(0,h.CG)((function(t){return t.param.branch_spacing})),x=(0,h.CG)((function(t){return t.param.direction})),v=(0,h.CG)((function(t){return t.param.namePosMTR})),y=(0,h.CG)((function(t){return t.param.current_stn_idx})),j=(0,h.CG)((function(t){return t.param.stn_list})),L=(0,c.Az)(j,Z,_),S=(0,r.useMemo)((function(){return(0,c.QE)("linestart","lineend",L)}),[JSON.stringify(L)]),N=(0,r.useMemo)((function(){return(0,c.QE)(S.nodes[1],S.nodes.slice(-2)[0],L)}),[JSON.stringify(L)]),w=(0,r.useMemo)((function(){return console.log("computing x shares"),Object.keys(j).reduce((function(t,n){return(0,s.Z)((0,s.Z)({},t),{},(0,a.Z)({},n,(0,c.ML)(n,L,e)))}),{})}),[e.toString(),JSON.stringify(L)]),M=[f[o.Ht.RailMap]*m/100,f[o.Ht.RailMap]*(1-m/100)],R=Object.keys(w).reduce((function(t,n){return(0,s.Z)((0,s.Z)({},t),{},(0,a.Z)({},n,M[0]+w[n]/N.len*(M[1]-M[0])))}),{}),O=(0,r.useMemo)((function(){return l.Z.getYShares(j,e)}),[d]),E=Object.keys(O).reduce((function(t,n){return(0,s.Z)((0,s.Z)({},t),{},(0,a.Z)({},n,-O[n]*p))}),{}),T=(0,r.useMemo)((function(){return(0,c.h6)(y,i,x)}),[y,x,i.toString()]),b=Object.keys(j).reduce((function(t,n){return(0,s.Z)((0,s.Z)({},t),{},(0,a.Z)({},n,function(t,n,e){var r,i=e.isStagger,a=e.isFlip;if(!i)return a;if(n[0].includes(t))r=n[0].indexOf(t)%2;else{var s=n.filter((function(n){return n.includes(t)}))[0];r=(n[0].indexOf(s[0])+s.indexOf(t)+1)%2}return 0===r?a:!a}(n,e,v)))}),{}),F=l.Z.drawLine(e,T,j,M,R,E,p,S);return(0,u.jsxs)("g",{id:"main",style:(t={},(0,a.Z)(t,"--y-percentage",g),(0,a.Z)(t,"transform","translateY(calc(var(--y-percentage) * var(--rmg-svg-height) / 100))"),t),children:[(0,u.jsx)(k,{paths:F}),(0,u.jsx)(P,{xs:R,ys:E,stnStates:T,namePoss:b})]})},k=r.memo((function(t){return(0,u.jsxs)("g",{fill:"none",strokeWidth:9.68,children:[(0,u.jsx)("g",{stroke:"var(--rmg-grey)",children:t.paths.pass.map((function(t,n){return(0,u.jsx)("path",{d:t},n)}))}),(0,u.jsx)("g",{stroke:"var(--rmg-theme-colour)",children:t.paths.main.map((function(t,n){return(0,u.jsx)("path",{d:t},n)}))})]})}),(function(t,n){return JSON.stringify(t.paths)===JSON.stringify(n.paths)})),P=function(t){var n=t.xs,e=t.ys,r=t.stnStates,i=t.namePoss,a=(0,h.CG)((function(t){return t.param.stn_list}));return(0,u.jsx)("g",{id:"stn_icons",children:Object.keys(a).filter((function(t){return!["linestart","lineend"].includes(t)})).map((function(t){return(0,u.jsx)("g",{style:{transform:"translate(".concat(n[t],"px,").concat(e[t],"px)")},children:(0,u.jsx)(N,{stationId:t,stationState:r[t],isReversed:i[t]})},t)}))})},M=(0,r.memo)((function(){return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(R,{}),(0,u.jsx)(i.Z,{stripPc:90}),(0,u.jsx)(w,{})]})})),R=r.memo((function(){return(0,u.jsxs)("defs",{children:[(0,u.jsxs)("g",{id:"airport",transform:"scale(0.5970084519)",children:[(0,u.jsx)("rect",{x:-29.33899,height:58.67798,width:58.67798}),(0,u.jsx)("path",{id:"airport",d:"M28.9769,6.60134c1.711.013,3.111,2.53205,3.111,4.241v10.337s17.106,15.435,17.358,15.666a1.145,1.145,0,0,1,.488,1.152v2.833c0,.651-.451.61-.695.467-.334-.119-17.151-8.863-17.151-8.863-.004,1.458-.797,9.006-1.326,13.304,0,0,4.61,2.457,4.699,2.521.334.268.352.359.352.852v2.001c0,.477-.352.428-.51.324-.183-.062-5.693-1.921-5.693-1.921a2.56018,2.56018,0,0,0-.633-.127,2.31654,2.31654,0,0,0-.666.127s-5.477,1.859-5.672,1.921c-.185.104-.523.153-.523-.324v-2.001c0-.493.029-.584.367-.852.086-.064,4.678-2.521,4.678-2.521-.524-4.298-1.307-11.846-1.325-13.304,0,0-16.822,8.744-17.148,8.863-.217.143-.69.184-.69-.467v-2.833a1.16206,1.16206,0,0,1,.473-1.152c.276-.231,17.365-15.666,17.365-15.666v-10.337c0-1.709,1.403-4.228,3.14105-4.241",transform:"translate(-28.9697,0.14347)",fill:"white"})]}),(0,u.jsxs)("g",{id:"disney",transform:"scale(0.5970084519)",children:[(0,u.jsx)("rect",{x:-29.33899,width:58.67798,height:58.67798}),(0,u.jsx)("path",{fill:"white",d:"M45.6152,7.85015a9.80248,9.80248,0,0,0-9.79907,9.801,9.70059,9.70059,0,0,0,.342,2.582c.002.026.002.055.002.093a.31815.31815,0,0,1-.31494.318.67741.67741,0,0,1-.12806-.02,15.71521,15.71521,0,0,0-13.498,0,.61.61,0,0,1-.122.02.31841.31841,0,0,1-.322-.318v-.067a9.62553,9.62553,0,0,0,.35608-2.608,9.803,9.803,0,1,0-9.797,9.8,10.10364,10.10364,0,0,0,2.308-.271h.05493a.31113.31113,0,0,1,.31409.318.32433.32433,0,0,1-.019.12,15.72588,15.72588,0,1,0,29.703,7.216,15.83676,15.83676,0,0,0-1.746-7.23.18417.18417,0,0,1-.0271-.106.31612.31612,0,0,1,.32007-.318h.057a10.15953,10.15953,0,0,0,2.316.271,9.80051,9.80051,0,0,0,0-19.601",transform:"translate(-28.9697 0.13398)"})]}),(0,u.jsx)("clipPath",{id:"hsr-clip-path",transform:"translate(-0.00057 0.01643)",children:(0,u.jsx)("path",{fill:"none",d:"M5.1606.89861a3.67176,3.67176,0,0,0-3.676,3.667v48.966a3.67842,3.67842,0,0,0,3.676,3.692h48.443a3.67892,3.67892,0,0,0,3.678-3.692V4.5656a3.67227,3.67227,0,0,0-3.678-3.667Z"})}),(0,u.jsxs)("g",{id:"hsr",transform:"scale(0.5970084519)",children:[(0,u.jsx)("rect",{x:-29.33899,width:58.67798,height:58.67798}),(0,u.jsxs)("g",{clipPath:"url(#hsr-clip-path)",transform:"translate(-29.33899,0)",children:[(0,u.jsx)("rect",{x:-3.25242,y:24.74141,width:61.75879,height:.98008,transform:"translate(-8.93747 17.31321) rotate(-30.16134)",fill:"white"}),(0,u.jsx)("path",{d:"M5.77169,48.97289c-2.17407-3.89294,2.56994-10.525,4.85-13.724l.173-.248a83.00826,83.00826,0,0,1,7.39294-9.285,97.384,97.384,0,0,1,11.082-9.958c7.051-6.045,15.832-5.876,16.447-5.894l11.785-.957.276,17.42-11.5271,10.586c-.36.39405-5.553,5.863-18.10193,11.035-6.752,2.783-11.877,4.146-15.66,4.146-3.301,0-5.561-1.049-6.71692-3.121",transform:"translate(-0.00057 0.01643)",fill:"white"}),(0,u.jsx)("polygon",{points:"57.453 29.614 32.426 58.31 35.582 58.509 57.584 30.433 57.453 29.614",fill:"white"}),(0,u.jsx)("path",{d:"M49.04708,11.61364a.94277.94277,0,0,0-.17407-.227c-.752-.93695-2.988-1.259-5.933-.793a25.98382,25.98382,0,0,0-9.99695,3.032A98.52916,98.52916,0,0,0,20.723,23.69768c-3.1759,3.487-4.645,6.388-3.62292,7.584,1.84,2.166,13.7539.716,22.00793-6.066,9.035-7.42,10.718-11.577,9.93909-13.602",transform:"translate(-0.00057 0.01643)"}),(0,u.jsx)("path",{d:"M34.65255,13.81182c5.65991-2.842,11.28088-2.856,12.1499-1.213.88306,1.652-2.99792,5.303-8.656,8.128-5.648,2.837-10.9469,3.805-11.81994,2.15-.873-1.641,2.668-6.237,8.326-9.065",transform:"translate(-0.00057 0.01643)",fill:"white"}),(0,u.jsx)("path",{d:"M58.10958,25.03454c-16.832,20.708-40.7301,26.038-40.7301,26.038,11-6.73,12.769-8.111,18.968-18.01,8.364-13.351,21.77808-21.549,21.912-21.63,0,0-.068,13.5-.1499,13.602",transform:"translate(-0.00057 0.01643)"}),(0,u.jsx)("path",{d:"M27.1877,26.69561l9.705-2.814a6.22768,6.22768,0,0,1-1.994,2.759,25.57277,25.57277,0,0,1-6.697,3.405,11.78221,11.78221,0,0,1-5.5.783Z",transform:"translate(-0.00057 0.01643)",fill:"white"}),(0,u.jsx)("path",{d:"M19.59005,25.97692a18.37656,18.37656,0,0,1,3.891-3.976,6.66452,6.66452,0,0,0-.30908,2.213l-4.391,4.829a6.18212,6.18212,0,0,1,.80908-3.066",transform:"translate(-0.00057 0.01643)",fill:"white"}),(0,u.jsx)("polygon",{points:"23.156 58.311 57.463 26.746 57.396 25.857 21.582 58.607 23.156 58.311",fill:"white"}),(0,u.jsx)("path",{d:"M60.15645,12.35973a68.6782,68.6782,0,0,0-12.602,9.542c-8.15,7.745-12.109,15.259-9.855,16.091,2.24793.816,10.678-4.782,18.83594-12.543,1.828-1.74,3.48-3.424,4.926-5.024Z",transform:"translate(-0.00057 0.01643)",fill:"white"}),(0,u.jsx)("path",{d:"M63.07638,11.82653a40.86955,40.86955,0,0,0-10,7.096c-5.90406,5.437-9.48609,11.105-7.848,11.742,1.657.631,8.28894-3.955,14.188-9.401a61.76591,61.76591,0,0,0,4.61694-4.705Z",transform:"translate(-0.00057 0.01643)"}),(0,u.jsx)("path",{d:"M12.67989,42.93969a9.87,9.87,0,0,0-5.754-1.895c-.113.22-.223.439-.33008.662a9.45046,9.45046,0,0,1,5.69507,1.749,6.27885,6.27885,0,0,1,2.61,6.305,10.16524,10.16524,0,0,1-.598,2.228c.238-.023.481-.053.725-.087.78308-2.249,1.394-6.184-2.3479-8.962",transform:"translate(-0.00057 0.01643)"})]})]}),(0,u.jsx)("path",{id:"inttick",d:"M0,0v17",strokeLinecap:"round"})]})}))},5459:function(t,n,e){var r=e(4942),i=e(2791),a=e(184);n.Z=(0,i.memo)((function(t){var n;return(0,a.jsx)("rect",{fill:"var(--rmg-theme-colour)",height:20,style:(n={width:"var(--rmg-svg-width)"},(0,r.Z)(n,"--strip-percentage",t.stripPc),(0,r.Z)(n,"transform","translateY(calc(var(--strip-percentage, 95) * var(--rmg-svg-height) / 100 - 10px))"),n)})}))}}]);
//# sourceMappingURL=railmapMTR.d09c1374.chunk.js.map