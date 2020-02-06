import { getParams, countryCode2Emoji, getTransText } from '../utils';
import { ID, StationInfo, Name, DirectionLong, NeighbourPl } from '../utils';
import { MDCDialog } from '@material/dialog';
import { MDCSelect } from '@material/select';
import { MDCTextField } from '@material/textfield';
import { MDCTabBar } from '@material/tab-bar';
import { MDCIconButtonToggle } from '@material/icon-button';

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

export function common() {
    // Duplicate element
    var intNameEl = $('#stn_transfer_diag .mdc-layout-grid__inner #int_name_zh,#int_name_en').slice(0,2).clone();
    intNameEl.find('.mdc-text-field').removeAttr('data-mdc-auto-init-state'); // to be removed
    $('div#int_line').slice(1,3).after(intNameEl);

    // mdc instances
    const [stnAddDialog, stnModifyDialog, stnTransferDialog, stnDeleteDialog, stnDeleteErrDialog] = 
        ['#stn_add_diag', '#stn_modify_diag', '#stn_transfer_diag', '#stn_delete_diag', '#stn_delete_err']
            .map(selector => new MDCDialog($(selector)[0]));
    
    const [stnAddPrepSelect, stnAddPivotSelect, stnAddLocSelect, stnAddEndSelect] = 
        ['#prep', '#pivot', '#loc', '#end'].map(selector => new MDCSelect($('#stn_add_diag').find(selector)[0]));

    const stnModifyNameFields = 
        ['#name_zh', '#name_en'].map(selector => new MDCTextField($('#stn_modify_diag').find(selector)[0]));
    const stnModifyNumField = new MDCTextField($('#stn_modify_diag #stn_num')[0]);

    const stnTransferTabBar = new MDCTabBar($('#stn_transfer_diag .mdc-tab-bar')[0]);
    const changeTypeSelect = new MDCSelect($('#change_type')[0]);
    const intCitySelects = $('#int_city .mdc-select').map((_,el) => new MDCSelect(el)).get();
    const intLineSelects = $('#int_line .mdc-select').map((_,el) => new MDCSelect(el)).get();
    const intNameFields = ['zh', 'en']
        .map(lang => $(`div#int_name_${lang}`).find('.mdc-text-field').map((_,el) => new MDCTextField(el)).get());
    const stnOSINameFields = 
        ['zh', 'en'].map(lang => new MDCTextField($('#stn_transfer_diag').find(`#osi_name_${lang}`)[0]));
    const [tickDirecToggle, paidAreaToggle] = 
        ['#tick_direc', '#paid_area'].map(selector => new MDCIconButtonToggle($('#stn_transfer_diag').find(selector)[0]));

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
        $('#stn_transfer_diag').attr('for', event.target.closest('.mdc-card').id)
        stnTransferDialog.open();
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
            $('#stn_transfer_diag').attr('for', stnId);
            stnTransferDialog.open();
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
        changeTypeSelect.layout();
        intCitySelects.forEach(select => select.layout());
        intLineSelects.forEach(select => select.layout());
        [].concat(...intNameFields).forEach(textfield => textfield.layout());
        stnOSINameFields.forEach(textfield => textfield.layout());
    };
    const focusBranch = () => {
        [...throughSelects, ...firstSelects, ...posSelects]
            .map(select => select.layout());
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


    // autoInit();

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



    function _showAllFields(n, show) {
        if (show) {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).show();
            intCitySelects[n].layout();
            intLineSelects[n].layout();
            intNameFields.map(fields => fields[n].layout());
        } else {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).hide();
        }
    }

    stnTransferDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        var stnInfo = getParams().stn_list[stnId];
        let lineThemeCity = getParams().theme[0];

        changeTypeSelect.value = stnInfo.change_type.split('_')[0];

        if (stnInfo.change_type !== 'none') {
            var allInterchanges = stnInfo.interchange[0].concat(
                stnInfo.interchange[1] ? stnInfo.interchange[1].slice(1,stnInfo.interchange[1].length) : []
            );
            if (allInterchanges.length < 3) {
                allInterchanges.unshift([,,,,,,]);
            }
            if (allInterchanges.length < 3) {
                allInterchanges.push([,,,,,,]);
            }
            console.log(allInterchanges)
            allInterchanges.forEach((intInfo, idx) => {
                let cIdx = $('#int_city__selection.mdc-list').eq(0).find(`[data-value="${intInfo[0] || lineThemeCity}"]`).index();
                intCitySelects[idx].selectedIndex = cIdx;
                intNameFields.forEach((fields, i) => fields[idx].value = intInfo[4+i] || '');
            });
        } else {
            let cIdx = $('#int_city__selection.mdc-list').eq(0).find(`[data-value="${lineThemeCity}"]`).index();
            intCitySelects.forEach(select => select.selectedIndex = cIdx);
            [].concat(...intNameFields).forEach(textfield => textfield.value = '');
        }

        if (['none', 'int2'].includes(stnInfo.change_type.split('_')[0])) {
            tickDirecToggle.on = true;
        } else {
            tickDirecToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            stnOSINameFields.forEach((textfield,i) => textfield.value = stnInfo.interchange[1][0][i]);
            paidAreaToggle.on = (stnInfo.change_type.split('_').reverse()[0][0] == 'p');
        } else {
            stnOSINameFields.forEach(textfield => textfield.value = '');
            paidAreaToggle.on = true;
        }

        // Branch
        initBranch(stnInfo);
    });

    stnTransferDialog.listen('MDCDialog:opened', event => {
        focusInterchange();
        focusBranch();
    });

    stnTransferDialog.listen('MDCDialog:closed', (event: any) => {
        if (event.detail.action == 'close') {return;}

        // var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnId = event.target.getAttribute('for');
        var type = changeTypeSelect.value;
        var tickDirec = tickDirecToggle.on ? 'r' : 'l';
        let osi = stnOSINameFields.map(textfield => textfield.value);
        var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';

        var [intInfo0, intInfo1, intInfo2] = [0,1,2].map(idx => {
            return [intCitySelects[idx].value, intLineSelects[idx].value]
                .concat(
                    $('ul#int_line__selection').eq(idx).find('li span')
                        .eq(intLineSelects[idx].selectedIndex)
                        .attr('style').match(/#[\w\d]+/g), 
                    ...intNameFields.map(fields => fields[idx].value)
                );
        });
        if (type == 'none') {
            window.myLine.updateStnTransfer(stnId, type);
        } else if (type == 'osi22') {
            window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[intInfo0], [osi, intInfo1, intInfo2]]);
        } else {
            switch (type) {
                case 'int2':
                    // window.myLine.updateStnTransfer(stnId, type, [[], intInfo1, []]);
                    window.myLine.updateStnTransfer(stnId, type, [[intInfo1]]);
                    break;
                case 'osi11':
                    // window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
                    window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1]]);
                    break;
                default:
                    switch (type) {
                        case 'int3':
                            // window.myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
                            window.myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[intInfo1, intInfo2]]);
                            break;
                        case 'osi12':
                            // window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
                            window.myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1, intInfo2]]);
                    }
            }
        }
    })
    changeTypeSelect.listen('MDCSelect:change', (event: any) => {
        if (event.detail.value == 'int2') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, false);
            $('#stn_transfer_diag #tick_direc').hide();
            $('#osi_name_zh, #osi_name_en, #paid_area').hide();
        } else if (event.detail.value == 'int3') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#stn_transfer_diag #tick_direc').show();
            $('#osi_name_zh, #osi_name_en, #paid_area').hide();
        } else if (event.detail.value == 'osi11') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, false);
            $('#stn_transfer_diag #tick_direc').show();
            $('#osi_name_zh, #osi_name_en, #paid_area').show();
        } else if (event.detail.value == 'osi12') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#stn_transfer_diag #tick_direc').show();
            $('#osi_name_zh, #osi_name_en, #paid_area').show();
        } else if (event.detail.value == 'osi22') {
            // $('#stn_transfer_diag .mdc-dialog__content [id]div, #paid_area').slice(1).show()
            _showAllFields(0, true);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#osi_name_zh, #osi_name_en, #paid_area').show();
            let stnInfo = getParams().stn_list[$('#stn_transfer_diag').attr('for')];
            if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
                $('#tick_direc').hide();
            } else {
                $('#tick_direc').show();
            }
        } else {
            $('#stn_transfer_diag #panel_interchange [id]div').slice(1).hide()
            $('#tick_direc, #paid_area').hide()
        }
    });

    intCitySelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if (event.detail.index === -1) {return;}
            $.getJSON(`data/${event.detail.value}.json`, data => {
                var lang = window.urlParams.get('lang');
                $('#int_line__selection.mdc-list').eq(idx).empty();
                data.forEach(l => {
                    $('#int_line__selection.mdc-list').eq(idx).append(
                        `<li class="mdc-list-item" data-value="${l.id}">
                        <span style="background:${l.colour};color:${l.fg || '#fff'};">&nbsp;${getTransText(l.name, lang)}&nbsp;</span>
                        </li>`
                    );
                });

                var stnId = $('#stn_transfer_diag').attr('for');
                var stnInfo = getParams().stn_list[stnId];
                if (stnInfo.change_type !== 'none') {
                    var allInterchanges = stnInfo.interchange[0].concat(
                        stnInfo.interchange[1] ? stnInfo.interchange[1].slice(1,stnInfo.interchange[1].length) : []
                    );
                    if (allInterchanges.length < 3) {
                        allInterchanges.unshift([,,,,,,]);
                    }
                    if (allInterchanges.length < 3) {
                        allInterchanges.push([,,,,,,]);
                    }
                    var lIdx = $('#int_line__selection.mdc-list').eq(idx).find(`[data-value="${allInterchanges[idx][1]}"]`).index();
                    intLineSelects[idx].selectedIndex = (lIdx == -1) ? 0 : lIdx;
                } else {
                    intLineSelects[idx].selectedIndex = 0;
                }
            });
        })
    }); 

    // Modification (Branch)
    throughSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if (event.detail.value === 'na') {return;}
            let stnId = $('#stn_transfer_diag').attr('for');
            window.myLine.updateBranchType(stnId, idx, event.detail.value);
        });
    });

    firstSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if ($(`#${DirectionLong[idx]}_first__selection`).children().length === 1) {return;}
            let stnId = $('#stn_transfer_diag').attr('for');
            if (window.myLine.updateBranchFirst(stnId, idx, event.detail.value)) {
                posSelects[idx].selectedIndex = posSelects[idx].selectedIndex === 0 ? 1 : 0;
            }
        });
    });

    posSelects.forEach((select, idx) => {
        select.listen('MDCSelect:change', (event: any) => {
            if (throughSelects[idx].value === 'na') {return;}
            let stnId = $('#stn_transfer_diag').attr('for');
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