const params = {
    "style": "mtr",
    "svg_height": 350,
    "padding": 5.06,
    "y_pc": 40,
    "branch_spacing": 45,
    "theme": [
        "toronto",
        "l1",
        "#F8C300",
        "#000"
    ],
    "direction": "l",
    "current_stn_idx": "l1mz",
    "platform_num": "2",
    "stn_list": {
        "linestart": {
            "parents": [],
            "children": [
                "size"
            ],
            "name": [
                "路綫右端",
                "RIGHT END"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    []
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "num": "39",
            "secondaryName": false
        },
        "lineend": {
            "parents": [
                "l1mz"
            ],
            "children": [],
            "name": [
                "路綫左端",
                "LEFT END"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    []
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "num": "00",
            "secondaryName": false
        },
        "l1mz": {
            "parents": [
                "iwf6"
            ],
            "children": [
                "lineend"
            ],
            "name": [
                "芬治",
                "Finch"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "num": "01",
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    []
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "secondaryName": false
        },
        "iwf6": {
            "children": [
                "l1mz"
            ],
            "parents": [
                "dpfk"
            ],
            "name": [
                "北约克中心",
                "North York Centre"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "num": "02",
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    []
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "secondaryName": false
        },
        "dpfk": {
            "name": [
                "雪柏－央街",
                "Sheppard-Yonge"
            ],
            "secondaryName": false,
            "num": "03",
            "services": [
                "local"
            ],
            "parents": [
                "bxd9"
            ],
            "children": [
                "iwf6"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "toronto",
                            "l4",
                            "#A21A68",
                            "#fff",
                            "4 雪柏线",
                            "Line 4\\Sheppard"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "bxd9": {
            "name": [
                "约妙斯",
                "York Mills"
            ],
            "secondaryName": false,
            "num": "04",
            "services": [
                "local"
            ],
            "parents": [
                "o0sv"
            ],
            "children": [
                "dpfk"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "o0sv": {
            "name": [
                "罗伦斯",
                "Lawrence"
            ],
            "secondaryName": false,
            "num": "05",
            "services": [
                "local"
            ],
            "parents": [
                "t03n"
            ],
            "children": [
                "bxd9"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "t03n": {
            "name": [
                "艾灵顿",
                "Eglinton"
            ],
            "secondaryName": false,
            "num": "06",
            "services": [
                "local"
            ],
            "parents": [
                "960q"
            ],
            "children": [
                "o0sv"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "960q": {
            "name": [
                "爹核士威老",
                "Davisville"
            ],
            "secondaryName": false,
            "num": "07",
            "services": [
                "local"
            ],
            "parents": [
                "zord"
            ],
            "children": [
                "t03n"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "zord": {
            "name": [
                "圣卡拉",
                "St. Clair"
            ],
            "secondaryName": false,
            "num": "08",
            "services": [
                "local"
            ],
            "parents": [
                "94qb"
            ],
            "children": [
                "960q"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "94qb": {
            "name": [
                "夏山",
                "Summerhill"
            ],
            "secondaryName": false,
            "num": "09",
            "services": [
                "local"
            ],
            "parents": [
                "zwg9"
            ],
            "children": [
                "zord"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "zwg9": {
            "name": [
                "玫瑰谷",
                "Rosedale"
            ],
            "secondaryName": false,
            "num": "10",
            "services": [
                "local"
            ],
            "parents": [
                "6pxn"
            ],
            "children": [
                "94qb"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "6pxn": {
            "name": [
                "布鲁亚－央街",
                "Bloor-Yonge"
            ],
            "secondaryName": false,
            "num": "11",
            "services": [
                "local"
            ],
            "parents": [
                "j2ym"
            ],
            "children": [
                "zwg9"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "toronto",
                            "l2",
                            "#00923F",
                            "#fff",
                            "2 布鲁亚－丹佛线",
                            "Line 2\\Bloor-Danforth"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "j2ym": {
            "name": [
                "韦斯里",
                "Wellesley"
            ],
            "secondaryName": false,
            "num": "12",
            "services": [
                "local"
            ],
            "parents": [
                "duql"
            ],
            "children": [
                "6pxn"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "duql": {
            "name": [
                "书院",
                "College"
            ],
            "secondaryName": false,
            "num": "13",
            "services": [
                "local"
            ],
            "parents": [
                "pprm"
            ],
            "children": [
                "j2ym"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "pprm": {
            "name": [
                "登打士",
                "Dundas"
            ],
            "secondaryName": false,
            "num": "14",
            "services": [
                "local"
            ],
            "parents": [
                "at32"
            ],
            "children": [
                "duql"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "at32": {
            "name": [
                "皇后",
                "Queen"
            ],
            "secondaryName": false,
            "num": "15",
            "services": [
                "local"
            ],
            "parents": [
                "6z6u"
            ],
            "children": [
                "pprm"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "6z6u": {
            "name": [
                "皇帝",
                "King"
            ],
            "secondaryName": false,
            "num": "16",
            "services": [
                "local"
            ],
            "parents": [
                "bqd8"
            ],
            "children": [
                "at32"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "bqd8": {
            "name": [
                "联合车站",
                "Union"
            ],
            "secondaryName": false,
            "num": "17",
            "services": [
                "local"
            ],
            "parents": [
                "60p4"
            ],
            "children": [
                "6z6u"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "60p4": {
            "name": [
                "圣安德鲁",
                "St. Andrew"
            ],
            "secondaryName": false,
            "num": "18",
            "services": [
                "local"
            ],
            "parents": [
                "ryfl"
            ],
            "children": [
                "bqd8"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "ryfl": {
            "name": [
                "奥斯古",
                "Osgoode"
            ],
            "secondaryName": false,
            "num": "19",
            "services": [
                "local"
            ],
            "parents": [
                "fl8n"
            ],
            "children": [
                "60p4"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "fl8n": {
            "name": [
                "圣柏德烈",
                "St. Patrick"
            ],
            "secondaryName": false,
            "num": "20",
            "services": [
                "local"
            ],
            "parents": [
                "aedu"
            ],
            "children": [
                "ryfl"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "aedu": {
            "name": [
                "皇后公园",
                "Queen's Park"
            ],
            "secondaryName": false,
            "num": "21",
            "services": [
                "local"
            ],
            "parents": [
                "sqse"
            ],
            "children": [
                "fl8n"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "sqse": {
            "name": [
                "博物馆",
                "Museum"
            ],
            "secondaryName": false,
            "num": "22",
            "services": [
                "local"
            ],
            "parents": [
                "gdg8"
            ],
            "children": [
                "aedu"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "gdg8": {
            "name": [
                "圣乔治",
                "St. George"
            ],
            "secondaryName": false,
            "num": "23",
            "services": [
                "local"
            ],
            "parents": [
                "mp0g"
            ],
            "children": [
                "sqse"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "toronto",
                            "l2",
                            "#00923F",
                            "#fff",
                            "2 布鲁亚－丹佛线",
                            "Line 2\\Bloor-Danforth"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "mp0g": {
            "name": [
                "士巴丹拿",
                "Spadina"
            ],
            "secondaryName": false,
            "num": "24",
            "services": [
                "local"
            ],
            "parents": [
                "dyou"
            ],
            "children": [
                "gdg8"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "toronto",
                            "l2",
                            "#00923F",
                            "#fff",
                            "2 布鲁亚－丹佛线",
                            "Line 2\\Bloor-Danforth"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "dyou": {
            "name": [
                "杜邦",
                "Dupont"
            ],
            "secondaryName": false,
            "num": "25",
            "services": [
                "local"
            ],
            "parents": [
                "9pk5"
            ],
            "children": [
                "mp0g"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "9pk5": {
            "name": [
                "圣卡拉西",
                "St. Clair West"
            ],
            "secondaryName": false,
            "num": "26",
            "services": [
                "local"
            ],
            "parents": [
                "z1r6"
            ],
            "children": [
                "dyou"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "z1r6": {
            "name": [
                "艾灵顿西",
                "Eglinton West"
            ],
            "secondaryName": false,
            "num": "27",
            "services": [
                "local"
            ],
            "parents": [
                "k333"
            ],
            "children": [
                "9pk5"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "k333": {
            "name": [
                "己连坚",
                "Glencairn"
            ],
            "secondaryName": false,
            "num": "28",
            "services": [
                "local"
            ],
            "parents": [
                "lhrn"
            ],
            "children": [
                "z1r6"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "lhrn": {
            "name": [
                "罗伦斯西",
                "Lawrence West"
            ],
            "secondaryName": false,
            "num": "29",
            "services": [
                "local"
            ],
            "parents": [
                "723z"
            ],
            "children": [
                "k333"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "723z": {
            "name": [
                "约克戴尔",
                "Yorkdale"
            ],
            "secondaryName": false,
            "num": "30",
            "services": [
                "local"
            ],
            "parents": [
                "2mi2"
            ],
            "children": [
                "lhrn"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "2mi2": {
            "name": [
                "卫信",
                "Wilson"
            ],
            "secondaryName": false,
            "num": "31",
            "services": [
                "local"
            ],
            "parents": [
                "l01e"
            ],
            "children": [
                "723z"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "l01e": {
            "name": [
                "雪柏西",
                "Unnamed l01e"
            ],
            "secondaryName": false,
            "num": "32",
            "services": [
                "local"
            ],
            "parents": [
                "ujtf"
            ],
            "children": [
                "2mi2"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "ujtf": {
            "name": [
                "登士维公园",
                "Downsview Park"
            ],
            "secondaryName": false,
            "num": "33",
            "services": [
                "local"
            ],
            "parents": [
                "t5jq"
            ],
            "children": [
                "l01e"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "t5jq": {
            "name": [
                "芬治西",
                "Finch West"
            ],
            "secondaryName": false,
            "num": "34",
            "services": [
                "local"
            ],
            "parents": [
                "pcws"
            ],
            "children": [
                "ujtf"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "pcws": {
            "name": [
                "约克大学",
                "York University"
            ],
            "secondaryName": false,
            "num": "35",
            "services": [
                "local"
            ],
            "parents": [
                "epdl"
            ],
            "children": [
                "t5jq"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "epdl": {
            "name": [
                "先锋村",
                "Pioneer Village"
            ],
            "secondaryName": false,
            "num": "36",
            "services": [
                "local"
            ],
            "parents": [
                "4xlk"
            ],
            "children": [
                "pcws"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "4xlk": {
            "name": [
                "407号公路",
                "Highway 407"
            ],
            "secondaryName": false,
            "num": "37",
            "services": [
                "local"
            ],
            "parents": [
                "size"
            ],
            "children": [
                "epdl"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "size": {
            "name": [
                "旺市都会中心",
                "Vaughan Metropolitan Centre"
            ],
            "secondaryName": false,
            "num": "38",
            "services": [
                "local"
            ],
            "parents": [
                "linestart"
            ],
            "children": [
                "4xlk"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        }
    },
    "line_name": [
        "1 央街－大学线",
        "Line 1\\Yonge-University"
    ],
    "psd_num": "1",
    "line_num": "1",
    "info_panel_type": "gz28",
    "direction_gz_x": 50,
    "direction_gz_y": 70,
    "customiseMTRDest": {
        "isLegacy": false,
        "terminal": false
    },
    "svgWidth": {
        "destination": 1500,
        "runin": 1500,
        "railmap": 3000,
        "indoor": 4000
    },
    "notesGZMTR": [],
    "namePosMTR": {
        "isStagger": true,
        "isFlip": false
    }
};

export default params;
