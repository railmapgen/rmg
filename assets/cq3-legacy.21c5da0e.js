System.register([],(function(i,n){"use strict";return{execute:function(){var n=i("svgWidth",{destination:2e3,runin:2e3,railmap:2600,indoor:2600}),e=i("svg_height",400),a=i("style","shmetro"),r=i("y_pc",50),o=i("padding",10),t=i("direction","r"),c=i("platform_num","1"),l=i("theme",["chongqing","cq3","#003DA5","#fff"]),s=i("line_name",["3号线","Line 3"]),_=i("current_stn_idx","2uFYan"),d=i("stn_list",{linestart:{name:["LEFT END","LEFT END"],secondaryName:!1,num:"00",services:["local"],parents:[],children:["2uFYan"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:200},"2uFYan":{name:["鱼洞","Yudong"],secondaryName:!1,num:"01",services:["local"],parents:["linestart"],children:["erB2C1"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq2","#007A33","#fff","2号线","Line 2"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},erB2C1:{name:["金竹","Jinzhu"],secondaryName:!1,num:"02",services:["local"],parents:["2uFYan"],children:["S14hDl"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},lineend:{name:["RIGHT END","RIGHT END"],secondaryName:!1,num:"00",services:["local"],parents:["uxJgzU","9jmc4k"],children:[],branch:{left:["through","uxJgzU"],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:200},S14hDl:{name:["鱼胡路","Yuhulu"],secondaryName:!1,num:"03",services:["local"],parents:["erB2C1"],children:["8Yucqk"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"8Yucqk":{name:["学堂湾","Xuetangwan"],secondaryName:!1,num:"04",services:["local"],parents:["S14hDl"],children:["4Z2Cb0"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"4Z2Cb0":{name:["大山村","Dashancun"],secondaryName:!1,num:"05",services:["local"],parents:["8Yucqk"],children:["f5nmOk"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},f5nmOk:{name:["花溪","Huaxi"],secondaryName:!1,num:"06",services:["local"],parents:["4Z2Cb0"],children:["rK1Ijs"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},rK1Ijs:{name:["岔路口","Chalukou"],secondaryName:!1,num:"07",services:["local"],parents:["f5nmOk"],children:["ESu8Fs"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},ESu8Fs:{name:["九公里","Jiugongli"],secondaryName:!1,num:"08",services:["local"],parents:["rK1Ijs"],children:["XGtdfp"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},XGtdfp:{name:["麒龙","Qilong"],secondaryName:!1,num:"09",services:["local"],parents:["ESu8Fs"],children:["zMIG5y"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},zMIG5y:{name:["八公里","Bagongli"],secondaryName:!1,num:"10",services:["local"],parents:["XGtdfp"],children:["U9JLvX"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},U9JLvX:{name:["重庆交通大学","Chongqing Jiaotong Univeristy"],secondaryName:!1,num:"11",services:["local"],parents:["zMIG5y"],children:["67gr7X"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"67gr7X":{name:["六公里","Liugongli"],secondaryName:!1,num:"12",services:["local"],parents:["U9JLvX"],children:["kK1LUK"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},kK1LUK:{name:["重庆工商大学","Chongqing Technology\\& Business University"],secondaryName:!1,num:"13",services:["local"],parents:["67gr7X"],children:["_i0ULk"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},_i0ULk:{name:["四公里","Sigongli"],secondaryName:!1,num:"14",services:["local"],parents:["kK1LUK"],children:["GXNWc6"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","loop","#A89968","#fff","环线","Loop Line"]],[],[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},GXNWc6:{name:["南坪","Nanping"],secondaryName:!1,num:"15",services:["local"],parents:["_i0ULk"],children:["39mRNU"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"39mRNU":{name:["工贸","Gongmao"],secondaryName:!1,num:"16",services:["local"],parents:["GXNWc6"],children:["R0KzL4"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},R0KzL4:{name:["铜元局","Tongyuanju"],secondaryName:!1,num:"17",services:["local"],parents:["39mRNU"],children:["JAuu3x"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},JAuu3x:{name:["两路口","Lianglukou"],secondaryName:!1,num:"18",services:["local"],parents:["R0KzL4"],children:["QtwCwS"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq1","#E4002B","#fff","1号线","Line 1"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},QtwCwS:{name:["牛角沱","Niujiaotuo"],secondaryName:!1,num:"19",services:["local"],parents:["JAuu3x"],children:["Xjriy7"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq2","#007A33","#fff","2号线","Line 2"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},Xjriy7:{name:["华新街","Huaxinjie"],secondaryName:!1,num:"20",services:["local"],parents:["QtwCwS"],children:["kIdMVF"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},kIdMVF:{name:["观音桥","Guanyinqiao"],secondaryName:!1,num:"21",services:["local"],parents:["Xjriy7"],children:["vzFBg3"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},vzFBg3:{name:["红旗河沟","Hongqihegou"],secondaryName:!1,num:"22",services:["local"],parents:["kIdMVF"],children:["_MAJKF"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq6","#F67599","#fff","6号线","Line 6"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},_MAJKF:{name:["嘉州路","Jiazhoulu"],secondaryName:!1,num:"23",services:["local"],parents:["vzFBg3"],children:["Swy4g5"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},Swy4g5:{name:["郑家院子","Zhengjiayuanzi"],secondaryName:!1,num:"24",services:["local"],parents:["_MAJKF"],children:["hJo4y6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},hJo4y6:{name:["唐家院子","Tangjiayuanzi"],secondaryName:!1,num:"25",services:["local"],parents:["Swy4g5"],children:["VcwERX"],branch:{left:[],right:[]},transfer:{info:[[],[],[]],tick_direc:"r",paid_area:!1,osi_names:[["",""]]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},VcwERX:{name:["狮子坪","Shiziping"],secondaryName:!1,num:"26",services:["local"],parents:["hJo4y6"],children:["9E51S9"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"9E51S9":{name:["重庆北站南广场","Chongqing North Station\\South Square"],secondaryName:!1,num:"27",services:["local"],parents:["VcwERX"],children:["lcE8ZT"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq10","#5F249F","#fff","10号线","Line 10"],["chongqing","loop","#A89968","#fff","环线","Loop Line"]],[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},lcE8ZT:{name:["龙头寺","Longtousi"],secondaryName:!1,num:"28",services:["local"],parents:["9E51S9"],children:["THDrss"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},THDrss:{name:["童家院子","Tongjiayuanzi"],secondaryName:!1,num:"29",services:["local"],parents:["lcE8ZT"],children:["n5t2ye"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},n5t2ye:{name:["金渝","Jinyu"],secondaryName:!1,num:"30",services:["local"],parents:["THDrss"],children:["ObKPnp"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},ObKPnp:{name:["金童路","Jintonglu"],secondaryName:!1,num:"31",services:["local"],parents:["n5t2ye"],children:["3XH2ct"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"3XH2ct":{name:["鸳鸯","Yuanyang"],secondaryName:!1,num:"32",services:["local"],parents:["ObKPnp"],children:["wDuEgQ"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},wDuEgQ:{name:["园博园","The EXPO Garden"],secondaryName:!1,num:"33",services:["local"],parents:["3XH2ct"],children:["4wnioW"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"4wnioW":{name:["翠云","Cuiyun"],secondaryName:!1,num:"34",services:["local"],parents:["wDuEgQ"],children:["1o-6t6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"1o-6t6":{name:["长福路","Changfulu"],secondaryName:!1,num:"35",services:["local"],parents:["4wnioW"],children:["zeL9lZ"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},zeL9lZ:{name:["回兴","Huixing"],secondaryName:!1,num:"36",services:["local"],parents:["1o-6t6"],children:["8D2gM6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"8D2gM6":{name:["双龙","Shuanglong"],secondaryName:!1,num:"37",services:["local"],parents:["zeL9lZ"],children:["72FPxi"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"72FPxi":{name:["碧津","Bijin"],secondaryName:!1,num:"38",services:["local"],parents:["8D2gM6"],children:["xp9R5h","9jmc4k"],branch:{left:[],right:["through","xp9R5h"]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"9jmc4k":{name:["江北机场T2航站楼","Terminal 2 of Jiangbei Airport"],secondaryName:!1,num:"39",services:["local"],parents:["72FPxi"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[["chongqing","cq10","#5F249F","#fff","10号线","Line 10"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},xp9R5h:{name:["双凤桥","Shuangfengqiao"],secondaryName:!1,num:"40",services:["local"],parents:["72FPxi"],children:["5SNtYu"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"5SNtYu":{name:["空港广场","Konggang Square"],secondaryName:!1,num:"41",services:["local"],parents:["xp9R5h"],children:["8dlKLu"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"8dlKLu":{name:["高堡湖","Gaobaohu"],secondaryName:!1,num:"42",services:["local"],parents:["5SNtYu"],children:["08K7x6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},"08K7x6":{name:["观月路","Guanyuelu"],secondaryName:!1,num:"43",services:["local"],parents:["8dlKLu"],children:["JNj8aR"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},JNj8aR:{name:["莲花","Lianhua"],secondaryName:!1,num:"44",services:["local"],parents:["08K7x6"],children:["uxJgzU"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200},uxJgzU:{name:["举人坝","Jurenba"],secondaryName:!1,num:"45",services:["local"],parents:["JNj8aR"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:200}}),p=i("namePosMTR",{isStagger:!0,isFlip:!0}),f=i("customiseMTRDest",{isLegacy:!1,terminal:!1}),m=i("line_num","3"),h=i("psd_num","1"),g=i("info_panel_type","sh"),u=i("notesGZMTR",[]),y=i("direction_gz_x",40),v=i("direction_gz_y",70),k=i("coline",{}),N=i("loop",!1),b=i("loop_info",{bank:!0,left_and_right_factor:1,bottom_factor:1}),L=i("branchSpacingPct",31);i("default",{svgWidth:n,svg_height:e,style:a,y_pc:r,padding:o,direction:t,platform_num:c,theme:l,line_name:s,current_stn_idx:_,stn_list:d,namePosMTR:p,customiseMTRDest:f,line_num:m,psd_num:h,info_panel_type:g,notesGZMTR:u,direction_gz_x:y,direction_gz_y:v,coline:k,loop:N,loop_info:b,branchSpacingPct:L})}}}));