import { getParams, countryCode2Emoji, getTransText } from '../utils';
import { ID, StationInfo, Name } from '../utils';
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

    const [stnModifyNameZHField, stnModifyNameENField, stnModifyNumField] =
        ['#name_zh', '#name_en', '#stn_num'].map(selector => new MDCTextField($('#stn_modify_diag').find(selector)[0]));

    const stnTransferTabBar = new MDCTabBar($('#stn_transfer_diag .mdc-tab-bar')[0]);

    const changeTypeSelect = new MDCSelect($('#change_type')[0]);
    const intCitySelects = $('#int_city .mdc-select').map((_,el) => new MDCSelect(el)).get();
    const intLineSelects = $('#int_line .mdc-select').map((_,el) => new MDCSelect(el)).get();
    const intNameZHFields = $('#int_name_zh .mdc-text-field').map((_,el) => new MDCTextField(el)).get();
    const intNameENFields = $('#int_name_en .mdc-text-field').map((_,el) => new MDCTextField(el)).get();
    const stnOSINameZHField = new MDCTextField($('#stn_transfer_diag #osi_name_zh')[0]);
    const stnOSINameENField = new MDCTextField($('#stn_transfer_diag #osi_name_en')[0]);
    const [tickDirecToggle, paidAreaToggle] = 
        ['#tick_direc', '#paid_area'].map(selector => new MDCIconButtonToggle($('#stn_transfer_diag').find(selector)[0]));

    const [leftThroughSelect, rightThroughSelect, leftFirstSelect, rightFirstSelect, leftPosSelect, rightPosSelect] = 
        ['#left_through', '#right_through', '#left_first', '#right_first', '#left_pos', '#right_pos'].map(selector => new MDCSelect($(selector)[0]));

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

    stnAddDialog.listen('MDCDialog:opening', event => {
        stnAddPivotSelect.selectedIndex = 0;
    });
    stnAddDialog.listen('MDCDialog:opened', event => {
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
        [stnModifyNameZHField.value, stnModifyNameENField.value] = getParams().stn_list[stnId].name;
        stnModifyNumField.value = getParams().stn_list[stnId].num;
    })
    stnModifyDialog.listen('MDCDialog:opened', () => {
        stnModifyNameZHField.layout();
        stnModifyNameENField.layout();
        stnModifyNumField.layout();
    })
    $('#stn_modify_diag #name_zh, #stn_modify_diag #name_en, #stn_num').on('input', () => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        var stnNum = stnModifyNumField.value;

        var stnId = $('#stn_modify_diag').attr('for');
        window.myLine.updateStnName(stnId, [nameZH, nameEN], stnNum);
        $(`#panel_stations .mdc-layout-grid__inner:first #${stnId} .mdc-card__media-content`)
            .html([nameZH, nameEN].join('<br>'))
            .prepend($('<span>', { style:(window.urlParams.get('style')=='gzmtr' ? '' : 'display:none;')}).text(stnNum+' '));
        $(`#pivot__selection [data-value="${stnId}`).html(`${nameZH} - ${nameEN}`);
    });


    // Modification (Interchange)
    const focusInterchange = () => {
        changeTypeSelect.layout();
        intCitySelects.forEach(select => select.layout());
        intLineSelects.forEach(select => select.layout());
        intNameZHFields.forEach(textfield => textfield.layout());
        intNameENFields.forEach(textfield => textfield.layout());
        stnOSINameENField.layout();
        stnOSINameZHField.layout();
    };
    const focusBranch = () => {
        leftThroughSelect.layout();
        rightThroughSelect.layout();
        leftFirstSelect.layout();
        rightFirstSelect.layout();
        leftPosSelect.layout();
        rightPosSelect.layout();
    };

    const initBranch = (stnInfo: StationInfo) => {
        // through type
        ['left', 'right'].forEach(direc => {
            let throughType = stnInfo.branch[direc][0];
            if (throughType) {
                if (direc === 'left') {
                    leftThroughSelect.value = throughType;
                } else {
                    rightThroughSelect.value = throughType;
                }
                $(`#${direc}_through__selection [data-value="na"]`).hide();
                $(`#${direc}_through__selection [data-value="through"]`).show();
                $(`#${direc}_through__selection [data-value="nonthrough"]`).show();

                $(`[${direc}-first-group], [${direc}-pos-group]`).show();
            } else {
                if (direc === 'left') {
                    leftThroughSelect.value = 'na';
                } else {
                    rightThroughSelect.value = 'na';
                }
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
                stnInfo.parents.forEach(par => {
                    $('#left_first__selection').append(
                        $('<li>', {
                            class: 'mdc-list-item', 
                            'data-value': par
                        }).text(stnList[par].name.join(' - '))
                    );
                });
                stnInfo.children.forEach(child => {
                    $('#right_first__selection').append(
                        $('<li>', {
                            class: 'mdc-list-item', 
                            'data-value': child
                        }).text(stnList[child].name.join(' - '))
                    );
                });
            })
            .then(() => {
                ['left', 'right'].forEach(direc => {
                    if (direc === 'left') {
                        if (leftThroughSelect.value !== 'na') {
                            leftFirstSelect.selectedIndex = stnInfo.parents.indexOf(stnInfo.branch[direc][1]);
                        } else {
                            leftFirstSelect.selectedIndex = 0;
                        }
                    } else {
                        if (rightThroughSelect.value !== 'na') {
                            rightFirstSelect.selectedIndex = stnInfo.children.indexOf(stnInfo.branch[direc][1]);
                        } else {
                            rightFirstSelect.selectedIndex = 0;
                        }
                    }
                })
            });
        
        // swap position
        leftPosSelect.selectedIndex = stnInfo.parents.indexOf(stnInfo.branch.left[1]);
        rightPosSelect.selectedIndex = stnInfo.children.indexOf(stnInfo.branch.right[1]);
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
                        .html(countryCode2Emoji(c.country) + getTransText(c.name, lang))
                );
            });
        });
    });



    function _showAllFields(n, show) {
        if (show) {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).show();
            intCitySelects[n].layout();
            intLineSelects[n].layout();
            intNameZHFields[n].layout();
            intNameENFields[n].layout();
        } else {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).hide();
        }
    }

    stnTransferDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        var stnInfo = getParams().stn_list[stnId];
        let lineThemeCity = getParams().theme[0];

        // if ((stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') && window.urlParams.get('style') === 'mtr') {
        //     $('#change_type__selection li:last-child').show();
        // } else {
        //     $('#change_type__selection li:last-child').hide();
        // }

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
                intNameZHFields[idx].value = intInfo[4] || '';
                intNameENFields[idx].value = intInfo[5] || '';
            })
        } else {
            let cIdx = $('#int_city__selection.mdc-list').eq(0).find(`[data-value="${lineThemeCity}"]`).index();
            intCitySelects.forEach(select => select.selectedIndex = cIdx);
            intNameZHFields.forEach(textfield => textfield.value = '');
            intNameENFields.forEach(textfield => textfield.value = '');
        }

        if (['none', 'int2'].includes(stnInfo.change_type.split('_')[0])) {
            tickDirecToggle.on = true;
        } else {
            tickDirecToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            [stnOSINameZHField.value, stnOSINameENField.value] = stnInfo.interchange[1][0];
            paidAreaToggle.on = (stnInfo.change_type.split('_').reverse()[0][0] == 'p');
        } else {
            stnOSINameZHField.value = '';
            stnOSINameENField.value = '';
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
        var osi = [stnOSINameZHField.value, stnOSINameENField.value];
        var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';

        var [intInfo0, intInfo1, intInfo2] = [0,1,2].map(idx => {
            return [intCitySelects[idx].value, intLineSelects[idx].value]
                .concat(
                    $('ul#int_line__selection').eq(idx).find('li span')
                        .eq(intLineSelects[idx].selectedIndex)
                        .attr('style').match(/#[\w\d]+/g), 
                    intNameZHFields[idx].value, intNameENFields[idx].value
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
    const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

    zip([leftThroughSelect, rightThroughSelect], ['left', 'right'])
        .forEach((select: [MDCSelect, 'left' | 'right']) => {
            select[0].listen('MDCSelect:change', (event: any) => {
                if (event.detail.value === 'na') {return;}
                let stnId = $('#stn_transfer_diag').attr('for');
                window.myLine.updateBranchType(stnId, select[1], event.detail.value);
            });
        });

    zip([leftFirstSelect, rightFirstSelect], ['left', 'right'], [leftPosSelect, rightPosSelect])
        .forEach((select: [MDCSelect, 'left' | 'right', MDCSelect]) => {
            select[0].listen('MDCSelect:change', (event: any) => {
                if ($(`#${select[1]}_first__selection`).children().length === 1) {return;}
                let stnId = $('#stn_transfer_diag').attr('for');
                if (window.myLine.updateBranchFirst(stnId, select[1], event.detail.value)) {
                    if (select[2].selectedIndex === 0) {
                        select[2].selectedIndex = 1;
                    } else {
                        select[2].selectedIndex = 0;
                    }
                }
            });
        });

    zip([leftPosSelect, rightPosSelect], ['left', 'right'], [leftThroughSelect, rightThroughSelect])
        .forEach((select: [MDCSelect, 'left' | 'right', MDCSelect]) => {
            select[0].listen('MDCSelect:change', (event: any) => {
                if (select[2].value === 'na') {return;}
                let stnId = $('#stn_transfer_diag').attr('for');
                window.myLine.updateBranchPos(stnId, select[1], event.detail.index);
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