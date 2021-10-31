const params = {
    style: 'mtr',
    svg_height: 321,
    padding: 2.836743495136327,
    y_pc: 49.6,
    branch_spacing: 45,
    theme: [
        "nanjing",
        "nj1",
        "#00A2DF",
        "#fff"
    ],
    direction: "l",
    current_stn_idx: "sb9i",
    platform_num: "1",
    info_panel_type: "gz5",
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "qdg7"
            ],
            name: [
                "路綫左端",
                "LEFT END"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "00",
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
        lineend: {
            parents: [
                "ranj"
            ],
            children: [],
            name: [
                "路綫右端",
                "RIGHT END"
            ],
            branch: {
                left: [],
                right: []
            },
            num: "33",
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
        l1mz: {
            parents: [
                "aa5j"
            ],
            children: [
                "iwf6"
            ],
            name: [
                "河定桥",
                "Hedingqiao"
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
        iwf6: {
            children: [
                "oq3d"
            ],
            parents: [
                "l1mz"
            ],
            name: [
                "胜太路",
                "Shengtailu"
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
            secondaryName: false
        },
        aa5j: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "7yo0"
            ],
            children: [
                "l1mz"
            ],
            name: [
                "双龙大道",
                "Shuanglongdadao"
            ],
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
        '7yo0': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "a4u8"
            ],
            children: [
                "aa5j"
            ],
            name: [
                "南京南站",
                "Nanjing South Railway Station"
            ],
            num: "21",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "nanjing",
                            "nj3",
                            "#009651",
                            "#fff",
                            "3号线",
                            "Line 3"
                        ],
                        [
                            "nanjing",
                            "s1",
                            "#4BBBB4",
                            "#fff",
                            "机场线",
                            "Airport Line"
                        ],
                        [
                            "nanjing",
                            "s3",
                            "#BA84AC",
                            "#fff",
                            "宁和线",
                            "Ninghe Line"
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
        a4u8: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "yric"
            ],
            children: [
                "7yo0"
            ],
            name: [
                "花神庙",
                "Huashenmiao"
            ],
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
        yric: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "fs4o"
            ],
            children: [
                "a4u8"
            ],
            name: [
                "软件大道",
                "Ruanjiandadao"
            ],
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
        fs4o: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "sb9i"
            ],
            children: [
                "yric"
            ],
            name: [
                "天隆寺",
                "Tianlongsi"
            ],
            num: "18",
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
        sb9i: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "rn3a"
            ],
            children: [
                "fs4o"
            ],
            name: [
                "安德门",
                "Andemen"
            ],
            num: "17",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "nanjing",
                            "nj10",
                            "#EAC384",
                            "#fff",
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
        rn3a: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "kln2"
            ],
            children: [
                "sb9i"
            ],
            name: [
                "中华门",
                "Zhonghuamen"
            ],
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
        kln2: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "zi23"
            ],
            children: [
                "rn3a"
            ],
            name: [
                "三山街",
                "Sanshanjie"
            ],
            num: "15",
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
        zi23: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "9zmg"
            ],
            children: [
                "kln2"
            ],
            name: [
                "张府园",
                "Zhangfuyuan"
            ],
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
        '9zmg': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "lrh8"
            ],
            children: [
                "zi23"
            ],
            name: [
                "新街口",
                "Xinjiekou"
            ],
            num: "13",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "nanjing",
                            "nj2",
                            "#C7003F",
                            "#fff",
                            "2号线",
                            "Line 2"
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
        lrh8: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "dexg"
            ],
            children: [
                "9zmg"
            ],
            name: [
                "珠江路",
                "Zhujianglu"
            ],
            num: "12",
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
        dexg: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "9v93"
            ],
            children: [
                "lrh8"
            ],
            name: [
                "鼓楼",
                "Gulou"
            ],
            num: "11",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "nanjing",
                            "nj4",
                            "#796BAF",
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
        '9v93': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "88ut"
            ],
            children: [
                "dexg"
            ],
            name: [
                "玄武门",
                "Xuanwumen"
            ],
            num: "10",
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
        '88ut': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "of5b"
            ],
            children: [
                "9v93"
            ],
            name: [
                "新模范马路",
                "Xinmofanmalu"
            ],
            num: "09",
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
        of5b: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "y0h6"
            ],
            children: [
                "88ut"
            ],
            name: [
                "南京站",
                "Nanjing Railway Station"
            ],
            num: "08",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
                        [
                            "nanjing",
                            "nj3",
                            "#009651",
                            "#fff",
                            "3号线",
                            "Line 3"
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
        y0h6: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "qdg7"
            ],
            children: [
                "of5b"
            ],
            name: [
                "红山动物园",
                "Hongshan Zoo"
            ],
            num: "07",
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
        qdg7: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "linestart"
            ],
            children: [
                "y0h6"
            ],
            name: [
                "迈皋桥",
                "Maigaoqiao"
            ],
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
        oq3d: {
            name: [
                "百家湖",
                "Baijiahu"
            ],
            secondaryName: false,
            num: "25",
            services: [
                "local"
            ],
            parents: [
                "iwf6"
            ],
            children: [
                "5y8q"
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
        '5y8q': {
            name: [
                "小龙湾",
                "Xiaolongwan"
            ],
            secondaryName: false,
            num: "26",
            services: [
                "local"
            ],
            parents: [
                "oq3d"
            ],
            children: [
                "rmxl"
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
        rmxl: {
            name: [
                "竹山路",
                "Zhushanlu"
            ],
            secondaryName: false,
            num: "27",
            services: [
                "local"
            ],
            parents: [
                "5y8q"
            ],
            children: [
                "mhfe"
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
        mhfe: {
            name: [
                "天印大道",
                "Tianyindadao"
            ],
            secondaryName: false,
            num: "28",
            services: [
                "local"
            ],
            parents: [
                "rmxl"
            ],
            children: [
                "94k6"
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
        '94k6': {
            name: [
                "龙眠大道",
                "Longmiandadao"
            ],
            secondaryName: false,
            num: "29",
            services: [
                "local"
            ],
            parents: [
                "mhfe"
            ],
            children: [
                "fmqa"
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
        fmqa: {
            name: [
                "南医大·江苏经贸学院",
                "NMU/JIETT"
            ],
            secondaryName: false,
            num: "30",
            services: [
                "local"
            ],
            parents: [
                "94k6"
            ],
            children: [
                "xkkq"
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
        xkkq: {
            name: [
                "南京交院",
                "NJCI"
            ],
            secondaryName: false,
            num: "31",
            services: [
                "local"
            ],
            parents: [
                "fmqa"
            ],
            children: [
                "ranj"
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
        ranj: {
            name: [
                "中国药科大学",
                "CPU"
            ],
            secondaryName: false,
            num: "32",
            services: [
                "local"
            ],
            parents: [
                "xkkq"
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
                    []
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        }
    },
    line_name: [
        "1号线",
        "Line 1"
    ],
    psd_num: "1",
    line_num: "1",
    direction_gz_x: 41.27,
    direction_gz_y: 79.85,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1000,
        runin: 1510,
        railmap: 2021
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
}

export default params;
