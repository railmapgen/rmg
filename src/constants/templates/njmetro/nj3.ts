const params = {
    svg_height: 321,
    padding: 8.750201061605276,
    y_pc: 44.84,
    branch_spacing: 46.63,
    theme: [
        "nanjing",
        "nj3",
        "#009651",
        "#fff"
    ],
    direction: "l",
    current_stn_idx: "dx9v",
    platform_num: "3",
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "kwag"
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
                "dx9v"
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
            num: "34",
            secondaryName: false
        },
        dx9v: {
            name: [
                "秣周东路",
                "Mozhoudonglu"
            ],
            secondaryName: false,
            num: "31",
            services: [
                "local"
            ],
            parents: [
                "507q"
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
        },
        '507q': {
            name: [
                "东大九龙湖校区",
                "SEU Jiulonghu Campus"
            ],
            secondaryName: false,
            num: "30",
            services: [
                "local"
            ],
            parents: [
                "wj16"
            ],
            children: [
                "dx9v"
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
        wj16: {
            name: [
                "诚信大道",
                "Chengxindadao"
            ],
            secondaryName: false,
            num: "29",
            services: [
                "local"
            ],
            parents: [
                "639e"
            ],
            children: [
                "507q"
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
        '639e': {
            name: [
                "九龙湖",
                "Jiulonghu"
            ],
            secondaryName: false,
            num: "28",
            services: [
                "local"
            ],
            parents: [
                "lej6"
            ],
            children: [
                "wj16"
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
        lej6: {
            name: [
                "天元西路",
                "Tianyuanxilu"
            ],
            secondaryName: false,
            num: "27",
            services: [
                "local"
            ],
            parents: [
                "4c8t"
            ],
            children: [
                "639e"
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
        '4c8t': {
            name: [
                "胜太西路",
                "Shengtaixilu"
            ],
            secondaryName: false,
            num: "26",
            services: [
                "local"
            ],
            parents: [
                "9pyo"
            ],
            children: [
                "lej6"
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
        '9pyo': {
            name: [
                "宏运大道",
                "Hongyundadao"
            ],
            secondaryName: false,
            num: "25",
            services: [
                "local"
            ],
            parents: [
                "r5kv"
            ],
            children: [
                "4c8t"
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
        r5kv: {
            name: [
                "南京南站",
                "Nanjing South Railway Station"
            ],
            secondaryName: false,
            num: "24",
            services: [
                "local"
            ],
            parents: [
                "uxm9"
            ],
            children: [
                "9pyo"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "nanjing",
                            "nj1",
                            "#00A2DF",
                            "#fff",
                            "1号线",
                            "Line 1"
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
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        uxm9: {
            name: [
                "明发广场",
                "Mingfaguangchang"
            ],
            secondaryName: false,
            num: "23",
            services: [
                "local"
            ],
            parents: [
                "e9rp"
            ],
            children: [
                "r5kv"
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
        e9rp: {
            name: [
                "大明路",
                "Daminglu"
            ],
            secondaryName: false,
            num: "22",
            services: [
                "local"
            ],
            parents: [
                "rtfa"
            ],
            children: [
                "uxm9"
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
        rtfa: {
            name: [
                "卡子门",
                "Kazimen"
            ],
            secondaryName: false,
            num: "21",
            services: [
                "local"
            ],
            parents: [
                "nu0i"
            ],
            children: [
                "e9rp"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
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
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        nu0i: {
            name: [
                "雨花门",
                "Yuhuamen"
            ],
            secondaryName: false,
            num: "20",
            services: [
                "local"
            ],
            parents: [
                "amk0"
            ],
            children: [
                "rtfa"
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
        amk0: {
            name: [
                "武定门",
                "Wudingmen"
            ],
            secondaryName: false,
            num: "19",
            services: [
                "local"
            ],
            parents: [
                "xzla"
            ],
            children: [
                "nu0i"
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
        xzla: {
            name: [
                "夫子庙",
                "Fuzimiao"
            ],
            secondaryName: false,
            num: "18",
            services: [
                "local"
            ],
            parents: [
                "p0k4"
            ],
            children: [
                "amk0"
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
        p0k4: {
            name: [
                "常府街",
                "Changfujie"
            ],
            secondaryName: false,
            num: "17",
            services: [
                "local"
            ],
            parents: [
                "0st5"
            ],
            children: [
                "xzla"
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
        '0st5': {
            name: [
                "大行宫",
                "Hujialou"
            ],
            secondaryName: false,
            num: "16",
            services: [
                "local"
            ],
            parents: [
                "mx71"
            ],
            children: [
                "p0k4"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
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
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        mx71: {
            name: [
                "浮桥",
                "Fuqiao"
            ],
            secondaryName: false,
            num: "15",
            services: [
                "local"
            ],
            parents: [
                "0uia"
            ],
            children: [
                "0st5"
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
        '0uia': {
            name: [
                "鸡鸣寺",
                "Jimingsi"
            ],
            secondaryName: false,
            num: "14",
            services: [
                "local"
            ],
            parents: [
                "d30g"
            ],
            children: [
                "mx71"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
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
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        xhx5: {
            name: [
                "南京站",
                "Nanjing Railway Station"
            ],
            secondaryName: false,
            num: "12",
            services: [
                "local"
            ],
            parents: [
                "kzwq"
            ],
            children: [
                "d30g"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "nanjing",
                            "nj1",
                            "#00A2DF",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        kzwq: {
            name: [
                "小市",
                "Xiaoshi"
            ],
            secondaryName: false,
            num: "11",
            services: [
                "local"
            ],
            parents: [
                "4qke"
            ],
            children: [
                "xhx5"
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
        d30g: {
            name: [
                "南京林业大学·新庄",
                "NFU·Xinzhuang"
            ],
            secondaryName: false,
            num: "13",
            services: [
                "local"
            ],
            parents: [
                "xhx5"
            ],
            children: [
                "0uia"
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
        '4qke': {
            name: [
                "五塘广场",
                "Wutangguangchang"
            ],
            secondaryName: false,
            num: "10",
            services: [
                "local"
            ],
            parents: [
                "ui4w"
            ],
            children: [
                "kzwq"
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
        ui4w: {
            name: [
                "上元门",
                "Shangyuanmen"
            ],
            secondaryName: false,
            num: "09",
            services: [
                "local"
            ],
            parents: [
                "exjz"
            ],
            children: [
                "4qke"
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
        exjz: {
            name: [
                "柳洲东路",
                "Liuzhoudonglu"
            ],
            secondaryName: false,
            num: "08",
            services: [
                "local"
            ],
            parents: [
                "g6am"
            ],
            children: [
                "ui4w"
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
        g6am: {
            name: [
                "天润城",
                "Tianruncheng"
            ],
            secondaryName: false,
            num: "07",
            services: [
                "local"
            ],
            parents: [
                "qpv2"
            ],
            children: [
                "exjz"
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
        qpv2: {
            name: [
                "泰冯路",
                "Taifenglu"
            ],
            secondaryName: false,
            num: "06",
            services: [
                "local"
            ],
            parents: [
                "mtpj"
            ],
            children: [
                "g6am"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "nanjing",
                            "s8",
                            "#ff8000",
                            "#fff",
                            "宁天线",
                            "Ningtian Line"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        mtpj: {
            name: [
                "东大成贤学院",
                "SEU Chengxian College"
            ],
            secondaryName: false,
            num: "05",
            services: [
                "local"
            ],
            parents: [
                "xh2v"
            ],
            children: [
                "qpv2"
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
        xh2v: {
            name: [
                "星火路",
                "Xinghuolu"
            ],
            secondaryName: false,
            num: "04",
            services: [
                "local"
            ],
            parents: [
                "kwag"
            ],
            children: [
                "mtpj"
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
        kwag: {
            name: [
                "林场",
                "Linchang"
            ],
            secondaryName: false,
            num: "03",
            services: [
                "local"
            ],
            parents: [
                "linestart"
            ],
            children: [
                "xh2v"
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
        "3号线",
        "Line 3"
    ],
    psd_num: "3",
    line_num: "3",
    info_panel_type: "gz3",
    direction_gz_x: 17.94,
    direction_gz_y: 73.9,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 2000,
        runin: 1143,
        railmap: 2021
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
}

export default params;
