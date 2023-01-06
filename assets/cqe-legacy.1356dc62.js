System.register([],(function(n,i){"use strict";return{execute:function(){var i=n("svgWidth",{destination:2e3,runin:2e3,railmap:2e3,indoor:2e3}),e=n("svg_height",400),a=n("style","shmetro"),r=n("y_pc",50),t=n("padding",10),o=n("direction","r"),c=n("platform_num","1"),s=n("theme",["chongqing","cq4","#DC8633","#fff"]),l=n("line_name",["直快列车","Express Train"]),_=n("current_stn_idx","2uFYan"),d=n("stn_list",{linestart:{name:["LEFT END","LEFT END"],secondaryName:!1,num:"00",services:["local"],parents:[],children:["2uFYan"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:200},"2uFYan":{name:["唐家沱","Tangjiatuo"],secondaryName:!1,num:"01",services:["local"],parents:["linestart"],children:["erB2C1"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},erB2C1:{name:["头塘","Toutang"],secondaryName:!1,num:"02",services:["local"],parents:["2uFYan"],children:["S14hDl"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq9","#862041","#fff","9号线","Line 9"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},lineend:{name:["RIGHT END","RIGHT END"],secondaryName:!1,num:"00",services:["local"],parents:["67gr7X"],children:[],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:200},S14hDl:{name:["重庆北站北广场","Chongqing North Station\\North Sqaure"],secondaryName:!1,num:"03",services:["local"],parents:["erB2C1"],children:["8Yucqk"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq10","#5F249F","#fff","10号线","Line 10"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"8Yucqk":{name:["民安大道","Min'an Avenue"],secondaryName:!1,num:"04",services:["local"],parents:["S14hDl"],children:["4Z2Cb0"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","loop","#A89968","#fff","环线","Loop Line"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"4Z2Cb0":{name:["冉家坝","Ranjiaba"],secondaryName:!1,num:"05",services:["local"],parents:["8Yucqk"],children:["f5nmOk"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq5","#00A3E0","#fff","5号线","Line 5"],["chongqing","cq6","#F67599","#fff","6号线","Line 6"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},f5nmOk:{name:["沙坪坝","Shapingba"],secondaryName:!1,num:"06",services:["local"],parents:["4Z2Cb0"],children:["rK1Ijs"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq1","#E4002B","#fff","1号线","Line 1"],["chongqing","cq9","#862041","#fff","9号线","Line 9"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},rK1Ijs:{name:["重庆图书馆","Chongqing Library"],secondaryName:!1,num:"07",services:["local"],parents:["f5nmOk"],children:["ESu8Fs"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},ESu8Fs:{name:["上桥","Shangqiao"],secondaryName:!1,num:"08",services:["local"],parents:["rK1Ijs"],children:["XGtdfp"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},XGtdfp:{name:["重庆西站","Chongqing West Station"],secondaryName:!1,num:"09",services:["local"],parents:["ESu8Fs"],children:["zMIG5y"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","loop","#A89968","#fff","环线","Loop Line"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},zMIG5y:{name:["金建路","Jinjianlu"],secondaryName:!1,num:"10",services:["local"],parents:["XGtdfp"],children:["U9JLvX"],branch:{left:[],right:[]},transfer:{info:[[],[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},U9JLvX:{name:["华岩中心","Huayan Center"],secondaryName:!1,num:"11",services:["local"],parents:["zMIG5y"],children:["67gr7X"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"67gr7X":{name:["跳磴","Tiaodeng"],secondaryName:!1,num:"12",services:["local"],parents:["U9JLvX"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[["other","other","#0077C8","#fff","江跳线","Jiangtiao Line"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200}}),f=n("namePosMTR",{isStagger:!0,isFlip:!0}),p=n("customiseMTRDest",{isLegacy:!1,terminal:!1}),g=n("line_num","4L5"),m=n("psd_num","1"),h=n("info_panel_type","sh"),u=n("notesGZMTR",[]),y=n("direction_gz_x",40),v=n("direction_gz_y",70),b=n("coline",{}),q=n("loop",!1),k=n("loop_info",{bank:!0,left_and_right_factor:1,bottom_factor:1}),N=n("branchSpacingPct",8);n("default",{svgWidth:i,svg_height:e,style:a,y_pc:r,padding:t,direction:o,platform_num:c,theme:s,line_name:l,current_stn_idx:_,stn_list:d,namePosMTR:f,customiseMTRDest:p,line_num:g,psd_num:m,info_panel_type:h,notesGZMTR:u,direction_gz_x:y,direction_gz_y:v,coline:b,loop:q,loop_info:k,branchSpacingPct:N})}}}));