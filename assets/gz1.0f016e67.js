const n="gzmtr",p=300,m=1150,f=1150,d=!0,y=5,b=40,z=90,e=44.44444444444444,t=["guangzhou","gz1","#F3D03E","#000"],a="r",h="l9io",i="3",r=15,c=!0,g={linestart:{parents:[],children:["l1mz"],name:["\u8DEF\u7DAB\u5DE6\u7AEF","LEFT END"],change_type:"none",branch:{left:[],right:[]}},lineend:{parents:["iwf6"],children:[],name:["\u8DEF\u7DAB\u53F3\u7AEF","RIGHT END"],change_type:"none",branch:{left:[],right:[]}},l1mz:{parents:["linestart"],children:["ndua"],name:["\u897F\u5871","Xilang"],change_type:"int2",interchange:[[["guangzhou","gfl","#C4D600","#fff","\u5E7F\u4F5B\u7EBF","Guangfo Line"]]],branch:{left:[],right:[]},num:"01"},iwf6:{children:["lineend"],parents:["57ve"],name:["\u5E7F\u5DDE\u4E1C\u7AD9","Guangzhou East\\Railway Station"],change_type:"int2",interchange:[[["guangzhou","gz3","#ECA154","#000","3\u53F7\u7EBF","Line 3"]]],branch:{left:[],right:[]},num:"16"},"57ve":{parents:["d2ch"],children:["iwf6"],name:["\u4F53\u80B2\u4E2D\u5FC3","Tianhe Sport Center"],change_type:"none",branch:{left:[],right:[]},num:"15"},d2ch:{parents:["rq4h"],children:["57ve"],name:["\u4F53\u80B2\u897F\u8DEF","Tiyu Xilu"],change_type:"int2",interchange:[[["guangzhou","gz3","#ECA154","#000","3\u53F7\u7EBF","Line 3"]]],branch:{left:[],right:[]},num:"14"},rq4h:{parents:["n1ni"],children:["d2ch"],name:["\u6768\u7B95","Yangji"],change_type:"int2",interchange:[[["guangzhou","gz5","#C5003E","#fff","5\u53F7\u7EBF","Line 5"]]],branch:{left:[],right:[]},num:"13"},n1ni:{parents:["7kvg"],children:["rq4h"],name:["\u4E1C\u5C71\u53E3","Dongshankou"],change_type:"int2",interchange:[[["guangzhou","gz6","#80225F","#fff","6\u53F7\u7EBF","Line 6"]]],branch:{left:[],right:[]},num:"12"},"7kvg":{parents:["5o5y"],children:["n1ni"],name:["\u70C8\u58EB\u9675\u56ED","Martyrs' Park"],change_type:"none",branch:{left:[],right:[]},num:"11"},l9io:{parents:["2ifb"],children:["5o5y"],name:["\u516C\u56ED\u524D","Gongyuanqian"],change_type:"int2",interchange:[[["guangzhou","gz2","#00629B","#fff","2\u53F7\u7EBF","Line 2"]]],branch:{left:[],right:[]},num:"09"},"2ifb":{parents:["lcjl"],children:["l9io"],name:["\u897F\u95E8\u53E3","Ximenkou"],change_type:"none",branch:{left:[],right:[]},num:"08"},lcjl:{parents:["fbpn"],children:["2ifb"],name:["\u9648\u5BB6\u7960","Chen Clan Academy"],change_type:"int2",interchange:[[["guangzhou","gz8","#008C95","#fff","8\u53F7\u7EBF","Line 8"]]],branch:{left:[],right:[]},num:"07"},fbpn:{parents:["mclm"],children:["lcjl"],name:["\u957F\u5BFF\u8DEF","Changshou Lu"],change_type:"none",branch:{left:[],right:[]},num:"06"},mclm:{parents:["lx10"],children:["fbpn"],name:["\u9EC4\u6C99","Huangsha"],change_type:"int2",interchange:[[["guangzhou","gz6","#80225F","#fff","6\u53F7\u7EBF","Line 6"]]],branch:{left:[],right:[]},num:"05"},lx10:{parents:["yz8y"],children:["mclm"],name:["\u82B3\u6751","Fangcun"],change_type:"none",branch:{left:[],right:[]},num:"04"},yz8y:{parents:["ndua"],children:["lx10"],name:["\u82B1\u5730\u6E7E","Huadiwan"],change_type:"none",branch:{left:[],right:[]},num:"03"},ndua:{parents:["l1mz"],children:["yz8y"],name:["\u5751\u53E3","Kengkou"],change_type:"none",branch:{left:[],right:[]},num:"02"},"5o5y":{parents:["l9io"],children:["7kvg"],name:["\u519C\u8BB2\u6240","Peasant Movement\\Institute"],change_type:"none",branch:{left:[],right:[]},num:"10"}},s=["1\u53F7\u7EBF","Line 1"],l=!1,o="cn",u=1,_=1,v={style:n,svg_height:300,svg_width:1150,svg_dest_width:1150,show_outer:!0,padding:5,y_pc:40,strip_pc:90,branch_spacing:e,theme:t,direction:a,current_stn_idx:h,platform_num:i,txt_bg_gap:r,txt_flip:c,stn_list:g,line_name:s,dest_legacy:l,char_form:o,psd_num:u,line_num:_};export{e as branch_spacing,o as char_form,h as current_stn_idx,v as default,l as dest_legacy,a as direction,s as line_name,_ as line_num,y as padding,i as platform_num,u as psd_num,d as show_outer,g as stn_list,z as strip_pc,n as style,f as svg_dest_width,p as svg_height,m as svg_width,t as theme,r as txt_bg_gap,c as txt_flip,b as y_pc};