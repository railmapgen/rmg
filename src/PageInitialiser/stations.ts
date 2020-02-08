import { getParams, countryCode2Emoji, getTransText, rgb2Hex } from '../utils';
import { ID, StationInfo, Name, DirectionLong, NeighbourPl } from '../utils';
import { MDCDialog } from '@material/dialog';
import { MDCSelect } from '@material/select';
import { MDCTextField } from '@material/textfield';
import { MDCTabBar } from '@material/tab-bar';
import { MDCIconButtonToggle } from '@material/icon-button';
import { MDCChipSet } from '@material/chips';
import { InterchangeInfo, IntInfoTag } from '../Station/Station';

const getStationCard = (id: ID, names: Name, num: string) => {
    return $('<div>', {
        id: id, 
        class: 'mdc-card mdc-layout-grid__cell--span-2-desktop mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-2-phone station-card'
    })
        .append(
            $('<div>', { class: 'mdc-card__primary-action'})
                .append($('<div>', { class: 'mdc-card__media mdc-card__media--16-9' }))
                .append(
                    $('<div>', { class: 'mdc-card__media-content station-card__content'})
                        .html(names.join('<br>'))
                        .prepend(
                            $('<span>')
                                .css('display', window.urlParams.get('style') === 'gzmtr' ? 'inline' : 'none')
                                .text(num + '\u00a0')
                        )
                )
        )
        .append(
            $('<div>', { class: 'mdc-card__actions' })
                .append(
                    $('<div>', { class: 'mdc-card__action-icons' })
                        .append(
                            $('<button>', {
                                title: 'Set As Current', 
                                class: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon'
                            })
                                .text('my_location')
                        )
                        .append(
                            $('<button>', {
                                title: 'Interchange', 
                                class: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon'
                            })
                                .text('edit')
                        )
                        .append(
                            $('<button>', {
                                title: 'Remove', 
                                class: 'material-icons mdc-icon-button mdc-card__action mdc-card__action--icon'
                            })
                                .text('delete_forever')
                        )
                )
        );
};

const getIntBoxChip = (intInfo: InterchangeInfo) => {
    let chipEl = $('<div>', { class: 'mdc-chip', role: 'row' })
        .css({
            'background-color': intInfo[IntInfoTag.colour], 
            color: intInfo[IntInfoTag.fg]
        })
        .data('theme', {
            city: intInfo[IntInfoTag.city], 
            line: intInfo[IntInfoTag.line]
        })
        .append($('<div>', { class: 'mdc-chip__ripple' }))
        .append(
            $('<span>', { role: 'gridcell' })
                .append(
                    $('<span>', { role: 'button', tabindex: 0, class: 'mdc-chip__text' })
                        .html(intInfo[IntInfoTag.nameZH] + '<br>' + intInfo[IntInfoTag.nameEN])
                )
        )
        .append(
            $('<span>', { role: 'gridcell' })
                .append(
                    $('<i>', { class: 'material-icons mdc-chip__icon mdc-chip__icon--trailing', tabindex: -1, role: 'button' })
                        .text('cancel')
                )
        );
    return chipEl[0];
};

const getIntInfoFromChip = (chip: HTMLDivElement) => {
    return [
        $(chip).data('theme').city, 
        $(chip).data('theme').line, 
        rgb2Hex($(chip).css('background-color')), 
        rgb2Hex($(chip).css('color')), 
        $(chip).find('.mdc-chip__text').html().split('<br>')[0], 
        $(chip).find('.mdc-chip__text').html().split('<br>')[1]
    ] as InterchangeInfo;
};

const getStnIntFromChipSets = (sets: HTMLDivElement[], osifields?: MDCTextField[]) => {
    let info = sets.map(set => {
        return $(set).find('.mdc-chip').get().map(el => getIntInfoFromChip(el));
    });
    let ns = info
        .map(int => int.length)
        .filter(x => x!==0);
    let changeType: string;
    if (ns[0] === 3 && ns[1] === 0) {
        changeType = 'int3'; // was int4
    } else if (ns[0] === 2 && ns[1] === 1) {
        changeType = 'osi11'; // was osi31
    } else if (ns[0] === 2 && ns[1] === 0) {
        changeType = 'int3'
    } else if (ns[0] === 1 && ns[1] === 2) {
        changeType = 'osi22'; 
    } else if (ns[0] === 1 && ns[1] === 1) {
        changeType = 'osi21';
    } else if (ns[0] === 1 && ns[1] === 0) {
        changeType = 'int2';
    } else if (ns[0] === 0 && ns[1] === 3) {
        changeType = 'int3'; // was osi13;
    } else if (ns[0] === 0 && ns[1] === 2) {
        changeType = 'osi12';
    } else if (ns[0] === 0 && ns[1] === 1) {
        changeType = 'osi11';
    } else if (ns[0] === 0 && ns[1] === 0) {
        changeType = 'none';
    } else {
        // sum(ns) > 3
        changeType = 'int3';
    }
    return { info, changeType };
};

export function common() {


    // Duplicate element
    var intNameEl = $('#stn_edit_diag .mdc-layout-grid__inner #int_name_zh,#int_name_en').slice(0,2).clone();
    intNameEl.find('.mdc-text-field').removeAttr('data-mdc-auto-init-state'); // to be removed
    $('div#int_line').slice(1,3).after(intNameEl);

    // mdc instances
    const [stnAddDialog, stnModifyDialog, stnEditDialog, stnIntBoxDialog, stnDeleteDialog, stnDeleteErrDialog] = 
        ['#stn_add_diag', '#stn_modify_diag', '#stn_edit_diag', '#stn_intbox_diag', '#stn_delete_diag', '#stn_delete_err']
            .map(selector => new MDCDialog($(selector)[0]));
    
    const [stnAddPrepSelect, stnAddPivotSelect, stnAddLocSelect, stnAddEndSelect] = 
        ['#prep', '#pivot', '#loc', '#end'].map(selector => new MDCSelect($('#stn_add_diag').find(selector)[0]));

    const stnModifyNameFields = 
        ['#name_zh', '#name_en'].map(selector => new MDCTextField($('#stn_modify_diag').find(selector)[0]));
    const stnModifyNumField = new MDCTextField($('#stn_modify_diag #stn_num')[0]);

    const intChipSetEls = $('#stn_edit_diag .mdc-chip-set').get() as HTMLDivElement[];
    const intChipSets = intChipSetEls.map(el => new MDCChipSet(el));
    const intCitySelect = new MDCSelect($('#int_city')[0]);
    const intLineSelect = new MDCSelect($('#int_line')[0]);
    const intBoxNameFields = ['zh', 'en'].map(lang => new MDCTextField($('#stn_intbox_diag').find('#name_'+lang)[0]));

    const stnTransferTabBar = new MDCTabBar($('#stn_edit_diag .mdc-tab-bar')[0]);
    // const changeTypeSelect = new MDCSelect($('#change_type')[0]);
    // const intCitySelects = $('#int_city .mdc-select').map((_,el) => new MDCSelect(el)).get();
    // const intLineSelects = $('#int_line .mdc-select').map((_,el) => new MDCSelect(el)).get();
    // const intNameFields = ['zh', 'en']
    //     .map(lang => $(`div#int_name_${lang}`).find('.mdc-text-field').map((_,el) => new MDCTextField(el)).get());
    const stnOSINameFields = 
        ['zh', 'en'].map(lang => new MDCTextField($('#stn_edit_diag').find(`#osi_name_${lang}`)[0]));
    // const [tickDirecToggle, paidAreaToggle] = 
    //     ['#tick_direc', '#paid_area'].map(selector => new MDCIconButtonToggle($('#stn_edit_diag').find(selector)[0]));

    const [throughSelects, firstSelects, posSelects] = 
        ['through', 'first', 'pos']
            .map(selector => ['left', 'right'].map(direc => new MDCSelect($(`#${direc}_${selector}`)[0])));

    var stnList = getParams().stn_list;
    window.myLine.tpo.forEach(stnId => {
        $('#panel_stations .mdc-layout-grid__inner:first').append(getStationCard(stnId, stnList[stnId].name, stnList[stnId].num));
        $('#pivot__selection').append(
            $('<li>', {'data-value':stnId}).addClass('mdc-list-item').text(stnList[stnId].name.join())
        );
    });

    $('#panel_stations .mdc-card__primary-action').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        if (stnId == 'add_stn') {return;}
        $('#stn_modify_diag').attr('for', stnId);
        stnModifyDialog.open();
    });
    $('#panel_stations .mdc-card__action-icons > [title="Add"]').on('click', event => {
        stnAddDialog.open();
    });
    $('#panel_stations .mdc-card__action-icons > [title="Set As Current"]').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        window.myLine.currentStnId = stnId;
    });
    $('#panel_stations .mdc-card__action-icons > [title="Interchange"]').on('click', event => {
        $('#stn_edit_diag').attr('for', event.target.closest('.mdc-card').id)
        stnEditDialog.open();
    });
    $('#panel_stations .mdc-card__action-icons > [title="Remove"]').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        $('#stn_delete_diag').attr('for', stnId);
        stnDeleteDialog.open();
    });


    // Addition
    stnAddDialog.listen('MDCDialog:opening', () => {
        stnAddPivotSelect.selectedIndex = 0;
    });
    stnAddDialog.listen('MDCDialog:opened', () => {
        [stnAddPrepSelect, stnAddPivotSelect, stnAddLocSelect].forEach(select => select.layout());
    });
    stnAddDialog.listen('MDCDialog:closed', (event: any) => {
        if (event.detail.action == 'close') {return;}

        var prep = stnAddPrepSelect.value as 'before' | 'after';
        var stnId = stnAddPivotSelect.value;
        var loc = stnAddLocSelect.value;
        var end = stnAddEndSelect.value;
        
        var [newId, newInfo] = window.myLine.addStn(prep, stnId, loc, end);

        console.log(prep, stnId, loc, end);
        // _genStnList();
        var prevId = window.myLine.tpo[window.myLine.tpo.indexOf(newId) - 1] || 'add_stn';
        $(`#panel_stations .mdc-layout-grid__inner:first #${prevId}`).after(getStationCard(newId, newInfo.name, newInfo.num));
        // Add event listeners
        $(`#panel_stations #${newId} .mdc-card__primary-action`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            if (stnId == 'add_stn') {return;}
            $('#stn_modify_diag').attr('for', stnId);
            stnModifyDialog.open();
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Set As Current"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            window.myLine.currentStnId = stnId;
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Interchange"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            $('#stn_edit_diag').attr('for', stnId);
            stnEditDialog.open();
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Remove"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            $('#stn_delete_diag').attr('for', stnId);
            stnDeleteDialog.open();
        });

        var listElem = $('<li>', {
            'data-value': newId, 'class': 'mdc-list-item'
        }).text(newInfo.name.join(' - '));
        if (prevId == 'add_stn') {
            $('#pivot__selection').prepend(listElem);
        } else {
            $(`#pivot__selection [data-value="${prevId}"`).after(listElem);
        }

        // Trigger station name modification
        $('#stn_modify_diag').attr('for', newId);
        stnModifyDialog.open();
    });
    stnAddPrepSelect.listen('MDCSelect:change', event => {
        $('#stn_add_diag #pivot')[0].dispatchEvent(new Event('MDCSelect:change'));
    });
    stnAddPivotSelect.listen('MDCSelect:change', event => {
        var prep = stnAddPrepSelect.value as 'before' | 'after';
        var stnId = stnAddPivotSelect.value;
        var stnList = getParams().stn_list;
        for (let [idx, state] of window.myLine.newStnPossibleLoc(prep, stnId).entries()) {
            if (state === 1 || (<ID[]>state).length) {
                $('#loc__selection li').eq(idx).show();
                if (idx >= 3) {
                    // newupper or newlower
                    $('#end__selection').empty();
                    (<ID[]>state).forEach(stnId => {
                        $('#end__selection').append(
                            $('<li>', { class:'mdc-list-item', 'data-value':stnId }).text(stnList[stnId].name.join(' - '))
                        );
                    });
                }
            } else {
                $('#loc__selection li').eq(idx).hide();
            }
        }
        // stnAddLocSelect.value = $('#loc__selection li:not([style="display: none;"]):first').attr('data-value');
        stnAddLocSelect.value = Array
            .from(document.querySelectorAll('#loc__selection li') as NodeListOf<HTMLElement>)
            .filter(el => el.style.display !== 'none')[0]
            .dataset.value;
    });
    stnAddLocSelect.listen('MDCSelect:change', (event: any) => {
        if (['newupper', 'newlower'].includes(event.detail.value)) {
            // $('#stn_add_diag #new_branch').show();
            $('#stn_add_diag [new-branch]').show();
            stnAddEndSelect.selectedIndex = 0;
        } else {
            // $('#stn_add_diag #new_branch').hide();
            $('#stn_add_diag [new-branch]').hide();
        }
    });


    // Modification (Name)
    stnModifyDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        Promise.resolve(getParams().stn_list)
            .then(stnList => {
                stnModifyNameFields.forEach((textfield, i) => textfield.value = stnList[stnId].name[i]);
                stnModifyNumField.value = stnList[stnId].num;
            });
    });

    stnModifyDialog.listen('MDCDialog:opened', () => {
        stnModifyNameFields.map(textfield => textfield.layout());
        stnModifyNumField.layout();
    });

    $('#stn_modify_diag').find('#name_zh, #name_en, #stn_num').on('input', () => {
        let names = stnModifyNameFields.map(textfield => textfield.value) as Name;
        var stnNum = stnModifyNumField.value;

        var stnId = $('#stn_modify_diag').attr('for');
        window.myLine.updateStnName(stnId, names, stnNum);
        $(`#panel_stations .mdc-layout-grid__inner:first #${stnId} .mdc-card__media-content`)
            .html(names.join('<br>'))
            .prepend($('<span>', { style:(window.urlParams.get('style')=='gzmtr' ? '' : 'display:none;')}).text(stnNum+' '));
        $(`li[data-value="${stnId}`).text(names.join());
    });


    // Modification (Interchange)
    const focusInterchange = () => {
        // changeTypeSelect.layout();
        // intCitySelects.forEach(select => select.layout());
        // intLineSelects.forEach(select => select.layout());
        // [].concat(...intNameFields).forEach(textfield => textfield.layout());
        stnOSINameFields.forEach(textfield => textfield.layout());
    };
    const focusBranch = () => {
        [...throughSelects, ...firstSelects, ...posSelects]
            .map(select => select.layout());
    };

    const initInterchange = (stnInfo: StationInfo) => {
        $(intChipSetEls).empty();

        stnInfo.interchange.forEach((infos, i) => {
            infos.forEach((info, j) => {
                // skip osi name
                if (i > 0 && j === 0) {return;}

                let chipEl = getIntBoxChip(info);
                intChipSetEls[i].appendChild(chipEl);
                intChipSets[i].addChip(chipEl);
            });
        });

        // // hide trailing icon if 1 chip only
        // intChipSetEls.forEach(el => {
        //     if ($(el).find('.mdc-chip').length === 1) {
        //         $(el).find('.mdc-chip__icon--trailing').parent().hide();
        //     }
        // });

        if (stnInfo.interchange.length === 2) {
            stnOSINameFields[0].value = stnInfo.interchange[1][0][0];
            stnOSINameFields[1].value = stnInfo.interchange[1][0][1];
        }
    };

    const initBranch = (stnInfo: StationInfo) => {
        // through type
        ['left', 'right'].forEach(direc => {
            let throughType = stnInfo.branch[direc][0];
            if (throughType) {
                throughSelects[DirectionLong[direc]].value = throughType;
                $(`#${direc}_through__selection [data-value="na"]`).hide();
                $(`#${direc}_through__selection [data-value="through"]`).show();
                $(`#${direc}_through__selection [data-value="nonthrough"]`).show();

                $(`[${direc}-first-group], [${direc}-pos-group]`).show();
            } else {
                throughSelects[DirectionLong[direc]].value = 'na';
                $(`#${direc}_through__selection [data-value="na"]`).show();
                $(`#${direc}_through__selection [data-value="through"]`).hide();
                $(`#${direc}_through__selection [data-value="nonthrough"]`).hide();

                $(`[${direc}-first-group], [${direc}-pos-group]`).hide();
            }
        });

        // first station
        $('#left_first__selection, #right_first__selection').empty();
        Promise.resolve(getParams().stn_list)
            .then(stnList => {
                [0, 1].forEach(i => {
                    stnInfo[NeighbourPl[i] as 'parents' | 'children']
                        .forEach(ne => {
                            $(`#${DirectionLong[i]}_first__selection`)
                                .append(
                                    $('<li>', { class: 'mdc-list-item', 'data-value': ne})
                                        .text(stnList[ne].name.join())
                                );
                        });
                });
            })
            .then(() => {
                throughSelects.forEach((select, idx) => {
                    firstSelects[idx].selectedIndex = 
                        select.value !== 'na' ?
                        stnInfo[NeighbourPl[idx]].indexOf(stnInfo.branch[DirectionLong[idx]][1]) :
                        0;
                });
            });
        
        // swap position
        posSelects.forEach((select, i) => {
            select.selectedIndex = stnInfo[NeighbourPl[i]].indexOf(stnInfo.branch[DirectionLong[i]][1])
        });
    };

    stnTransferTabBar.listen('MDCTabBar:activated', (event: any) => {
        switch (event.detail.index) {
            case 0:
                $('#panel_interchange').show();
                $('#panel_branch').hide();
                focusInterchange();
                break;
            case 1:
                $('#panel_interchange').hide();
                $('#panel_branch').show();
                focusBranch();
        }
    });

    $.getJSON('data/city_list.json', data => {
        var lang = window.urlParams.get('lang');
        data.forEach(c => {
            $('#int_city__selection.mdc-list').each((_,el) => {
                $(el).append(
                    $('<li>', { class: 'mdc-list-item', 'data-value': c.id})
                        .text(countryCode2Emoji(c.country) + getTransText(c.name, lang))
                );
            });
        });
    });



    // function _showAllFields(n, show) {
    //     if (show) {
    //         $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).show();
    //         intCitySelects[n].layout();
    //         intLineSelects[n].layout();
    //         intNameFields.map(fields => fields[n].layout());
    //     } else {
    //         $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).hide();
    //     }
    // }

    stnEditDialog.listen('MDCDialog:opening', event => {
        let stnId = $(event.target).attr('for');
        let stnInfo = getParams().stn_list[stnId];

        initInterchange(stnInfo);

        // var stnId = $(event.target).attr('for');
        // var stnInfo = getParams().stn_list[stnId];
        // let lineThemeCity = getParams().theme[0];

        // changeTypeSelect.value = stnInfo.change_type.split('_')[0];

        // if (stnInfo.change_type !== 'none') {
        //     var allInterchanges = stnInfo.interchange[0].concat(
        //         stnInfo.interchange[1] ? stnInfo.interchange[1].slice(1,stnInfo.interchange[1].length) : []
        //     );
        //     if (allInterchanges.length < 3) {
        //         allInterchanges.unshift([,,,,,,]);
        //     }
        //     if (allInterchanges.length < 3) {
        //         allInterchanges.push([,,,,,,]);
        //     }
        //     console.log(allInterchanges)
        //     allInterchanges.forEach((intInfo, idx) => {
        //         let cIdx = $('#int_city__selection.mdc-list').eq(0).find(`[data-value="${intInfo[0] || lineThemeCity}"]`).index();
        //         intCitySelects[idx].selectedIndex = cIdx;
        //         intNameFields.forEach((fields, i) => fields[idx].value = intInfo[4+i] || '');
        //     });
        // } else {
        //     let cIdx = $('#int_city__selection.mdc-list').eq(0).find(`[data-value="${lineThemeCity}"]`).index();
        //     intCitySelects.forEach(select => select.selectedIndex = cIdx);
        //     [].concat(...intNameFields).forEach(textfield => textfield.value = '');
        // }

        // if (['none', 'int2'].includes(stnInfo.change_type.split('_')[0])) {
        //     tickDirecToggle.on = true;
        // } else {
        //     tickDirecToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        // }

        // if (stnInfo.change_type.substring(0,3) == 'osi') {
        //     stnOSINameFields.forEach((textfield,i) => textfield.value = stnInfo.interchange[1][0][i]);
        //     paidAreaToggle.on = (stnInfo.change_type.split('_').reverse()[0][0] == 'p');
        // } else {
        //     stnOSINameFields.forEach(textfield => textfield.value = '');
        //     paidAreaToggle.on = true;
        // }

        // Branch
        initBranch(stnInfo);
    });

    stnEditDialog.listen('MDCDialog:opened', event => {
        focusInterchange();
        focusBranch();
    });

    intChipSets.forEach((chipset, i) => {
        chipset.listen('MDCChip:interaction', (event: CustomEvent) => {
            // setIdx (0: int, 1: osi)
            $('#stn_intbox_diag').data('intId', { setIdx: i, chipId: event.detail.chipId });
            stnIntBoxDialog.open();
        });
    });

    intChipSets.forEach((chipset, i) => {
        chipset.listen('MDCChip:removal', () => {
            console.log(getStnIntFromChipSets(intChipSetEls, stnOSINameFields));

            // // hide trailing icon if 1 chip left
            // if ($(intChipSetEls[i]).find('.mdc-chip').length === 1) {
            //     $(intChipSetEls[i]).find('.mdc-chip__icon--trailing').parent().hide();
            // }
        });
    });

    stnIntBoxDialog.listen('MDCDialog:opening', (event) => {
        let { setIdx, chipId } = $(event.target).data('intId');
        let { city, line } = $(intChipSetEls[setIdx]).find('#'+chipId).data('theme');
        intCitySelect.value = city;

        let intNames = $(intChipSetEls[setIdx])
            .find('#'+chipId)
            .find('.mdc-chip__text')
            .html().split('<br>');
        intBoxNameFields.forEach((textfield, i) => textfield.value = intNames[i]);
    });

    stnIntBoxDialog.listen('MDCDialog:opened', (event) => {
        intBoxNameFields.map(textfield => textfield.layout());
    });

    intCitySelect.listen('MDCSelect:change', (event: CustomEvent) => {
        if (event.detail.index === -1) {return;}

        let { setIdx, chipId } = $('#stn_intbox_diag').data('intId');

        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = window.urlParams.get('lang');
            $('#int_line__selection.mdc-list').empty();
            data.forEach(l => {
                $('#int_line__selection.mdc-list').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};color:${l.fg || '#fff'};">&nbsp;${getTransText(l.name, lang)}&nbsp;</span>
                    </li>`
                );
            });

            // select default intLine value
            let { line } = $(intChipSetEls[setIdx]).find('#'+chipId).data('theme');
            let lineIdx = $('#int_line__selection.mdc-list').find(`[data-value=${line}]`).index();
            intLineSelect.selectedIndex = lineIdx===-1 ? 0 : lineIdx;
        });

        // update data value of chip element
        $(intChipSetEls[setIdx]).find('#'+chipId).data('theme').city = event.detail.value;
    });

    intLineSelect.listen('MDCSelect:change', (event: CustomEvent) => {
        let { value, index } = event.detail;
        let { setIdx, chipId } = $('#stn_intbox_diag').data('intId');

        // update data value of chip element
        $(intChipSetEls[setIdx]).find('#'+chipId).data('theme').line = value;

        // update colour of chip
        $(intChipSetEls[setIdx]).find('#'+chipId).css({
            'background-color': $('#int_line__selection span').eq(index).css('background-color'), 
            color: $('#int_line__selection span').eq(index).css('color')
        });
    });

    intBoxNameFields.forEach(textfield => {
        ($(textfield.root_).find('input') as JQuery<HTMLInputElement>)
            .on('input', () => {
                let { setIdx, chipId } = $('#stn_intbox_diag').data('intId');
                $(intChipSetEls[setIdx])
                    .find('#'+chipId)
                    .find('.mdc-chip__text')
                    .html(intBoxNameFields[0].value + '<br>' + intBoxNameFields[1].value);
            });
    });

    stnIntBoxDialog.listen('MDCDialog:closed', () => {
        console.log(getStnIntFromChipSets(intChipSetEls, stnOSINameFields));
    });

    // stnEditDialog.listen('MDCDialog:closed', (event: any) => {
    //     if (event.detail.action == 'close') {return;}

    //     // var stnId = $('#panel_stations #selected_stn').attr('stn');
    //     var stnId = event.target.getAttribute('for');
    //     var type = changeTypeSelect.value;
    //     var tickDirec = tickDirecToggle.on ? 'r' : 'l';
    //     let osi = stnOSINameFields.map(textfield => textfield.value);
    //     var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';

    //     var [intInfo0, intInfo1, intInfo2] = [0,1,2].map(idx => {
    //         return [intCitySelects[idx].value, intLineSelects[idx].value]
    //             .concat(
    //                 $('ul#int_line__selection').eq(idx).find('li span')
    //                     .eq(intLineSelects[idx].selectedIndex)
    //                     .attr('style').match(/#[\w\d]+/g), 
    //                 ...intNameFields.map(fields => fields[idx].value)
    //             );
    //     });
    //     if (type == 'none') {
    //         window.myLine.updateStnTransfer(stnId, type);
    //     } else if (type == 'osi22') {
    //         window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[intInfo0], [osi, intInfo1, intInfo2]]);
    //     } else {
    //         switch (type) {
    //             case 'int2':
    //                 // window.myLine.updateStnTransfer(stnId, type, [[], intInfo1, []]);
    //                 window.myLine.updateStnTransfer(stnId, type, [[intInfo1]]);
    //                 break;
    //             case 'osi11':
    //                 // window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
    //                 window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1]]);
    //                 break;
    //             default:
    //                 switch (type) {
    //                     case 'int3':
    //                         // window.myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
    //                         window.myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[intInfo1, intInfo2]]);
    //                         break;
    //                     case 'osi12':
    //                         // window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
    //                         window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1, intInfo2]]);
    //                 }
    //         }
    //     }
    // })

    // changeTypeSelect.listen('MDCSelect:change', (event: any) => {
    //     if (event.detail.value == 'int2') {
    //         _showAllFields(0, false);
    //         _showAllFields(1, true);
    //         _showAllFields(2, false);
    //         $('#stn_edit_diag #tick_direc').hide();
    //         $('#osi_name_zh, #osi_name_en, #paid_area').hide();
    //     } else if (event.detail.value == 'int3') {
    //         _showAllFields(0, false);
    //         _showAllFields(1, true);
    //         _showAllFields(2, true);
    //         $('#stn_edit_diag #tick_direc').show();
    //         $('#osi_name_zh, #osi_name_en, #paid_area').hide();
    //     } else if (event.detail.value == 'osi11') {
    //         _showAllFields(0, false);
    //         _showAllFields(1, true);
    //         _showAllFields(2, false);
    //         $('#stn_edit_diag #tick_direc').show();
    //         $('#osi_name_zh, #osi_name_en, #paid_area').show();
    //     } else if (event.detail.value == 'osi12') {
    //         _showAllFields(0, false);
    //         _showAllFields(1, true);
    //         _showAllFields(2, true);
    //         $('#stn_edit_diag #tick_direc').show();
    //         $('#osi_name_zh, #osi_name_en, #paid_area').show();
    //     } else if (event.detail.value == 'osi22') {
    //         // $('#stn_edit_diag .mdc-dialog__content [id]div, #paid_area').slice(1).show()
    //         _showAllFields(0, true);
    //         _showAllFields(1, true);
    //         _showAllFields(2, true);
    //         $('#osi_name_zh, #osi_name_en, #paid_area').show();
    //         let stnInfo = getParams().stn_list[$('#stn_edit_diag').attr('for')];
    //         if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
    //             $('#tick_direc').hide();
    //         } else {
    //             $('#tick_direc').show();
    //         }
    //     } else {
    //         $('#stn_edit_diag #panel_interchange [id]div').slice(1).hide()
    //         $('#tick_direc, #paid_area').hide()
    //     }
    // });

    // intCitySelects.forEach((select, idx) => {
    //     select.listen('MDCSelect:change', (event: any) => {
    //         if (event.detail.index === -1) {return;}
    //         $.getJSON(`data/${event.detail.value}.json`, data => {
    //             var lang = window.urlParams.get('lang');
    //             $('#int_line__selection.mdc-list').eq(idx).empty();
    //             data.forEach(l => {
    //                 $('#int_line__selection.mdc-list').eq(idx).append(
    //                     `<li class="mdc-list-item" data-value="${l.id}">
    //                     <span style="background:${l.colour};color:${l.fg || '#fff'};">&nbsp;${getTransText(l.name, lang)}&nbsp;</span>
    //                     </li>`
    //                 );
    //             });

    //             var stnId = $('#stn_edit_diag').attr('for');
    //             var stnInfo = getParams().stn_list[stnId];
    //             if (stnInfo.change_type !== 'none') {
    //                 var allInterchanges = stnInfo.interchange[0].concat(
    //                     stnInfo.interchange[1] ? stnInfo.interchange[1].slice(1,stnInfo.interchange[1].length) : []
    //                 );
    //                 if (allInterchanges.length < 3) {
    //                     allInterchanges.unshift([,,,,,,]);
    //                 }
    //                 if (allInterchanges.length < 3) {
    //                     allInterchanges.push([,,,,,,]);
    //                 }
    //                 var lIdx = $('#int_line__selection.mdc-list').eq(idx).find(`[data-value="${allInterchanges[idx][1]}"]`).index();
    //                 intLineSelects[idx].selectedIndex = (lIdx == -1) ? 0 : lIdx;
    //             } else {
    //                 intLineSelects[idx].selectedIndex = 0;
    //             }
    //         });
    //     })
    // }); 

    // Modification (Branch)
    throughSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if (event.detail.value === 'na') {return;}
            let stnId = $('#stn_edit_diag').attr('for');
            window.myLine.updateBranchType(stnId, idx, event.detail.value);
        });
    });

    firstSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if ($(`#${DirectionLong[idx]}_first__selection`).children().length === 1) {return;}
            let stnId = $('#stn_edit_diag').attr('for');
            if (window.myLine.updateBranchFirst(stnId, idx, event.detail.value)) {
                posSelects[idx].selectedIndex = posSelects[idx].selectedIndex === 0 ? 1 : 0;
            }
        });
    });

    posSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if (throughSelects[idx].value === 'na') {return;}
            let stnId = $('#stn_edit_diag').attr('for');
            window.myLine.updateBranchPos(stnId, idx, event.detail.index);
        })
    })

    // Deletion
    stnDeleteDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        $('#stn_delete_diag #err_stn').text(getParams().stn_list[stnId].name.join(' - '));
    });
    stnDeleteDialog.listen('MDCDialog:closed', (event: any) => {
        if (event.detail.action == 'close') {return;}
        var stnId = $(event.target).attr('for');
        // Remove from data and svg
        if (window.myLine.removeStn(stnId)) {
            // Remove station from selection
            $(`#panel_stations .mdc-layout-grid__inner #${stnId}`).remove();
            $(`#pivot__selection [data-value="${stnId}"]`).remove();
        } else {
            stnDeleteErrDialog.open();
        }
    });
}