export default {
    svg_height: 300,
    padding: 3.47,
    y_pc: 68.02,
    branch_spacing: 64.32,
    theme: [
        "shanghai",
        "sh2",
        "#97D700",
        "#000"
    ],
    direction: "r",
    current_stn_idx: "lh7j",
    platform_num: false,
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "iwf6"
            ],
            name: [
                "路綫右端",
                "RIGHT END"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            num: "00",
            secondaryName: false
        },
        lineend: {
            parents: [
                "mx89"
            ],
            children: [],
            name: [
                "路綫左端",
                "LEFT END"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            num: "30",
            secondaryName: false
        },
        l1mz: {
            parents: [
                "iwf6"
            ],
            children: [
                "n4at"
            ],
            name: [
                "虹桥火车站",
                "Hongqiao Railway Station"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "02",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "shanghai",
                            "sh10",
                            "#C1A7E2",
                            "#000",
                            "10号线",
                            "Line 10"
                        ],
                        [
                            "shanghai",
                            "sh17",
                            "#C09C83",
                            "#fff",
                            "17号线",
                            "Line 17"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        iwf6: {
            children: [
                "l1mz"
            ],
            parents: [
                "linestart"
            ],
            name: [
                "徐泾东",
                "East Xujing"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "01",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        n4at: {
            parents: [
                "l1mz"
            ],
            children: [
                "8gmo"
            ],
            name: [
                "虹桥2号航站楼",
                "Hongqiao Airport Terminal 2"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "03",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [],
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
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '8gmo': {
            parents: [
                "n4at"
            ],
            children: [
                "uixu"
            ],
            name: [
                "淞虹路",
                "Songhong Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "04",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        uixu: {
            parents: [
                "8gmo"
            ],
            children: [
                "f6ez"
            ],
            name: [
                "北新泾",
                "Beixinjing"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "05",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        f6ez: {
            parents: [
                "uixu"
            ],
            children: [
                "5fjd"
            ],
            name: [
                "威宁路",
                "Weining Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "06",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '5fjd': {
            parents: [
                "f6ez"
            ],
            children: [
                "11dr"
            ],
            name: [
                "娄山关路",
                "Loushanguan Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "07",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [],
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
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '11dr': {
            parents: [
                "5fjd"
            ],
            children: [
                "orew"
            ],
            name: [
                "中山公园",
                "Zhongshan Park"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "08",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "shanghai",
                            "sh3",
                            "#FFD100",
                            "#000",
                            "3号线",
                            "Line 3"
                        ],
                        [
                            "shanghai",
                            "sh4",
                            "#5F259F",
                            "#fff",
                            "4号线",
                            "Line 4"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        orew: {
            parents: [
                "11dr"
            ],
            children: [
                "1i6w"
            ],
            name: [
                "江苏路",
                "Jiangsu Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "09",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "shanghai",
                            "sh11",
                            "#76232F",
                            "#fff",
                            "11号线",
                            "Line 11"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '1i6w': {
            parents: [
                "orew"
            ],
            children: [
                "lh7j"
            ],
            name: [
                "南京西路",
                "West Nanjing Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "10",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [],
                    [
                        [
                            "shanghai",
                            "sh12",
                            "#007B5F",
                            "#fff",
                            "12号线",
                            "Line 12"
                        ],
                        [
                            "shanghai",
                            "sh13",
                            "#EF95CF",
                            "#000",
                            "13号线",
                            "Line 13"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        lh7j: {
            parents: [
                "1i6w"
            ],
            children: [
                "gicw"
            ],
            name: [
                "人民广场",
                "People's Square"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "11",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "shanghai",
                            "sh1",
                            "#E4002B",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ],
                        [
                            "shanghai",
                            "sh8",
                            "#00A3E0",
                            "#fff",
                            "8号线",
                            "Line 8"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        gicw: {
            parents: [
                "lh7j"
            ],
            children: [
                "ebgb"
            ],
            name: [
                "南京东路",
                "East Nanjing Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "12",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
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
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        ebgb: {
            parents: [
                "gicw"
            ],
            children: [
                "ttuu"
            ],
            name: [
                "陆家嘴",
                "Lujiazui"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "13",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
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
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        ttuu: {
            parents: [
                "ebgb"
            ],
            children: [
                "m5bp"
            ],
            name: [
                "东昌路",
                "Dongchang Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "14",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        m5bp: {
            parents: [
                "ttuu"
            ],
            children: [
                "4nai"
            ],
            name: [
                "世纪大道",
                "Century Avenue"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "15",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
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
                            "sh6",
                            "#D9027D",
                            "#fff",
                            "6号线",
                            "Line 6"
                        ],
                        [
                            "shanghai",
                            "sh9",
                            "#71C5E8",
                            "#000",
                            "9号线",
                            "Line 9"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '4nai': {
            parents: [
                "m5bp"
            ],
            children: [
                "dhsq"
            ],
            name: [
                "上海科技馆",
                "Shanghai Science & Technology Museum"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "16",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        dhsq: {
            parents: [
                "4nai"
            ],
            children: [
                "2q8m"
            ],
            name: [
                "世纪公园",
                "Century Park"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "17",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '2q8m': {
            parents: [
                "dhsq"
            ],
            children: [
                "uh7r"
            ],
            name: [
                "龙阳路",
                "Longyang Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "18",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "shanghai",
                            "sh7",
                            "#FF6900",
                            "#000",
                            "7号线",
                            "Line 7"
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
                            "sh18",
                            "#D6A461",
                            "#000",
                            "18号线",
                            "Line 18"
                        ],
                        [
                            "shanghai",
                            "maglev",
                            "#009090",
                            "#fff",
                            "磁悬浮",
                            "Maglev"
                        ]
                    ]
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        uh7r: {
            parents: [
                "2q8m"
            ],
            children: [
                "cwlm"
            ],
            name: [
                "张江高科",
                "Zhangjiang High-Technology Park"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "19",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        cwlm: {
            parents: [
                "uh7r"
            ],
            children: [
                "6d8a"
            ],
            name: [
                "金科路",
                "Jinke Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "20",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '6d8a': {
            parents: [
                "cwlm"
            ],
            children: [
                "8qia"
            ],
            name: [
                "广兰路",
                "Guanglan Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "21",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '8qia': {
            parents: [
                "6d8a"
            ],
            children: [
                "ww5f"
            ],
            name: [
                "唐镇",
                "Tangzhen"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "22",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        ww5f: {
            parents: [
                "8qia"
            ],
            children: [
                "r3cg"
            ],
            name: [
                "创新中路",
                "Middle Chuangxin Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "23",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        r3cg: {
            parents: [
                "ww5f"
            ],
            children: [
                "i21j"
            ],
            name: [
                "华夏东路",
                "East Huaxia Road"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "24",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: [
                "1号航站楼",
                "Terminal 1"
            ]
        },
        i21j: {
            parents: [
                "r3cg"
            ],
            children: [
                "zloz"
            ],
            name: [
                "川沙",
                "Chuansha"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "25",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: [
                "2号航站楼",
                "Terminal 2"
            ]
        },
        zloz: {
            name: [
                "凌空路",
                "Lingkong Road"
            ],
            secondaryName: false,
            num: "26",
            services: [
                "local"
            ],
            parents: [
                "i21j"
            ],
            children: [
                "5ltj"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    []
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        '5ltj': {
            name: [
                "远东大道",
                "Yuandong Avenue"
            ],
            secondaryName: false,
            num: "27",
            services: [
                "local"
            ],
            parents: [
                "zloz"
            ],
            children: [
                "r4df"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    []
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        r4df: {
            name: [
                "海天三路",
                "Haitiansan Road"
            ],
            secondaryName: false,
            num: "28",
            services: [
                "local"
            ],
            parents: [
                "5ltj"
            ],
            children: [
                "mx89"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    []
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        mx89: {
            name: [
                "浦东国际机场",
                "Pudong International Airport"
            ],
            secondaryName: false,
            num: "29",
            services: [
                "local"
            ],
            parents: [
                "r4df"
            ],
            children: [
                "lineend"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "shanghai",
                            "maglev",
                            "#009090",
                            "#fff",
                            "磁悬浮",
                            "Maglev"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        }
    },
    line_name: [
        "2号线",
        "Line 2"
    ],
    psd_num: "",
    line_num: "2",
    info_panel_type: "sh",
    direction_gz_x: 2.21,
    direction_gz_y: 12.724668484036409,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1500,
        runin: 1500,
        railmap: 2000
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: true
    }
};