const e="shmetro",z=400,n=8.750201061605276,a=40,i=45,s=["shanghai","sh3","#FFD100","#000"],r="r",t="s9tt",c="2",l={linestart:{parents:[],children:["vzv2","s9tt"],name:["路綫左端","LEFT END"],branch:{left:[],right:["through","s9tt"]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1},lineend:{parents:["l9j9","fcqo"],children:[],name:["路綫右端","RIGHT END"],branch:{left:["through","fcqo"],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1},l1mz:{parents:["vzv2","syq7"],children:["ll8u"],name:["l1mz","1"],branch:{left:["through","syq7"],right:[]},num:"02",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",secondaryName:!1},iwf6:{children:["l9j9","fmlo"],parents:["ll8u"],name:["iwf6","1"],branch:{left:[],right:["through","fmlo"]},num:"01",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",secondaryName:!1},vzv2:{name:["vzv2","1"],secondaryName:!1,num:"00",services:["local"],parents:["linestart"],children:["l1mz"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},l9j9:{name:["l9j9","1"],secondaryName:!1,num:"00",services:["local"],parents:["iwf6"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},ll8u:{name:["ll8u","1"],secondaryName:!1,num:"00",services:["local"],parents:["l1mz"],children:["iwf6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},syq7:{name:["syq7","1"],secondaryName:!1,num:"00",services:["local"],parents:["s9tt"],children:["l1mz"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},fmlo:{name:["fmlo","1"],secondaryName:!1,num:"00",services:["local"],parents:["iwf6"],children:["fcqo"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},fcqo:{name:["fcqo","1"],secondaryName:!1,num:"00",services:["local"],parents:["fmlo"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},s9tt:{name:["s9tt","1"],secondaryName:!1,num:"00",services:["local"],parents:["linestart"],children:["syq7"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""}},o=["荃灣綫","Tsuen Wan Line"],f="1",m="TW",d="sh2020",h=50,_=70,u={isLegacy:!1,terminal:!1},p={destination:1e3,runin:1e3,railmap:1e3,indoor:800},y=[],g={isStagger:!0,isFlip:!1},v=[{from:"iwf6",to:"l1mz",colors:[["shanghai","sh4","#5F259F","#fff","4号线","Line 4"]],display:!0},{from:"iwf6",to:"fcqo",colors:[["shanghai","sh7","#FF6900","#000","4号线","Line 4"]],display:!0},{from:"s9tt",to:"l1mz",colors:[["shanghai","sh2","#97D700","#000","4号线","Line 4"]],display:!0}],b={style:e,svg_height:400,padding:n,y_pc:a,branch_spacing:i,theme:s,direction:r,current_stn_idx:t,platform_num:c,stn_list:l,line_name:o,psd_num:f,line_num:m,info_panel_type:d,direction_gz_x:h,direction_gz_y:_,customiseMTRDest:u,svgWidth:p,notesGZMTR:y,namePosMTR:g,coline:v};export{i as branch_spacing,v as coline,t as current_stn_idx,u as customiseMTRDest,b as default,r as direction,h as direction_gz_x,_ as direction_gz_y,d as info_panel_type,o as line_name,m as line_num,g as namePosMTR,y as notesGZMTR,n as padding,c as platform_num,f as psd_num,l as stn_list,e as style,p as svgWidth,z as svg_height,s as theme,a as y_pc};