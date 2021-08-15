const params = {
    "svg_height": 400,
    "padding": 8.750201061605276,
    "y_pc": 40,
    "branch_spacing": 45,
    "theme": [
        "shanghai",
        "sh7",
        "#FF6900",
        "#000"
    ],
    "direction": "r",
    "current_stn_idx": "wyk2",
    "platform_num": false,
    "stn_list": {
        "linestart": {
            "parents": [],
            "children": [
                "l1mz"
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
                "iwf6"
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
            "num": "00",
            "secondaryName": false
        },
        "l1mz": {
            "parents": [
                "linestart"
            ],
            "children": [
                "5qhf"
            ],
            "name": [
                "美兰湖",
                "Meilan Lake"
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
        "iwf6": {
            "children": [
                "lineend"
            ],
            "parents": [
                "3jml"
            ],
            "name": [
                "花木路",
                "Huamu Road"
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
        "qg34": {
            "name": [
                "芳华路",
                "Fanghua Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "vifb"
            ],
            "children": [
                "3jml"
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
        "3jml": {
            "name": [
                "龙阳路",
                "Longyang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "qg34"
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
                            "shanghai",
                            "sh18",
                            "#D6A461",
                            "#000",
                            "18号线",
                            "Line 18"
                        ],
                        [
                            "shanghai",
                            "sh16",
                            "#2CD5C4",
                            "#000",
                            "16号线",
                            "Line 16"
                        ],
                        [
                            "shanghai",
                            "sh2",
                            "#97D700",
                            "#000",
                            "2号线",
                            "Line 2"
                        ]
                    ],
                    [
                        [
                            "shanghai",
                            "maglev",
                            "#009090",
                            "#fff",
                            "磁浮",
                            "Maglev"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "vifb": {
            "name": [
                "锦绣路",
                "Jinxiu Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "a9xr"
            ],
            "children": [
                "qg34"
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
        "a9xr": {
            "name": [
                "杨高南路",
                "South Yanggao Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "mrhv"
            ],
            "children": [
                "vifb"
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
        "mrhv": {
            "name": [
                "高科西路",
                "West Gaoke Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "vhwl"
            ],
            "children": [
                "a9xr"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh6",
                            "#D9027D",
                            "#fff",
                            "6号线",
                            "Line 6"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "vhwl": {
            "name": [
                "云台路",
                "Yuntai Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "zv8o"
            ],
            "children": [
                "mrhv"
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
        "zv8o": {
            "name": [
                "耀华路",
                "Yaohua Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "gwtu"
            ],
            "children": [
                "vhwl"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh8",
                            "#00A3E0",
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
            "facility": ""
        },
        "gwtu": {
            "name": [
                "长清路",
                "Changqing Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "b2hj"
            ],
            "children": [
                "zv8o"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [],
                    [
                        [
                            "other",
                            "other",
                            "#EF95CF",
                            "#000",
                            "13号线",
                            "Line"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "b2hj": {
            "name": [
                "后滩",
                "Houtan"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "yec8"
            ],
            "children": [
                "gwtu"
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
        "yec8": {
            "name": [
                "龙华中路",
                "Middle Longhua Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "v44x"
            ],
            "children": [
                "b2hj"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh12",
                            "#007B5F",
                            "#fff",
                            "12号线",
                            "Line 12"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "v44x": {
            "name": [
                "东安路",
                "Dong'an Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "g9l3"
            ],
            "children": [
                "yec8"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh4",
                            "#5F259F",
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
        "g9l3": {
            "name": [
                "肇嘉浜路",
                "Zhaojiabang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "wyk2"
            ],
            "children": [
                "v44x"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh9",
                            "#71C5E8",
                            "#000",
                            "9号线",
                            "Line 9"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "wyk2": {
            "name": [
                "常熟路",
                "Changshu Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "oua9"
            ],
            "children": [
                "g9l3"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh1",
                            "#E4002B",
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
            "facility": ""
        },
        "oua9": {
            "name": [
                "静安寺",
                "Jing'an Temple"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "9lmq"
            ],
            "children": [
                "wyk2"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh14",
                            "#827A04",
                            "#fff",
                            "14号线",
                            "Line 14"
                        ],
                        [
                            "shanghai",
                            "sh2",
                            "#97D700",
                            "#000",
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
        "9lmq": {
            "name": [
                "昌平路",
                "Changping Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "48po"
            ],
            "children": [
                "oua9"
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
        "48po": {
            "name": [
                "长寿路",
                "Changshou Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "16qe"
            ],
            "children": [
                "9lmq"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "other",
                            "other",
                            "#EF95CF",
                            "#000",
                            "13号线",
                            "Line 13"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "16qe": {
            "name": [
                "镇坪路",
                "Zhenping Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "zqho"
            ],
            "children": [
                "48po"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh4",
                            "#5F259F",
                            "#fff",
                            "4号线",
                            "Line 4"
                        ],
                        [
                            "shanghai",
                            "sh3",
                            "#FFD100",
                            "#000",
                            "3号线",
                            "Line 3"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "zqho": {
            "name": [
                "岚皋路",
                "Lan'gao Road "
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "2i8c"
            ],
            "children": [
                "16qe"
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
        "2i8c": {
            "name": [
                "新村路",
                "Xincun Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "ltqr"
            ],
            "children": [
                "zqho"
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
        "ltqr": {
            "name": [
                "大华三路",
                "Dahuasan Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "3j1w"
            ],
            "children": [
                "2i8c"
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
        "3j1w": {
            "name": [
                "行知路",
                "Xingzhi Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "epvt"
            ],
            "children": [
                "ltqr"
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
        "epvt": {
            "name": [
                "大场镇",
                "Dachang Town"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "mb4g"
            ],
            "children": [
                "3j1w"
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
        "mb4g": {
            "name": [
                "场中路",
                "Changzhong Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "26gh"
            ],
            "children": [
                "epvt"
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
        "26gh": {
            "name": [
                "上大路",
                "Shangda Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "96rp"
            ],
            "children": [
                "mb4g"
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
        "96rp": {
            "name": [
                "南陈路",
                "Nanchen Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "j0f3"
            ],
            "children": [
                "26gh"
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
        "j0f3": {
            "name": [
                "上海大学",
                "Shanghai University"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "ljq6"
            ],
            "children": [
                "96rp"
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
        "ljq6": {
            "name": [
                "祁华路",
                "Qihua Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "g7x1"
            ],
            "children": [
                "j0f3"
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
        "g7x1": {
            "name": [
                "顾村公园",
                "Gucun Park"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "6iy3"
            ],
            "children": [
                "ljq6"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "transfer": {
                "info": [
                    [
                        [
                            "shanghai",
                            "sh15",
                            "#BBA786",
                            "#000",
                            "15号线",
                            "Line 15"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "6iy3": {
            "name": [
                "刘行",
                "Liuhang"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "qfyk"
            ],
            "children": [
                "g7x1"
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
        "qfyk": {
            "name": [
                "潘广路",
                "Panguang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "5qhf"
            ],
            "children": [
                "6iy3"
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
        "5qhf": {
            "name": [
                "罗南新村",
                "Luonan Xincun"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "l1mz"
            ],
            "children": [
                "qfyk"
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
        "7号线",
        "Line7"
    ],
    "psd_num": "1",
    "line_num": "TW",
    "info_panel_type": "sh",
    "direction_gz_x": 50,
    "direction_gz_y": 70,
    "customiseMTRDest": {
        "isLegacy": false,
        "terminal": false
    },
    "svgWidth": {
        "destination": 1500,
        "runin": 1500,
        "railmap": 2000,
        "indoor": 2500,
    },
    "notesGZMTR": [],
    "namePosMTR": {
        "isStagger": true,
        "isFlip": false
    }
}

export default params;