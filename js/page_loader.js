'use strict';

function initLayoutPanel() {
    var layoutList = new mdc.list.MDCList($('#panel_layout .mdc-list')[0]);
    var layoutListItemRipple = layoutList.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));

    var svgWidthTextField = new mdc.textField.MDCTextField($('#svg_width')[0]);
    svgWidthTextField.value = getParams().svg_width;
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
    var designListItemRipple = designList.listElements.map(listItemEl => new mdc.ripple.MDCRipple(listItemEl));

    $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
        getParams().line_name.join(' - ')
    );

    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html(
        (getParams().direction == 'r') ? 'Right' : 'Left'
    );

    $('#panel_design #design_list li:nth-child(7) .mdc-list-item__secondary-text').html(
        $(`#design_char_diag ul [data-mdc-dialog-action="${
            (region => {switch (region) {
                case 'KR': return 'trad';
                case 'TC': return 'tw';
                case 'SC': return 'cn';
                case 'JP': return 'jp';
            }})(getParams().fontZH[0].split(' ').reverse()[0])
        }"] span`).html()
    );

    designList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                themeDialog.open();
                break;
            case 1:
                lineNameDialog.open();
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
                myLine.swapStnName();
                break;
            case 6:
                charDialog.open();
        }
    });

    var themeDialog = new mdc.dialog.MDCDialog($('#design_theme_diag')[0]);
    themeDialog.listen('MDCDialog:opened', () => {
        themeCitySelect.layout();
        themeLineSelect.layout();
    });

    var themeCitySelect = new mdc.select.MDCSelect($('#theme_city')[0]);
    var themeLineSelect = new mdc.select.MDCSelect($('#theme_line')[0]);
    // var themeColourSelect = new mdc.textField.MDCTextField($('#theme_colour')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            // $('#theme_city > select').append(
            //     `<option value="${c.id}">${c.name[0]}</option>`
            // );
            $('#theme_city__selection').append(
                `<li class="mdc-list-item" data-value="${c.id}">
                ${countryCode2Emoji(c.country)}${c.name[0]}
                </li>`
            );
        });

        var [themeCity, themeLine, themeColour] = getParams().theme
        // var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        themeCitySelect.selectedIndex = cityIdx;
    });

    themeCitySelect.listen("MDCSelect:change", (event) => {
        // $('#theme_line > select').empty();
        $('#theme_line__selection').empty();

        if (event.detail.value == 'nullcity') {
            //
        } else {
            $.getJSON(`data/${event.detail.value}.json`, data => {
                data.forEach(l => {
                    // $('#theme_line > select').append(
                    //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                    // );
                    $('#theme_line__selection').append(
                        `<li class="mdc-list-item" data-value="${l.id}">
                        <span style="background:${l.colour};">&nbsp;</span>&nbsp;${l.name[0]}
                        </li>`
                    );
                });

                var param_instance = getParams();
                param_instance.theme[0] = event.detail.value;
                putParams(param_instance);

                var themeLine = param_instance.theme[1];
                // var lineIdx = $(`#theme_line > select > [value="${themeLine}"]`).index();
                var lineIdx = $(`#theme_line__selection > [data-value="${themeLine}"]`).index();

                if (lineIdx == -1) {
                    themeLineSelect.selectedIndex = 0;
                } else {
                    themeLineSelect.selectedIndex = lineIdx;
                }
            });
        }
    });

    themeLineSelect.listen("MDCSelect:change", event => {
        if (themeCitySelect.value == 'nullcity') {
            //
        } else {
            var param = getParams();
            param.theme[1] = event.detail.value;
            putParams(param);

            myLine.themeLine = event.detail.value;
            // myLine.themeColour = $('#theme_line option').eq(event.detail.index).attr('colour');
            // myLine.themeColour = $('#theme_line__selection li').eq(event.detail.index).attr('colour');
            myLine.themeColour = $('#theme_line__selection li span')
                                .eq(event.detail.index).attr('style')
                                .match(/(?!background:)#[\w\d]+(?=;)/g)[0]

            $('#panel_design #design_list li:first-child .mdc-list-item__secondary-text').html(
                `${$('#theme_city__selection li').eq(themeCitySelect.selectedIndex).html().trim()} - ${$('#theme_line__selection li').eq(event.detail.index).html().trim()}`
            );
        }
    });

    var lineNameDialog = new mdc.dialog.MDCDialog($('#line_name_diag')[0]);
    var lineNameZHField = new mdc.textField.MDCTextField($('#line_name_diag #name_zh')[0]);
    var lineNameENField = new mdc.textField.MDCTextField($('#line_name_diag #name_en')[0]);
    [lineNameZHField.value, lineNameENField.value] = getParams().line_name;
    lineNameDialog.listen('MDCDialog:opened', () => {
        lineNameZHField.layout();
        lineNameENField.layout();
    });
    $('#line_name_diag #name_zh, #name_en').on('input', event => {
        var nameZH = lineNameZHField.value;
        var nameEN = lineNameENField.value;
        myLine.lineNames = [nameZH, nameEN];
        $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
            `${nameZH} - ${nameEN}`
        );
    });


    var platformTextField = new mdc.textField.MDCTextField($('#platform_num')[0]);
    platformTextField.value = getParams().platform_num;
    $('#platform_num > input').on('input', event => {
        myLine.platformNum = event.target.value;
    });

    // var txtFilpButtonRipple = new mdc.ripple.MDCRipple($('#txt_flip')[0]);
    // txtFilpButtonRipple.unbounded = true;
    // $('#txt_flip').on('click', event => {myLine.swapStnName();});

    var legacySwitch = new mdc.switchControl.MDCSwitch($('#legacy')[0]);
    legacySwitch.checked = getParams().dest_legacy;
    $('#legacy input').on('change', event => {
        console.log(event.target.checked);
        myLine.destLegacy = event.target.checked;
    });

    var charDialog = new mdc.dialog.MDCDialog($('#design_char_diag')[0]);
    var charDialogList = new mdc.list.MDCList($('#design_char_diag .mdc-list')[0]);
    charDialog.listen('MDCDialog:opened', () => {
        charDialogList.layout();
        var charDialogListItemRipple = charDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    charDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        // myLine.switchCharForm(event.detail.action);
        myLine.charForm = event.detail.action;
        $('#panel_design #design_list li:nth-child(7) .mdc-list-item__secondary-text').html(
            $(`#design_char_diag ul [data-mdc-dialog-action="${event.detail.action}"] span`).html()
        );
    });


    // var test = new mdc.select.MDCSelect($('#test')[0]);
}

function initStationsPanel() {
    var stationsList = new mdc.list.MDCList($('#panel_stations .mdc-list:first-child')[0]);
    var stationsListItemRipple = stationsList.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));
    stationsList.listen('MDCList:action', event => {
        console.log(event.detail);
        // console.log(event.detail.index);
        switch (event.detail.index) {
            case 0:
                stnAddDialog.open();
                break;
            case 1:
                stnSelectDialog.open();
                break;
            case 2:
                var stnId = $('#panel_stations #selected_stn').attr('stn');
                if (stnId == 'none') {break;}
                myLine.currentStnId = stnId;
                break;
            case 3:
                var stnId = $('#panel_stations #selected_stn').attr('stn');
                if (stnId == 'none') {break;}
                stnModifyDialog.open();
                break;
            case 4:
                var stnId = $('#panel_stations #selected_stn').attr('stn');
                if (stnId == 'none') {break;}
                stnTransferDialog.open();
                break;
            case 5:
                var stnId = $('#panel_stations #selected_stn').attr('stn');
                if (stnId == 'none') {break;}
                stnDeleteConfirmDialog.open();
                break;
        }
    });


    // Selection
    var stnSelectDialog = new mdc.dialog.MDCDialog($('#stn_select_diag')[0]);
    var stnSelectDialogList = new mdc.list.MDCList($('#stn_select_diag .mdc-list')[0]);
    function _genStnList() {
        var stnList = getParams().stn_list;
        $('#stn_select_diag ul').empty();
        $('#stn_add_diag #pivot select').empty();
        $('#stn_select_diag ul').append(
            `<li class="mdc-list-item" tabindex="0" data-mdc-dialog-action="none">
            <span class="mdc-list-item__text">Not Selected</span>
            </li>`
        );
        myLine.tpo.forEach(stnId => {
            $('#stn_select_diag ul').append(
                `<li class="mdc-list-item" data-mdc-dialog-action="${stnId}">
                <span class="mdc-list-item__text">${stnList[stnId].name.join(' - ')}</span>
                </li>`
            );
            // $('#stn_add_diag #pivot select').append(
            //     `<option value="${stnId}">${stnList[stnId].name.join(' - ')}</option>`
            // );
            $('#pivot__selection').append(
                `<li class="mdc-list-item" data-value="${stnId}">
                ${stnList[stnId].name.join(' - ')}</li>`
            );
        });
    }
    _genStnList();
    // $('#stn_select_diag li:first-child').attr('tabindex', 0);
    stnSelectDialog.listen('MDCDialog:opening', event => {
        //
    });
    stnSelectDialog.listen('MDCDialog:opened', () => {
        stnSelectDialogList.layout();
        var stnSelectDialogListItemRipple = stnSelectDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    stnSelectDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        var selectedStnNames = $(`#stn_select_diag ul [data-mdc-dialog-action=${event.detail.action}] span`).html();
        $('#panel_stations #selected_stn span:nth-child(2)').html(
            `Modify Station: ${selectedStnNames}`
        );
        $('#panel_stations #selected_stn').attr('stn', event.detail.action);

        if (event.detail.action == 'none') {
            [4,5,6,7].forEach(i => $(`#panel_stations #stations_list li:nth-child(${i})`).addClass('mdc-list-item--disabled'));
        } else {
            [4,5,6,7].forEach(i => $(`#panel_stations #stations_list li:nth-child(${i})`).removeClass('mdc-list-item--disabled'));
        }
    });


    // Addition
    var stnAddDialog = new mdc.dialog.MDCDialog($('#stn_add_diag')[0]);

    var stnAddPrepSelect = new mdc.select.MDCSelect($('#stn_add_diag #prep')[0]);
    var stnAddPivotSelect = new mdc.select.MDCSelect($('#stn_add_diag #pivot')[0]);
    var stnAddLocSelect = new mdc.select.MDCSelect($('#stn_add_diag #loc')[0]);
    var stnAddEndSelect = new mdc.select.MDCSelect($('#stn_add_diag #end')[0]);
    stnAddDialog.listen('MDCDialog:opening', event => {
        // $('#stn_add_diag #pivot')[0].dispatchEvent(new Event('MDCSelect:change'));
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

        // $('#stn_list > select').append(
        //     `<option value="${newId}">${newInfo.name.join(' - ')}</option>`
        // );
        console.log(prep, stnId, loc, end);
        _genStnList();

        // Trigger station name modification
        $('#stn_select_diag')[0].dispatchEvent(new CustomEvent('MDCDialog:closed', {'detail':{'action':newId}}));
        $('#panel_stations #stations_list')[0].dispatchEvent(new CustomEvent('MDCList:action', {'detail':{'index':3}}));
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
            $('#stn_add_diag #new_branch').attr('style', '');
            stnAddEndSelect.selectedIndex = 0;
        } else {
            $('#stn_add_diag #new_branch').attr('style', 'display:none');
        }
    });


    // Modification (Name)
    // var stnModifyButtonRipple = new mdc.ripple.MDCRipple($('#stn_modify')[0]);
    // stnModifyButtonRipple.unbounded = true;
    var stnModifyDialog = new mdc.dialog.MDCDialog($('#stn_modify_diag')[0]);
    var stnModifyNameZHField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_zh')[0]);
    var stnModifyNameENField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_en')[0]);
    // $('#stn_modify').on('click', event => {
    //     if (stationSelect.value == 'null') {return;}
    //     stnModifyDialog.open();
    // });
    stnModifyDialog.listen('MDCDialog:opening', event => {
        // var stnId = stationSelect.value;
        var stnId = $('#panel_stations #selected_stn').attr('stn');
        var param = getParams();
        [stnModifyNameZHField.value, stnModifyNameENField.value] = param.stn_list[stnId].name;
    });
    stnModifyDialog.listen('MDCDialog:opened', event => {
        stnModifyNameZHField.layout();
        stnModifyNameENField.layout();
    })
    $('#stn_modify_diag #name_zh, #name_en').on('input', event => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        var stnId = $('#panel_stations #selected_stn').attr('stn');
        myLine.updateStnName(stnId, nameZH, nameEN);
        $(`#stn_select_diag ul [data-mdc-dialog-action="${stnId}"] span`).html(`${nameZH} - ${nameEN}`);
        $('#panel_stations #selected_stn span:last-child').html(`Modify Station: ${nameZH} - ${nameEN}`);
        // $('#stn_list option').eq(stationSelect.selectedIndex).html(`${nameZH} - ${nameEN}`);
        $(`#stn_add_diag #pivot select [value=${stnId}]`).html(`${nameZH} - ${nameEN}`);
    });


    // Modification (Interchange)
    // var stnTransferButtonRipple = new mdc.ripple.MDCRipple($('#stn_transfer')[0]);
    // stnTransferButtonRipple.unbounded = true;
    var stnTransferDialog = new mdc.dialog.MDCDialog($('#stn_transfer_diag')[0]);
    var stnTransferSelect = new mdc.select.MDCSelect($('#stn_transfer_diag #change_type')[0]);
    var stnIntTickDirectionToggle = new mdc.iconButton.MDCIconButtonToggle($('#stn_transfer_diag #tick_direc')[0]);
    stnIntTickDirectionToggle.unbounded = true;

    var stnIntCity1Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_1')[0]);
    var stnIntCity2Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_2')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            [1,2].forEach(i => {
                // $(`#stn_transfer_diag #int_city_${i} select`).append(
                //     `<option value="${c.id}">${c.name[0]}</option>`
                // );
                $(`#int_city_${i}__selection`).append(
                    `<li class="mdc-list-item" data-value="${c.id}">
                    ${countryCode2Emoji(c.country)}${c.name[0]}
                    </li>`
                );
            });
        });
    });

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
            // OSI fields
            stnOSINameZHField.layout();
            stnOSINameENField.layout();
        }
    }

    function _showAllFields(n, show) {
        var sty = show ? '' : 'display:none';
        $(`#stn_transfer_diag #int_city_${n}, #int_line_${n}, #int_name_zh_${n}, #int_name_en_${n}`).attr('style', sty);
    }

    function _showIntTickDirecToggle(show) {
        var sty = show ? '' : 'display:none';
        $('#stn_transfer_diag #tick_direc').attr('style', sty);
    }

    function _showOSIFields(show) {
        var sty = show ? '' : 'display:none';
        $('#stn_transfer_diag #osi_name_zh').attr('style', sty);
        $('#stn_transfer_diag #osi_name_en').attr('style', sty);
        $('#stn_transfer_diag #paid_area').attr('style', sty)
    }

    // $('#stn_transfer').on('click', event => {
    //     if (stationSelect.value == 'null') {return;}
    //     stnTransferDialog.open();
    // });
    stnTransferDialog.listen('MDCDialog:opening', event => {
        // var stnId = stationSelect.value;
        var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnInfo = getParams().stn_list[stnId];
        stnTransferSelect.value = stnInfo.change_type.split('_')[0];

        if (stnInfo.change_type != 'none') {
            if (stnInfo.transfer[1].length) {
                stnIntCity1Select.value = stnInfo.transfer[1][0];
                stnIntNameZH1Field.value = stnInfo.transfer[1][3];
                stnIntNameEN1Field.value = stnInfo.transfer[1][4];
            } else {
                stnIntCity1Select.selectedIndex = 0;
                stnIntNameZH1Field.value = '';
                stnIntNameEN1Field.value = '';
            }
            if (stnInfo.transfer[2].length) {
                stnIntCity2Select.value = stnInfo.transfer[2][0];
                stnIntNameZH2Field.value = stnInfo.transfer[2][3];
                stnIntNameEN2Field.value = stnInfo.transfer[2][4];
            } else {
                stnIntCity2Select.selectedIndex = 0;
                stnIntNameZH2Field.value = '';
                stnIntNameEN2Field.value = '';
            }
        } else {
            stnIntCity1Select.selectedIndex = 0;
            stnIntCity2Select.selectedIndex = 0;
            stnIntNameZH1Field.value = '';
            stnIntNameEN1Field.value = '';
            stnIntNameZH2Field.value = '';
            stnIntNameEN2Field.value = '';
        }

        if (['none', 'int2'].includes(stnInfo.change_type)) {
            stnIntTickDirectionToggle.on = true;
        } else {
            stnIntTickDirectionToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            stnOSINameZHField.value = stnInfo.transfer[0][0];
            stnOSINameENField.value = stnInfo.transfer[0][1];

            paidAreaToggle.on = (stnInfo.change_type.substring(6,7) == 'p');
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
    });
    stnTransferDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        var stnId = $('#panel_stations #selected_stn').attr('stn');
        var type = stnTransferSelect.value;
        var tickDirec = stnIntTickDirectionToggle.on ? 'r' : 'l';
        var osi = [stnOSINameZHField.value, stnOSINameENField.value];
        var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';
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
        } else {
            intInfo1.splice(
                2, 0, 
                $('#int_line_1__selection li span').eq(stnIntLine1Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            switch (type) {
                case 'int2':
                    myLine.updateStnTransfer(stnId, type, [[], intInfo1, []]);
                    break;
                case 'osi11':
                    myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
                    break;
                default:
                    intInfo2.splice(
                        2, 0, 
                        $('#int_line_2__selection li span').eq(stnIntLine2Select.selectedIndex)
                        .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
                    )
                    switch (type) {
                        case 'int3':
                            myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
                            break;
                        case 'osi12':
                            myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
                    }
            }
        }
    })
    stnTransferSelect.listen('MDCSelect:change', event => {
        if (event.detail.value == 'int2') {
            _showAllFields(1, true);
            _showAllFields(2, false);
            _showIntTickDirecToggle(false);
            _showOSIFields(false);
            _notchAllOutlines(1);
        } else if (event.detail.value == 'int3') {
            _showAllFields(1, true);
            _showAllFields(2, true);
            _showIntTickDirecToggle(true);
            _showOSIFields(false);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
        } else if (event.detail.value == 'osi11') {
            _showAllFields(1, true);
            _showAllFields(2, false);
            _showIntTickDirecToggle(true);
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(0);
        } else if (event.detail.value == 'osi12') {
            _showAllFields(1, true);
            _showAllFields(2, true);
            _showIntTickDirecToggle(true);
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
            _notchAllOutlines(0);
        } else {
            _showAllFields(1, false);
            _showAllFields(2, false);
            _showIntTickDirecToggle(false);
            _showOSIFields(false);
        }    
    });
    stnIntCity1Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            // $('#stn_transfer_diag #int_line_1 select').empty();
            $('#int_line_1__selection').empty();
            data.forEach(l => {
                // $('#stn_transfer_diag #int_line_1 select').append(
                //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                // );
                $('#int_line_1__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${l.name[0]}
                    </li>`
                );
            });

            var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                // var idx = $(`#stn_transfer_diag #int_line_1 select > [value="${stnInfo.transfer[1][1]}"]`).index();
                var idx = $(`#int_line_1__selection > [data-value="${stnInfo.transfer[1][1]}"]`).index();
                stnIntLine1Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine1Select.selectedIndex = 0;
            }
        });
    });
    stnIntCity2Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            // $('#stn_transfer_diag #int_line_2 select').empty();
            $('#int_line_2__selection').empty();
            data.forEach(l => {
                // $('#stn_transfer_diag #int_line_2 select').append(
                //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                // );
                $('#int_line_2__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${l.name[0]}
                    </li>`
                );
            });

            var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                // var idx = $(`#stn_transfer_diag #int_line_2 select > [value="${stnInfo.transfer[2][1]}"]`).index();
                var idx = $(`#int_line_2__selection > [data-value="${stnInfo.transfer[2][1]}"]`).index();
                stnIntLine2Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine2Select.selectedIndex = 0;
            }
        });
    });


    // Deletion
    // var stnDeleteButtonRipple = new mdc.ripple.MDCRipple($('#stn_delete')[0]);
    // stnDeleteButtonRipple.unbounded = true;
    var stnDeleteConfirmDialog = new mdc.dialog.MDCDialog($('#stn_delete_diag')[0]);
    var stnDeleteErrorDialog = new mdc.dialog.MDCDialog($('#stn_delete_err')[0]);
    // $('#stn_delete').on('click', event => {
    //     if (stationSelect.value == 'null') {return;}
    //     stnDeleteConfirmDialog.open();
    // });
    stnDeleteConfirmDialog.listen('MDCDialog:opening', event => {
        var stnNames = $('#stations_list #selected_stn span:last-child').html().split(':')[1];
        $('#stn_delete_diag .mdc-dialog__content').html(
            `Are you sure to delete station ${stnNames}? You can't undo this action. `
        );
    });
    stnDeleteConfirmDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        var stnId = $('#panel_stations #selected_stn').attr('stn');
        // var idx = stationSelect.selectedIndex;
        // Remove from data and svg
        if (myLine.removeStn(stnId)) {
            // Remove station from selection
            // $(`#stn_list [value=${stnId}]`).remove();
            $(`#stn_select_diag ul [data-mdc-dialog-action="${stnId}"`).remove();
            $('#stn_select_diag')[0].dispatchEvent(new CustomEvent('MDCDialog:closed', {'detail':{'action':'none'}}));
            // $('#stn_list option').eq(stationSelect.selectedIndex).remove();
            $(`#stn_add_diag #pivot [value=${stnId}]`).remove();
            // stationSelect.selectedIndex = (idx==0) ? 0 : idx-1;
        } else {
            stnDeleteErrorDialog.open();
        }
    });

}

function initSavePanel() {
    var saveList = new mdc.list.MDCList($('#panel_save .mdc-list')[0]);
    var saveListItemRipple = saveList.listElements.map((listItemEl) => new mdc.ripple.MDCRipple(listItemEl));

    saveList.listen('MDCList:action', event => {
        console.log(event.detail);
        switch (event.detail.index) {
            case 0:
                newFileDialog.open();
                break;
            case 1:
                $('#upload_file').click();
                break;
            case 2:
                var link = document.createElement('a');
                var data = new Blob([localStorage.rmgParam], {type: 'application/json;charset=utf-8'});
                var url = window.URL.createObjectURL(data);
                link.href = url;
                link.download = 'railmap_config.json';
                link.click();
                URL.revokeObjectURL(url);
                break;
            case 3:
                exportDialog.open();
                break;
        }
    });

    var newFileDialog = new mdc.dialog.MDCDialog($('#new_file_diag')[0]);
    var newFileDialogList = new mdc.list.MDCList($('#new_file_diag .mdc-list')[0]);
    newFileDialog.listen('MDCDialog:opened', () => {
        newFileDialogList.layout();
        var newFileDialogListItemRipple = newFileDialogList.listElements.map(
            listItemEl => new mdc.ripple.MDCRipple(listItemEl)
        );
    });
    newFileDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        if (event.detail.action == 'blank') {
            $.getJSON(`templates/blank.json`, data => {
                localStorage.rmgParam = JSON.stringify(data);
                location.reload(true);
            });
        }
        if (event.detail.action == 'template') {
            templateDialog.open();
            return;
        }

        // $.getJSON(`templates/${event.detail.action}.json`, data => {
        //     localStorage.rmgParam = JSON.stringify(data);
        //     location.reload(true);
        // });
    });

    var templateDialog = new mdc.dialog.MDCDialog($('#template_diag')[0]);
    var templateDialogList = new mdc.list.MDCList($('#template_diag .mdc-list')[0]);
    $.getJSON('templates/template_list.json', data => {
        data.forEach(d => {
            $('#template_diag ul').append(
                `<li class="mdc-list-item" data-mdc-dialog-action="${d.filename}">
                <span class="mdc-list-item__text">${d.description}</span>
                </li>`
            )
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
        if (event.detail.action == 'back') {
            newFileDialog.open();
            return;
        }
        
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
                link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent($('#svgs svg:first-child')[0].outerHTML)));
                link.download = 'railmap_dest.svg';
                link.click();
                break;
            case 'svg2':
                var link = document.createElement('a');
                link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent($('#svgs svg:last-child')[0].outerHTML)));
                link.download = 'railmap_map.svg';
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
}

function initTestPanel() {
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
                    $('<button>', {'title':'Set As Current'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('my_location')
                ).append(
                    $('<button>', {'title':'Interchange'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('transfer_within_a_station')
                ).append(
                    $('<button>', {'title': 'Remove'}).addClass('material-icons mdc-icon-button mdc-card__action mdc-card__action--icon').text('delete_forever')
                )
            )
        );
        return `<div class="mdc-card mdc-layout-grid__cell--span-2-desktop mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-2-phone station-card" id="${id}">
        <div class="mdc-card__primary-action">
            <div class="mdc-card__media mdc-card__media--16-9">
            <div class="mdc-card__media-content station-card__content">${names.join('<br>')}</div>
            </div>
        </div>
        <div class="mdc-card__actions">
            <div class="mdc-card__action-icons">
            <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Set As Current">my_location</button>
            <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Interchange">transfer_within_a_station</button>
            <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Remove">delete_forever</button>
            </div>
        </div>
        </div>`
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

        if (prevId == 'add_stn') {
            $('#pivot__selection').prepend(
                `<li class="mdc-list-item" data-value="${newId}">
                ${newInfo.name.join(' - ')}</li>`
            );
        } else {
            $(`#pivot__selection [data-value="${prevId}"`).after(
                `<li class="mdc-list-item" data-value="${newId}">
                ${newInfo.name.join(' - ')}</li>`
            );
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
            $('#stn_add_diag #new_branch').attr('style', '');
            stnAddEndSelect.selectedIndex = 0;
        } else {
            $('#stn_add_diag #new_branch').attr('style', 'display:none');
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

    var stnIntCity1Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_1')[0]);
    var stnIntCity2Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_2')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            [1,2].forEach(i => {
                $(`#int_city_${i}__selection`).append(
                    `<li class="mdc-list-item" data-value="${c.id}">
                    ${countryCode2Emoji(c.country)}${c.name[0]}
                    </li>`
                );
            });
        });
    });

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
            // OSI fields
            stnOSINameZHField.layout();
            stnOSINameENField.layout();
        }
    }

    function _showAllFields(n, show) {
        var sty = show ? '' : 'display:none';
        $(`#stn_transfer_diag #int_city_${n}, #int_line_${n}, #int_name_zh_${n}, #int_name_en_${n}`).attr('style', sty);
    }

    function _showIntTickDirecToggle(show) {
        var sty = show ? '' : 'display:none';
        $('#stn_transfer_diag #tick_direc').attr('style', sty);
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
        stnTransferSelect.value = stnInfo.change_type.split('_')[0];

        if (stnInfo.change_type != 'none') {
            if (stnInfo.transfer[1].length) {
                stnIntCity1Select.value = stnInfo.transfer[1][0];
                stnIntNameZH1Field.value = stnInfo.transfer[1][3];
                stnIntNameEN1Field.value = stnInfo.transfer[1][4];
            } else {
                stnIntCity1Select.value = lineThemeCity;
                stnIntNameZH1Field.value = '';
                stnIntNameEN1Field.value = '';
            }
            if (stnInfo.transfer[2].length) {
                stnIntCity2Select.value = stnInfo.transfer[2][0];
                stnIntNameZH2Field.value = stnInfo.transfer[2][3];
                stnIntNameEN2Field.value = stnInfo.transfer[2][4];
            } else {
                stnIntCity2Select.value = lineThemeCity;
                stnIntNameZH2Field.value = '';
                stnIntNameEN2Field.value = '';
            }
        } else {
            stnIntCity1Select.value = lineThemeCity;
            stnIntCity2Select.value = lineThemeCity;
            stnIntNameZH1Field.value = '';
            stnIntNameEN1Field.value = '';
            stnIntNameZH2Field.value = '';
            stnIntNameEN2Field.value = '';
        }

        if (['none', 'int2'].includes(stnInfo.change_type)) {
            stnIntTickDirectionToggle.on = true;
        } else {
            stnIntTickDirectionToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            stnOSINameZHField.value = stnInfo.transfer[0][0];
            stnOSINameENField.value = stnInfo.transfer[0][1];

            paidAreaToggle.on = (stnInfo.change_type.substring(6,7) == 'p');
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
    });
    stnTransferDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        // var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnId = event.target.getAttribute('for');
        var type = stnTransferSelect.value;
        var tickDirec = stnIntTickDirectionToggle.on ? 'r' : 'l';
        var osi = [stnOSINameZHField.value, stnOSINameENField.value];
        var osiPaidArea = paidAreaToggle.on ? 'p' : 'u';
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
        } else {
            intInfo1.splice(
                2, 0, 
                $('#int_line_1__selection li span').eq(stnIntLine1Select.selectedIndex)
                .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
            );
            switch (type) {
                case 'int2':
                    myLine.updateStnTransfer(stnId, type, [[], intInfo1, []]);
                    break;
                case 'osi11':
                    myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
                    break;
                default:
                    intInfo2.splice(
                        2, 0, 
                        $('#int_line_2__selection li span').eq(stnIntLine2Select.selectedIndex)
                        .attr('style').match(/(?!background:)#[\w\d]+(?=;)/g)[0]
                    )
                    switch (type) {
                        case 'int3':
                            myLine.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
                            break;
                        case 'osi12':
                            myLine.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
                    }
            }
        }
    })
    stnTransferSelect.listen('MDCSelect:change', event => {
        if (event.detail.value == 'int2') {
            _showAllFields(1, true);
            _showAllFields(2, false);
            _showIntTickDirecToggle(false);
            _showOSIFields(false);
            _notchAllOutlines(1);
        } else if (event.detail.value == 'int3') {
            _showAllFields(1, true);
            _showAllFields(2, true);
            _showIntTickDirecToggle(true);
            _showOSIFields(false);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
        } else if (event.detail.value == 'osi11') {
            _showAllFields(1, true);
            _showAllFields(2, false);
            _showIntTickDirecToggle(true);
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(0);
        } else if (event.detail.value == 'osi12') {
            _showAllFields(1, true);
            _showAllFields(2, true);
            _showIntTickDirecToggle(true);
            _showOSIFields(true);
            _notchAllOutlines(1);
            _notchAllOutlines(2);
            _notchAllOutlines(0);
        } else {
            _showAllFields(1, false);
            _showAllFields(2, false);
            _showIntTickDirecToggle(false);
            _showOSIFields(false);
        }    
    });
    stnIntCity1Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            // $('#stn_transfer_diag #int_line_1 select').();
            $('#int_line_1__selection').empty();
            data.forEach(l => {
                // $('#stn_transfer_diag #int_line_1 select').append(
                //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                // );
                $('#int_line_1__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${l.name[0]}
                    </li>`
                );
            });

            // var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnId = $('#stn_transfer_diag').attr('for');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                // var idx = $(`#stn_transfer_diag #int_line_1 select > [value="${stnInfo.transfer[1][1]}"]`).index();
                var idx = $(`#int_line_1__selection > [data-value="${stnInfo.transfer[1][1]}"]`).index();
                stnIntLine1Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine1Select.selectedIndex = 0;
            }
        });
    });
    stnIntCity2Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            // $('#stn_transfer_diag #int_line_2 select').empty();
            $('#int_line_2__selection').empty();
            data.forEach(l => {
                // $('#stn_transfer_diag #int_line_2 select').append(
                //     `<option value="${l.id}" colour="${l.colour}">${l.name[0]}</option>`
                // );
                $('#int_line_2__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};">&nbsp;</span>&nbsp;${l.name[0]}
                    </li>`
                );
            });

            // var stnId = $('#panel_stations #selected_stn').attr('stn');
            var stnId = $('#stn_transfer_diag').attr('for');
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                // var idx = $(`#stn_transfer_diag #int_line_2 select > [value="${stnInfo.transfer[2][1]}"]`).index();
                var idx = $(`#int_line_2__selection > [data-value="${stnInfo.transfer[2][1]}"]`).index();
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
    $('#panel_info .mdc-card__action-icons [title="Star"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator', '_blank');
    });
    $('#panel_info .mdc-card__action-icons [title="Fork"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator/fork', '_blank');
    });
}