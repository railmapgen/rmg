const params = {
    "svg_height": 340,
    "padding": 2.42,
    "y_pc": 44.12,
    "branch_spacing": 45,
    "theme": [
        "other",
        "other",
        "#D28F00",
        "#fff"
    ],
    "direction": "r",
    "current_stn_idx": "iwf6",
    "platform_num": "2",
    "stn_list": {
        "linestart": {
            "parents": [],
            "children": [
                "iwf6"
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
            "num": "00",
            "secondaryName": false
        },
        "lineend": {
            "parents": [
                "izko"
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
            "num": "41",
            "secondaryName": false
        },
        "iwf6": {
            "children": [
                "em5m"
            ],
            "parents": [
                "linestart"
            ],
            "name": [
                "贾河",
                "Jia He"
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
        "em5m": {
            "name": [
                "惠济区政府",
                "Huiji District Government"
            ],
            "secondaryName": false,
            "num": "02",
            "services": [
                "local"
            ],
            "parents": [
                "iwf6"
            ],
            "children": [
                "zg2w"
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
        "zg2w": {
            "name": [
                "毛庄",
                "Mao Zhuang"
            ],
            "secondaryName": false,
            "num": "03",
            "services": [
                "local"
            ],
            "parents": [
                "em5m"
            ],
            "children": [
                "zc3f"
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
        "zc3f": {
            "name": [
                "黄河迎宾馆",
                "Yellow River Hotel"
            ],
            "secondaryName": false,
            "num": "04",
            "services": [
                "local"
            ],
            "parents": [
                "zg2w"
            ],
            "children": [
                "3uwu"
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
                            "#C0955A",
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
        "3uwu": {
            "name": [
                "金洼",
                "Jin Wa"
            ],
            "secondaryName": false,
            "num": "05",
            "services": [
                "local"
            ],
            "parents": [
                "zc3f"
            ],
            "children": [
                "552w"
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
        "552w": {
            "name": [
                "金达路",
                "Jinda Road"
            ],
            "secondaryName": false,
            "num": "06",
            "services": [
                "local"
            ],
            "parents": [
                "3uwu"
            ],
            "children": [
                "3yqa"
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
        "3yqa": {
            "name": [
                "刘庄",
                "Liu Zhuang"
            ],
            "secondaryName": false,
            "num": "07",
            "services": [
                "local"
            ],
            "parents": [
                "552w"
            ],
            "children": [
                "lb89"
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
        "lb89": {
            "name": [
                "柳林",
                "Liu Lin"
            ],
            "secondaryName": false,
            "num": "08",
            "services": [
                "local"
            ],
            "parents": [
                "3yqa"
            ],
            "children": [
                "wdpc"
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
        "wdpc": {
            "name": [
                "沙门",
                "Sha Men"
            ],
            "secondaryName": false,
            "num": "09",
            "services": [
                "local"
            ],
            "parents": [
                "lb89"
            ],
            "children": [
                "o4d8"
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
                            "#3792D6",
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
        "o4d8": {
            "name": [
                "北三环",
                "Third Ring Road (N)"
            ],
            "secondaryName": false,
            "num": "10",
            "services": [
                "local"
            ],
            "parents": [
                "wdpc"
            ],
            "children": [
                "c6fe"
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
        "c6fe": {
            "name": [
                "东风路",
                "Dongfeng Road"
            ],
            "secondaryName": false,
            "num": "11",
            "services": [
                "local"
            ],
            "parents": [
                "o4d8"
            ],
            "children": [
                "n93r"
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
                            "#E6E394",
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
        "n93r": {
            "name": [
                "关虎屯",
                "Guan Hu Tun"
            ],
            "secondaryName": false,
            "num": "12",
            "services": [
                "local"
            ],
            "parents": [
                "c6fe"
            ],
            "children": [
                "el8e"
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
        "el8e": {
            "name": [
                "黄河路",
                "Huanghe Road"
            ],
            "secondaryName": false,
            "num": "13",
            "services": [
                "local"
            ],
            "parents": [
                "n93r"
            ],
            "children": [
                "1yb7"
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
                            "#25AC74",
                            "#fff",
                            "5号线",
                            "Line 5"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "1yb7": {
            "name": [
                "紫荆山",
                "Zi Jing Shan"
            ],
            "secondaryName": false,
            "num": "14",
            "services": [
                "local"
            ],
            "parents": [
                "el8e"
            ],
            "children": [
                "i97w"
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
                            "#D20200",
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
        "i97w": {
            "name": [
                "东大街",
                "Dongdajie Street"
            ],
            "secondaryName": false,
            "num": "15",
            "services": [
                "local"
            ],
            "parents": [
                "1yb7"
            ],
            "children": [
                "59o9"
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
                            "#CB5100",
                            "#fff",
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
        "59o9": {
            "name": [
                "陇海东路",
                "Longhai Road (E)"
            ],
            "secondaryName": false,
            "num": "16",
            "services": [
                "local"
            ],
            "parents": [
                "i97w"
            ],
            "children": [
                "4kcp"
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
        "4kcp": {
            "name": [
                "二里岗",
                "Er Li Gang"
            ],
            "secondaryName": false,
            "num": "17",
            "services": [
                "local"
            ],
            "parents": [
                "59o9"
            ],
            "children": [
                "unjl"
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
                            "#852081",
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
        "unjl": {
            "name": [
                "南五里堡",
                "Nan Wu Li Bao"
            ],
            "secondaryName": false,
            "num": "18",
            "services": [
                "local"
            ],
            "parents": [
                "4kcp"
            ],
            "children": [
                "28rn"
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
                            "#25AC74",
                            "#fff",
                            "5号线",
                            "Line 5"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "28rn": {
            "name": [
                "花寨",
                "Hua Zhai"
            ],
            "secondaryName": false,
            "num": "19",
            "services": [
                "local"
            ],
            "parents": [
                "unjl"
            ],
            "children": [
                "mlrg"
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
        "mlrg": {
            "name": [
                "南三环",
                "Third Ring Road (S)"
            ],
            "secondaryName": false,
            "num": "20",
            "services": [
                "local"
            ],
            "parents": [
                "28rn"
            ],
            "children": [
                "zn0v"
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
        "zn0v": {
            "name": [
                "站马屯",
                "Zhan Ma Tun"
            ],
            "secondaryName": false,
            "num": "21",
            "services": [
                "local"
            ],
            "parents": [
                "mlrg"
            ],
            "children": [
                "izko"
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
        "izko": {
            "name": [
                "南四环",
                "Fourth Ring Road (S)"
            ],
            "secondaryName": false,
            "num": "22",
            "services": [
                "local"
            ],
            "parents": [
                "zn0v"
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
                            "other",
                            "other",
                            "#828C47",
                            "#fff",
                            "城郊线",
                            "Suburban Line"
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
        "2号线",
        "Line 2"
    ],
    "psd_num": "1",
    "line_num": "2",
    "info_panel_type": "gz28",
    "direction_gz_x": 50,
    "direction_gz_y": 74.48,
    "customiseMTRDest": {
        "isLegacy": false,
        "terminal": false
    },
    "svgWidth": {
        "destination": 1000,
        "runin": 1500,
        "railmap": 3000,
        "indoor": 800
    },
    "notesGZMTR": [
        [
            "6号线、7号线、8号线暂缓开通",
            "Line 6, Line 7, Line 8 have been suspen",
            0,
            4,
            false
        ],
        [
            "2号线与城郊线在南四环站贯通运营",
            "Line 2 and suburban line in the South fourth Ring station through operation",
            83.5,
            52,
            true
        ]
    ],
    "namePosMTR": {
        "isStagger": true,
        "isFlip": false
    },
    "style": "gzmtr"
};

export default params;
