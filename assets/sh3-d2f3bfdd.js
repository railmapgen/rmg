const e="shmetro",N=500,a=8.750201061605276,i=40,n=53,r=["shanghai","sh3","#FFD100","#000"],t="l",s="lak6",o="",l={linestart:{parents:[],children:["9cyo","k9pi"],name:["路綫左端","LEFT END"],branch:{left:[],right:["through","k9pi"]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],num:"00",facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},lineend:{parents:["srpy","gjjd"],children:[],name:["路綫右端","RIGHT END"],branch:{left:["through","gjjd"],right:[]},transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],num:"00",facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},srpy:{parents:["x9gu"],children:["lineend"],branch:{left:[],right:[]},name:["上海南站","Shanghai South Railway Station"],num:"00",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["shanghai","sh1","#e4002b","#fff","1号线","Line 1"],["shanghai","sh15","#a4bcc2","#fff","15号线","Line 15"]],[],[["shanghai","pjl","#999999","#fff","金山铁路","Jingshan Railway"]]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1,one_line:!1,int_padding:180},x9gu:{parents:["k9k5"],children:["srpy"],branch:{left:[],right:[]},name:["石龙路","Shilong Road"],num:"00",transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},services:["local"],facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},k9k5:{parents:["j2kn"],children:["x9gu"],branch:{left:[],right:[]},name:["龙漕路","Longcao Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["shanghai","sh12","#007b5f","#fff","12号线","Line 12"]]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},j2kn:{parents:["lcgp"],children:["k9k5"],branch:{left:[],right:[]},name:["漕溪路","Caoxi Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},kaxg:{parents:["7x7k"],children:["wbtv"],branch:{left:[],right:[]},name:["金沙江路","Jinshajiang Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["shanghai","sh13","#EF95CF","#000","13号线","Line 13"]]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},sd6y:{parents:["lak6"],children:["2qe4"],branch:{left:[],right:[]},name:["上海火车站","Shanghai Railway Station"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[["車站名","Stn Name"]],info:[[["shanghai","sh4","#5f259f","#fff","4号线","Line 4"]],[["shanghai","sh1","#e4002b","#fff","1号线","Line 1"]]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!1,int_padding:180},"9cyo":{parents:["linestart"],children:["8hte"],branch:{left:[],right:[]},name:["江杨北路","North Jiangyang"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},hhar:{children:["qgae"],parents:["nhrh"],branch:{left:[],right:[]},name:["淞滨路","Songbin Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},jjh7:{children:["h3vs"],parents:["wbtv"],branch:{left:[],right:[]},name:["延安西路","West Yan'an Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},"7x7k":{children:["kaxg"],parents:["qnbj"],branch:{left:[],right:[]},name:["曹杨路","Caoyang Road"],num:"00",services:["local"],transfer:{tick_direc:"r",paid_area:!0,osi_names:[],info:[[["shanghai","sh11","#76232f","#fff","11号线","Line 11"]],[["shanghai","sh14","#827A04","#fff","14号线","Line 14"]]]},facility:"",secondaryName:!1,loop_pivot:!1,one_line:!0,int_padding:180},qnbj:{name:["镇坪路","Zhenping Road"],secondaryName:!1,num:"00",services:["local"],parents:["2qe4"],children:["7x7k"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh7","#FF6900","#000","7号线","Line 7"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"1fdr":{name:["大柏树","Dabaishu"],secondaryName:!1,num:"00",services:["local"],parents:["wai3"],children:["yrxe"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},lcgp:{name:["宜山路","Yishan Road"],secondaryName:!1,num:"00",services:["local"],parents:["h3vs"],children:["j2kn"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh4","#5f259f","#fff","4号线","Line 4"],["shanghai","sh9","#71c5e8","#000","9号线","Line 9"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},wbtv:{name:["中山公园","Zhongshan Park"],secondaryName:!1,num:"00",services:["local"],parents:["kaxg"],children:["jjh7"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh2","#97D700","#000","2号线","Line 2"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},wai3:{name:["江湾镇","Jiangwan Town"],secondaryName:!1,num:"00",services:["local"],parents:["naz0"],children:["1fdr"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},naz0:{name:["殷高西路","West Yingao Road"],secondaryName:!1,num:"00",services:["local"],parents:["y6id"],children:["wai3"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},y6id:{name:["长江南路","South Changjiang Road"],secondaryName:!1,num:"00",services:["local"],parents:["ekdv"],children:["naz0"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh18","#D6A461","#000","18号线","Line 18"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},exax:{name:["宝杨路","Baoyang Road"],secondaryName:!1,num:"00",services:["local"],parents:["yrlx"],children:["nhrh"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"8hte":{name:["铁力路","Tieli Road"],secondaryName:!1,num:"00",services:["local"],parents:["9cyo"],children:["yrlx"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},yrlx:{name:["友谊路","Youyi Road"],secondaryName:!1,num:"00",services:["local"],parents:["8hte"],children:["exax"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},nhrh:{name:["水产路","Shuichan Road"],secondaryName:!1,num:"00",services:["local"],parents:["exax"],children:["hhar"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},qgae:{name:["张华浜","Zhanghuabang"],secondaryName:!1,num:"00",services:["local"],parents:["hhar"],children:["ekdv"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},ekdv:{name:["淞发路","Songfa Road"],secondaryName:!1,num:"00",services:["local"],parents:["qgae"],children:["y6id"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},h3vs:{name:["虹桥路","Hongqiao Road"],secondaryName:!1,num:"00",services:["local"],parents:["jjh7"],children:["lcgp","cbfq"],branch:{left:[],right:["through","cbfq"]},transfer:{info:[[["shanghai","sh10","#C1A7E2","#000","10号线","Line 10"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},yrxe:{name:["赤峰路","Chifeng Road"],secondaryName:!1,num:"00",services:["local"],parents:["1fdr"],children:["l680"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},l680:{name:["虹口足球场","Hongkou Football Stadium"],secondaryName:!1,num:"00",services:["local"],parents:["yrxe"],children:["grdg"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh8","#00a3e0","#fff","8号线","Line 8"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:180},grdg:{name:["东宝兴路","Dongbaoxing Road"],secondaryName:!1,num:"00",services:["local"],parents:["l680"],children:["lak6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},lak6:{name:["宝山路","Baoshan Road"],secondaryName:!1,num:"00",services:["local"],parents:["grdg","xpbv"],children:["sd6y"],branch:{left:["through","xpbv"],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"2qe4":{name:["中潭路","Zhongtan Road"],secondaryName:!1,num:"00",services:["local"],parents:["sd6y"],children:["qnbj"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},xpbv:{name:["海伦路站","Hailun Road"],secondaryName:!1,num:"00",services:["local"],parents:["zyfy"],children:["lak6"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},cbfq:{name:["宜山路","Yishan Road"],secondaryName:!1,num:"00",services:["local"],parents:["h3vs"],children:["47f8"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},zyfy:{name:["临平路","Linping Road"],secondaryName:!1,num:"00",services:["local"],parents:["t6fw"],children:["xpbv"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},t6fw:{name:["大连路","Dalian Road"],secondaryName:!1,num:"00",services:["local"],parents:["i456"],children:["zyfy"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh12","#007b5f","#fff","12号线","Line 12"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},i456:{name:["杨树浦路","Yangshupu Road"],secondaryName:!1,num:"00",services:["local"],parents:["0bgm"],children:["t6fw"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"0bgm":{name:["浦东大道","Pudong Avenue"],secondaryName:!1,num:"00",services:["local"],parents:["y068"],children:["i456"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh14","#827A04","#fff","14号线","Line 14"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},y068:{name:["世纪大道","Century Avenue"],secondaryName:!1,num:"00",services:["local"],parents:["jbai"],children:["0bgm"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh2","#97D700","#000","2号线","Line 2"],["shanghai","sh6","#D9027D","#fff","6号线","Line 6"],["shanghai","sh9","#71c5e8","#000","9号线","Line 9"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:180},jbai:{name:["浦电路","Pudian Road"],secondaryName:!1,num:"00",services:["local"],parents:["cl8d"],children:["y068"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},cl8d:{name:["蓝村路","Lancun Road"],secondaryName:!1,num:"00",services:["local"],parents:["d3t3"],children:["jbai"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh6","#D9027D","#fff","6号线","Line 6"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},d3t3:{name:["塘桥","Tangqiao"],secondaryName:!1,num:"00",services:["local"],parents:["i4vg"],children:["cl8d"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},i4vg:{name:["南浦大桥","Nanpu Bridge"],secondaryName:!1,num:"00",services:["local"],parents:["142p"],children:["d3t3"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"142p":{name:["西藏南路","South Xizang Road"],secondaryName:!1,num:"00",services:["local"],parents:["l7r5"],children:["i4vg"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh8","#00a3e0","#fff","8号线","Line 8"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},l7r5:{name:["鲁班路","Luban Road"],secondaryName:!1,num:"00",services:["local"],parents:["k9pi"],children:["142p"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},k9pi:{name:["大木桥路","Damuqiao Road"],secondaryName:!1,num:"00",services:["local"],parents:["linestart"],children:["l7r5"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh12","#007b5f","#fff","12号线","Line 12"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},"47f8":{name:["上海体育馆","Shanghai Indoor Stadium"],secondaryName:!1,num:"00",services:["local"],parents:["cbfq"],children:["a8eo"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh1","#e4002b","#fff","1号线","Line 1"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!1,int_padding:180},a8eo:{name:["上海体育场","Shanghai Stadium"],secondaryName:!1,num:"00",services:["local"],parents:["47f8"],children:["gjjd"],branch:{left:[],right:[]},transfer:{info:[[]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180},gjjd:{name:["东安路站","Dong'an Road"],secondaryName:!1,num:"00",services:["local"],parents:["a8eo"],children:["lineend"],branch:{left:[],right:[]},transfer:{info:[[["shanghai","sh7","#FF6900","#000","7号线","Line 7"]]],tick_direc:"r",paid_area:!0,osi_names:[]},facility:"",loop_pivot:!1,one_line:!0,int_padding:180}},c=["3号线","Line 3"],f="1",d="01",_="sh",h=50,p=70,m={isLegacy:!1,terminal:!1},g={destination:1600,runin:1200,railmap:3e3,indoor:3e3},u=[],y={isStagger:!0,isFlip:!1},v={hLJQ:{from:"lak6",to:"h3vs",colors:[["shanghai","sh4","#5F259F","#fff","4号线","Line 4"]],display:!0},yzn6:{from:"k9pi",to:"lak6",colors:[["shanghai","sh4","#5F259F","#fff","4号线","Line 4"]],display:!0},senz:{from:"h3vs",to:"gjjd",colors:[["shanghai","sh4","#5F259F","#fff","4号线","Line 4"]],display:!0}},b=!1,k={bank:!0,left_and_right_factor:0,bottom_factor:1},R={style:e,svg_height:500,padding:a,y_pc:i,branch_spacing:n,theme:r,direction:t,current_stn_idx:s,platform_num:o,stn_list:l,line_name:c,psd_num:f,line_num:d,info_panel_type:_,direction_gz_x:h,direction_gz_y:p,customiseMTRDest:m,svgWidth:g,notesGZMTR:u,namePosMTR:y,coline:v,loop:b,loop_info:k};export{n as branch_spacing,v as coline,s as current_stn_idx,m as customiseMTRDest,R as default,t as direction,h as direction_gz_x,p as direction_gz_y,_ as info_panel_type,c as line_name,d as line_num,b as loop,k as loop_info,y as namePosMTR,u as notesGZMTR,a as padding,o as platform_num,f as psd_num,l as stn_list,e as style,g as svgWidth,N as svg_height,r as theme,i as y_pc};