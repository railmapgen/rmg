const params = {
    style: 'mtr',
    svg_height: 450,
    padding: 8.750201061605276,
    y_pc: 40,
    branch_spacing: 45,
    theme: [
        "beijing",
        "bj1",
        "#A4343A",
        "#fff"
    ],
    direction: "r",
    current_stn_idx: "l1mz",
    platform_num: "2",
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "l1mz"
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
                "eqkp"
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
            num: "00",
            secondaryName: false
        },
        l1mz: {
            parents: [
                "linestart"
            ],
            children: [
                "iwf6"
            ],
            name: [
                "苹果园",
                "Pingguo Yuan"
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
                            "beijing",
                            "bj6",
                            "#B58500",
                            "#fff",
                            "6号线",
                            "Line 6"
                        ],
                        [
                            "beijing",
                            "s1l",
                            "#A45A2A",
                            "#fff",
                            "S1线",
                            "Line S1"
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
                "vlfi"
            ],
            parents: [
                "l1mz"
            ],
            name: [
                "古城",
                "Gucheng"
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
        vlfi: {
            name: [
                "八角游乐园",
                "Bajiao Amusement Park"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "iwf6"
            ],
            children: [
                "5ita"
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
        '5ita': {
            name: [
                "八宝山",
                "Babaoshan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "vlfi"
            ],
            children: [
                "b2ng"
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
        b2ng: {
            name: [
                "玉泉路",
                "Yuquan Lu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "5ita"
            ],
            children: [
                "d628"
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
        vuve: {
            name: [
                "四惠东",
                "Sihui Dong(E)"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "lf7i"
            ],
            children: [
                "ay50"
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
        d628: {
            name: [
                "万寿路",
                "Wanshou Lu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "b2ng"
            ],
            children: [
                "pd4i"
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
        pd4i: {
            name: [
                "公主坟",
                "Gongzhufen"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "d628"
            ],
            children: [
                "lbjd"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj10",
                            "#0092BC",
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
        lbjd: {
            name: [
                "军事博物馆",
                "Military Museum"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "pd4i"
            ],
            children: [
                "3op8"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj9",
                            "#97D700",
                            "#fff",
                            "9号线",
                            "Line 9"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        '3op8': {
            name: [
                "木樨地",
                "Muxidi"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "lbjd"
            ],
            children: [
                "zfhq"
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
        zfhq: {
            name: [
                "南礼士路",
                "Nanlishi Lu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "3op8"
            ],
            children: [
                "0v5o"
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
        '0v5o': {
            name: [
                "复兴门",
                "Fuxing Men"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "zfhq"
            ],
            children: [
                "fw9b"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj2",
                            "#004B87",
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
        fw9b: {
            name: [
                "西单",
                "Xidan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "0v5o"
            ],
            children: [
                "7s0j"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj4",
                            "#008C95",
                            "#fff",
                            "4号线/大兴线",
                            "Line 4/DAXING Line"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        '7s0j': {
            name: [
                "天安门西",
                "Tian'anmen Xi(W)"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "fw9b"
            ],
            children: [
                "a6rd"
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
        a6rd: {
            name: [
                "天安门东",
                "Tian'anmen Dong(E)"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "7s0j"
            ],
            children: [
                "owpe"
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
        owpe: {
            name: [
                "王府井",
                "Wangfujing"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "a6rd"
            ],
            children: [
                "kehl"
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
        kehl: {
            name: [
                "东单",
                "Dongdan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "owpe"
            ],
            children: [
                "yzrw"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj5",
                            "#AA0061",
                            "#fff",
                            "5号线",
                            "Line 5"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        yzrw: {
            name: [
                "建国门",
                "Jianguo Men"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "kehl"
            ],
            children: [
                "f901"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj2",
                            "#004B87",
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
        f901: {
            name: [
                "永安里",
                "Yong'an Li"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "yzrw"
            ],
            children: [
                "v8cv"
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
        v8cv: {
            name: [
                "国贸",
                "Guomao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "f901"
            ],
            children: [
                "xest"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj10",
                            "#0092BC",
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
        xest: {
            name: [
                "大望路",
                "Dawang Lu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "v8cv"
            ],
            children: [
                "lf7i"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj14",
                            "#CA9A8E",
                            "#fff",
                            "14号线",
                            "Line 14"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        lf7i: {
            name: [
                "四惠",
                "Sihui"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "xest"
            ],
            children: [
                "vuve"
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
        ay50: {
            name: [
                "高碑店",
                "Gaobeidian"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "vuve"
            ],
            children: [
                "g2m7"
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
        g2m7: {
            name: [
                "传媒大学",
                "Communication\\University of China"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ay50"
            ],
            children: [
                "qk3z"
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
        qk3z: {
            name: [
                "双桥",
                "Shuang Qiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "g2m7"
            ],
            children: [
                "b9ib"
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
        b9ib: {
            name: [
                "管庄",
                "Guaanzhuang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "qk3z"
            ],
            children: [
                "431c"
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
        '431c': {
            name: [
                "八里桥",
                "Bali Qiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "b9ib"
            ],
            children: [
                "1s1w"
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
        '1s1w': {
            name: [
                "通州北苑",
                "Tongzhou Beiyuan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "431c"
            ],
            children: [
                "i4pk"
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
        i4pk: {
            name: [
                "果园",
                "Guoyuan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "1s1w"
            ],
            children: [
                "rfzx"
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
        rfzx: {
            name: [
                "九棵树",
                "Jiukeshu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "i4pk"
            ],
            children: [
                "yehq"
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
        yehq: {
            name: [
                "梨园",
                "Liyuan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "rfzx"
            ],
            children: [
                "ofqx"
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
        ofqx: {
            name: [
                "临河里",
                "Linheli"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "yehq"
            ],
            children: [
                "i623"
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
        i623: {
            name: [
                "土桥",
                "Tu Qiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ofqx"
            ],
            children: [
                "sa6k"
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
        sa6k: {
            name: [
                "花庄",
                "Huazhuang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "i623"
            ],
            children: [
                "eqkp"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [
                        [
                            "beijing",
                            "bj7",
                            "#FFC56E",
                            "#fff",
                            "7号线",
                            "Line 7"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        eqkp: {
            name: [
                "环球度假区",
                "Universal Resort"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "sa6k"
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
                            "beijing",
                            "bj7",
                            "#FFC56E",
                            "#fff",
                            "7号线",
                            "Line 7"
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
        "1号线",
        "Line 1"
    ],
    psd_num: "1",
    line_num: "TW",
    info_panel_type: "gz28",
    direction_gz_x: 50,
    direction_gz_y: 70,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 2000,
        runin: 2000,
        railmap: 2500,
        indoor: 2000
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
};

export default params;
