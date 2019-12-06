'use strict';

function initLayoutPanel() {
    Promise.resolve(getParams())
        .then(param => {
            $('#svg_dest_width')[0].MDCTextField.value = param.svg_dest_width;
            $('#svg_width')[0].MDCTextField.value = param.svg_dest_width;
        })

    $('#svg_dest_width > input').on('input', event => {
        myLine.svgDestWidth = event.target.value;
    });

    $('#svg_width > input').on('input', event => {
        myLine.svgWidth = event.target.value;
    });

    var branchSpacingSlider = new mdc.slider.MDCSlider($('#branch_spacing')[0]);
    branchSpacingSlider.value = getParams().branch_spacing;
    branchSpacingSlider.listen('MDCSlider:input', () => {
        myLine.branchSpacing = branchSpacingSlider.value;
    });

    var yPcSlider = new mdc.slider.MDCSlider($('#y_pc')[0]);
    yPcSlider.value = getParams().y_pc;
    yPcSlider.listen('MDCSlider:input', () => {
        myLine.yPc = yPcSlider.value;
    });

    var paddingSlider = new mdc.slider.MDCSlider($('#padding')[0]);
    paddingSlider.value = getParams().padding;
    paddingSlider.listen('MDCSlider:input', () => {
        myLine.padding = paddingSlider.value;
    });
}

function initDesignPanel() {
    var designList = new mdc.list.MDCList($('#panel_design #design_list')[0]);

    $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
        getParams().line_name.join(' - ')
    );

    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html(
        (getParams().direction == 'r') ? 'Right' : 'Left'
    );

    $('#panel_design #design_list li:nth-child(7) .mdc-list-item__secondary-text').html(
        $(`#design_char_diag ul [data-mdc-dialog-action="${getParams().char_form}"] span`).html()
    );

    designList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                $('#design_theme_diag')[0].MDCDialog.open();
                break;
            case 1:
                $('#line_name_diag')[0].MDCDialog.open();
                break;
            case 2:
                if (getParams().direction == 'r') {
                    myLine.direction = 'l';
                    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html('Left');
                } else {
                    myLine.direction = 'r';
                    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html('Right');
                }
                break;
            case 5:
                myLine.txtFlip = !getParams().txt_flip;
                break;
            case 6:
                $('#design_char_diag')[0].MDCDialog.open();
        }
    });

    $('#design_theme_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-select')
            .each((_,el) => el.MDCSelect.layout());
    });

    $.getJSON('data/city_list.json', function(data) {
        var lang = urlParams.get('lang');
        data.forEach(function(c) {
            $('#theme_city__selection').append(
                `<li class="mdc-list-item" data-value="${c.id}">
                ${countryCode2Emoji(c.country)}${getTransText(c.name, lang)}
                </li>`
            );
        });

        var [themeCity, themeLine, themeColour] = getParams().theme
        // var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        $('#theme_city')[0].MDCSelect.selectedIndex = cityIdx;
    });

    $('#theme_city')[0].MDCSelect.listen("MDCSelect:change", (event) => {
        $('#theme_line__selection').empty();
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = urlParams.get('lang');
            data.forEach(l => {
                $('#theme_line__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${getTransText(l.name, lang)}
                    </li>`
                );
            });

            var param = getParams();
            param.theme[0] = event.detail.value;
            putParams(param);

            var lineIdx = $(`#theme_line__selection > [data-value="${param.theme[1]}"]`).index();
            $('#theme_line')[0].MDCSelect.selectedIndex = lineIdx==-1 ? 0 : lineIdx;
        });
    });

    $('#theme_line')[0].MDCSelect.listen("MDCSelect:change", event => {
        var param = getParams();
        param.theme[1] = event.detail.value;
        putParams(param);

        myLine.themeLine = event.detail.value;
        myLine.themeColour = $('#theme_line__selection li span')
                            .eq(event.detail.index).attr('style')
                            .match(/(?!background:)#[\w\d]+(?=;)/g)[0]

        $('#panel_design #design_list li:first-child .mdc-list-item__secondary-text').html(
            `${$('#theme_city__selection li')
                .eq($('#theme_city')[0].MDCSelect.selectedIndex)
                .html().trim()
            } - ${$('#theme_line__selection li').eq(event.detail.index).html().trim()}`
        );
    });

    Promise.resolve(getParams())
        .then(param => {
            $('#line_name_diag #name_zh')[0].MDCTextField.value = param.line_name[0];
            $('#line_name_diag #name_en')[0].MDCTextField.value = param.line_name[1];
            $('#platform_num')[0].MDCTextField.value = param.platform_num;
            $('#legacy')[0].MDCSwitch.checked = param.dest_legacy;
        });

    $('#line_name_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-text-field')
            .each((_,el) => el.MDCTextField.layout());
    });
    $('#line_name_diag #name_zh, #name_en').on('input', event => {
        var lineNames = $('#line_name_diag .mdc-text-field').get().map(el => el.MDCTextField.value);
        myLine.lineNames = lineNames;
        $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
            lineNames.join(' - ')
        );
    });

    $('#platform_num > input').on('input', event => {
        myLine.platformNum = event.target.value;
    });

    $('#legacy input').on('change', event => {
        myLine.destLegacy = event.target.checked;
    });

    $('#design_char_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        myLine.charForm = event.detail.action;
        $('#panel_design #design_list li:nth-child(7) .mdc-list-item__secondary-text').html(
            $(`#design_char_diag ul [data-mdc-dialog-action="${event.detail.action}"] span`).html()
        );
    });
}


function initSavePanel() {
    $('#panel_save .mdc-list')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                templateDialog.open();
                break;
            case 1:
                $('#upload_file').click();
                break;
            case 2:
                var link = document.createElement('a');
                var data = new Blob([localStorage.rmgParam], {type: 'application/json;charset=utf-8'});
                var url = window.URL.createObjectURL(data);
                link.href = url;
                link.download = 'rmg_config.json';
                link.click();
                URL.revokeObjectURL(url);
                break;
            case 3:
                exportDialog.open();
                break;
            case 4:
                langDialog.open();
                break;
        }
    });

    var templateDialog = new mdc.dialog.MDCDialog($('#template_diag')[0]);
    var templateDialogList = new mdc.list.MDCList($('#template_diag .mdc-list')[0]);
    $.getJSON('templates/template_list.json', data => {
        var lang = urlParams.get('lang');
        data.forEach(d => {
            $('#template_diag ul').append(
                $('<li>', {
                    class: "mdc-list-item", 
                    'data-mdc-dialog-action': d.filename
                }).append(
                    $('<span>', { class: "mdc-list-item__text" }).text(getTransText(d.desc, lang))
                )
            );
        });
        $('#template_diag li:first-child').attr('tabindex', 0);
    });
    templateDialog.listen('MDCDialog:opened', () => {
        templateDialogList.layout();
        var templateDialogListItemRipple = templateDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    templateDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        
        $.getJSON(`templates/${event.detail.action}.json`, data => {
            localStorage.rmgParam = JSON.stringify(data);
            location.reload(true);
        });
    });

    var exportDialog = new mdc.dialog.MDCDialog($('#export_diag')[0]);
    var exportDialogList = new mdc.list.MDCList($('#export_diag .mdc-list')[0]);
    exportDialog.listen('MDCDialog:opened', () => {
        exportDialogList.layout();
        var exportDialogListItemRipple = exportDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    exportDialog.listen('MDCDialog:closed', event => {
        switch (event.detail.action) {
            case 'close':
                break;
            case 'svg1':
                var link = document.createElement('a');
                var svgContent = $('#svgs svg:first-child').prepend($('style#svg_share'));
                link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
                link.download = 'rmg_dest.svg';
                link.click();
                break;
            case 'svg2':
                var link = document.createElement('a');
                var svgContent = $('#svgs svg:last-child').prepend($('style#svg_share'));
                link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
                link.download = 'rmg_map.svg';
                link.click();
                break;
        }
    });

    var importDialog = new mdc.dialog.MDCDialog($('#import_diag')[0]);
    var importedFile = undefined;
    $('#upload_file').on('change', event => {
        console.log(event.target.files[0]);
        var reader = new FileReader();
        reader.onload = function(e) {
            importedFile = JSON.parse(e.target.result);
            $('#import_diag .mdc-dialog__content').html(
                describeParams(importedFile)
            );
            importDialog.open();
        };
        reader.readAsText(event.target.files[0]);
    });
    importDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        Line.clearSVG();
        localStorage.rmgParam = JSON.stringify(importedFile);
        location.reload(true);
    });

    var langDialog = new mdc.dialog.MDCDialog($('#lang_diag')[0]);
    var langDialogList = new mdc.list.MDCList($('#lang_diag .mdc-list')[0]);
    langDialog.listen('MDCDialog:opened', () => {
        langDialogList.layout();
        var langDialogListItemRipple = langDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    langDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        var nextLang = event.detail.action;
        localStorage.rmgLang = nextLang;
        if (nextLang == urlParams.get('lang')) {
            return;
        } else {
            window.location = '?lang=' + nextLang;
        }
    })
}

function initStationsPanel() {
    // var ripples = $('#panel_stations .mdc-icon-button, .mdc-card__primary-action')
    //                 .each((idx,el) => {
    //                     return new mdc.ripple.MDCRipple(el);
    //                 });
    function _stationCard(id, names) {
        return $('<div>', {'id':id}).addClass('mdc-card mdc-layout-grid__cell--span-2-desktop mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-2-phone station-card').append(
            $('<div>').addClass('mdc-card__primary-action').append(
                $('<div>').addClass('mdc-card__media mdc-card__media--16-9')
            ).append(
                $('<div>').addClass('mdc-card__media-content station-card__content').html(names.join('<br>'))
            )
        ).append(
            $('<div>').addClass('mdc-card__actions').append(
                $('<div>').addClass('mdc-card__action-icons').append(
                    $('<button>', {title:'Set As Current'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('my_location')
                ).append(
                    $('<button>', {title:'Interchange'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('transfer_within_a_station')
                ).append(
                    $('<button>', {title: 'Remove'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('delete_forever')
                )
            )
        );
    }

    var stnList = getParams().stn_list;
    myLine.tpo.forEach(stnId => {
        $('#panel_stations .mdc-layout-grid__inner:first').append(_stationCard(stnId, stnList[stnId].name));
        $('#pivot__selection').append(
            $('<li>', {'data-value':stnId}).addClass('mdc-list-item').text(stnList[stnId].name.join(' - '))
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
        myLine.currentStnId = stnId;
    });
    $('#panel_stations .mdc-card__action-icons > [title="Interchange"]').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        $('#stn_transfer_diag').attr('for', stnId);
        stnTransferDialog.open();
    });
    $('#panel_stations .mdc-card__action-icons > [title="Remove"]').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        $('#stn_delete_diag').attr('for', stnId);
        stnDeleteConfirmDialog.open();
    });


    // Addition
    var stnAddDialog = new mdc.dialog.MDCDialog($('#stn_add_diag')[0]);
    var stnAddPrepSelect = new mdc.select.MDCSelect($('#stn_add_diag #prep')[0]);
    var stnAddPivotSelect = new mdc.select.MDCSelect($('#stn_add_diag #pivot')[0]);
    var stnAddLocSelect = new mdc.select.MDCSelect($('#stn_add_diag #loc')[0]);
    var stnAddEndSelect = new mdc.select.MDCSelect($('#stn_add_diag #end')[0]);
    stnAddDialog.listen('MDCDialog:opening', event => {
        stnAddPivotSelect.selectedIndex = 0;
    });
    stnAddDialog.listen('MDCDialog:opened', event => {
        [stnAddPrepSelect, stnAddPivotSelect, stnAddLocSelect].forEach(select => select.layout());
    });
    stnAddDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        var prep = stnAddPrepSelect.value;
        var stnId = stnAddPivotSelect.value;
        var loc = stnAddLocSelect.value;
        var end = stnAddEndSelect.value;
        
        var [newId, newInfo] = myLine.addStn(prep, stnId, loc, end);

        console.log(prep, stnId, loc, end);
        // _genStnList();
        var prevId = myLine.tpo[myLine.tpo.indexOf(newId) - 1] || 'add_stn';
        $(`#panel_stations .mdc-layout-grid__inner:first #${prevId}`).after(_stationCard(newId, newInfo.name));
        // Add event listeners
        $(`#panel_stations #${newId} .mdc-card__primary-action`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            if (stnId == 'add_stn') {return;}
            $('#stn_modify_diag').attr('for', stnId);
            stnModifyDialog.open();
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Set As Current"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            myLine.currentStnId = stnId;
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Interchange"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            $('#stn_transfer_diag').attr('for', stnId);
            stnTransferDialog.open();
        });
        $(`#panel_stations #${newId} .mdc-card__action-icons > [title="Remove"]`).on('click', event => {
            var stnId = event.target.closest('.mdc-card').id;
            $('#stn_delete_diag').attr('for', stnId);
            stnDeleteConfirmDialog.open();
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
        var prep = stnAddPrepSelect.value;
        var stnId = stnAddPivotSelect.value;
        var stnList = getParams().stn_list;
        for (let [idx, state] of myLine.newStnPossibleLoc(prep, stnId).entries()) {
            if (state) {
                // $('#stn_add_diag #loc option').eq(idx).prop('disabled', false);
                $('#loc__selection li').eq(idx).removeClass('mdc-list-item--disabled');
                if (idx >= 3) {
                    // newupper or newlower
                    // $('#stn_add_diag #end select').empty();
                    $('#end__selection').empty();
                    state.forEach(stnId => {
                        // $('#stn_add_diag #end select').append(
                        //     `<option value="${stnId}">${stnList[stnId].name.join(' - ')}</option>`
                        // );
                        $('#end__selection').append(
                            `<li class="mdc-list-item" data-value="${stnId}">${stnList[stnId].name.join(' - ')}</li>`
                        );
                    });
                }
            } else {
                // $('#stn_add_diag #loc option').eq(idx).prop('disabled', true);
                $('#loc__selection li').eq(idx).addClass('mdc-list-item--disabled');
            }
            // $('#stn_add_diag #loc option').eq(idx).prop('disabled', (state)?false:true);
        }
        // stnAddLocSelect.value = $('#stn_add_diag #loc option:not([disabled]):first').attr('value');
        stnAddLocSelect.value = $('#loc__selection li:not(.mdc-list-item--disabled):first').attr('data-value');
    });
    stnAddLocSelect.listen('MDCSelect:change', event => {
        if (['newupper', 'newlower'].includes(event.detail.value)) {
            $('#stn_add_diag #new_branch').show();
            stnAddEndSelect.selectedIndex = 0;
        } else {
            $('#stn_add_diag #new_branch').hide();
        }
    });


    // Modification (Name)
    var stnModifyDialog = new mdc.dialog.MDCDialog($('#stn_modify_diag')[0]);
    var stnModifyNameZHField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_zh')[0]);
    var stnModifyNameENField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_en')[0]);
    stnModifyDialog.listen('MDCDialog:opening', event => {
        var stnId = event.target.getAttribute('for');
        [stnModifyNameZHField.value, stnModifyNameENField.value] = getParams().stn_list[stnId].name;
    })
    stnModifyDialog.listen('MDCDialog:opened', () => {
        stnModifyNameZHField.layout();
        stnModifyNameENField.layout();
    })
    $('#stn_modify_diag #name_zh, #name_en').on('input', () => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        var stnId = $('#stn_modify_diag').attr('for');
        myLine.updateStnName(stnId, nameZH, nameEN);
        $(`#panel_stations .mdc-layout-grid__inner:first #${stnId} .mdc-card__media-content`).html(`${nameZH}<br>${nameEN}`);
        $(`#pivot__selection [data-value="${stnId}`).html(`${nameZH} - ${nameEN}`);
    });


    // Modification (Interchange)
    var stnTransferDialog = new mdc.dialog.MDCDialog($('#stn_transfer_diag')[0]);
    var stnTransferSelect = new mdc.select.MDCSelect($('#stn_transfer_diag #change_type')[0]);
    var stnIntTickDirectionToggle = new mdc.iconButton.MDCIconButtonToggle($('#stn_transfer_diag #tick_direc')[0]);
    stnIntTickDirectionToggle.unbounded = true;

    var stnIntCity0Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_0')[0]);
    var stnIntCity1Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_1')[0]);
    var stnIntCity2Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_2')[0]);
    $.getJSON('data/city_list.json', function(data) {
        var lang = urlParams.get('lang');
        data.forEach(function(c) {
            [0,1,2].forEach(i => {
                $(`#int_city_${i}__selection`).append(
                    $('<li>', {
                        class: 'mdc-list-item', 
                        'data-value': c.id
                    }).html(countryCode2Emoji(c.country) + getTransText(c.name, lang))
                );
            });
        });
    });

    var stnIntLine0Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_line_0')[0]);
    var stnIntNameZH0Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_zh_0')[0]);
    var stnIntNameEN0Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_en_0')[0]);

    var stnOSINameZHField = new mdc.textField.MDCTextField($('#stn_transfer_diag #osi_name_zh')[0]);
    var stnOSINameENField = new mdc.textField.MDCTextField($('#stn_transfer_diag #osi_name_en')[0]);
    var paidAreaToggle = new mdc.iconButton.MDCIconButtonToggle($('#stn_transfer_diag #paid_area')[0]);
    paidAreaToggle.unbounded = true;

    var stnIntLine1Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_line_1')[0]);
    var stnIntNameZH1Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_zh_1')[0]);
    var stnIntNameEN1Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_en_1')[0]);

    var stnIntLine2Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_line_2')[0]);
    var stnIntNameZH2Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_zh_2')[0]);
    var stnIntNameEN2Field = new mdc.textField.MDCTextField($('#stn_transfer_diag #int_name_en_2')[0]);

    function _notchAllOutlines(n) {
        if (n == 1) {
            stnIntCity1Select.layout();
            stnIntLine1Select.layout();
            stnIntNameZH1Field.layout();
            stnIntNameEN1Field.layout();
        }
        if (n == 2) {
            stnIntCity2Select.layout();
            stnIntLine2Select.layout();
            stnIntNameZH2Field.layout();
            stnIntNameEN2Field.layout();
        }
        if (n == 0) {
            stnIntCity0Select.layout();
            stnIntLine0Select.layout();
            stnIntNameZH0Field.layout();
            stnIntNameEN0Field.layout();
        }
        if (n == -1) {
            // OSI fields
            stnOSINameZHField.layout();
            stnOSINameENField.layout();
        }
    }

    function _showAllFields(n, show) {
        if (show) {
            $(`#stn_transfer_diag #int_city_${n}, #int_line_${n}, #int_name_zh_${n}, #int_name_en_${n}`).show();
        } else {
            $(`#stn_transfer_diag #int_city_${n}, #int_line_${n}, #int_name_zh_${n}, #int_name_en_${n}`).hide();
        }
    }

    function _showOSIFields(show) {
        var sty = show ? '' : 'display:none';
        $('#stn_transfer_diag #osi_name_zh').attr('style', sty);
        $('#stn_transfer_diag #osi_name_en').attr('style', sty);
        $('#stn_transfer_diag #paid_area').attr('style', sty)
    }

    stnTransferDialog.listen('MDCDialog:opening', event => {
        // var stnId = stationSelect.value;
        // var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnId = event.target.getAttribute('for');
        var stnInfo = getParams().stn_list[stnId];
        var lineThemeCity = getParams().theme[0];

        if (stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') {
            $('#change_type__selection li:last-child').removeClass('mdc-list-item--disabled');
        } else {
            $('#change_type__selection li:last-child').addClass('mdc-list-item--disabled');
        }

        stnTransferSelect.value = stnInfo.change_type.split('_')[0];

        switch (stnInfo.change_type.split('_')[0]) {
            case 'int2':
                stnIntCity0Select.value = '';
                stnIntNameZH0Field.value = '';
                stnIntNameEN0Field.value = '';
                stnIntCity1Select.value = stnInfo.interchange[0][0][0];
                stnIntNameZH1Field.value = stnInfo.interchange[0][0][3];
                stnIntNameEN1Field.value = stnInfo.interchange[0][0][4];
                stnIntCity2Select.value = lineThemeCity;
                stnIntNameZH2Field.value = '';
                stnIntNameEN2Field.value = '';
                break;
            case 'int3':
                stnIntCity0Select.value = '';
                stnIntNameZH0Field.value = '';
                stnIntNameEN0Field.value = '';
                stnIntCity1Select.value = stnInfo.interchange[0][0][0];
                stnIntNameZH1Field.value = stnInfo.interchange[0][0][3];
                stnIntNameEN1Field.value = stnInfo.interchange[0][0][4];
                stnIntCity2Select.value = stnInfo.interchange[0][1][0];
                stnIntNameZH2Field.value = stnInfo.interchange[0][1][3];
                stnIntNameEN2Field.value = stnInfo.interchange[0][1][4];
                break;
            case 'osi11':
                stnIntCity0Select.value = '';
                stnIntNameZH0Field.value = '';
                stnIntNameEN0Field.value = '';
                stnIntCity1Select.value = stnInfo.interchange[1][1][0];
                stnIntNameZH1Field.value = stnInfo.interchange[1][1][3];
                stnIntNameEN1Field.value = stnInfo.interchange[1][1][4];
                stnIntCity2Select.value = lineThemeCity;
                stnIntNameZH2Field.value = '';
                stnIntNameEN2Field.value = '';
                break;
            case 'osi12':
                stnIntCity0Select.value = '';
                stnIntNameZH0Field.value = '';
                stnIntNameEN0Field.value = '';
                stnIntCity1Select.value = stnInfo.interchange[1][1][0];
                stnIntNameZH1Field.value = stnInfo.interchange[1][1][3];
                stnIntNameEN1Field.value = stnInfo.interchange[1][1][4];
                stnIntCity2Select.value = stnInfo.interchange[1][2][0];
                stnIntNameZH2Field.value = stnInfo.interchange[1][2][3];
                stnIntNameEN2Field.value = stnInfo.interchange[1][2][4];
                break;
            case 'osi22':
                stnIntCity0Select.value = stnInfo.interchange[0][0][0];
                stnIntNameZH0Field.value = stnInfo.interchange[0][0][3];
                stnIntNameEN0Field.value = stnInfo.interchange[0][0][4];
                stnIntCity1Select.value = stnInfo.interchange[1][1][0];
                stnIntNameZH1Field.value = stnInfo.interchange[1][1][3];
                stnIntNameEN1Field.value = stnInfo.interchange[1][1][4];
                stnIntCity2Select.value = stnInfo.interchange[1][2][0];
                stnIntNameZH2Field.value = stnInfo.interchange[1][2][3];
                stnIntNameEN2Field.value = stnInfo.interchange[1][2][4];
                break;
            default:
                stnIntCity0Select.value = lineThemeCity;
                stnIntCity1Select.value = lineThemeCity;
                stnIntCity2Select.value = lineThemeCity;
                stnIntNameZH0Field.value = '';
                stnIntNameEN0Field.value = '';
                stnIntNameZH1Field.value = '';
                stnIntNameEN1Field.value = '';
                stnIntNameZH2Field.value = '';
                stnIntNameEN2Field.value = '';
        }

        if (['none', 'int2', 'osi22'].includes(stnInfo.change_type.split('_')[0])) {
            stnIntTickDirectionToggle.on = true;
        } else {
            stnIntTickDirectionToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            [stnOSINameZHField.value, stnOSINameENField.value] = stnInfo.interchange[1][0];
            paidAreaToggle.on = (stnInfo.change_type.split('_').reverse()[0][0] == 'p');
        } else {
            stnOSINameZHField.value = '';
            stnOSINameENField.value = '';
            paidAreaToggle.on = true;
        }
    });
    stnTransferDialog.listen('MDCDialog:opened', event => {
        stnTransferSelect.layout();
        _notchAllOutlines(1);
        _notchAllOutlines(2);
        _notchAllOutlines(0);
        _notchAllOutlines(-1);
    });
    stnTransferDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        // var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnId = event.target.getAttribute('for');
        var type = stnTransferSelect.value;
        var tickDirec = stnIntTickDirectionToggle.on ? 'r' : 'l';
        var osi = [stnOSINameZHField.value, stnOSINameENField.value];
        var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';
        var intInfo0 = [
            stnIntCity0Select.value, 
            stnIntLine0Select.value, 
            stnIntNameZH0Field.value, 
            stnIntNameEN0Field.value
        ];
        var intInfo1 = [
            stnIntCity1Select.value, 
            stnIntLine1Select.value, 
            stnIntNameZH1Field.value, 
            stnIntNameEN1Field.value
        ];
        var intInfo2 = [
            stnIntCity2Select.value, 
            stnIntLine2Select.value, 
            stnIntNameZH2Field.value, 
            stnIntNameEN2Field.value
        ];
        console.log(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
        if (type == 'none') {
            myLine.updateStnTransfer(stnId, type);
        } else if (type == 'osi22') {
            intInfo0.splice(
                2, 0, 
                $('#int_line_0__selection li span').eq(stnIntLine0Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            intInfo1.splice(
                2, 0, 
                $('#int_line_1__selection li span').eq(stnIntLine1Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            intInfo2.splice(
                2, 0, 
                $('#int_line_2__selection li span').eq(stnIntLine2Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            myLine.updateStnTransfer(stnId, `${type}_end_${osiPaidArea}`, [[intInfo0], [osi, intInfo1, intInfo2]]);
        } else {
            intInfo1.splice(
                2, 0, 
                $('#int_line_1__selection li span').eq(stnIntLine1Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            switch (type) {
                case 'int2':
                    // myLine.updateStnTransfer(stnId, type, [[], intInfo1, []]);
                    myLine.updateStnTransfer(stnId, type, [[intInfo1]]);
                    break;
                case 'osi11':
                    // myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
                    myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1]]);
                    break;
                default:
                    intInfo2.splice(
                        2, 0, 
                        $('#int_line_2__selection li span').eq(stnIntLine2Select.selectedIndex)
                        .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
                    )
                    switch (type) {
                        case 'int3':
                            // myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
                            myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[intInfo1, intInfo2]]);
                            break;
                        case 'osi12':
                            // myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
                            myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [[], [osi, intInfo1, intInfo2]]);
                    }
            }
        }
    })
    stnTransferSelect.listen('MDCSelect:change', event => {
        if (event.detail.value == 'int2') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, false);
            $('#stn_transfer_diag #tick_direc').hide();
            _showOSIFields(false);
            _notchAllOutlines(1);
        } else if (event.detail.value == 'int3') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#stn_transfer_diag #tick_direc').show();
            _showOSIFields(false);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
        } else if (event.detail.value == 'osi11') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, false);
            $('#stn_transfer_diag #tick_direc').show();
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(-1);
        } else if (event.detail.value == 'osi12') {
            _showAllFields(0, false);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#stn_transfer_diag #tick_direc').show();
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
            _notchAllOutlines(-1);
        } else if (event.detail.value == 'osi22') {
            _showAllFields(0, true);
            _showAllFields(1, true);
            _showAllFields(2, true);
            $('#stn_transfer_diag #tick_direc').hide();
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
            _notchAllOutlines(0);
            _notchAllOutlines(-1);
        } else {
            _showAllFields(0, false);
            _showAllFields(1, false);
            _showAllFields(2, false);
            $('#stn_transfer_diag #tick_direc').hide();
            _showOSIFields(false);
        }    
    });
    stnIntCity0Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = urlParams.get('lang');
            // $('#stn_transfer_diag #int_line_1 select').();
            $('#int_line_0__selection').empty();
            data.forEach(l => {
                // $('#stn_transfer_diag #int_line_1 select').append(
                //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                // );
                $('#int_line_0__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${getTransText(l.name, lang)}
                    </li>`
                );
            });

            // var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnId = $('#stn_transfer_diag').attr('for');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.change_type.split('_')[0] == 'osi22') {
                var idx = $(`#int_line_0__selection > [data-value="${stnInfo.interchange[0][0][1]}"]`).index();
                stnIntLine0Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine0Select.selectedIndex = 0;
            }
        });
    });
    stnIntCity1Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = urlParams.get('lang');
            // $('#stn_transfer_diag #int_line_1 select').();
            $('#int_line_1__selection').empty();
            data.forEach(l => {
                $('#int_line_1__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${getTransText(l.name, lang)}
                    </li>`
                );
            });

            var stnId = $('#stn_transfer_diag').attr('for');
            var stnInfo = getParams().stn_list[stnId];

            switch (stnInfo.change_type.split('_')[0]) {
                case 'int2':
                case 'int3':
                    var idx = $(`#int_line_1__selection > [data-value="${stnInfo.interchange[0][0][1]}"]`).index();
                    stnIntLine1Select.selectedIndex = (idx == -1) ? 0 : idx;
                    break;
                case 'osi11':
                case 'osi12':
                case 'osi22':
                    var idx = $(`#int_line_1__selection > [data-value="${stnInfo.interchange[1][1][1]}"]`).index();
                    stnIntLine1Select.selectedIndex = (idx == -1) ? 0 : idx;
                    break;
                default:
                    stnIntLine1Select.selectedIndex = 0;
            }
        });
    });
    stnIntCity2Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = urlParams.get('lang');
            // $('#stn_transfer_diag #int_line_2 select').empty();
            $('#int_line_2__selection').empty();
            data.forEach(l => {
                $('#int_line_2__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${getTransText(l.name, lang)}
                    </li>`
                );
            });

            // var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnId = $('#stn_transfer_diag').attr('for');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.interchange && stnInfo.interchange[0] && stnInfo.interchange[0][1]) {
                // var idx = $(`#stn_transfer_diag #int_line_2 select > [value="${stnInfo.transfer[2][1]}"]`).index();
                var idx = $(`#int_line_2__selection > [data-value="${stnInfo.interchange[0][1][1]}"]`).index();
                stnIntLine2Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else if (stnInfo.interchange && stnInfo.interchange[1] && stnInfo.interchange[1][2]) {
                var idx = $(`#int_line_2__selection > [data-value="${stnInfo.interchange[1][2][1]}"]`).index();
                stnIntLine2Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine2Select.selectedIndex = 0;
            }
        });
    });


    // Deletion
    var stnDeleteConfirmDialog = new mdc.dialog.MDCDialog($('#stn_delete_diag')[0]);
    var stnDeleteErrorDialog = new mdc.dialog.MDCDialog($('#stn_delete_err')[0]);
    stnDeleteConfirmDialog.listen('MDCDialog:opening', event => {
        var stnId = event.target.getAttribute('for');
        $('#stn_delete_diag .mdc-dialog__content').html(
            `Are you sure to delete station ${getParams().stn_list[stnId].name.join(' - ')}? You can't undo this action. `
        );
    });
    stnDeleteConfirmDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        var stnId = event.target.getAttribute('for');
        // Remove from data and svg
        if (myLine.removeStn(stnId)) {
            // Remove station from selection
            $(`#panel_stations .mdc-layout-grid__inner #${stnId}`).remove();
            $(`#pivot__selection [data-value="${stnId}"]`).remove();
        } else {
            stnDeleteErrorDialog.open();
        }
    });
}

function initInfoPanel() {
    // var ripples = [].map.call($('#panel_info .mdc-button, .mdc-icon-button, .mdc-card__primary-action'), el => {
    //     new mdc.ripple.MDCRipple(el);
    // });
    $('#panel_info .mdc-card__actions #report').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator/issues', '_blank');
    });
    $('#panel_info .mdc-card__action-icons [title="Star"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator', '_blank');
    });
    $('#panel_info .mdc-card__action-icons [title="Fork"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator/fork', '_blank');
    });
}