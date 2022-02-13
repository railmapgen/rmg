import { LanguageCode, Note, RmgStyle, StationInfo, Translation } from './constants/constants';

export const updateParam = (param: { [x: string]: any }) => {
    // Version 0.10
    if (!('line_name' in param)) {
        param.line_name = ['路線名', 'Name of Line'];
    }
    if (!('dest_legacy' in param)) {
        param.dest_legacy = false;
    }

    // Version 0.11
    delete param.fontZH;
    delete param.fontEN;
    delete param.weightZH;
    delete param.weightEN;

    // Version 0.12
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('branch' in stnInfo)) {
            param.stn_list[stnId].branch = { left: [], right: [] };
            if (stnInfo.children.length === 2) {
                param.stn_list[stnId].branch.right = ['through', stnInfo.children[1]];
            } else {
                param.stn_list[stnId].branch.right = [];
            }
            if (stnInfo.parents.length === 2) {
                param.stn_list[stnId].branch.left = ['through', stnInfo.parents[1]];
            } else {
                param.stn_list[stnId].branch.left = [];
            }
        }
    }

    // Version 1.2
    if (!('psd_num' in param)) {
        param.psd_num = '1';
    } else {
        param.psd_num = param.psd_num.toString();
    }

    if (!('line_num' in param)) {
        param.line_num = '1';
    }
    if (param.theme.length === 3) {
        param.theme.push('#fff');
    }

    // Version 1.3
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('num' in stnInfo)) {
            param.stn_list[stnId].num = '00';
        }
        if ('interchange' in stnInfo) {
            stnInfo.interchange.map((arr: any) => {
                return arr.forEach((intInfo: any) => {
                    if (intInfo.length === 5) {
                        intInfo.splice(3, 0, '#fff');
                    }
                });
            });
        }
    }

    // Version 1.5
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (stnInfo.change_type === 'osi22_end_p') {
            param.stn_list[stnId].change_type = 'osi22_pr';
        }
        if (stnInfo.change_type === 'osi22_end_u') {
            param.stn_list[stnId].change_type = 'osi22_ur';
        }
    }

    // Version 2.1
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('interchange' in stnInfo)) {
            param.stn_list[stnId].interchange = [[]];
        }
    }

    // Version 1.4
    // Version 2.2
    // Version 2.3
    if (!('info_panel_type' in param)) {
        param.info_panel_type = 'gz28';
    } else {
        param.info_panel_type = (type => {
            switch (type) {
                case 'gz_1':
                case 'panasonic':
                    return 'gz28';
                case 'gz_2':
                    return 'gz6';
                case 'gz_3':
                    return 'gz3';
                default:
                    return type;
            }
        })(param.info_panel_type);
    }

    if (!('direction_gz_x' in param)) {
        param.direction_gz_x = 50;
    }
    if (!('direction_gz_y' in param)) {
        param.direction_gz_y = 70;
    }

    // Version 2.6
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('transfer' in stnInfo)) {
            param.stn_list[stnId].transfer = {
                // type: stnInfo.change_type?.split('_')[0] as 'none' | 'int2' | 'int3' | 'osi11' | 'osi12' | 'osi22',
                tick_direc:
                    stnInfo.change_type === 'none' || stnInfo.change_type === 'int2'
                        ? 'r'
                        : (stnInfo.change_type?.split('_')[1].split('').slice().reverse()[0] as 'l' | 'r'),
                paid_area:
                    stnInfo.change_type?.indexOf('osi') !== -1 ? stnInfo.change_type?.split('_')[1][0] === 'p' : true,
                osi_names: stnInfo.change_type?.indexOf('osi') !== -1 ? [stnInfo.interchange[1][0]] : [],
                info:
                    stnInfo.interchange.length === 2
                        ? [stnInfo.interchange[0], stnInfo.interchange[1].slice(1)]
                        : stnInfo.interchange,
            };
        }
        delete param.stn_list[stnId].change_type;
        delete param.stn_list[stnId].interchange;
    }

    // Version 2.8
    // Version 3.0
    for (let [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('services' in stnInfo)) {
            param.stn_list[stnId].services = ['local'];
        }
        if (!('facility' in stnInfo)) {
            if ('usage' in stnInfo) {
                param.stn_list[stnId].facility = stnInfo.usage;
            } else {
                param.stn_list[stnId].facility = '';
            }
        }
        delete param.stn_list[stnId].usage;
    }

    // Version 3.4
    if (!('customiseMTRDest' in param)) {
        param.customiseMTRDest = { isLegacy: param.dest_legacy || false, terminal: false };
    }
    delete param.dest_legacy;

    // Version 3.4
    if (!('svgWidth' in param)) {
        param.svgWidth = {
            destination: param.svg_dest_width,
            runin: param.svg_dest_width,
            railmap: param.svg_width,
            indoor: param.svg_width,
        };
    }
    // Version 3.8
    if (!('indoor' in param.svgWidth)) {
        param.svgWidth.indoor = param.svgWidth.railmap;
    }
    delete param.svg_width;
    delete param.svg_dest_width;

    if (!('notesGZMTR' in param)) {
        param.notesGZMTR = [];
    }

    param.notesGZMTR = param.notesGZMTR?.map((note: any[]) =>
        note.length === 4 ? note.concat([false]) : note
    ) as Note[];

    // Version 3.5.3
    delete param.char_form;
    delete param.show_outer;
    delete param.strip_pc;
    delete param.txt_bg_gap;

    // Version 3.5.4
    if (!('namePosMTR' in param)) {
        param.namePosMTR = {
            isStagger: true,
            isFlip: param.txt_flip,
        };
    }
    delete param.txt_flip;

    // Version 3.5.6
    // Version 3.6.2
    Object.keys(param.stn_list).forEach(stnId => {
        if (!('secondaryName' in param.stn_list[stnId])) {
            param.stn_list[stnId].secondaryName = false;
        } else {
            if (param.stn_list[stnId].secondaryName !== false && param.stn_list[stnId].secondaryName.join() === ',') {
                param.stn_list[stnId].secondaryName = false;
            }
        }

        if ('type' in param.stn_list[stnId].transfer) {
            delete param.stn_list[stnId].transfer.type;
        }
    });

    // Version 3.9.36
    // Set unknown and missing style to mtr
    param.style =
        param.style === undefined || !Object.values(RmgStyle).includes(param.style) ? RmgStyle.MTR : param.style;

    param.coline = param.coline ?? [];
    // FIXME: remove this test purpose param
    // param.coline = [
    //     {
    //         from: 'l1mz',
    //         to: 'iwf6',
    //         colors: [
    //             // ['shanghai', 'sh3', '#FFD100', '#fff'],
    //             ['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4'],
    //         ],
    //         display: true,
    //     },
    //     {
    //         from: 'iwf6',
    //         to: 'fcqo',
    //         colors: [['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4']],
    //         display: true,
    //     },
    //     {
    //         from: 's9tt',
    //         to: 'l1mz',
    //         colors: [['shanghai', 'sh4', '#5F259F', '#fff', '4号线', 'Line 4']],
    //         display: true,
    //     },
    // ];

    return param;
};

export const getTransText2 = (obj: Translation, langs: LanguageCode[]) => {
    for (let l of langs) {
        if (obj[l]) return obj[l];
    }
    return obj[LanguageCode.English];
};

/**
 * Format display style of station name as `[num: ]nameZH,nameEN`.
 */
export const formatStnName = (stnInfo: StationInfo, style: RmgStyle) =>
    (style === RmgStyle.GZMTR ? (stnInfo?.num || '-') + ': ' : '') + stnInfo?.name.join().replace('\\', ' ');
