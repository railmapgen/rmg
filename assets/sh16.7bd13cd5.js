const e="shmetro",v=450,a=8.750201061605276,n=40,i=45,s=["shanghai","sh16","#2CD5C4","#000"],r="r",t="l1mz",c="",l={linestart:{parents:[],children:["l1mz"],name:["\u8DEF\u7DAB\u5DE6\u7AEF","LEFT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1},lineend:{parents:["iwf6"],children:[],name:["\u8DEF\u7DAB\u53F3\u7AEF","RIGHT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1},l1mz:{parents:["linestart"],children:["l5s7"],name:["\u9F99\u9633\u8DEF","Longyang Road"],branch:{left:[],right:[]},num:"02",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["shanghai","sh2","#97D700","#000","2\u53F7\u7EBF","Line 2"],["shanghai","sh7","#FF6900","#000","7\u53F7\u7EBF","Line 7"],["shanghai","sh18","#D6A461","#000","18\u53F7\u7EBF","Line 18"]],[],[["shanghai","maglev","#009090","#fff","\u78C1\u6D6E\u7EBF","Maglev Line"]]]},services:["local","express","direct"],facility:"",secondaryName:!1,int_padding:200},iwf6:{children:["lineend"],parents:["j2ts"],name:["\u6EF4\u6C34\u6E56","Dishui Lake"],branch:{left:[],right:[]},num:"01",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local","express","direct"],facility:"",secondaryName:!1},l5s7:{name:["\u534E\u590F\u4E2D\u8DEF","Middle Huaxia Road"],secondaryName:!1,num:"00",services:["local"],parents:["l1mz"],children:["z631"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh13","#EF95CF","#000","13\u53F7\u7EBF","Line 13"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",int_padding:200},z631:{name:["\u7F57\u5C71\u8DEF","Luoshan Road"],secondaryName:!1,num:"00",services:["local","express"],parents:["l5s7"],children:["flg6"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh11","#76232F","#fff","11\u53F7\u7EBF","Line 11"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",int_padding:200},flg6:{name:["\u5468\u6D66\u4E1C","East Zhoupu"],secondaryName:!1,num:"00",services:["local"],parents:["z631"],children:["op34"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},q0vm:{name:["\u822A\u5934\u4E1C","East Hangtou"],secondaryName:!1,num:"00",services:["local"],parents:["op34"],children:["c0at"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},c0at:{name:["\u65B0\u573A","Xinchang"],secondaryName:!1,num:"00",services:["local","express"],parents:["q0vm"],children:["zph2"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},zph2:{name:["\u91CE\u751F\u52A8\u7269\u56ED","Wild Animal Park"],secondaryName:!1,num:"00",services:["local"],parents:["c0at"],children:["0ku9"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},"0ku9":{name:["\u60E0\u5357","Huinan"],secondaryName:!1,num:"00",services:["local","express"],parents:["zph2"],children:["jj84"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},jj84:{name:["\u60E0\u5357\u4E1C","East Huinan"],secondaryName:!1,num:"00",services:["local"],parents:["0ku9"],children:["oy89"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},oy89:{name:["\u4E66\u9662","Shuyuan"],secondaryName:!1,num:"00",services:["local"],parents:["jj84"],children:["j2ts"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},j2ts:{name:["\u4E34\u6E2F\u5927\u9053","Lingang Avenue"],secondaryName:!1,num:"00",services:["local","express"],parents:["oy89"],children:["iwf6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},op34:{name:["\u9E64\u6C99\u822A\u57CE","Heshahangcheng"],secondaryName:!1,num:"00",services:["local"],parents:["flg6"],children:["q0vm"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""}},o=["16\u53F7\u7EBF","Line 16"],d="1",f="16",h="sh",m=50,_=70,p={isLegacy:!1,terminal:!1},g={destination:1e3,runin:1e3,railmap:2e3,indoor:2e3},u=[],y={isStagger:!0,isFlip:!1},k={style:e,svg_height:450,padding:a,y_pc:n,branch_spacing:i,theme:s,direction:r,current_stn_idx:t,platform_num:c,stn_list:l,line_name:o,psd_num:d,line_num:f,info_panel_type:h,direction_gz_x:m,direction_gz_y:_,customiseMTRDest:p,svgWidth:g,notesGZMTR:u,namePosMTR:y};export{i as branch_spacing,t as current_stn_idx,p as customiseMTRDest,k as default,r as direction,m as direction_gz_x,_ as direction_gz_y,h as info_panel_type,o as line_name,f as line_num,y as namePosMTR,u as notesGZMTR,a as padding,c as platform_num,d as psd_num,l as stn_list,e as style,g as svgWidth,v as svg_height,s as theme,n as y_pc};