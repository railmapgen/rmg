System.register([],(function(e,i){"use strict";return{execute:function(){var i=e("style","gzmtr"),n=e("svg_height",300),a=e("padding",8.750201061605276),r=e("y_pc",40),t=e("branch_spacing",45),o=e("theme",["guangzhou","gz18","#0047BA","#fff"]),s=e("direction","r"),c=e("current_stn_idx","qbbb"),l=e("platform_num","3"),_=e("stn_list",{linestart:{parents:[],children:["qbbb"],name:["路綫右端","RIGHT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1,loop_pivot:!1},lineend:{parents:["iwf6"],children:[],name:["路綫左端","LEFT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"09",secondaryName:!1,loop_pivot:!1},l1mz:{parents:["lyqw"],children:["iwf6"],name:["磨碟沙","Modiesha"],branch:{left:[],right:[]},num:"07",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["guangzhou","gz8","#008C95","#fff","8号线","Line 8"]]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1},iwf6:{children:["lineend"],parents:["l1mz"],name:["冼村","Xiancun"],branch:{left:[],right:[]},num:"08",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1},qbbb:{parents:["linestart"],children:["tgp4"],branch:{left:[],right:[]},name:["万顷沙","Wanqingsha"],num:"01",services:["local"],facility:"",transfer:{info:[[]],osi_names:[],paid_area:!0,tick_direc:"r"},secondaryName:!1,loop_pivot:!1},tgp4:{parents:["qbbb"],children:["ecsx"],branch:{left:[],right:[]},name:["横沥","Hengli"],num:"02",services:["local"],facility:"",transfer:{info:[[]],osi_names:[],paid_area:!0,tick_direc:"r"},secondaryName:!1,loop_pivot:!1},su3g:{parents:["ecsx"],children:["9v64"],branch:{left:[],right:[]},name:["南村万博","Nancun Wanbo"],num:"04",services:["local"],facility:"",transfer:{info:[[["guangzhou","gz7","#97D700","#000","7号线","Line 7"]]],osi_names:[],paid_area:!0,tick_direc:"r"},secondaryName:!1,loop_pivot:!1},"9v64":{parents:["su3g"],children:["lyqw"],branch:{left:[],right:[]},name:["沙溪","Shaxi"],num:"05",services:["local"],facility:"",transfer:{info:[[]],osi_names:[],paid_area:!0,tick_direc:"r"},secondaryName:!1,loop_pivot:!1},lyqw:{parents:["9v64"],children:["l1mz"],branch:{left:[],right:[]},name:["龙潭","Longtan"],num:"06",services:["local"],facility:"",transfer:{info:[[]],osi_names:[],paid_area:!0,tick_direc:"r"},secondaryName:!1,loop_pivot:!1},ecsx:{name:["番禺广场","Panyu Square"],secondaryName:!1,num:"03",services:["local"],parents:["tgp4"],children:["su3g"],branch:{left:[],right:[]},transfer:{info:[[["guangzhou","gz3","#ECA154","#000","3号线","Line 3"],["guangzhou","gz22","#CD5228","#fff","22号线","Line 22"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1}}),f=e("line_name",["18号线","Line 18"]),m=e("psd_num","3"),d=e("line_num","18"),p=e("info_panel_type","gz1421"),g=e("direction_gz_x",57.35),h=e("direction_gz_y",80),u=e("customiseMTRDest",{isLegacy:!1,terminal:!1}),y=e("svgWidth",{destination:1e3,runin:1e3,railmap:1500,indoor:1e3}),v=e("notesGZMTR",[]),b=e("namePosMTR",{isStagger:!0,isFlip:!1}),z=e("coline",{}),N=e("loop",!1),k=e("loop_info",{bank:!0,left_and_right_factor:0,bottom_factor:1});e("default",{style:i,svg_height:n,padding:a,y_pc:r,branch_spacing:t,theme:o,direction:s,current_stn_idx:c,platform_num:l,stn_list:_,line_name:f,psd_num:m,line_num:d,info_panel_type:p,direction_gz_x:g,direction_gz_y:h,customiseMTRDest:u,svgWidth:y,notesGZMTR:v,namePosMTR:b,coline:z,loop:N,loop_info:k})}}}));