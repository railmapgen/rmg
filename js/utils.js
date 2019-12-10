'use strict';

// function switchBoard(elem) {
//     if (elem.value == 'dest') {
//         $('#editor', parent.document).contents().find('#destination').attr('visibility', 'visible');
//         $('#editor', parent.document).contents().find('#railmap').attr('visibility', 'hidden');
//     } else {
//         $('#editor', parent.document).contents().find('#destination').attr('visibility', 'hidden');
//         $('#editor', parent.document).contents().find('#railmap').attr('visibility', 'visible');
//     }
// }

function putParams(instance) {
    localStorage.setItem('rmgParam', JSON.stringify(instance));
}

function getParams() {
    return JSON.parse(localStorage.rmgParam);
}

function setParams(key, data) {
    var param = getParams();
    param[key] = data;
    putParams(param);
}

function loadLink(id) {
    // var uri = $('#editor', parent.document).contents().find('body').get(0);
    var uri = $(`#${id}`)[0];
    html2canvas(uri).then(function(canvas) {
        var png = canvas.toDataURL('image/png');
        saveAs(png, '1.png')
    });
}

function saveAs(uri, filename) {

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

function isInt2(param, i) {
    return param['stn_list'][i]['change_type']=='int2'
}

function isInt3(param, i) {
    var stn_type = param['stn_list'][i]['change_type'];
    if (['int3l','int3r'].includes(stn_type)) {
        return stn_type;
    } else {
        return false;
    }
}

function isOSI11(param, i) {
    var stn_type = param['stn_list'][i]['change_type'];
    if (stn_type.substring(0,5) == 'osi11') {
        return [stn_type.substring(5,6), stn_type.substring(6,7)];
    } else {
        return false;
    }
}

function isOSI12(stn) {
    var stn_type = stn['change_type'];
    if (stn_type.substring(0,5) == 'osi12') {
        return [stn_type.substring(5,6), stn_type.substring(6,7)];
    } else {
        return false;
    }
}

function getTxtBoxDim(elem, svg) {
    var bcr = elem.getBoundingClientRect();
    var pt = document.getElementById(svg).createSVGPoint();
    pt.x = bcr.left;
    pt.y = bcr.top;
    var ctm = document.getElementById(svg).getScreenCTM();
    var pos = pt.matrixTransform(ctm.inverse());
    return {x:pos.x, y:pos.y, width:bcr.width, height:bcr.height};
}

function wrapText(arr, dy) {
    return $.map(arr, function(txt) {
        var t = txt.split(/\\/g);
        if (t.length == 1) {
            return t;
        } else {
            var res = t[0];
            for (let i=1; i<t.length; i++) {
                res = res + '<tspan x="0" dy="' + dy + '">' + t[i] + '</tspan>';
            }
            return res;
        }
    })
}

function wrapTxt(txt, dy, cls, dd) {
    var dattr = (dd) ? 'dy="10"' : '';
    var t = txt.split(/\\/g);
    // if (t.length == 1) {return [t, 1];}
    var res = `<text class="${cls}" ${dattr}> ${t[0]} `;
    for (let i=1; i<t.length; i++) {
        res = res + '<tspan x="0" dy="' + dy + '">' + t[i] + '</tspan>';
    }
    res += '</text>'
    return [res, t.length];
}

function joinIntName(names, dy1, dy2) {
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

function getStnState(param, i) {
    var current_stn_idx = param['current_stn_idx'];
    var direction = param['direction'];
    if (direction == 'right') {
        return Math.sign(i-current_stn_idx);
    } else {
        return Math.sign(current_stn_idx-i);
    }
}

function getRandomId() {
    return Math.floor(Math.random() * Math.pow(36, 4)).toString(36).padStart(4, '0');
}

function describeParams(param) {
    return `Number of stations: ${Object.keys(param.stn_list).length-2}
            ${Object.entries(param.stn_list).map(x => ['linestart','lineend'].includes(x[0]) ? '' : x[1].name.join(' - ')).join('<br>').trim().replace(/\\/,' ')}`;
}

function countryCode2Emoji(code) {
    var chars = code.toUpperCase().split('');
    if (code.length == 2) {
        return chars.map(char => '&#' + (char.charCodeAt()+127397).toString() + ';').join('');
    } else {
        return '&#127988;' + chars.map(char => '&#' + (char.charCodeAt()+917536).toString() + ';').join('') + '&#917631;';
    }
}

function updateParam() {
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
        }
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
    putParams(param);
}

function testStyle(style) {
    if (style == 'gzmtr') {
        window.myLine = new LineGZ(getParams());
        Line.clearSVG();
        Line.initSVG(myLine);
    }
    if (style == 'mtr') {
        window.myLine = new Line(getParams());
        Line.clearSVG();
        Line.initSVG(myLine);
    }
    
}

function changeStyle(style) {
    setParams('style', style);
    location.reload(true);
}

const langFallback = lang => {
    switch (lang) {
        case 'en': return ['en'];
        case 'zh-Hans': return ['zh-Hans', 'zh', 'en'];
        case 'zh-HK': return ['zh-HK', 'zh-Hant', 'zh', 'en'];
        default: return [lang, 'en'];
    }
}

const getTransText = (obj, lang) => {
    return obj[langFallback(lang).find(l => obj[l])];
}