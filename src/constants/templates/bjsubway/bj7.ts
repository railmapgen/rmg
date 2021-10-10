const params = {
    svg_height: 450,
    padding: 8.750201061605276,
    y_pc: 40,
    branch_spacing: 45,
    theme: [
        "beijing",
        "bj7",
        "#FFC56E",
        "#fff"
    ],
    direction: "r",
    current_stn_idx: "l1mz",
    platform_num: "2",
    stn_list: {
        6918: {
            name: [
                "广渠门外",
                "Guangqumen Wai"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "b5ig"
            ],
            children: [
                "f31l"
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
                "gcjy"
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
                "北京西站",
                "Beijing West Railway Station"
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
                            "bj9",
                            "#97D700",
                            "#fff",
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
        iwf6: {
            children: [
                "ydi5"
            ],
            parents: [
                "l1mz"
            ],
            name: [
                "湾子",
                "Wanzi"
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
        ydi5: {
            name: [
                "达官营",
                "Daguanying"
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
                "1h0h"
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
        '1h0h': {
            name: [
                "广安门内",
                "Guang'anmen Nei"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ydi5"
            ],
            children: [
                "jzfd"
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
        jzfd: {
            name: [
                "菜市口",
                "Caishi Kou"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "1h0h"
            ],
            children: [
                "5jwb"
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
        '5jwb': {
            name: [
                "虎坊桥",
                "Hufangqiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "jzfd"
            ],
            children: [
                "d8t0"
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
        d8t0: {
            name: [
                "珠市口",
                "Zhushi Kou"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "5jwb"
            ],
            children: [
                "ibpw"
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
                            "bj8",
                            "#009B77",
                            "#fff",
                            "8号线",
                            "Line 8"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        ibpw: {
            name: [
                "桥湾",
                "Qiaowan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "d8t0"
            ],
            children: [
                "004v"
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
        '004v': {
            name: [
                "磁器口",
                "Ciqi Kou"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ibpw"
            ],
            children: [
                "b5ig"
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
        b5ig: {
            name: [
                "广渠门内",
                "Guangqumen Nei"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "004v"
            ],
            children: [
                "6918"
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
        f31l: {
            name: [
                "双井",
                "Shuangjing"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "6918"
            ],
            children: [
                "u7e2"
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
        u7e2: {
            name: [
                "九龙山",
                "Jiulongshan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "f31l"
            ],
            children: [
                "ngcw"
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
        ngcw: {
            name: [
                "大郊亭",
                "Dajiaoting"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "u7e2"
            ],
            children: [
                "34ps"
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
        '34ps': {
            name: [
                "百子湾",
                "Baiziwan"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ngcw"
            ],
            children: [
                "vsrh"
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
        vsrh: {
            name: [
                "化工",
                "Huagong"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "34ps"
            ],
            children: [
                "tg0b"
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
        tg0b: {
            name: [
                "南楼梓庄",
                "Nanlouzi Zhuang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "vsrh"
            ],
            children: [
                "gtbx"
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
        gtbx: {
            name: [
                "欢乐谷景区",
                "Happy Valley"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "tg0b"
            ],
            children: [
                "nkjt"
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
        nkjt: {
            name: [
                "垡头",
                "Fatou"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "gtbx"
            ],
            children: [
                "t7e5"
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
        t7e5: {
            name: [
                "双合",
                "Shuanghe"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "nkjt"
            ],
            children: [
                "t5yy"
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
        t5yy: {
            name: [
                "焦化厂",
                "Jiaohua Chang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "t7e5"
            ],
            children: [
                "5gr4"
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
        '5gr4': {
            name: [
                "黄厂",
                "Huangchang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "t5yy"
            ],
            children: [
                "itww"
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
        itww: {
            name: [
                "郎辛庄",
                "Langxinzhuang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "5gr4"
            ],
            children: [
                "682f"
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
        '682f': {
            name: [
                "黑庄户",
                "Heizhuanghu"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "itww"
            ],
            children: [
                "ipwb"
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
        ipwb: {
            name: [
                "万盛西",
                "Wansheng Xi(W)"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "682f"
            ],
            children: [
                "qu5i"
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
        qu5i: {
            name: [
                "万盛东",
                "Wansheng Dong(E)"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ipwb"
            ],
            children: [
                "os8u"
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
        os8u: {
            name: [
                "群芳",
                "Qunfang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "qu5i"
            ],
            children: [
                "9e3f"
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
        '9e3f': {
            name: [
                "高楼金",
                "Gaoloujin"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "os8u"
            ],
            children: [
                "3fnb"
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
        '3fnb': {
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
                "9e3f"
            ],
            children: [
                "gcjy"
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
                            "bj1",
                            "#A4343A",
                            "#fff",
                            "1号线/八通线",
                            "Line 1/Batong Line"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        gcjy: {
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
                "3fnb"
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
                            "bj1",
                            "#A4343A",
                            "#fff",
                            "1号线/八通线",
                            "Line 1/Batong Line"
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
        "7号线",
        "Line 7"
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
        railmap: 2000,
        indoor: 2000
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
}

export default params;
