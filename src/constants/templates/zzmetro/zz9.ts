const params = {
    "style": "gzmtr",
    "svg_height": 380,
    "padding": 8.07,
    "y_pc": 56.62,
    "branch_spacing": 48.88,
    "theme": [
        "other",
        "other",
        "#828C47",
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
                "1a4g"
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
            "num": "20",
            "secondaryName": false
        },
        "l1mz": {
            "parents": [
                "tek3"
            ],
            "children": [
                "19dl"
            ],
            "name": [
                "新郑机场",
                "Zhengzhou Xinzheng \\International Airport"
            ],
            "branch": {
                "left": [],
                "right": []
            },
            "num": "15",
            "transfer": {
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": [],
                "info": [
                    [
                        [
                            "other",
                            "other",
                            "#1D4155",
                            "#fff",
                            "17号线/机许线",
                            "Line 17/JIXU Line"
                        ]
                    ]
                ]
            },
            "services": [
                "local"
            ],
            "facility": "",
            "secondaryName": [
                "2号航站楼",
                "Terminal 2"
            ]
        },
        "iwf6": {
            "children": [
                "uenc"
            ],
            "parents": [
                "linestart"
            ],
            "name": [
                "南四环",
                "Fourth Ring Road (S)"
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
                    [
                        [
                            "other",
                            "other",
                            "#D28F00",
                            "#fff",
                            "2号线",
                            "Line 2"
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
        "uenc": {
            "name": [
                "十八里河",
                "Shibali River"
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
                "ypp8"
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
        "ypp8": {
            "name": [
                "沙窝李",
                "Sha Wo Li"
            ],
            "secondaryName": false,
            "num": "03",
            "services": [
                "local"
            ],
            "parents": [
                "uenc"
            ],
            "children": [
                "6gy3"
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
        "6gy3": {
            "name": [
                "双湖大道",
                "Shuanghu Ave"
            ],
            "secondaryName": false,
            "num": "04",
            "services": [
                "local"
            ],
            "parents": [
                "ypp8"
            ],
            "children": [
                "uxo9"
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
        "uxo9": {
            "name": [
                "小乔",
                "Xiao Qiao"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "05",
            "services": [
                "local"
            ],
            "parents": [
                "6gy3"
            ],
            "children": [
                "zw3e"
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
        "zw3e": {
            "name": [
                "华南城西",
                "Zhengzhou South China City (W)"
            ],
            "secondaryName": false,
            "num": "06",
            "services": [
                "local"
            ],
            "parents": [
                "uxo9"
            ],
            "children": [
                "ho65"
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
        "ho65": {
            "name": [
                "华南城",
                "Zhengzhou South China City"
            ],
            "secondaryName": false,
            "num": "07",
            "services": [
                "local"
            ],
            "parents": [
                "zw3e"
            ],
            "children": [
                "2y33"
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
        "2y33": {
            "name": [
                "华南城东",
                "Zhengzhou South China City (E)"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "08",
            "services": [
                "local"
            ],
            "parents": [
                "ho65"
            ],
            "children": [
                "mtni"
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
        "mtni": {
            "name": [
                "孟庄",
                "Meng Zhuang"
            ],
            "secondaryName": false,
            "num": "09",
            "services": [
                "local"
            ],
            "parents": [
                "2y33"
            ],
            "children": [
                "i5lt"
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
        "i5lt": {
            "name": [
                "港区北",
                "Zhengzhou Airport Economic \\Comprehensive Experimental Zone (N)"
            ],
            "secondaryName": false,
            "num": "10",
            "services": [
                "local"
            ],
            "parents": [
                "mtni"
            ],
            "children": [
                "8bo8"
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
                            "#1D4155",
                            "#fff",
                            "17号线/机许线",
                            "Line 17/JIXU Line"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "8bo8": {
            "name": [
                "康平湖",
                "Kangping Lake"
            ],
            "secondaryName": false,
            "num": "11",
            "services": [
                "local"
            ],
            "parents": [
                "i5lt"
            ],
            "children": [
                "syac"
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
        "syac": {
            "name": [
                "兰河公园",
                "Lanhe Park"
            ],
            "secondaryName": false,
            "num": "12",
            "services": [
                "local"
            ],
            "parents": [
                "8bo8"
            ],
            "children": [
                "pdha"
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
        "pdha": {
            "name": [
                "恩平湖",
                "Enping Lake"
            ],
            "secondaryName": false,
            "num": "13",
            "services": [
                "local"
            ],
            "parents": [
                "syac"
            ],
            "children": [
                "tek3"
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
        "tek3": {
            "name": [
                "综合保税区",
                "Zhengzhou Xinzheng \\Comprehensive Free Trade Zone"
            ],
            "secondaryName": false,
            "num": "14",
            "services": [
                "local"
            ],
            "parents": [
                "pdha"
            ],
            "children": [
                "l1mz"
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
        "1a4g": {
            "name": [
                "郑州南站",
                "Zhengzhou South Railway Station"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "19",
            "services": [
                "local"
            ],
            "parents": [
                "zo4d"
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
                    []
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "zo4d": {
            "name": [
                "港区会展",
                "Exhibition Center of Zhengzhou Airport \\Economic Comprehensive Pilot Zone"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "18",
            "services": [
                "local"
            ],
            "parents": [
                "r1eh"
            ],
            "children": [
                "1a4g"
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
        "r1eh": {
            "name": [
                "机场东",
                "Zhengzhou Xinzheng \\International Airport (E)"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "17",
            "services": [
                "local"
            ],
            "parents": [
                "19dl"
            ],
            "children": [
                "zo4d"
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
        "19dl": {
            "name": [
                "3号航站楼",
                "Zhengzhou Xinzheng \\International Airport Terminal 3"
            ],
            "secondaryName": [
                "暂缓开通",
                "Stay Open"
            ],
            "num": "16",
            "services": [
                "local"
            ],
            "parents": [
                "l1mz"
            ],
            "children": [
                "r1eh"
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
        "城郊线",
        "Suburban Line"
    ],
    "psd_num": "1",
    "line_num": "9",
    "info_panel_type": "gz28",
    "direction_gz_x": 50,
    "direction_gz_y": 78.05,
    "customiseMTRDest": {
        "isLegacy": false,
        "terminal": false
    },
    "svgWidth": {
        "destination": 1000,
        "runin": 1800,
        "railmap": 2000,
        "indoor": 800
    },
    "notesGZMTR": [
        [
            "小乔、华南城东、3号航站楼至郑州南站暂缓开通",
            "Xiao Qiao, Zhengzhou South China City (E), Zhengzhou Xinzheng International Airport Terminal 3 to Zhengzhou South Railway Station suspended opening",
            0,
            11,
            false
        ],
        [
            "17号线/机许线暂缓开通",
            "Line 17/JIXU Line have been suspended opening",
            0,
            2.5,
            false
        ],
        [
            "城郊线与2号线在南四环站贯通运营",
            "Suburban line and Line 2 in the South fourth Ring station through operation",
            12.5,
            64,
            true
        ]
    ],
    "namePosMTR": {
        "isStagger": true,
        "isFlip": false
    }
};

export default params;
