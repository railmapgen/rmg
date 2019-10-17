'use strict';

function initLayoutPanel() {
    var svgWidthTextField = new mdc.textField.MDCTextField($('#svg_width')[0]);
    svgWidthTextField.value = getParams().svg_width;
    $('#svg_width > input').on('input', event => {
        ktl.svgWidth = event.target.value;
    });

    var branchSpacingSlider = new mdc.slider.MDCSlider($('#branch_spacing')[0]);
    branchSpacingSlider.value = getParams().branch_spacing;
    branchSpacingSlider.listen('MDCSlider:input', () => {
        ktl.branchSpacing = branchSpacingSlider.value;
    });

    var yPcSlider = new mdc.slider.MDCSlider($('#y_pc')[0]);
    yPcSlider.value = getParams().branch_spacing;
    yPcSlider.listen('MDCSlider:input', () => {
        ktl.yPc = yPcSlider.value;
    });
}

function initDesignPanel() {
    var themeCitySelect = new mdc.select.MDCSelect($('#theme_city')[0]);
    var themeLineSelect = new mdc.select.MDCSelect($('#theme_line')[0]);
    // var themeColourSelect = new mdc.textField.MDCTextField($('#theme_colour')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            $('#theme_city > select').append(
                `<option value="${c.id}">${c.name[0]}</option>`
            );
        });

        var [themeCity, themeLine, themeColour] = getParams().theme
        var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        themeCitySelect.selectedIndex = cityIdx;
    });

    themeCitySelect.listen("MDCSelect:change", (event) => {
        $('#theme_line > select').empty();

        if (event.detail.value == 'nullcity') {
            //
        } else {
            $.getJSON(`data/${event.detail.value}.json`, data => {
                data.forEach(l => {
                    $('#theme_line > select').append(
                        `<option value="${l.id}">${l.name[0]}</option>`
                    );
                });

                var param_instance = getParams();
                var themeLine = param_instance.theme[1];
                var lineIdx = $(`#theme_line > select > [value="${themeLine}"]`).index();

                if (lineIdx == -1) {
                    themeLineSelect.selectedIndex = 0;
                } else {
                    themeLineSelect.selectedIndex = lineIdx;
                }

                param_instance.theme[0] = event.detail.value;
                putParams(param_instance);
            });
        }
    });

    themeLineSelect.listen("MDCSelect:change", event => {
        if (themeCitySelect.value == 'nullcity') {
            //
        } else {
            $.getJSON(`data/${themeCitySelect.value}.json`, (data) => {
                var theme = data[event.detail.index];

                ktl.themeLine = theme.id;
                ktl.themeColour = theme.colour;
                // ktl.fillThemeColour();

                var param_instance = getParams();
                param_instance.theme[1] = theme.id;
                // param_instance.theme[2] = theme.colour;
                putParams(param_instance);
            })
        }
    });

    var directionLToggle = new mdc.iconButton.MDCIconButtonToggle($('#direction_l')[0]);
    var directionRToggle = new mdc.iconButton.MDCIconButtonToggle($('#direction_r')[0]);
    directionLToggle.unbounded = true;
    directionRToggle.unbounded = true;
    if (getParams().direction == 'l') {
        directionLToggle.on = true;
        directionRToggle.on = false;
        $('#direction_l').prop('disabled', true);
    } else {
        directionLToggle.on = false;
        directionRToggle.on = true;
        $('#direction_r').prop('disabled', true);
    }
    directionRToggle.listen('MDCIconButtonToggle:change', event => {
        if (event.detail.isOn) {
            ktl.direction = 'r';
            directionLToggle.on = false;
            $('#direction_r').prop('disabled', true);
            $('#direction_l').prop('disabled', false);
        }
    })
    directionLToggle.listen('MDCIconButtonToggle:change', event => {
        if (event.detail.isOn) {
            ktl.direction = 'l';
            directionRToggle.on = false;
            $('#direction_l').prop('disabled', true);
            $('#direction_r').prop('disabled', false);
        }
    })

    var platformTextField = new mdc.textField.MDCTextField($('#platform_num')[0]);
    platformTextField.value = getParams().platform_num;
    $('#platform_num > input').on('input', event => {
        ktl.platformNum = event.target.value;
    });

    var txtFilpButtonRipple = new mdc.ripple.MDCRipple($('#txt_flip')[0]);
    txtFilpButtonRipple.unbounded = true;
    $('#txt_flip').on('click', event => {ktl.swapStnName();});
}

function initStationsPanel() {
    var stationSelect = new mdc.select.MDCSelect($('#stn_list')[0]);
    for (let [stnId, stnInfo] of Object.entries(getParams().stn_list)) {
        $('#stn_list > select').append(
            `<option value="${stnId}">${stnInfo.name.join(' - ')}</option>`
        );
    }


    // Modification (Name)
    var stnModifyButtonRipple = new mdc.ripple.MDCRipple($('#stn_modify')[0]);
    stnModifyButtonRipple.unbounded = true;
    var stnModifyDialog = new mdc.dialog.MDCDialog($('#stn_modify_diag')[0]);
    var stnModifyNameZHField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_zh')[0]);
    var stnModifyNameENField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_en')[0]);
    $('#stn_modify').on('click', event => {
        if (stationSelect.value == 'null') {return;}
        stnModifyDialog.open();
    });
    stnModifyDialog.listen('MDCDialog:opening', event => {
        var stnId = stationSelect.value;
        var param = getParams();
        stnModifyNameZHField.value = param.stn_list[stnId].name[0];
        stnModifyNameENField.value = param.stn_list[stnId].name[1];
    });
    stnModifyDialog.listen('MDCDialog:opened', event => {
        stnModifyNameZHField.foundation_.notchOutline(true);
        stnModifyNameENField.foundation_.notchOutline(true);
    })
    $('#stn_modify_diag #name_zh').on('input', event => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        ktl.updateStnName(stationSelect.value, nameZH, nameEN);
        $('#stn_list option').eq(stationSelect.selectedIndex).html(`${nameZH} - ${nameEN}`);
    });
    $('#stn_modify_diag #name_en').on('input', event => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        ktl.updateStnName(stationSelect.value, nameZH, nameEN);
        $('#stn_list option').eq(stationSelect.selectedIndex).html(`${nameZH} - ${nameEN}`);
    });


    // Modification (Interchange)
    var stnTransferButtonRipple = new mdc.ripple.MDCRipple($('#stn_transfer')[0]);
    stnTransferButtonRipple.unbounded = true;
    var stnTransferDialog = new mdc.dialog.MDCDialog($('#stn_transfer_diag')[0]);
    var stnTransferSelect = new mdc.select.MDCSelect($('#stn_transfer_diag #change_type')[0]);
    var stnIntTickDirectionToggle = new mdc.iconButton.MDCIconButtonToggle($('#stn_transfer_diag #tick_direc')[0]);
    stnIntTickDirectionToggle.unbounded = true;

    var stnIntCity1Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_1')[0]);
    var stnIntCity2Select = new mdc.select.MDCSelect($('#stn_transfer_diag #int_city_2')[0]);
    $.getJSON('data/city_list.json', function(data) {
        data.forEach(function(c) {
            $('#stn_transfer_diag #int_city_1 select').append(`<option value="${c.id}">${c.name[0]}</option>`);
            $('#stn_transfer_diag #int_city_2 select').append(`<option value="${c.id}">${c.name[0]}</option>`);
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
            // // stnIntLine1Select.foundation_.notchOutline(true);
            // // if (stnIntNameZH1Field.value != '') {
            //     // stnIntNameZH1Field.foundation_.notchOutline(true);
            //     stnIntNameZH1Field.layout();
            // // }
            // if (stnIntNameEN1Field.value != '') {
            //     stnIntNameEN1Field.foundation_.notchOutline(true);
            // }
        }
        if (n == 2) {
            stnIntCity2Select.foundation_.notchOutline(true);
            stnIntLine2Select.foundation_.notchOutline(true);
            if (stnIntNameZH2Field.value != '') {
                stnIntNameZH2Field.foundation_.notchOutline(true);
            }
            if (stnIntNameEN2Field.value != '') {
                stnIntNameEN2Field.foundation_.notchOutline(true);
            }
        }
        if (n == 0) {
            // OSI fields
            if (stnOSINameZHField.value != '') {
                stnOSINameZHField.foundation_.notchOutline(true);
            }
            if (stnOSINameENField.value != '') {
                stnOSINameENField.foundation_.notchOutline(true);
            }
        }
    }

    function _showAllFields(n, show) {
        var sty = show ? '' : 'display:none';
        $(`#stn_transfer_diag #int_city_${n}`).attr('style', sty);
        $(`#stn_transfer_diag #int_line_${n}`).attr('style', sty);
        $(`#stn_transfer_diag #int_name_zh_${n}`).attr('style', sty);
        $(`#stn_transfer_diag #int_name_en_${n}`).attr('style', sty);
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

    $('#stn_transfer').on('click', event => {
        if (stationSelect.value == 'null') {return;}
        stnTransferDialog.open();
    });
    stnTransferDialog.listen('MDCDialog:opening', event => {
        var stnId = stationSelect.value;
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

        var stnId = stationSelect.value;
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
            ktl.updateStnTransfer(stnId, type);
        } else {
            $.getJSON(`data/${intInfo1[0]}.json`, data => {
                intInfo1.splice(2, 0, data[stnIntLine1Select.selectedIndex].colour);
                switch (type) {
                    case 'int2':
                        ktl.updateStnTransfer(stnId, type, [[], intInfo1, []]);
                        break;
                    case 'osi11':
                        ktl.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, []]);
                        break;
                    default:
                        $.getJSON(`data/${intInfo2[0]}.json`, d => {
                            intInfo2.splice(2, 0, d[stnIntLine2Select.selectedIndex].colour);
                            switch (type) {
                                case 'int3':
                                    ktl.updateStnTransfer(stnId, `${type}_${tickDirec}`, [[], intInfo1, intInfo2]);
                                    break;
                                case 'osi12':
                                    ktl.updateStnTransfer(stnId, `${type}_${osiPaidArea}${tickDirec}`, [osi, intInfo1, intInfo2]);
                            }
                        });
                }
            })
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
            $('#stn_transfer_diag #int_line_1 select').empty();
            data.forEach(l => {
                $('#stn_transfer_diag #int_line_1 select').append(`<option value="${l.id}">${l.name[0]}</option>`);
            });

            var stnId = stationSelect.value;
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                var idx = $(`#stn_transfer_diag #int_line_1 select > [value="${stnInfo.transfer[1][1]}"]`).index();
                stnIntLine1Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine1Select.selectedIndex = 0;
            }
        });
    });
    stnIntCity2Select.listen('MDCSelect:change', event => {
        if (event.detail.index == -1) {return;}
        $.getJSON(`data/${event.detail.value}.json`, data => {
            $('#stn_transfer_diag #int_line_2 select').empty();
            data.forEach(l => {
                $('#stn_transfer_diag #int_line_2 select').append(`<option value="${l.id}">${l.name[0]}</option>`);
            });

            var stnId = stationSelect.value;
            var stnInfo = getParams().stn_list[stnId];

            if (stnInfo.transfer) {
                var idx = $(`#stn_transfer_diag #int_line_2 select > [value="${stnInfo.transfer[2][1]}"]`).index();
                stnIntLine2Select.selectedIndex = (idx == -1) ? 0 : idx;
            } else {
                stnIntLine2Select.selectedIndex = 0;
            }
        });
    });


    // Deletion
    var stnDeleteButtonRipple = new mdc.ripple.MDCRipple($('#stn_delete')[0]);
    stnDeleteButtonRipple.unbounded = true;
    var stnDeleteConfirmDialog = new mdc.dialog.MDCDialog($('#stn_delete_diag')[0]);
    var stnDeleteErrorDialog = new mdc.dialog.MDCDialog($('#stn_delete_err')[0]);
    $('#stn_delete').on('click', event => {
        if (stationSelect.value == 'null') {return;}
        stnDeleteConfirmDialog.open();
    });
    stnDeleteConfirmDialog.listen('MDCDialog:opening', event => {
        $('#stn_delete_diag .mdc-dialog__content').html(
            `Are you sure to delete station ${$('#stn_list option').eq(stationSelect.selectedIndex).html()}?`
        );
    });
    stnDeleteConfirmDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        // Remove from data and svg
        if (ktl.removeStn(stationSelect.value)) {
            // Remove station from selection
            $('#stn_list option').eq(stationSelect.selectedIndex).remove();
        } else {
            stnDeleteErrorDialog.open();
        }
    });
}