const e="shmetro",y=500,v=8.75,j=40,k=45,i=["beijing","bj2","#004B87","#fff"],n="r",a="iwf6",r="",s={linestart:{parents:[],children:["l1mz"],name:["\u8DEF\u7DAB\u5DE6\u7AEF","LEFT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1,loop_pivot:!1},lineend:{parents:["wcjm"],children:[],name:["\u8DEF\u7DAB\u53F3\u7AEF","RIGHT END"],branch:{left:[],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",num:"00",secondaryName:!1,loop_pivot:!1},l1mz:{parents:["linestart"],children:["fdwp"],name:["\u79EF\u6C34\u6F6D","Jishuit\u03B1n"],branch:{left:[],right:[]},num:"02",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["beijing","bj19","#D6ABC1","#fff","19\u53F7\u7EBF","Line 19"]]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1},iwf6:{children:["8lip"],parents:["lt41"],name:["\u671D\u9633\u95E8","Ch\u03B1oy\u03B1ngmen"],branch:{left:[],right:[]},num:"01",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["beijing","bj6","#B58500","#fff","6\u53F7\u7EBF","Line 6"]]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1},fdwp:{name:["\u9F13\u697C\u5927\u8857","Gulou D\u03B1jie"],secondaryName:!1,num:"00",services:["local"],parents:["l1mz"],children:["etp0"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj8","#009B77","#fff","8\u53F7\u7EBF","Line 8"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},etp0:{name:["\u5B89\u5B9A\u95E8","Andingmen"],secondaryName:!1,num:"00",services:["local"],parents:["fdwp"],children:["56xk"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"56xk":{name:["\u96CD\u548C\u5BAB","Yonghegong\\(Lama Temple)"],secondaryName:!1,num:"00",services:["local"],parents:["etp0"],children:["768x"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj5","#AA0061","#fff","5\u53F7\u7EBF","Line 5"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"768x":{name:["\u4E1C\u76F4\u95E8","Dongzhimen"],secondaryName:!1,num:"00",services:["local"],parents:["56xk"],children:["lt41"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj13","#F4DA40","#fff","13\u53F7\u7EBF","Line 13"],["beijing","cae","#A192B2","#fff","\u9996\u90FD\u673A\u573A\u7EBF","Captial Airport Express"]],[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},lt41:{name:["\u4E1C\u56DB\u5341\u6761","Dongsi Shiti\u03B1o"],secondaryName:!1,num:"00",services:["local"],parents:["768x"],children:["iwf6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"8lip":{name:["\u5EFA\u56FD\u95E8","Ji\u03B1nguomen"],secondaryName:!1,num:"00",services:["local"],parents:["iwf6"],children:["9zfq"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj1","#A4343A","#fff","1\u53F7\u7EBF/\u516B\u901A\u7EBF","Line 1/Batong Line"]],[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"9zfq":{name:["\u5317\u4EAC\u7AD9","Beijing Zh\u03B1n\\(Beijing Railway Station)"],secondaryName:!1,num:"00",services:["local"],parents:["8lip"],children:["norf"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},norf:{name:["\u5D07\u6587\u95E8","Chongwenmen"],secondaryName:!1,num:"00",services:["local"],parents:["9zfq"],children:["1od5"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj5","#AA0061","#fff","5\u53F7\u7EBF","Line 5"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"1od5":{name:["\u524D\u95E8","Qi\u03B1nmen"],secondaryName:!1,num:"00",services:["local"],parents:["norf"],children:["na0v"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj8","#009B77","#fff","8\u53F7\u7EBF","Line 8"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},na0v:{name:["\u548C\u5E73\u95E8","Hepingmen"],secondaryName:!1,num:"00",services:["local"],parents:["1od5"],children:["ifws"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},ifws:{name:["\u5BA3\u6B66\u95E8","Xu\u03B1nwumen"],secondaryName:!1,num:"00",services:["local"],parents:["na0v"],children:["vcga"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj4","#008C95","#fff","4\u53F7\u7EBF/\u5927\u5174\u7EBF","Line 4/Daxing Line"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},vcga:{name:["\u957F\u693F\u8857","Ch\u03B1ngchun Jie"],secondaryName:!1,num:"00",services:["local"],parents:["ifws"],children:["y27r"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},y27r:{name:["\u590D\u5174\u95E8","Fuxingmen"],secondaryName:!1,num:"00",services:["local"],parents:["vcga"],children:["d41s"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj1","#A4343A","#fff","1\u53F7\u7EBF/\u516B\u901A\u7EBF","Line 1/Batong Line"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},d41s:{name:["\u961C\u6210\u95E8","Fuchengmen"],secondaryName:!1,num:"00",services:["local"],parents:["y27r"],children:["8p8j"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},"8p8j":{name:["\u8F66\u516C\u5E84","Chegongzhu\u03B1ng"],secondaryName:!1,num:"00",services:["local"],parents:["d41s"],children:["wcjm"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj6","#B58500","#fff","6\u53F7\u7EBF","Line 6"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1},wcjm:{name:["\u897F\u76F4\u95E8","Xizhimen"],secondaryName:!1,num:"00",services:["local"],parents:["8p8j"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[["beijing","bj4","#008C95","#fff","4\u53F7\u7EBF/\u5927\u5174\u7EBF","Line 4/Daxing Line"],["beijing","bj13","#F4DA40","#fff","13\u53F7\u7EBF","Line 13"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1}},t=["2\u53F7\u7EBF","Line 2"],o="1",c="TW",l="sh",f=50,p=70,_={isLegacy:!1,terminal:!1},m={destination:2e3,runin:2e3,railmap:2e3,indoor:2e3},d=[],h={isStagger:!0,isFlip:!1},g=[],u=!0,b={bank:!0,left_and_right_factor:1,bottom_factor:8},N={style:e,svg_height:500,padding:8.75,y_pc:40,branch_spacing:45,theme:i,direction:n,current_stn_idx:a,platform_num:r,stn_list:s,line_name:t,psd_num:o,line_num:c,info_panel_type:l,direction_gz_x:f,direction_gz_y:p,customiseMTRDest:_,svgWidth:m,notesGZMTR:d,namePosMTR:h,coline:g,loop:u,loop_info:b};export{k as branch_spacing,g as coline,a as current_stn_idx,_ as customiseMTRDest,N as default,n as direction,f as direction_gz_x,p as direction_gz_y,l as info_panel_type,t as line_name,c as line_num,u as loop,b as loop_info,h as namePosMTR,d as notesGZMTR,v as padding,r as platform_num,o as psd_num,s as stn_list,e as style,m as svgWidth,y as svg_height,i as theme,j as y_pc};