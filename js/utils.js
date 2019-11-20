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

// function isOSI12(param, i) {
//     var stn_type = param['stn_list'][i]['change_type'];
//     if (stn_type.substring(0,5) == 'osi12') {
//         return [stn_type.substring(5,6), stn_type.substring(6,7)];
//     } else {
//         return false;
//     }
// }

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
    var res = `<text class="IntNameZH"> ${nameZH[0]}`;
    for (let i=1; i<nameZH.length; i++) {
        res += `<tspan x="0" dy="${dy1}"> ${nameZH[i]} </tspan>`;
    }
    var btwGap = (nameZH.length == 1) ? 10 : dy2;
    res += `<tspan x="0" dy="${btwGap}" class="IntNameEN"> ${nameEN[0]} </tspan>`
    for (let i=1; i<nameEN.length; i++) {
        res += `<tspan x="0" dy="${dy2}" class="IntNameEN"> ${nameEN[i]} </tspan>`;
    }
    res += '</text>';
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

    if (!('line_name' in param)) {
        param.line_name = ['路線名', 'Name of Line'];
    }
    if (!('dest_legacy' in param)) {
        param.dest_legacy = false;
    }

    putParams(param);
}