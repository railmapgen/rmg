System.register([],(function(e,a){"use strict";return{execute:function(){var a=e("style","gzmtr"),i=e("svg_height",300),n=e("padding",7),r=e("y_pc",40),c=e("branch_spacing",60),s=e("theme",["kunming","km3","#D02E81","#fff"]),t=e("direction","l"),l=e("current_stn_idx","iwf6"),d=e("platform_num","2"),m=e("stn_list",{linestart:{parents:[],children:["l1mz"],name:["路綫左端","LEFT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"21",secondaryName:!1},lineend:{parents:["iwf6"],children:[],name:["路綫右端","RIGHT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1},l1mz:{parents:["linestart"],children:["dylu"],name:["东部汽车站","East Coach Station"],branch:{left:[],right:[]},num:"20",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["kunming","km6","#3D89A8","#fff","6号线","Line 6"]]]},services:["local"],facility:"",secondaryName:!1},iwf6:{children:["lineend"],parents:["jqzs"],name:["西山公园","Western Hills Park"],branch:{left:[],right:[]},num:"01",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",secondaryName:!1},jqzs:{name:["车家壁","Chejiabi"],secondaryName:!1,num:"02",services:["local"],parents:["es08"],children:["iwf6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},es08:{name:["普坪村","Pupingcun"],secondaryName:!1,num:"03",services:["local"],parents:["32tt"],children:["jqzs"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},"32tt":{name:["石咀","Shizui"],secondaryName:!1,num:"04",services:["local"],parents:["k7r5"],children:["es08"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},k7r5:{name:["大渔路","Dayu Rd."],secondaryName:!1,num:"05",services:["local"],parents:["6bue"],children:["32tt"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},"6bue":{name:["西部汽车站","West Coach Station"],secondaryName:!1,num:"06",services:["local"],parents:["ipv8"],children:["k7r5"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},ipv8:{name:["眠山","Minshan"],secondaryName:!1,num:"07",services:["local"],parents:["wlrj"],children:["6bue"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},wlrj:{name:["昌源中路","Changyuan Middle Rd."],secondaryName:!1,num:"08",services:["local"],parents:["lux4"],children:["ipv8"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},lux4:{name:["西苑","Xiyuan"],secondaryName:!1,num:"09",services:["local"],parents:["39bz"],children:["wlrj"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},"39bz":{name:["梁家河","Liangjiahe"],secondaryName:!1,num:"10",services:["local"],parents:["3jd8"],children:["lux4"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},"3jd8":{name:["市体育馆","Municipal Statium"],secondaryName:!1,num:"11",services:["local"],parents:["j9ir"],children:["39bz"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},j9ir:{name:["潘家湾","Panjiawan"],secondaryName:!1,num:"12",services:["local"],parents:["eoy4"],children:["3jd8"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},eoy4:{name:["五一路","Wuyi Rd."],secondaryName:!1,num:"13",services:["local"],parents:["dd9v"],children:["j9ir"],branch:{left:[],right:[]},transfer:{info:[[["kunming","km5","#2AA844","#fff","5号线","Line 5"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},dd9v:{name:["东风广场","Dongfeng Square"],secondaryName:!1,num:"14",services:["local"],parents:["bcwd"],children:["eoy4"],branch:{left:[],right:[]},transfer:{info:[[["kunming","km2","#235A99","#fff","2号线","Line 2"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},bcwd:{name:["拓东体育馆","Tuodong Stadium"],secondaryName:!1,num:"15",services:["local"],parents:["waec"],children:["dd9v"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},waec:{name:["大树营","Dashuying"],secondaryName:!1,num:"16",services:["local"],parents:["ojq3"],children:["bcwd"],branch:{left:[],right:[]},transfer:{info:[[["kunming","km4","#EE7C30","#fff","4号线","Line 4"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},ojq3:{name:["金马寺","Jinmasi"],secondaryName:!1,num:"17",services:["local"],parents:["n8s8"],children:["waec"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},n8s8:{name:["太平村","Taipingcun"],secondaryName:!1,num:"18",services:["local"],parents:["dylu"],children:["ojq3"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""},dylu:{name:["虹桥","Hongqiao"],secondaryName:!1,num:"19",services:["local"],parents:["l1mz"],children:["n8s8"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:""}}),o=e("line_name",["3号线","Line 3"]),f=e("psd_num","12"),_=e("line_num","3"),h=e("info_panel_type","gzgf"),u=e("direction_gz_x",50),p=e("direction_gz_y",70),y=e("customiseMTRDest",{isLegacy:!1,terminal:!1}),g=e("svgWidth",{destination:1420,runin:1130,railmap:1420,indoor:1420}),k=e("notesGZMTR",[]),b=e("namePosMTR",{isStagger:!0,isFlip:!1});e("default",{style:a,svg_height:i,padding:n,y_pc:r,branch_spacing:c,theme:s,direction:t,current_stn_idx:l,platform_num:d,stn_list:m,line_name:o,psd_num:f,line_num:_,info_panel_type:h,direction_gz_x:u,direction_gz_y:p,customiseMTRDest:y,svgWidth:g,notesGZMTR:k,namePosMTR:b})}}}));