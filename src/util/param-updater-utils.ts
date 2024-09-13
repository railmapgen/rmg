import { InterchangeGroup, Name, Note, RMGParam, RmgStyle, StationInfo } from '../constants/constants';
import { nanoid } from 'nanoid';
import { MonoColour, Theme, updateTheme } from '@railmapgen/rmg-palette-resources';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';

export const updateParam = (param: { [x: string]: any }) => {
    // Version 0.10
    if (!('line_name' in param)) {
        param.line_name = ['路線名', 'Name of Line'];
    }

    // Version 0.11
    delete param.fontZH;
    delete param.fontEN;
    delete param.weightZH;
    delete param.weightEN;

    // Version 0.12
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('branch' in stnInfo)) {
            param.stn_list[stnId].branch = {};
            if (stnInfo.children.length === 2) {
                param.stn_list[stnId].branch.right = ['through', stnInfo.children[1]];
            }
            if (stnInfo.parents.length === 2) {
                param.stn_list[stnId].branch.left = ['through', stnInfo.parents[1]];
            }
            if (Object.keys(param.stn_list[stnId].branch).length === 0) {
                delete param.stn_list[stnId].branch;
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
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
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
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (stnInfo.change_type === 'osi22_end_p') {
            param.stn_list[stnId].change_type = 'osi22_pr';
        }
        if (stnInfo.change_type === 'osi22_end_u') {
            param.stn_list[stnId].change_type = 'osi22_ur';
        }
    }

    // Version 2.1
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
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
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
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
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('services' in stnInfo)) {
            param.stn_list[stnId].services = ['local'];
        }
        if (!('facility' in stnInfo)) {
            param.stn_list[stnId].facility = stnInfo.usage || undefined;
        } else if (stnInfo.facility === '') {
            param.stn_list[stnId].facility = undefined;
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
        if ('secondaryName' in param.stn_list[stnId]) {
            if (param.stn_list[stnId].secondaryName === false) {
                delete param.stn_list[stnId].secondaryName;
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

    // Version 5.0
    // Add coline and loop default value
    param.coline = param.coline ?? [];
    param.loop = param.loop ?? false;
    param.loop_info =
        param.loop_info === undefined
            ? { bank: true, left_and_right_factor: 0, bottom_factor: 1 }
            : {
                  ...param.loop_info,
                  bottom_factor: Math.max(param.loop_info.bottom_factor, 1),
              };
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as { [x: string]: any })) {
        if (!('loop_pivot' in stnInfo)) {
            param.stn_list[stnId].loop_pivot = false;
        }
    }

    // Version 5.0.0-19
    // convert list of coline to key-value pairs
    if (Array.isArray(param.coline)) {
        param.coline = param.coline.reduce((acc, cur) => ({ ...acc, [nanoid(4)]: cur }), {});
    }

    // Version 5.0.4
    // Convert platform_num from `string | false` to `''`
    if (param.platform_num === false) {
        param.platform_num = '';
    }

    // Version 5.4.4
    // Add one_line switch and int_padding for station
    Object.values(param.stn_list).forEach(stn => {
        const s = stn as StationInfo;
        s.one_line = s.one_line ?? false;
        s.int_padding = s.int_padding ?? (param.loop ? 250 : 355);
    });

    // Version 5.4.19
    if (param.branchSpacingPct === undefined) {
        if (param.style === RmgStyle.SHMetro) {
            param.branchSpacingPct = Math.round((param.branch_spacing / param.svg_height) * 300);
        } else {
            param.branchSpacingPct = Math.round((param.branch_spacing / param.svg_height) * 200);
        }

        delete param.branch_spacing;
    }

    // Version pre 5.10
    v5_10_updateInterchangeGroup(param);

    sanitiseParam(param);
    return param;
};

export const v5_10_updateInterchangeGroup = (param: Record<string, any>) => {
    for (const [stnId, stnInfo] of Object.entries(param.stn_list as Record<string, any>)) {
        const originalInfo: [...Theme, ...Name][][] = stnInfo.transfer.info;
        if (originalInfo) {
            param.stn_list[stnId].transfer.groups = originalInfo.map<InterchangeGroup>((infoGroup, idx) => {
                if (!infoGroup.length) {
                    return { lines: [] };
                }

                return {
                    name: stnInfo.transfer.osi_names[idx - 1],
                    lines: infoGroup.map(info => {
                        const typedInfo = info;
                        return {
                            theme: typedInfo.slice(0, 4) as Theme,
                            name: typedInfo.slice(4, 6) as Name,
                        };
                    }),
                };
            });
        }

        delete param.stn_list[stnId].transfer.info;
        delete param.stn_list[stnId].transfer.osi_names;
    }
};

interface MatchedThemeWithPaths {
    path: string;
    value: Theme;
}

const isTheme = (arr: any[]): boolean => {
    return (
        arr.length === 4 && // length ok
        arr.every(elem => typeof elem === 'string') && // type ok
        !!arr[2].match(/^#[0-9a-fA-F]{6}$/) && // hex ok
        (Object.values(MonoColour) as string[]).includes(arr[3]) // bg ok
    );
};

export const getMatchedThemesWithPaths = (obj: any): MatchedThemeWithPaths[] => {
    const results: MatchedThemeWithPaths[] = [];

    const search = (o: any, currentPath?: string) => {
        if (Array.isArray(o) && isTheme(o)) {
            // push itself if it's theme
            results.push({ path: currentPath || '', value: o as Theme });
            return;
        }

        for (const key in o) {
            const value = o[key];
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            if (Array.isArray(value)) {
                if (isTheme(value)) {
                    results.push({ path: newPath, value: value as Theme });
                } else {
                    value.forEach((it, idx) => search(it, `${newPath}.${idx}`));
                }
            } else if (value && typeof value === 'object') {
                search(value, newPath);
            }
        }
    };

    search(obj);

    return results;
};

export const dottieGet = (obj: any, path: string) => {
    const result: Record<string, any> = {};
    const get = (o: any, currentPaths: string[], remainingPaths: string[]) => {
        let curO = o;
        for (let i = 0; i < remainingPaths.length - 1; i++) {
            if (remainingPaths[i] === '*') {
                Object.keys(curO).forEach(key =>
                    get(curO, [...currentPaths, ...remainingPaths.slice(0, i)], [key, ...remainingPaths.slice(i + 1)])
                );
                return;
            }
            curO = curO?.[remainingPaths[i]];
            if (curO === undefined) {
                return;
            }
        }

        const value = curO?.[remainingPaths[remainingPaths.length - 1]];
        if (value !== undefined) {
            result[[...currentPaths, ...remainingPaths].join('.')] = curO?.[remainingPaths[remainingPaths.length - 1]];
        }
    };
    get(obj, [], path.split('.'));
    return result;
};

const dottieSet = (obj: any, path: string, value: any): void => {
    const pathParts = path.split('.');
    let currentObj: any = obj;
    for (let i = 0; i < pathParts.length - 1; i++) {
        currentObj = currentObj[pathParts[i]];
    }
    currentObj[pathParts[pathParts.length - 1]] = value;
};

export const updateThemes = async (param: RMGParam): Promise<RMGParam> => {
    const startTimestamp = new Date().getTime();

    const matchedThemes = getMatchedThemesWithPaths(param);
    logger.info(`Found all themes pending for update`, matchedThemes);

    const paramCopy: RMGParam = JSON.parse(JSON.stringify(param));

    const TIMEOUT = 5000;
    let timeoutId;
    let aborted = false;
    const updatePromise = new Promise<void>((resolve, reject) => {
        timeoutId = setTimeout(() => {
            aborted = true;
            reject(`Executing time exceeds ${TIMEOUT}ms`);
        }, TIMEOUT);

        (async () => {
            for (const { path, value } of matchedThemes) {
                if (aborted) {
                    throw new Error('Update aborted');
                }

                // do not use Promise.all to void firing hundreds of same requests
                const updatedTheme = await updateTheme(value);
                dottieSet(paramCopy, path, updatedTheme);
            }
        })()
            .then(resolve)
            .catch(reject);
    });

    try {
        await updatePromise;
        logger.info(`Themes update completed, elapsed time ${(new Date().getTime() - startTimestamp) / 1000} sec`);
        return paramCopy;
    } catch (e) {
        logger.warn(
            `Error occurs when updating themes, elapsed time ${(new Date().getTime() - startTimestamp) / 1000} sec`,
            e
        );
        return paramCopy;
    } finally {
        clearTimeout(timeoutId);
    }
};

const SANITISATION_RULES: Record<string, (value: any) => boolean> = {
    notesGZMTR: value => !value?.length,
    'stn_list.*.branch.left': value => !value?.length,
    'stn_list.*.branch.right': value => !value?.length,
    'stn_list.*.branch': value => !value || Object.keys(value).length === 0,
    'stn_list.*.facility': value => !value,
    'stn_list.*.secondaryName': value => !value || value.join(',') === ',',
    'stn_list.*.transfer.groups.*.lines': value => !value?.length,
};

export const sanitiseParam = (param: any) => {
    const clone = structuredClone(param);
    Object.entries(SANITISATION_RULES).forEach(([path, predicate]) => {
        Object.entries(dottieGet(clone, path)).forEach(([exactPath, value]) => {
            logger.debug('Sanitising', exactPath, value);
            if (predicate(value)) {
                dottieSet(clone, exactPath, undefined);
            }
        });
    });

    clone.version = rmgRuntime.getAppVersion();
    return clone;
};
