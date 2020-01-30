export type ID = string;
export interface BranchInfo {
    left: [string, ID] | [], 
    right: [string, ID] | []
}
export type Name = [string, string];
export interface StationInfo {
    branch: BranchInfo;
    parents: ID[];
    children: ID[];
    [propName: string]: any;
}
export interface StationInfoDict {
    [index: string]: StationInfo;
}
export interface RMGParam {
    stn_list: StationInfoDict;
    [propName: string]: any;
}

export function putParams(instance: RMGParam) {
    localStorage.setItem('rmgParam', JSON.stringify(instance));
}

export function getParams() {
    return JSON.parse(localStorage.rmgParam) as RMGParam;
}

export function setParams(key: string, data: any) {
    let param = getParams();
    param[key] = data;
    putParams(param);
}

export function test(svgEl) {
    var [_, _, svgW, svgH] = svgEl.attr('viewBox').split(' ');

    var canvas = <HTMLCanvasElement> $('canvas')[0];
    $('canvas').attr({
        width: svgW*2.5, height:svgH*2.5
    });
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    svgEl.find('text, tspan').each((_,el) => {
        var elStyle = window.getComputedStyle(el);
        $(el).attr({
            'font-family': elStyle.getPropertyValue('font-family'), 
            'fill': elStyle.getPropertyValue('fill'), 
            'alignment-baseline': elStyle.getPropertyValue('alignment-baseline'), 
            'text-anchor': elStyle.getPropertyValue('text-anchor'),
            'font-size': elStyle.getPropertyValue('font-size')
        }).removeAttr('class');
    });

    svgEl.find('#strip, #dest_strip').each((_,el) => {
        var elStyle = window.getComputedStyle(el);
        $(el).attr({
            'stroke-width': elStyle.getPropertyValue('stroke-width')
        });
    });

    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, 0, 0, svgW*2.5, svgH*2.5);
        saveAs(
            (<HTMLCanvasElement>$('canvas')[0]).toDataURL('image/png'), 
            'rmg_export'
        );
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl[0].outerHTML)));
}

function saveAs(uri: string, filename: string) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);

    } else {
        window.open(uri);
    }
}

export function getTxtBoxDim(elem: SVGGraphicsElement, svg: string) {
    let svgNode = $('#' + svg)[0] as Element as SVGSVGElement;
    let bcr = elem.getBoundingClientRect();
    let pt = svgNode.createSVGPoint();
    let ctm = svgNode.getScreenCTM();
    pt.x = bcr.left;
    pt.y = bcr.top;
    let pos = pt.matrixTransform(ctm.inverse());
    return {x:pos.x, y:pos.y, width:bcr.width, height:bcr.height};
}

export function joinIntName(names: Name, dy1, dy2): [JQuery<HTMLElement>, number, number] {
    var [nameZH, nameEN] = names.map(txt => txt.split(/\\/g));
    var res = $('<text>').addClass('rmg-name__zh IntName').text(nameZH[0]);
    for (let i=1; i<nameZH.length; i++) {
        res = res.append(
            $('<tspan>', {'x':0, 'dy':dy1}).text(nameZH[i])
        );
    }
    var btwGap = (nameZH.length == 1) ? 9 : dy2;
    res = res.append(
        $('<tspan>', {
            'x':0, 'dy':btwGap, 'class': 'rmg-name__en IntName'
        }).text(nameEN[0])
    );
    for (let i=1; i<nameEN.length; i++) {
        res = res.append(
            $('<tspan>', {
                'x':0, 'dy':dy2, 'class': 'rmg-name__en IntName'
            }).text(nameEN[i])
        );
    }
    return [res, nameZH.length, nameEN.length];
}

export function getRandomId() {
    return Math.floor(Math.random() * Math.pow(36, 4)).toString(36).padStart(4, '0');
}

export function describeParams(param: RMGParam) {
    return `Number of stations: ${Object.keys(param.stn_list).length-2}
            ${Object.entries(param.stn_list).map(x => ['linestart','lineend'].includes(x[0]) ? '' : x[1].name.join(' - ')).join('<br>').trim().replace(/\\/,' ')}`;
}

export function countryCode2Emoji(code: string): string {
    var chars = code.toUpperCase().split('');
    if (code.length == 2) {
        return chars.map(char => '&#' + (char.charCodeAt(0)+127397).toString() + ';').join('');
    } else {
        return '&#127988;' + chars.map(char => '&#' + (char.charCodeAt(0)+917536).toString() + ';').join('') + '&#917631;';
    }
}

export function updateParam() {
    var param = getParams();

    // Version 0.10
    if (!('line_name' in param)) {
        param.line_name = ['路線名', 'Name of Line'];
    }
    if (!('dest_legacy' in param)) {
        param.dest_legacy = false;
    }

    // Version 0.11
    if (!('char_form' in param)) {
        param.char_form = (region => {switch (region) {
            case 'KR': return 'trad';
            case 'TC': return 'tw';
            case 'SC': return 'cn';
            case 'JP': return 'jp';
        }})(param.fontZH[0].split(' ').reverse()[0])
    }
    delete param.fontZH;
    delete param.fontEN;
    delete param.weightZH;
    delete param.weightEN;

    // Version 0.12
    for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
        // if (['linestart', 'lineend'].includes(stnId)) {continue;}
        if ('transfer' in stnInfo) {
            delete param.stn_list[stnId].interchange;
            switch (stnInfo.change_type) {
                case 'int2':
                    param.stn_list[stnId].interchange = [[stnInfo.transfer[1]]];
                    break;
                case 'int3_l':
                case 'int3_r':
                    param.stn_list[stnId].interchange = [stnInfo.transfer.slice(1,3)];
                    break;
                case 'osi11_pl':
                case 'osi11_pr':
                case 'osi11_ul':
                case 'osi11_ur':
                    param.stn_list[stnId].interchange = [[], stnInfo.transfer.slice(0,2)];
                    break;
                case 'osi12_pl':
                case 'osi12_pr':
                case 'osi12_ul':
                case 'osi12_ur':
                    param.stn_list[stnId].interchange = [[], stnInfo.transfer];
                    break;
            }
        }
        delete param.stn_list[stnId].transfer;
        
        if (!('branch' in stnInfo)) {
            param.stn_list[stnId].branch = { left:[], right:[] };
            if (stnInfo.children.length == 2) {
                param.stn_list[stnId].branch.right = ['through', stnInfo.children[1]];
            } else {
                param.stn_list[stnId].branch.right = [];
            }
            if (stnInfo.parents.length == 2) {
                param.stn_list[stnId].branch.left = ['through', stnInfo.parents[1]];
            } else {
                param.stn_list[stnId].branch.left = [];
            }
        }
    }

    // Version 1.2
    if (!('psd_num' in param)) {
        param.psd_num = 1;
    }
    if (!('line_num' in param)) {
        param.line_num = 1;
    }
    delete param.style;
    if (param.theme.length == 3) {
        param.theme.push('#fff');
    }
    for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
        if (['linestart', 'lineend'].includes(stnId)) {continue;}
        if (!('num' in stnInfo)) {
            param.stn_list[stnId].num = '00';
        }
    }

    // Version 1.3
    for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
        if ('interchange' in stnInfo) {
            stnInfo.interchange.map(arr => {
                arr.map(intInfo => {
                    if (intInfo.length == 5) {
                        intInfo.splice(3,0,'#fff');
                    }
                });
            });
        }
    }

    // Version 1.4
    if (!('info_panel_type' in param)) {
        param.info_panel_type = 'gz_1';
    }

    // Version 1.5
    for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
        if (stnInfo.change_type === 'osi22_end_p') {
            param.stn_list[stnId].change_type = 'osi22_pr';
        }
        if (stnInfo.change_type === 'osi22_end_u') {
            param.stn_list[stnId].change_type = 'osi22_ur';
        }
    }

   // Version 2.1
   for (let [stnId, stnInfo] of Object.entries(param.stn_list)) {
       if (!('interchange' in stnInfo)) {
           param.stn_list[stnId].interchange = [[]];
       }
   } 
    putParams(param);
}


const langFallback = (lang: string) => {
    switch (lang) {
        case 'en': return ['en'];
        case 'zh-Hans': return ['zh-Hans', 'zh', 'en'];
        case 'zh-HK': return ['zh-HK', 'zh-Hant', 'zh', 'en'];
        default: return [lang, 'en'];
    }
}

export const getTransText = (obj: {[index: string]: string}, lang: string) => {
    return obj[langFallback(lang).find(l => obj[l])];
}
