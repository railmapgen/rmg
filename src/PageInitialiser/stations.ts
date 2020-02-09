import { getParams, countryCode2Emoji, getTransText, rgb2Hex } from '../utils';
import { ID, StationInfo, Name, DirectionLong, NeighbourPl } from '../utils';
import { MDCDialog } from '@material/dialog';
import { MDCSelect } from '@material/select';
import { MDCTextField } from '@material/textfield';
import { MDCTabBar } from '@material/tab-bar';
import { MDCIconButtonToggle } from '@material/icon-button';
import { MDCChipSet } from '@material/chips';
import { MDCRipple } from '@material/ripple';
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

const getStnIntFromChipSets = (sets: HTMLDivElement[]) => {
    let info = sets.map(set => {
        return $(set).find('.mdc-chip').get().map(el => getIntInfoFromChip(el));
    });
    let ns = info
        .map(int => int.length);
    if (ns[1] === 0) {info = [info[0]];}
    let changeType: string;
    if (ns[0] === 3 && ns[1] === 0) {
        changeType = 'int3_r'; // was int4
    } else if (ns[0] === 2 && ns[1] === 1) {
        changeType = 'osi11_pr'; // was osi31
    } else if (ns[0] === 2 && ns[1] === 0) {
        changeType = 'int3_r'
    } else if (ns[0] === 1 && ns[1] === 2) {
        changeType = 'osi22_pr'; 
    } else if (ns[0] === 1 && ns[1] === 1) {
        changeType = 'osi11_pr'; // was osi21
    } else if (ns[0] === 1 && ns[1] === 0) {
        changeType = 'int2';
    } else if (ns[0] === 0 && ns[1] === 3) {
        changeType = 'int3_r'; // was osi13;
    } else if (ns[0] === 0 && ns[1] === 2) {
        changeType = 'osi12_pr';
    } else if (ns[0] === 0 && ns[1] === 1) {
        changeType = 'osi11_pr';
    } else if (ns[0] === 0 && ns[1] === 0) {
        changeType = 'none';
    } else {
        // sum(ns) > 3
        changeType = 'int3_r';
    }
    return { info, changeType };
};

const updateStnTransfer = (sets: HTMLDivElement[], osinames: MDCTextField[]) => {
    let { changeType, info } = getStnIntFromChipSets(sets);
    let intInfo = info as any;
    let stnId = $('#stn_edit_diag').attr('for');
    if (changeType.indexOf('osi') !== -1) {
        let osiNames = osinames.map(textfield => textfield.value);
        intInfo[1].unshift(osiNames);
    }
    window.myLine.updateStnTransfer(stnId, changeType, intInfo);
}

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

    const intChipAddButtonEls = $('#stn_edit_diag .mdc-icon-button').get() as HTMLButtonElement[];
    const intChipSetEls = $('#stn_edit_diag .mdc-chip-set').get() as HTMLDivElement[];
    const intChipSets = intChipSetEls.map(el => new MDCChipSet(el));
    const intCitySelect = new MDCSelect($('#int_city')[0]);
    const intLineSelect = new MDCSelect($('#int_line')[0]);
    const intBoxNameFields = ['zh', 'en'].map(lang => new MDCTextField($('#stn_intbox_diag').find('#name_'+lang)[0]));

    const stnTransferTabBar = new MDCTabBar($('#stn_edit_diag .mdc-tab-bar')[0]);
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
        stnOSINameFields.forEach(textfield => textfield.layout());
    };
    const focusBranch = () => {
        [...throughSelects, ...firstSelects, ...posSelects]
            .map(select => select.layout());
    };

    const initInterchange = (stnInfo: StationInfo) => {
        $(intChipSetEls).empty();

        stnInfo.transfer.info.forEach((infos, i) => {
            infos.forEach((info, j) => {
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

        if (stnInfo.transfer.osi_names.length) {
            stnOSINameFields[0].value = stnInfo.transfer.osi_names[0][0];
            stnOSINameFields[1].value = stnInfo.transfer.osi_names[0][1];
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

    stnEditDialog.listen('MDCDialog:opening', event => {
        let stnId = $(event.target).attr('for');
        let stnInfo = getParams().stn_list[stnId];

        initInterchange(stnInfo);
        initBranch(stnInfo);
    });

    stnEditDialog.listen('MDCDialog:opened', event => {
        focusInterchange();
        focusBranch();
    });

    intChipAddButtonEls.forEach((button, i) => {
        $(button).on('click', event => {
            let param = getParams();
            let info = [param.theme[0], null, null, '#000', '線', 'Line'] as InterchangeInfo;
            let chipEl = getIntBoxChip(info);
            intChipSetEls[i].appendChild(chipEl);
            intChipSets[i].addChip(chipEl);
            
            updateStnTransfer(intChipSetEls, stnOSINameFields);
        })
    })

    intChipSets.forEach((chipset, i) => {
        chipset.listen('MDCChip:interaction', (event: CustomEvent) => {
            // setIdx (0: int, 1: osi)
            $('#stn_intbox_diag').data('intId', { setIdx: i, chipId: event.detail.chipId });
            stnIntBoxDialog.open();
        });
    });

    intChipSets.forEach((chipset, i) => {
        chipset.listen('MDCChip:removal', () => {
            updateStnTransfer(intChipSetEls, stnOSINameFields);

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
            let lineIdx = $('#int_line__selection.mdc-list').find(`[data-value="${line}"]`).index();
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
        updateStnTransfer(intChipSetEls, stnOSINameFields);
    });

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