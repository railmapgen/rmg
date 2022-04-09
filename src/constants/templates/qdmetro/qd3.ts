const params = {
    "style": "gzmtr",
    "svg_height": 311,
    "padding": 3.37,
    "y_pc": 47.22,
    "branch_spacing": 40.67,
    "theme": [
        "qingdao",
        "qd3",
        "#0057B7",
        "#fff"
    ],
    "direction": "l",
    "current_stn_idx": "6rgu",
    "platform_num": "3",
    "stn_list": {
        "linestart": {
            "parents": [],
            "children": [
                "ny2q"
            ],
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
        "lineend": {
            "parents": [
                "6rgu"
            ],
            "children": [],
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
            "num": "23",
            "secondaryName": false
        },
        "l1mz": {
            "parents": [
                "iwf6"
            ],
            "children": [
                "lyqw"
            ],
            "name": [
                "敦化路",
                "Dunhua Road"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "num": "10",
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
                "0gcd"
            ],
            "name": [
                "宁夏路",
                "Ningxia Road"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "num": "09",
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    [
                        [
                            "qingdao",
                            "qd5",
                            "#981E97",
                            "#fff",
                            "5号线",
                            "Line 5"
                        ]
                    ]
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "secondaryName": false
        },
        "ei9t": {
            "parents": [
                "qbbb"
            ],
            "children": [
                "ov9v"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "万年泉路",
                "Wannianquan Road"
            ],
            "num": "17",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    []
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "qbbb": {
            "parents": [
                "tgp4"
            ],
            "children": [
                "ei9t"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "海尔路",
                "Hai'er Road"
            ],
            "num": "16",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    []
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "tgp4": {
            "parents": [
                "su3g"
            ],
            "children": [
                "qbbb"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "地铁大厦",
                "Metro Building"
            ],
            "num": "15",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd5",
                            "#981E97",
                            "#fff",
                            "5号线",
                            "Line 5"
                        ]
                    ]
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "su3g": {
            "parents": [
                "dre1"
            ],
            "children": [
                "tgp4"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "长沙路",
                "Changsha Road"
            ],
            "num": "14",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    []
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "dre1": {
            "parents": [
                "9v64"
            ],
            "children": [
                "su3g"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "双山",
                "Shuangshan"
            ],
            "num": "13",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    []
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "9v64": {
            "parents": [
                "lyqw"
            ],
            "children": [
                "dre1"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "清江路",
                "Qingjiang Road"
            ],
            "num": "12",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    []
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "lyqw": {
            "parents": [
                "l1mz"
            ],
            "children": [
                "9v64"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "name": [
                "错埠岭",
                "Cuobuling"
            ],
            "num": "11",
            "services": [
                "local"
            ],
            "facility": "",
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd4",
                            "#007A33",
                            "#fff",
                            "4号线",
                            "Line 4"
                        ]
                    ]
                ],
                "osi_names": [],
                "paid_area": true,
                "tick_direc": "r"
            },
            "secondaryName": false
        },
        "0gcd": {
            "name": [
                "江西路",
                "Jiangxi Road"
            ],
            "secondaryName": false,
            "num": "08",
            "services": [
                "local"
            ],
            "parents": [
                "svlx"
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
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "svlx": {
            "name": [
                "五四广场",
                "May 4th Square"
            ],
            "secondaryName": false,
            "num": "07",
            "services": [
                "local"
            ],
            "parents": [
                "s08h"
            ],
            "children": [
                "0gcd"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd2",
                            "#AF272F",
                            "#fff",
                            "2号线",
                            "Line 2"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "s08h": {
            "name": [
                "延安三路",
                "Yan'an 3rd Road"
            ],
            "secondaryName": false,
            "num": "06",
            "services": [
                "local"
            ],
            "parents": [
                "ojvh"
            ],
            "children": [
                "svlx"
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
        "ojvh": {
            "name": [
                "太平角公园",
                "Taipingjiao Park"
            ],
            "secondaryName": false,
            "num": "05",
            "services": [
                "local"
            ],
            "parents": [
                "naqs"
            ],
            "children": [
                "s08h"
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
        "naqs": {
            "name": [
                "中山公园",
                "Zhongshan Park"
            ],
            "secondaryName": false,
            "num": "04",
            "services": [
                "local"
            ],
            "parents": [
                "epll"
            ],
            "children": [
                "ojvh"
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
        "epll": {
            "name": [
                "汇泉广场",
                "Huiquan Square"
            ],
            "secondaryName": false,
            "num": "03",
            "services": [
                "local"
            ],
            "parents": [
                "9uzg"
            ],
            "children": [
                "naqs"
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
        "9uzg": {
            "name": [
                "人民会堂",
                "Hall of the People"
            ],
            "secondaryName": false,
            "num": "02",
            "services": [
                "local"
            ],
            "parents": [
                "ny2q"
            ],
            "children": [
                "epll"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd4",
                            "#007A33",
                            "#fff",
                            "4号线",
                            "Line 4"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "ny2q": {
            "name": [
                "青岛站",
                "Qingdao Railway Station"
            ],
            "secondaryName": false,
            "num": "01",
            "services": [
                "local"
            ],
            "parents": [
                "linestart"
            ],
            "children": [
                "9uzg"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd1",
                            "#EAAA00",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": "hsr"
        },
        "6rgu": {
            "name": [
                "青岛北站",
                "Qingdao North Railway Station"
            ],
            "secondaryName": false,
            "num": "22",
            "services": [
                "local"
            ],
            "parents": [
                "ezmz"
            ],
            "children": [
                "lineend"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd1",
                            "#EAAA00",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ],
                        [
                            "qingdao",
                            "qd8",
                            "#DF1995",
                            "#fff",
                            "8号线",
                            "Line 8"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": "hsr"
        },
        "ezmz": {
            "name": [
                "永平路",
                "Yongping Road"
            ],
            "secondaryName": false,
            "num": "21",
            "services": [
                "local"
            ],
            "parents": [
                "6ti2"
            ],
            "children": [
                "6rgu"
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
        "6ti2": {
            "name": [
                "振华路",
                "Zhenhua Road"
            ],
            "secondaryName": false,
            "num": "20",
            "services": [
                "local"
            ],
            "parents": [
                "l6b8"
            ],
            "children": [
                "ezmz"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd7",
                            "#AD96DC",
                            "#fff",
                            "7号线",
                            "Line 7"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "l6b8": {
            "name": [
                "君峰路",
                "Junfeng Road"
            ],
            "secondaryName": false,
            "num": "19",
            "services": [
                "local"
            ],
            "parents": [
                "ov9v"
            ],
            "children": [
                "6ti2"
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
        "ov9v": {
            "name": [
                "李村",
                "Licun"
            ],
            "secondaryName": false,
            "num": "18",
            "services": [
                "local"
            ],
            "parents": [
                "ei9t"
            ],
            "children": [
                "l6b8"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "qingdao",
                            "qd2",
                            "#AF272F",
                            "#fff",
                            "2号线",
                            "Line 2"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        }
    },
    "line_name": [
        "3号线",
        "Line 3"
    ],
    "psd_num": "11",
    "line_num": "3",
    "info_panel_type": "gz1421",
    "direction_gz_x": 21.28,
    "direction_gz_y": 79.02,
    "customiseMTRDest": {
        "isLegacy": false,
        "terminal": false
    },
    "svgWidth": {
        "destination": 1000,
        "runin": 1023,
        "railmap": 1510,
        "indoor": 1000
    },
    "notesGZMTR": [
        [
            "四号线、五号线、七号线尚未开通。",
            "Line 4, Line 5 and Line 7 are under construction.",
            50,
            79.5,
            true
        ]
    ],
    "namePosMTR": {
        "isStagger": true,
        "isFlip": false
    }
};

export default params;
