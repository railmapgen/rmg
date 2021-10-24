const params = {
    style: 'mtr',
    svg_height: 300,
    padding: 8.750201061605276,
    y_pc: 40,
    branch_spacing: 45,
    theme: [
        "nanjing",
        "nj10",
        "#EAC384",
        "#fff"
    ],
    direction: "l",
    current_stn_idx: "kxo3",
    platform_num: "10",
    stn_list: {
        2990: {
            name: [
                "梦都大街",
                "Mengdudajie"
            ],
            num: "09",
            services: [
                "local"
            ],
            parents: [
                "o2kp"
            ],
            children: [
                "l1mz"
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
            facility: "",
            secondaryName: false
        },
        6575: {
            name: [
                "龙华路",
                "Longhualu"
            ],
            num: "03",
            services: [
                "local"
            ],
            parents: [
                "iblk"
            ],
            children: [
                "g0m1"
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
            facility: "",
            secondaryName: false
        },
        linestart: {
            parents: [],
            children: [
                "6dw0"
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
                "kxo3"
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
            num: "15",
            secondaryName: false
        },
        l1mz: {
            parents: [
                "2990"
            ],
            children: [
                "iwf6"
            ],
            name: [
                "奥体中心",
                "Olympic Stadium"
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
        iwf6: {
            children: [
                "7cqu"
            ],
            parents: [
                "l1mz"
            ],
            name: [
                "元通",
                "Yuantong"
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
        '6dw0': {
            name: [
                "雨山路",
                "Yushanlu"
            ],
            num: "01",
            services: [
                "local"
            ],
            parents: [
                "linestart"
            ],
            children: [
                "iblk"
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
            facility: "",
            secondaryName: false
        },
        iblk: {
            name: [
                "文德路",
                "Wendelu"
            ],
            num: "02",
            services: [
                "local"
            ],
            parents: [
                "6dw0"
            ],
            children: [
                "6575"
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
            facility: "",
            secondaryName: false
        },
        g0m1: {
            name: [
                "南京工业大学",
                "NJUT"
            ],
            num: "04",
            services: [
                "local"
            ],
            parents: [
                "6575"
            ],
            children: [
                "9tlx"
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
            facility: "",
            secondaryName: false
        },
        '9tlx': {
            name: [
                "浦口万汇城",
                "Pukouwanhuicheng"
            ],
            num: "05",
            services: [
                "local"
            ],
            parents: [
                "g0m1"
            ],
            children: [
                "1en6"
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
            facility: "",
            secondaryName: false
        },
        '1en6': {
            name: [
                "临江",
                "Linjiang"
            ],
            num: "06",
            services: [
                "local"
            ],
            parents: [
                "9tlx"
            ],
            children: [
                "hnoy"
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
            facility: "",
            secondaryName: false
        },
        hnoy: {
            name: [
                "江心洲",
                "Jiangxinzhou"
            ],
            num: "07",
            services: [
                "local"
            ],
            parents: [
                "1en6"
            ],
            children: [
                "o2kp"
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
            facility: "",
            secondaryName: false
        },
        o2kp: {
            name: [
                "绿博园",
                "Lüboyuan"
            ],
            num: "08",
            services: [
                "local"
            ],
            parents: [
                "hnoy"
            ],
            children: [
                "2990"
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
            facility: "",
            secondaryName: false
        },
        '7cqu': {
            name: [
                "中胜",
                "Zhongsheng"
            ],
            secondaryName: false,
            num: "12",
            services: [
                "local"
            ],
            parents: [
                "iwf6"
            ],
            children: [
                "bm8i"
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
        bm8i: {
            name: [
                "小行",
                "Xiaohang"
            ],
            secondaryName: false,
            num: "13",
            services: [
                "local"
            ],
            parents: [
                "7cqu"
            ],
            children: [
                "kxo3"
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
        kxo3: {
            name: [
                "安德门",
                "Andemen"
            ],
            secondaryName: false,
            num: "14",
            services: [
                "local"
            ],
            parents: [
                "bm8i"
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
        }
    },
    line_name: [
        "10号线",
        "Line 10"
    ],
    psd_num: "10",
    line_num: "10",
    info_panel_type: "gz1421",
    direction_gz_x: 41.84,
    direction_gz_y: 77.98,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1000,
        runin: 1000,
        railmap: 1000
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
}

export default params;
