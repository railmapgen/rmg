const params = {
    style: 'shmetro',
    svg_height: 450,
    padding: 3,
    y_pc: 40,
    branch_spacing: 50,
    theme: [
        "shanghai",
        "sh10",
        "#C1A7E2",
        "#000"
    ],
    direction: "l",
    current_stn_idx: "39k5",
    platform_num: false,
    stn_list: {
        linestart: {
            parents: [],
            children: [
                "8elh",
                "l1mz"
            ],
            name: [
                "路綫左端",
                "LEFT END"
            ],
            branch: {
                left: [],
                right: [
                    "through",
                    "8elh"
                ]
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
                "iwf6"
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
                "qua1"
            ],
            name: [
                "航中路",
                "Hangzhong Road"
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
        iwf6: {
            children: [
                "lineend"
            ],
            parents: [
                "235e"
            ],
            name: [
                "基隆路",
                "Jilong Road"
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
        '235e': {
            name: [
                "港城路",
                "Gangcheng Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "z5mf"
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
                    [
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
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        z5mf: {
            name: [
                "高桥",
                "Gaoqiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "cqz1"
            ],
            children: [
                "235e"
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
        cqz1: {
            name: [
                "高桥西",
                "West Gaoqiao"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "j3bx"
            ],
            children: [
                "z5mf"
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
        j3bx: {
            name: [
                "双江路",
                "Shuangjiang Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "n2ay"
            ],
            children: [
                "cqz1"
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
        n2ay: {
            name: [
                "国帆路",
                "Guofan Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "x4kz"
            ],
            children: [
                "j3bx"
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
        x4kz: {
            name: [
                "新江湾城",
                "Xinjiangwancheng"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "pa31"
            ],
            children: [
                "n2ay"
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
        pa31: {
            name: [
                "殷高东路",
                "East Yingao Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "4nf6"
            ],
            children: [
                "x4kz"
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
        '4nf6': {
            name: [
                "三门路",
                "Sanmen Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "jv50"
            ],
            children: [
                "pa31"
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
        jv50: {
            name: [
                "江湾体育场",
                "Jiangwan Stadium"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "j2qt"
            ],
            children: [
                "4nf6"
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
        j2qt: {
            name: [
                "五角场",
                "Wujiaochang"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "nhio"
            ],
            children: [
                "jv50"
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
        nhio: {
            name: [
                "国权路",
                "Guoquan Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "jiq4"
            ],
            children: [
                "j2qt"
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
                            "sh18",
                            "#D6A461",
                            "#000",
                            "18号线",
                            "Line 18"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        jiq4: {
            name: [
                "同济大学",
                "Tongji University"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "5uq1"
            ],
            children: [
                "nhio"
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
        '5uq1': {
            name: [
                "四平路",
                "Siping Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "xmdd"
            ],
            children: [
                "jiq4"
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
                            "sh8",
                            "#00A3E0",
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
        xmdd: {
            name: [
                "邮电新村",
                "Youdian Xincun"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "9l56"
            ],
            children: [
                "5uq1"
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
        '9l56': {
            name: [
                "海伦路",
                "Hailun Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "uzwc"
            ],
            children: [
                "xmdd"
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
                            "sh4",
                            "#5F259F",
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
        uzwc: {
            name: [
                "四川北路",
                "North Sichuan Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "c9cn"
            ],
            children: [
                "9l56"
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
        c9cn: {
            name: [
                "天潼路",
                "Tiantong Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "21qj"
            ],
            children: [
                "uzwc"
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
                            "sh12",
                            "#007B5F",
                            "#fff",
                            "12号线",
                            "Line 12"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        '21qj': {
            name: [
                "南京东路",
                "East Nanjing Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "otr5"
            ],
            children: [
                "c9cn"
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
                            "sh2",
                            "#97D700",
                            "#000",
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
        otr5: {
            name: [
                "豫园",
                "Yuyuan Garden"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "s5gw"
            ],
            children: [
                "21qj"
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
                            "sh14",
                            "#827A04",
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
        s5gw: {
            name: [
                "老西门",
                "Laoximen"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "35wr"
            ],
            children: [
                "otr5"
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
                            "sh8",
                            "#00A3E0",
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
        '35wr': {
            name: [
                "一大会址·新天地",
                "Site of the First CPC\\National Congress · Xintiandi"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "r2iv"
            ],
            children: [
                "s5gw"
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
                            "sh13",
                            "#EF95CF",
                            "#000",
                            "13号线",
                            "Line 13"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        r2iv: {
            name: [
                "陕西南路",
                "South Shaanxi Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "1izj"
            ],
            children: [
                "35wr"
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
                            "sh1",
                            "#E4002B",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ],
                        [
                            "shanghai",
                            "sh12",
                            "#007B5F",
                            "#fff",
                            "12号线",
                            "Line 12"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        '1izj': {
            name: [
                "上海图书馆",
                "Shanghai Library"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "vq27"
            ],
            children: [
                "r2iv"
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
        vq27: {
            name: [
                "交通大学",
                "Jiao Tong University"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "dnhi"
            ],
            children: [
                "1izj"
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
                            "sh11",
                            "#76232F",
                            "#fff",
                            "11号线",
                            "Line 11"
                        ]
                    ]
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        dnhi: {
            name: [
                "虹桥路",
                "Hongqiao Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "pdin"
            ],
            children: [
                "vq27"
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
                ],
                tick_direc: "r",
                paid_area: true,
                osi_names: []
            },
            facility: ""
        },
        pdin: {
            name: [
                "宋园路",
                "Songyuan Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "3p4h"
            ],
            children: [
                "dnhi"
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
        '3p4h': {
            name: [
                "伊犁路",
                "Yili Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "xu0h"
            ],
            children: [
                "pdin"
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
        xu0h: {
            name: [
                "水城路",
                "Shuicheng Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "39k5"
            ],
            children: [
                "3p4h"
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
        '39k5': {
            name: [
                "龙溪路",
                "Longxi Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "cgz8",
                "mb2s"
            ],
            children: [
                "xu0h"
            ],
            branch: {
                left: [
                    "through",
                    "cgz8"
                ],
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
        mb2s: {
            name: [
                "龙柏新村",
                "Longbai Xincun"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "qua1"
            ],
            children: [
                "39k5"
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
        qua1: {
            name: [
                "紫藤路",
                "Ziteng Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "l1mz"
            ],
            children: [
                "mb2s"
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
        cgz8: {
            name: [
                "上海动物园",
                "Shanghai Zoo"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "jgng"
            ],
            children: [
                "39k5"
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
        jgng: {
            name: [
                "虹桥一号航站楼",
                "Hongqiao Airport Terminal 1"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "4h0t"
            ],
            children: [
                "cgz8"
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
        '4h0t': {
            name: [
                "虹桥二号航站楼",
                "Hongqiao Airport Terminal 2"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "8elh"
            ],
            children: [
                "jgng"
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
                            "sh2",
                            "#97D700",
                            "#000",
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
        '8elh': {
            name: [
                "虹桥火车站",
                "Hongqiao Railway Station"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "linestart"
            ],
            children: [
                "4h0t"
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
                            "sh2",
                            "#97D700",
                            "#000",
                            "2号线",
                            "Line 2"
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
        "Line10"
    ],
    psd_num: "1",
    line_num: "10",
    info_panel_type: "sh",
    direction_gz_x: 50,
    direction_gz_y: 70,
    customiseMTRDest: {
        isLegacy: false,
        terminal: false
    },
    svgWidth: {
        destination: 1500,
        runin: 1500,
        railmap: 2500,
        indoor: 3200
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: false
    }
}

export default params;
