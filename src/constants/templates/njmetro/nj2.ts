const params = {
    svg_height: 321,
    padding: 4.216780871148593,
    y_pc: 40,
    branch_spacing: 45,
    theme: [
        "nanjing",
        "nj2",
        "#C7003F",
        "#fff"
    ],
    direction: "l",
    current_stn_idx: "7985",
    platform_num: "2",
    stn_list: {
        7985: {
            name: [
                "仙鹤门",
                "Xianhemen"
            ],
            secondaryName: false,
            num: "25",
            services: [
                "local"
            ],
            parents: [
                "so5s"
            ],
            children: [
                "wyw9"
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
        linestart: {
            parents: [],
            children: [
                "1qsn"
            ],
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
            num: "00",
            secondaryName: false
        },
        lineend: {
            parents: [
                "n109"
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
            num: "32",
            secondaryName: false
        },
        l1mz: {
            parents: [
                "6th3"
            ],
            children: [
                "iwf6"
            ],
            name: [
                "钟灵街",
                "Zhonglingjie"
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
        iwf6: {
            children: [
                "so5s"
            ],
            parents: [
                "l1mz"
            ],
            name: [
                "马群",
                "Maqun"
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
                    [
                        [
                            "chengdu",
                            "cd24",
                            "#C98BDB",
                            "#fff",
                            "宁句线",
                            "Ningju Line"
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
        '6th3': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "o594"
            ],
            children: [
                "l1mz"
            ],
            name: [
                "孝陵卫",
                "Xiaolingwei"
            ],
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
        o594: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "vqo5"
            ],
            children: [
                "6th3"
            ],
            name: [
                "下马坊",
                "Xiamafang"
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
        vqo5: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "ocv4"
            ],
            children: [
                "o594"
            ],
            name: [
                "苜蓿园",
                "Muxuyuan"
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
        ocv4: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "6vxs"
            ],
            children: [
                "vqo5"
            ],
            name: [
                "明故宫",
                "Minggugong"
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
        '6vxs': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "hewc"
            ],
            children: [
                "ocv4"
            ],
            name: [
                "西安门",
                "Xi'anmen"
            ],
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
        hewc: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "pe88"
            ],
            children: [
                "6vxs"
            ],
            name: [
                "大行宫",
                "Daxinggong"
            ],
            num: "16",
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
        pe88: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "4olr"
            ],
            children: [
                "hewc"
            ],
            name: [
                "新街口",
                "Xinjiekou"
            ],
            num: "15",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
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
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '4olr': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "581h"
            ],
            children: [
                "pe88"
            ],
            name: [
                "上海路",
                "Shanghailu"
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
        '581h': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "a2zk"
            ],
            children: [
                "4olr"
            ],
            name: [
                "汉中门",
                "Hanzhongmen"
            ],
            num: "13",
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
        a2zk: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "bhi4"
            ],
            children: [
                "581h"
            ],
            name: [
                "莫愁湖",
                "Mochouhu"
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
        bhi4: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "2tzt"
            ],
            children: [
                "a2zk"
            ],
            name: [
                "云锦路",
                "Yunjinlu"
            ],
            num: "11",
            transfer: {
                tick_direc: "l",
                paid_area: false,
                osi_names: [
                    [
                        "庆盛",
                        "Qingsheng"
                    ]
                ],
                info: [
                    [],
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '2tzt': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "u2e7"
            ],
            children: [
                "bhi4"
            ],
            name: [
                "集庆门大街",
                "Jiqingmendajie"
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
        u2e7: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "1r1c"
            ],
            children: [
                "2tzt"
            ],
            name: [
                "兴隆大街",
                "Xinglongdajie"
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
        '1r1c': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "jz7x"
            ],
            children: [
                "u2e7"
            ],
            name: [
                "奥体东",
                "Olympic Stadium East"
            ],
            num: "08",
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
        jz7x: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "pluc"
            ],
            children: [
                "1r1c"
            ],
            name: [
                "元通",
                "Yuantong"
            ],
            num: "07",
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
        pluc: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "hroa"
            ],
            children: [
                "jz7x"
            ],
            name: [
                "雨润大街",
                "Yurundajie"
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
        hroa: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "hebc"
            ],
            children: [
                "pluc"
            ],
            name: [
                "油坊桥",
                "Youfangqiao"
            ],
            num: "05",
            transfer: {
                tick_direc: "r",
                paid_area: true,
                osi_names: [],
                info: [
                    [
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
        hebc: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "pprg"
            ],
            children: [
                "hroa"
            ],
            name: [
                "螺塘路",
                "Luotanglu"
            ],
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
        pprg: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "r74n"
            ],
            children: [
                "hebc"
            ],
            name: [
                "青莲街",
                "Qinglianjie"
            ],
            num: "03",
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
        r74n: {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "1qsn"
            ],
            children: [
                "pprg"
            ],
            name: [
                "天保街",
                "Tianbaojie"
            ],
            num: "02",
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
        '1qsn': {
            branch: {
                left: [],
                right: []
            },
            parents: [
                "linestart"
            ],
            children: [
                "r74n"
            ],
            name: [
                "鱼嘴",
                "Yuzui"
            ],
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
        so5s: {
            name: [
                "金马路",
                "Jinmalu"
            ],
            secondaryName: false,
            num: "24",
            services: [
                "local"
            ],
            parents: [
                "iwf6"
            ],
            children: [
                "7985"
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
        wyw9: {
            name: [
                "学则路",
                "Xuezelu"
            ],
            secondaryName: false,
            num: "26",
            services: [
                "local"
            ],
            parents: [
                "7985"
            ],
            children: [
                "8xt9"
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
        '8xt9': {
            name: [
                "仙林中心",
                "Xianlinzhongxin"
            ],
            secondaryName: false,
            num: "27",
            services: [
                "local"
            ],
            parents: [
                "wyw9"
            ],
            children: [
                "lksc"
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
        lksc: {
            name: [
                "羊山公园",
                "Yangshangongyuan"
            ],
            secondaryName: false,
            num: "28",
            services: [
                "local"
            ],
            parents: [
                "8xt9"
            ],
            children: [
                "8l0m"
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
        '8l0m': {
            name: [
                "南大仙林校区",
                "NJU Xianlin Campus"
            ],
            secondaryName: false,
            num: "29",
            services: [
                "local"
            ],
            parents: [
                "lksc"
            ],
            children: [
                "n109"
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
        n109: {
            name: [
                "经天路",
                "Jingtianlu"
            ],
            secondaryName: false,
            num: "30",
            services: [
                "local"
            ],
            parents: [
                "8l0m"
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
        "2号线",
        "Line 2"
    ],
    psd_num: "2",
    line_num: "2",
    info_panel_type: "gz4",
    direction_gz_x: 50,
    direction_gz_y: 70,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1100,
        runin: 1143,
        railmap: 2021
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: true
    }
}

export default params;
