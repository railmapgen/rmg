const params = {
    style: 'shmetro',
    svg_height: 450,
    padding: 3.47,
    y_pc: 68.02,
    branch_spacing: 64.32,
    theme: [
        "shanghai",
        "sh12",
        "#007B5F",
        "#fff"
    ],
    direction: "r",
    current_stn_idx: "iwf6",
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
                "cusn"
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
                "虹莘路",
                "Hongxin Road"
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
                "l1mz"
            ],
            parents: [
                "linestart"
            ],
            name: [
                "七莘路",
                "Qixin Road"
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
                "顾戴路",
                "Gudai Road"
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
                    []
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
                "东兰路",
                "Donglan Road"
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
                "虹梅路",
                "Hongmei Road"
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
                "虹漕路",
                "Hongcao Road"
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
                "桂林公园",
                "Guilin Park"
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
                "漕宝路",
                "Caobao Road"
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
                            "sh1",
                            "#E4002B",
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
        orew: {
            parents: [
                "11dr"
            ],
            children: [
                "1i6w"
            ],
            name: [
                "龙漕路",
                "Longcao Road"
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
                            "sh3",
                            "#FFD100",
                            "#000",
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
        '1i6w': {
            parents: [
                "orew"
            ],
            children: [
                "lh7j"
            ],
            name: [
                "龙华",
                "Longhua"
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
                    [
                        [
                            "shanghai",
                            "sh11",
                            "#76232F",
                            "#fff",
                            "11号线",
                            "Line 11"
                        ]
                    ],
                    []
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
                "龙华中路",
                "Middle Longhua Road"
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
                            "sh7",
                            "#FF6900",
                            "#000",
                            "7号线",
                            "Line 7"
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
                "大木桥路",
                "Damuqiao Road"
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
        ebgb: {
            parents: [
                "gicw"
            ],
            children: [
                "ttuu"
            ],
            name: [
                "嘉善路",
                "Jiashan Road"
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
        ttuu: {
            parents: [
                "ebgb"
            ],
            children: [
                "9x2u"
            ],
            name: [
                "陕西南路",
                "South Shaanxi Road"
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
                            "shanghai",
                            "sh1",
                            "#E4002B",
                            "#fff",
                            "1号线",
                            "Line 1"
                        ],
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
        m5bp: {
            parents: [
                "9x2u"
            ],
            children: [
                "4nai"
            ],
            name: [
                "汉中路",
                "Hanzhong Road"
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
                            "sh1",
                            "#E4002B",
                            "#fff",
                            "1号线",
                            "Line 1"
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
        '4nai': {
            parents: [
                "m5bp"
            ],
            children: [
                "dhsq"
            ],
            name: [
                "曲阜路",
                "Qufu Road"
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
                "天潼路",
                "Tiantong Road"
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
        '2q8m': {
            parents: [
                "dhsq"
            ],
            children: [
                "uh7r"
            ],
            name: [
                "国际客运中心",
                "International Cruise Terminal"
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
        uh7r: {
            parents: [
                "2q8m"
            ],
            children: [
                "cwlm"
            ],
            name: [
                "提篮桥",
                "Tilanqiao"
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
                "大连路",
                "Dalian Road"
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
                "江浦公园",
                "Jiangpu Park"
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
                "宁国路",
                "Ningguo Road"
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
                "隆昌路",
                "Longchang Road"
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
                "爱国路",
                "Aiguo Road"
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
        i21j: {
            parents: [
                "r3cg"
            ],
            children: [
                "zloz"
            ],
            name: [
                "复兴岛",
                "Fuxing Island"
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
            secondaryName: false
        },
        zloz: {
            name: [
                "东陆路",
                "Donglu Road"
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
                "巨峰路",
                "Jufeng Road"
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
        r4df: {
            name: [
                "杨高北路",
                "North Yanggao Road"
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
                "金京路",
                "Jinjing Road"
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
                "rgnz"
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
        cusn: {
            name: [
                "金海路",
                "Jinhai Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "rgnz"
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
                            "sh9",
                            "#71C5E8",
                            "#000",
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
        rgnz: {
            name: [
                "申江路",
                "Shenjiang Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "mx89"
            ],
            children: [
                "cusn"
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
        '9x2u': {
            name: [
                "南京西路",
                "West Nanjing Road"
            ],
            secondaryName: false,
            num: "00",
            services: [
                "local"
            ],
            parents: [
                "ttuu"
            ],
            children: [
                "m5bp"
            ],
            branch: {
                left: [],
                right: []
            },
            transfer: {
                info: [
                    [],
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
        }
    },
    line_name: [
        "12号线",
        "Line 12"
    ],
    psd_num: "",
    line_num: "12",
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
        railmap: 2500,
        indoor: 2500
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: true
    }
}

export default params;
