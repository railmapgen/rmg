const params = {
    "svg_height": 400,
    "padding": 8.750201061605276,
    "y_pc": 40,
    "branch_spacing": 42.07,
    "theme": [
        "shanghai",
        "sh8",
        "#00A3E0",
        "#fff"
    ],
    "direction": "r",
    "current_stn_idx": "s2mu",
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
                "zv4k"
            ],
            "name": [
                "市光路",
                "Shiguang Road"
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
                "qdv6"
            ],
            "name": [
                "沈杜公路",
                "Shendu Highway"
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
                            "shanghai",
                            "pjl",
                            "#999999",
                            "#fff",
                            "浦江线",
                            "Line Pujiang"
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
        "qdv6": {
            "name": [
                "联航路",
                "Lianhang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "5m0u"
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
        "5m0u": {
            "name": [
                "江月路",
                "Jiangyue Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "ihlj"
            ],
            "children": [
                "qdv6"
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
        "ihlj": {
            "name": [
                "浦江镇",
                "Pujiang Town"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "9hqr"
            ],
            "children": [
                "5m0u"
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
        "9hqr": {
            "name": [
                "芦恒路",
                "Luheng Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "7rk9"
            ],
            "children": [
                "ihlj"
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
        "7rk9": {
            "name": [
                "凌兆新村",
                "Linzhao Xincun"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "er8w"
            ],
            "children": [
                "9hqr"
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
        "er8w": {
            "name": [
                "东方体育中心",
                "Oriental Sports Center"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "hpva"
            ],
            "children": [
                "7rk9"
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
                            "sh11",
                            "#76232F",
                            "#fff",
                            "11号线",
                            "Line 11"
                        ],
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
        "hpva": {
            "name": [
                "杨思",
                "Yangsi"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "hddq"
            ],
            "children": [
                "er8w"
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
        "hddq": {
            "name": [
                "成山路",
                "Chengshan Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "lbhn"
            ],
            "children": [
                "hpva"
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
                            "sh13",
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
        "lbhn": {
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
                "rgqe"
            ],
            "children": [
                "hddq"
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
                            "sh7",
                            "#FF6900",
                            "#000",
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
        "rgqe": {
            "name": [
                "中华艺术宫",
                "China Art Museum"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "ci2s"
            ],
            "children": [
                "lbhn"
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
        "ci2s": {
            "name": [
                "西藏南路",
                "South Xizang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "x6sg"
            ],
            "children": [
                "rgqe"
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
        "x6sg": {
            "name": [
                "陆家浜路",
                "Lujiabang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "zb53"
            ],
            "children": [
                "ci2s"
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
        "zb53": {
            "name": [
                "老西门",
                "Laoximen"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "cg8n"
            ],
            "children": [
                "x6sg"
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
                            "sh10",
                            "#C1A7E2",
                            "#000",
                            "10号线",
                            "Line 10"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "cg8n": {
            "name": [
                "大世界",
                "Dashijie"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "s2mu"
            ],
            "children": [
                "zb53"
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
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "s2mu": {
            "name": [
                "人民广场",
                "People's Square"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "jwc0"
            ],
            "children": [
                "cg8n"
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
                            "sh2",
                            "#97D700",
                            "#000",
                            "2号线",
                            "Line 2"
                        ],
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
        "jwc0": {
            "name": [
                "曲阜路",
                "Qufu Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "wx8p"
            ],
            "children": [
                "s2mu"
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
        "wx8p": {
            "name": [
                "中兴路",
                "Zhongxin Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "dudd"
            ],
            "children": [
                "jwc0"
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
        "dudd": {
            "name": [
                "虹口足球场",
                "Hongkou Football Stadium"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "tf7a"
            ],
            "children": [
                "wx8p"
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
        "tf7a": {
            "name": [
                "曲阳路",
                "Quyang Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "jjrs"
            ],
            "children": [
                "dudd"
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
        "jjrs": {
            "name": [
                "四平路",
                "Siping Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "eo9h"
            ],
            "children": [
                "tf7a"
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
                            "sh10",
                            "#C1A7E2",
                            "#000",
                            "10号线",
                            "Line 10"
                        ]
                    ]
                ],
                "tick_direc": "r",
                "paid_area": true,
                "osi_names": []
            },
            "facility": ""
        },
        "a00g": {
            "name": [
                "黄兴路",
                "Huangxing Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "3sdo"
            ],
            "children": [
                "u0mf"
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
        "3sdo": {
            "name": [
                "延吉中路",
                "Middle Yanji Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "cs56"
            ],
            "children": [
                "a00g"
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
        "cs56": {
            "name": [
                "黄兴公园",
                "Huangxing Park"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "gdwo"
            ],
            "children": [
                "3sdo"
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
        "gdwo": {
            "name": [
                "翔殷路",
                "Xiangyin Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "zv4k"
            ],
            "children": [
                "cs56"
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
        "zv4k": {
            "name": [
                "嫩江路",
                "Nenjiang Road"
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
                "gdwo"
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
        "eo9h": {
            "name": [
                "鞍山新村",
                "Anshan Xincun"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "u0mf"
            ],
            "children": [
                "jjrs"
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
        "u0mf": {
            "name": [
                "江浦路",
                "Jiangpu Road"
            ],
            "secondaryName": false,
            "num": "00",
            "services": [
                "local"
            ],
            "parents": [
                "a00g"
            ],
            "children": [
                "eo9h"
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
        "8号线",
        "Line8"
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