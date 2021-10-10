const params = {
    svg_height: 450,
    padding: 3.47,
    y_pc: 68.02,
    branch_spacing: 64.32,
    theme: [
        "shanghai",
        "sh13",
        "#EF95CF",
        "#000"
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
                "rgnz"
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
                "金沙江西路",
                "West Jinshajiang Road"
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
                "金运路",
                "Jinyun Road"
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
                "丰庄",
                "Fengzhuang"
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
                "祁连山南路",
                "South Qilianshan Road"
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
                "真北路",
                "Zhenbei Road"
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
                "大渡河路",
                "Daduhe Road"
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
        '5fjd': {
            parents: [
                "f6ez"
            ],
            children: [
                "11dr"
            ],
            name: [
                "金沙江路",
                "Jinshajiang Road"
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
        '11dr': {
            parents: [
                "5fjd"
            ],
            children: [
                "orew"
            ],
            name: [
                "隆德路",
                "Longde Road"
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
        orew: {
            parents: [
                "11dr"
            ],
            children: [
                "1i6w"
            ],
            name: [
                "武宁路",
                "Wuning Road"
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
        '1i6w': {
            parents: [
                "orew"
            ],
            children: [
                "lh7j"
            ],
            name: [
                "长寿路",
                "Changshou Road"
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
                            "sh7",
                            "#FF6900",
                            "#000",
                            "7号线",
                            "Line 7"
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
                "江宁路",
                "Jiangning Road"
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
        gicw: {
            parents: [
                "lh7j"
            ],
            children: [
                "ebgb"
            ],
            name: [
                "汉中路",
                "Hanzhong Road"
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
                "自然博物馆",
                "Shanghai Natural\\History Museum"
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
        ttuu: {
            parents: [
                "ebgb"
            ],
            children: [
                "9x2u"
            ],
            name: [
                "南京西路",
                "West Nanjing Road"
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
                            "sh12",
                            "#007B5F",
                            "#fff",
                            "12号线",
                            "Line 12"
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
                "一大会址·新天地",
                "Site of the First CPC\\National Congress · Xintiandi"
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
        '4nai': {
            parents: [
                "m5bp"
            ],
            children: [
                "dhsq"
            ],
            name: [
                "马当路",
                "Madang Road"
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
        dhsq: {
            parents: [
                "4nai"
            ],
            children: [
                "2q8m"
            ],
            name: [
                "世博会博物馆",
                "World Expo Museum"
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
                "世博大道",
                "Shibo Avenue"
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
                "长清路",
                "Changqing Road"
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
                    [],
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
        cwlm: {
            parents: [
                "uh7r"
            ],
            children: [
                "6d8a"
            ],
            name: [
                "成山路",
                "Chengshan Road"
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
        '6d8a': {
            parents: [
                "cwlm"
            ],
            children: [
                "8qia"
            ],
            name: [
                "东明路",
                "Dongming Road"
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
                            "sh6",
                            "#D9027D",
                            "#fff",
                            "6号线",
                            "Line 6"
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
                "华鹏路",
                "Huapeng Road"
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
                "下南路",
                "Xia'nan Road"
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
                "北蔡",
                "Beicai"
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
                "陈春路",
                "Chenchun Road"
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
                "莲溪路",
                "Lianxi Road"
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
        '5ltj': {
            name: [
                "华夏中路",
                "Middle Huaxia Road"
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
                            "sh16",
                            "#2CD5C4",
                            "#000",
                            "16号线",
                            "Line 16"
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
                "中科路",
                "Zhongke Road"
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
                "学林路",
                "Xuelin Road"
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
        rgnz: {
            name: [
                "张江路",
                "Zhangjiang Road"
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
        '9x2u': {
            name: [
                "淮海中路",
                "Middle Huaihai Road"
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
        "13号线",
        "Line 13"
    ],
    psd_num: "",
    line_num: "13",
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
        indoor: 3000
    },
    notesGZMTR: [],
    namePosMTR: {
        isStagger: true,
        isFlip: true
    }
}

export default params;
