'use strict';

function initLayoutPanel() {
    Promise.resolve(getParams())
        .then(param => {
            $('#svg_dest_width')[0].MDCTextField.value = param.svg_dest_width;
            $('#svg_width')[0].MDCTextField.value = param.svg_width;
            $('#y_pc')[0].MDCSlider.value = param.y_pc;
            $('#branch_spacing')[0].MDCSlider.value = param.branch_spacing;
            $('#padding')[0].MDCSlider.value = param.padding;
        })

    $('#svg_dest_width > input').on('input', event => {
        myLine.svgDestWidth = event.target.value;
    });

    $('#svg_width > input').on('input', event => {
        myLine.svgWidth = event.target.value;
    });

    $('#branch_spacing')[0].MDCSlider.listen('MDCSlider:input', event => {
        myLine.branchSpacing = event.target.MDCSlider.value;
    });

    $('#y_pc')[0].MDCSlider.listen('MDCSlider:input', event => {
        myLine.yPc = event.target.MDCSlider.value;
    });

    $('#padding')[0].MDCSlider.listen('MDCSlider:input', event => {
        myLine.padding = event.target.MDCSlider.value;
    });
}

function initDesignPanel() {
    $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
        getParams().line_name.join(' - ')
    );

    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html(
        (getParams().direction == 'r') ? 'Right' : 'Left'
    );

    $('#panel_design #design_list_mtr li:nth-child(1) .mdc-list-item__secondary-text').html(
        $(`#design_char_diag ul [data-mdc-dialog-action="${getParams().char_form}"] span`).html()
    );

    $('#design_list')[0].MDCList.listen('MDCList:action', event => {
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
            case 4:
                myLine.txtFlip = !getParams().txt_flip;
                break;
            case 5:
                window.lineClass.reverseStns(myLine);
                break;
        }
    });

    $('#design_list_mtr')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                $('#design_char_diag')[0].MDCDialog.open();
                break;
        }
    });

    $('#design_list_gzmtr')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 1:
                $('#panel_type_diag')[0].MDCDialog.open();
                break;
        }
    })

    $('#design_theme_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-select')
            .each((_,el) => el.MDCSelect.layout());
    });

    $.getJSON('data/city_list.json', function(data) {
        var lang = window.urlParams.get('lang');
        data.forEach(c => {
            $('#theme_city__selection').append(
                `<li class="mdc-list-item" data-value="${c.id}">
                ${countryCode2Emoji(c.country)}${getTransText(c.name, lang)}
                </li>`
            );
        });

        var [themeCity] = getParams().theme
        // var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        $('#theme_city')[0].MDCSelect.selectedIndex = cityIdx;
    });

    $('#theme_city')[0].MDCSelect.listen("MDCSelect:change", (event) => {
        $('#theme_line__selection').empty();
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = window.urlParams.get('lang');
            data.forEach(l => {
                $('#theme_line__selection').append(
                    `<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};color:${l.fg || '#fff'};">&nbsp;${getTransText(l.name, lang)}&nbsp;</span>
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
                .match(/#[\w\d]+/g); 

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

            $('#psd_num')[0].MDCTextField.value = param.psd_num;
            $('#line_num')[0].MDCTextField.value = param.line_num;
        });

    $('#line_name_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-text-field')
            .each((_,el) => el.MDCTextField.layout());
    });
    $('#line_name_diag .mdc-text-field').on('input', event => {
        var lineNames = $('#line_name_diag .mdc-text-field').get().map(el => el.MDCTextField.value);
        myLine.lineNames = lineNames;
        $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(
            lineNames.join(' - ')
        );
    });

    $('#platform_num > input').on('input', event => {
        myLine.platformNum = event.target.value;
    });

    // mtr-specific
    $('#legacy input').on('change', event => {
        myLine.destLegacy = event.target.checked;
    });

    $('#design_char_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        myLine.charForm = event.detail.action;
        $('#panel_design #design_list_mtr li:nth-child(1) .mdc-list-item__secondary-text').html(
            $(`#design_char_diag ul [data-mdc-dialog-action="${event.detail.action}"] span`).html()
        );
    });

    // gzmtr-specific
    $('#line_num > input').on('input', event => {
        myLine.lineNum = event.target.value;
    });
    $('#psd_num > input').on('input', event => {
        myLine.psdNum = event.target.value;
    });

    $('#panel_type_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action === 'close') {return;}
        myLine.infoPanelType = event.detail.action;
    })
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
                // var link = document.createElement('a');
                // var data = new Blob([localStorage.rmgParam], {type: 'application/json;charset=utf-8'});
                // var url = window.URL.createObjectURL(data);
                // link.href = url;
                // link.download = 'rmg_config.json';
                // link.click();
                // URL.revokeObjectURL(url);
                // break;
                var link = $('<a>', {
                    href: 'data:application/json;base64,'+btoa(unescape(encodeURIComponent(localStorage.rmgParam))), 
                    download: 'rmg_param.json'
                });
                link[0].click();
                break;
            case 3:
                exportDialog.open();
                break;
        }
    });

    $('#panel_save .mdc-list:nth-child(2) li:first-child span:nth-child(2) span:last-child')
        .attr('trans-tag', $(`#style_diag [data-mdc-dialog-action="${window.urlParams.get('style')}"] span`).attr('trans-tag'))
        .text($(`#style_diag [data-mdc-dialog-action="${window.urlParams.get('style')}"] span`).text());

    $('#panel_save .mdc-list:nth-child(2) li:nth-child(2) span:nth-child(2) span:last-child')
        .text($(`#lang_diag [data-mdc-dialog-action="${window.urlParams.get('lang')}"] span`).text());
        
    $('#panel_save .mdc-list')[1].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                $('#style_diag')[0].MDCDialog.open();
                break;
            case 1:
                $('#lang_diag')[0].MDCDialog.open();
                break;
        }
    });

    var templateDialog = new mdc.dialog.MDCDialog($('#template_diag')[0]);
    var templateDialogList = new mdc.list.MDCList($('#template_diag .mdc-list')[0]);
    $.getJSON('templates/template_list.json', data => {
        var lang = window.urlParams.get('lang');
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

    exportDialog.listen('MDCDialog:closed', event => {
        switch (event.detail.action) {
            case 'close':
                break;
            case 'svg1':
                $('#preview_diag').attr('for', 'destination');
                $('#preview_diag')[0].MDCDialog.open();
                break;
            case 'svg2':
                $('#preview_diag').attr('for', 'railmap');
                $('#preview_diag')[0].MDCDialog.open();
                break;
        }
    });

    $(window).on('resize', _ => {
        resizeSVGPreview();
        // $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width()-32}px;`);
    });
    const resizeSVGPreview = _ => {
        var svgId = $('preview_diag').attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId=='destination' ? getParams().svg_dest_width : getParams().svg_width, 
            getParams().svg_height
        ]

        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH/thisSVGWidth, MAX_HEIGHT/thisSVGHeight);

        $('#preview_diag svg').attr({
            width: thisSVGWidth * scaleFactor, 
            height: thisSVGHeight * scaleFactor
        });

        $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${MAX_WIDTH+50}px;`);
    }
    $('#preview_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        var svgId = $(event.target).attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId=='destination' ? getParams().svg_dest_width : getParams().svg_width, 
            getParams().svg_height
        ]

        $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width()-32}px;`);

        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH/thisSVGWidth, MAX_HEIGHT/thisSVGHeight);

        $(event.target).find('.mdc-dialog__content')
            .append(
                $('#'+$(event.target).attr('for')).clone().attr({
                    style: 'all:initial;', 
                    viewBox: `0 0 ${thisSVGWidth} ${thisSVGHeight}`, 
                    width: thisSVGWidth * scaleFactor, 
                    height: thisSVGHeight * scaleFactor
                })
            );
    });
    $('#preview_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action === 'close') {
            $(event.target).removeAttr('for').find('.mdc-dialog__content').empty();
            return;
        }

        var link = document.createElement('a');
        var svgContent = $(event.target).find('.mdc-dialog__content svg').prepend($('style#svg_share').clone());
        link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
        link.download = 'rmg_export.svg';
        link.click();

        $(event.target).removeAttr('for').find('.mdc-dialog__content').empty();
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

    $('#style_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        switch (event.detail.action) {
            case 'close': 
            case window.urlParams.get('style'):
                return;
            default:
                window.urlParams.set('style', event.detail.action);
                window.location = '?' + window.urlParams.toString();
        }
    });

    $('#lang_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        var nextLang = event.detail.action;
        localStorage.rmgLang = nextLang;
        if (nextLang == window.urlParams.get('lang')) {
            return;
        } else {
            window.urlParams.set('lang', nextLang);
            window.location = '?' + window.urlParams.toString();
        }
    })
}

function initStationsPanel() {
    // var ripples = $('#panel_stations .mdc-icon-button, .mdc-card__primary-action')
    //                 .each((idx,el) => {
    //                     return new mdc.ripple.MDCRipple(el);
    //                 });
    function _stationCard(id, names, num) {
        return $('<div>', {'id':id}).addClass('mdc-card mdc-layout-grid__cell--span-2-desktop mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-2-phone station-card').append(
            $('<div>').addClass('mdc-card__primary-action').append(
                $('<div>').addClass('mdc-card__media mdc-card__media--16-9')
            ).append(
                $('<div>').addClass('mdc-card__media-content station-card__content')
                    .html(names.join('<br>'))
                    .prepend($('<span>', { style:(window.urlParams.get('style')=='gzmtr' ? '' : 'display:none;')}).text(num+' '))
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
        $('#panel_stations .mdc-layout-grid__inner:first').append(_stationCard(stnId, stnList[stnId].name, stnList[stnId].num));
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
        $('#stn_transfer_diag').attr('for', stnId)[0].MDCDialog.open();
    });
    $('#panel_stations .mdc-card__action-icons > [title="Remove"]').on('click', event => {
        var stnId = event.target.closest('.mdc-card').id;
        $('#stn_delete_diag').attr('for', stnId)[0].MDCDialog.open();
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
        $(`#panel_stations .mdc-layout-grid__inner:first #${prevId}`).after(_stationCard(newId, newInfo.name, newInfo.num));
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
            $('#stn_transfer_diag')[0].MDCDialog.open();
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
                $('#loc__selection li').eq(idx).show();
                if (idx >= 3) {
                    // newupper or newlower
                    $('#end__selection').empty();
                    state.forEach(stnId => {
                        $('#end__selection').append(
                            $('<li>', { class:'mdc-list-item', 'data-value':stnId }).text(stnList[stnId].name.join(' - '))
                        );
                    });
                }
            } else {
                $('#loc__selection li').eq(idx).hide();
            }
        }
        stnAddLocSelect.value = $('#loc__selection li:not([style="display: none;"]):first').attr('data-value');
    });
    stnAddLocSelect.listen('MDCSelect:change', event => {
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
    var stnModifyDialog = new mdc.dialog.MDCDialog($('#stn_modify_diag')[0]);
    var stnModifyNameZHField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_zh')[0]);
    var stnModifyNameENField = new mdc.textField.MDCTextField($('#stn_modify_diag #name_en')[0]);
    stnModifyDialog.listen('MDCDialog:opening', event => {
        var stnId = event.target.getAttribute('for');
        [stnModifyNameZHField.value, stnModifyNameENField.value] = getParams().stn_list[stnId].name;
        $('#stn_modify_diag #stn_num')[0].MDCTextField.value = getParams().stn_list[stnId].num;
    })
    stnModifyDialog.listen('MDCDialog:opened', () => {
        stnModifyNameZHField.layout();
        stnModifyNameENField.layout();
        $('#stn_modify_diag #stn_num')[0].MDCTextField.layout();
    })
    $('#stn_modify_diag #name_zh, #stn_modify_diag #name_en, #stn_num').on('input', () => {
        var nameZH = stnModifyNameZHField.value;
        var nameEN = stnModifyNameENField.value;
        var stnNum = $('#stn_modify_diag #stn_num')[0].MDCTextField.value;

        var stnId = $('#stn_modify_diag').attr('for');
        myLine.updateStnName(stnId, nameZH, nameEN, stnNum);
        $(`#panel_stations .mdc-layout-grid__inner:first #${stnId} .mdc-card__media-content`)
            .html([nameZH, nameEN].join('<br>'))
            .prepend($('<span>', { style:(window.urlParams.get('style')=='gzmtr' ? '' : 'display:none;')}).text(stnNum+' '));
        $(`#pivot__selection [data-value="${stnId}`).html(`${nameZH} - ${nameEN}`);
    });


    // Modification (Interchange)
    // Duplicate element
    var intNameEl = $('#stn_transfer_diag .mdc-layout-grid__inner #int_name_zh,#int_name_en').slice(0,2).clone();
    intNameEl.find('.mdc-text-field').removeAttr('data-mdc-auto-init-state');
    $('div#int_line').slice(1,3).after(intNameEl);
    window.mdc.autoInit();

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

    var stnOSINameZHField = new mdc.textField.MDCTextField($('#stn_transfer_diag #osi_name_zh')[0]);
    var stnOSINameENField = new mdc.textField.MDCTextField($('#stn_transfer_diag #osi_name_en')[0]);

    function _showAllFields(n, show) {
        if (show) {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).show();
        } else {
            $('#int_city, #int_line, #int_name_zh, #int_name_en').slice(n*4, (n+1)*4).hide();
        }
    }

    $('#stn_transfer_diag')[0].MDCDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        var stnInfo = getParams().stn_list[stnId];
        var lineThemeCity = getParams().theme[0];

        if ((stnInfo.parents[0] == 'linestart' || stnInfo.children[0] == 'lineend') && window.urlParams.get('style') === 'mtr') {
            $('#change_type__selection li:last-child').show();
        } else {
            $('#change_type__selection li:last-child').hide();
        }

        $('#change_type')[0].MDCSelect.value = stnInfo.change_type.split('_')[0];

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
                $('#int_city .mdc-select')[idx].MDCSelect.value = intInfo[0] || lineThemeCity;
                $('#int_name_zh .mdc-text-field')[idx].MDCTextField.value = intInfo[4] || '';
                $('#int_name_en .mdc-text-field')[idx].MDCTextField.value = intInfo[5] || '';
            })
        } else {
            $('#int_city .mdc-select').each((_,el) => el.MDCSelect.value = lineThemeCity);
            $('#int_name_zh, #int_name_en').find('.mdc-text-field').each((_,el) => el.MDCTextField.value = '');
        }

        if (['none', 'int2', 'osi22'].includes(stnInfo.change_type.split('_')[0])) {
            $('#stn_transfer_diag #tick_direc')[0].MDCIconButtonToggle.on = true;
        } else {
            $('#stn_transfer_diag #tick_direc')[0].MDCIconButtonToggle.on = (stnInfo.change_type.slice(-1) == 'r');
        }

        if (stnInfo.change_type.substring(0,3) == 'osi') {
            [stnOSINameZHField.value, stnOSINameENField.value] = stnInfo.interchange[1][0];
            $('#paid_area')[0].MDCIconButtonToggle.on = (stnInfo.change_type.split('_').reverse()[0][0] == 'p');
        } else {
            stnOSINameZHField.value = '';
            stnOSINameENField.value = '';
            $('#paid_area')[0].MDCIconButtonToggle.on = true;
        }
    });

    $('#stn_transfer_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $('#change_type')[0].MDCSelect.layout();
        $('#int_city, #int_line').find('.mdc-select').each((_,el) => el.MDCSelect.layout());
        $('#int_name_zh, #int_name_en').find('.mdc-text-field').each((_,el) => el.MDCTextField.layout());
        stnOSINameENField.layout();
        stnOSINameZHField.layout();
    });

    $('#stn_transfer_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}

        // var stnId = $('#panel_stations #selected_stn').attr('stn');
        var stnId = event.target.getAttribute('for');
        var type = $('#change_type')[0].MDCSelect.value;
        var tickDirec = $('#stn_transfer_diag #tick_direc')[0].MDCIconButtonToggle.on ? 'r' : 'l';
        var osi = [stnOSINameZHField.value, stnOSINameENField.value];
        var osiPaidArea = $('#paid_area')[0].MDCIconButtonToggle.on ? 'p' : 'u';

        var [intInfo0, intInfo1, intInfo2] = [0,1,2].map(idx => {
            return $('#int_city, #int_line')
                .find('.mdc-select').slice(idx*2,(idx+1)*2).get().map(el => el.MDCSelect.value)
                .concat(
                    $('ul#int_line__selection').eq(idx).find('li span')
                        .eq($('#int_line .mdc-select')[idx].MDCSelect.selectedIndex)
                        .attr('style').match(/#[\w\d]+/g), 
                    $('#int_name_zh, #int_name_en').find('.mdc-text-field').slice(idx*2,(idx+1)*2).get().map(el => el.MDCTextField.value)
                );
        });
        if (type == 'none') {
            myLine.updateStnTransfer(stnId, type);
        } else if (type == 'osi22') {
            myLine.updateStnTransfer(stnId, `${type}_end_${osiPaidArea}`, [[intInfo0], [osi, intInfo1, intInfo2]]);
        } else {
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
    $('#change_type')[0].MDCSelect.listen('MDCSelect:change', event => {
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
            $('#stn_transfer_diag .mdc-dialog__content [id]div, #paid_area').slice(1).show()
            $('#tick_direc').hide()
        } else {
            $('#stn_transfer_diag .mdc-dialog__content [id]div').slice(1).hide()
            $('#stn_transfer_diag .mdc-dialog__content [id]button').hide()
        }
        $('#stn_transfer_diag .mdc-select').each((_,el) => el.MDCSelect.layout())
    });

    $('#int_city .mdc-select').each((idx,el) => {
        el.MDCSelect.listen('MDCSelect:change', event => {
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
                    $('#int_line .mdc-select')[idx].MDCSelect.selectedIndex = (lIdx == -1) ? 0 : lIdx;
                } else {
                    $('#int_line .mdc-select')[idx].MDCSelect.selectedIndex = 0;
                }
            });
        })
    })


    // Deletion
    $('#stn_delete_diag')[0].MDCDialog.listen('MDCDialog:opening', event => {
        var stnId = $(event.target).attr('for');
        $('#stn_delete_diag #err_stn').text(getParams().stn_list[stnId].name.join(' - '));
    });
    $('#stn_delete_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {return;}
        var stnId = $(event.target).attr('for');
        // Remove from data and svg
        if (myLine.removeStn(stnId)) {
            // Remove station from selection
            $(`#panel_stations .mdc-layout-grid__inner #${stnId}`).remove();
            $(`#pivot__selection [data-value="${stnId}"]`).remove();
        } else {
            $('#stn_delete_err')[0].MDCDialog.open();
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