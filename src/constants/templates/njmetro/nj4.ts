const params = {
    style: 'mtr',
    svg_height: 300,
    padding: 5,
    y_pc: 40,
    branch_spacing: 44.44444444444444,
    theme: [
        "nanjing",
        "nj4",
        "#796BAF",
        "#fff"
    ],
    direction: "l",
    current_stn_idx: "l1mz",
    platform_num: "4",
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "eg1z"
            ],
            name: [
                "路綫右端",
                "RIGHT END"
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
                "l1mz"
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
        l1mz: {
            parents: [
                "ndua"
            ],
            children: [
                "lineend"
            ],
            name: [
                "仙林湖",
                "Xianlinhu"
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
        iwf6: {
            children: [
                "57ve"
            ],
            parents: [
                "qrv2"
            ],
            name: [
                "云南路",
                "Yunnanlu"
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
        '57ve': {
            parents: [
                "iwf6"
            ],
            children: [
                "d2ch"
            ],
            name: [
                "鼓楼",
                "Gulou"
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
        d2ch: {
            parents: [
                "57ve"
            ],
            children: [
                "rq4h"
            ],
            name: [
                "鸡鸣寺",
                "Jimingsi"
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
        rq4h: {
            parents: [
                "d2ch"
            ],
            children: [
                "n1ni"
            ],
            name: [
                "九华山",
                "Jiuhuashan"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        n1ni: {
            parents: [
                "rq4h"
            ],
            children: [
                "7kvg"
            ],
            name: [
                "岗子村",
                "Gangzicun"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '7kvg': {
            parents: [
                "n1ni"
            ],
            children: [
                "5o5y"
            ],
            name: [
                "蒋王庙",
                "Jiangwangmiao"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        l9io: {
            parents: [
                "5o5y"
            ],
            children: [
                "2ifb"
            ],
            name: [
                "聚宝山",
                "Jubaoshan"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '2ifb': {
            parents: [
                "l9io"
            ],
            children: [
                "lcjl"
            ],
            name: [
                "徐庄",
                "Xuzhuang"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        lcjl: {
            parents: [
                "2ifb"
            ],
            children: [
                "fbpn"
            ],
            name: [
                "金马路",
                "Jinmalu"
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
        fbpn: {
            parents: [
                "lcjl"
            ],
            children: [
                "mclm"
            ],
            name: [
                "汇通路",
                "Huitonglu"
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
        mclm: {
            parents: [
                "fbpn"
            ],
            children: [
                "lx10"
            ],
            name: [
                "灵山",
                "Lingshan"
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
        lx10: {
            parents: [
                "mclm"
            ],
            children: [
                "yz8y"
            ],
            name: [
                "东流",
                "Dongliu"
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
        yz8y: {
            parents: [
                "lx10"
            ],
            children: [
                "ndua"
            ],
            name: [
                "孟北",
                "Mengbei"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        ndua: {
            parents: [
                "yz8y"
            ],
            children: [
                "l1mz"
            ],
            name: [
                "西岗桦墅",
                "Xiganghuashu"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        '5o5y': {
            parents: [
                "7kvg"
            ],
            children: [
                "l9io"
            ],
            name: [
                "王家湾",
                "Wangjiawan"
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
                    []
                ]
            },
            services: [
                "local"
            ],
            facility: "",
            secondaryName: false
        },
        qrv2: {
            name: [
                "草场门",
                "Caochangmen"
            ],
            secondaryName: false,
            num: "17",
            services: [
                "local"
            ],
            parents: [
                "eg1z"
            ],
            children: [
                "iwf6"
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
        eg1z: {
            name: [
                "龙江",
                "Longjiang"
            ],
            secondaryName: false,
            num: "18",
            services: [
                "local"
            ],
            parents: [
                "linestart"
            ],
            children: [
                "qrv2"
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
        "4号线",
        "Line 4"
    ],
    psd_num: "4",
    line_num: "4",
    info_panel_type: "gz4",
    direction_gz_x: 50,
    direction_gz_y: 70,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1150,
        runin: 1150,
        railmap: 1150,
        indoor: 1150
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: true
    }
}

export default params;
