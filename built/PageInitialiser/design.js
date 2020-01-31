import { getParams, putParams, countryCode2Emoji, getTransText } from '../utils.js';
export function common() {
    $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(getParams().line_name.join(' - '));
    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html((getParams().direction == 'r') ? 'Right' : 'Left');
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
                    window.myLine.direction = 'l';
                    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html('Left');
                }
                else {
                    window.myLine.direction = 'r';
                    $('#panel_design #design_list li:nth-child(3) .mdc-list-item__secondary-text').html('Right');
                }
                break;
            case 4:
                window.myLine.reverseStns();
                break;
        }
    });
    $('#design_theme_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-select')
            .each((_, el) => el.MDCSelect.layout());
    });
    $.getJSON('data/city_list.json', function (data) {
        var lang = window.urlParams.get('lang');
        data.forEach(c => {
            $('#theme_city__selection').append(`<li class="mdc-list-item" data-value="${c.id}">
                ${countryCode2Emoji(c.country)}${getTransText(c.name, lang)}
                </li>`);
        });
        var [themeCity] = getParams().theme;
        // var cityIdx = $(`#theme_city > select > [value="${themeCity}"]`).index();
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        $('#theme_city')[0].MDCSelect.selectedIndex = cityIdx;
    });
    $('#theme_city')[0].MDCSelect.listen("MDCSelect:change", (event) => {
        $('#theme_line__selection').empty();
        $.getJSON(`data/${event.detail.value}.json`, data => {
            var lang = window.urlParams.get('lang');
            data.forEach(l => {
                $('#theme_line__selection').append(`<li class="mdc-list-item" data-value="${l.id}">
                    <span style="background:${l.colour};color:${l.fg || '#fff'};">&nbsp;${getTransText(l.name, lang)}&nbsp;</span>
                    </li>`);
            });
            var param = getParams();
            param.theme[0] = event.detail.value;
            putParams(param);
            var lineIdx = $(`#theme_line__selection > [data-value="${param.theme[1]}"]`).index();
            $('#theme_line')[0].MDCSelect.selectedIndex = lineIdx == -1 ? 0 : lineIdx;
        });
    });
    $('#theme_line')[0].MDCSelect.listen("MDCSelect:change", event => {
        var param = getParams();
        param.theme[1] = event.detail.value;
        putParams(param);
        window.myLine.themeLine = event.detail.value;
        window.myLine.themeColour = $('#theme_line__selection li span')
            .eq(event.detail.index).attr('style')
            .match(/#[\w\d]+/g);
        $('#panel_design #design_list li:first-child .mdc-list-item__secondary-text').html(`${$('#theme_city__selection li')
            .eq($('#theme_city')[0].MDCSelect.selectedIndex)
            .html().trim()} - ${$('#theme_line__selection li').eq(event.detail.index).html().trim()}`);
    });
    Promise.resolve(getParams())
        .then(param => {
        $('#line_name_diag #name_zh')[0].MDCTextField.value = param.line_name[0];
        $('#line_name_diag #name_en')[0].MDCTextField.value = param.line_name[1];
        $('#platform_num')[0].MDCTextField.value = param.platform_num;
    });
    $('#line_name_diag')[0].MDCDialog.listen('MDCDialog:opened', event => {
        $(event.target)
            .find('.mdc-text-field')
            .each((_, el) => el.MDCTextField.layout());
    });
    $('#line_name_diag .mdc-text-field').on('input', event => {
        var lineNames = $('#line_name_diag .mdc-text-field').get().map(el => el.MDCTextField.value);
        window.myLine.lineNames = lineNames;
        $('#panel_design #design_list li:nth-child(2) .mdc-list-item__secondary-text').text(lineNames.join(' - '));
    });
    $('#platform_num > input').on('input', event => {
        window.myLine.platformNum = event.target.value;
    });
}
export function mtr() {
    $('#design_list_mtr')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                window.myLine.txtFlip = !getParams().txt_flip;
                break;
            case 1:
                $('#design_char_diag')[0].MDCDialog.open();
                break;
        }
    });
    $('#panel_design #design_list_mtr li:nth-child(2) .mdc-list-item__secondary-text').html($(`#design_char_diag ul [data-mdc-dialog-action="${getParams().char_form}"] span`).html());
    $('#design_char_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {
            return;
        }
        window.myLine.charForm = event.detail.action;
        $('#panel_design #design_list_mtr li:nth-child(2) .mdc-list-item__secondary-text').html($(`#design_char_diag ul [data-mdc-dialog-action="${event.detail.action}"] span`).html());
    });
    $('#legacy')[0].MDCSwitch.checked = getParams().dest_legacy;
    $('#legacy input').on('change', event => {
        window.myLine.destLegacy = event.target.checked;
    });
}
export function gzmtr() {
    $('#design_list_gzmtr')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 1:
                $('#panel_type_diag')[0].MDCDialog.open();
                break;
        }
    });
    Promise.resolve(getParams())
        .then(param => {
        $('#psd_num')[0].MDCTextField.value = param.psd_num;
        $('#line_num')[0].MDCTextField.value = param.line_num;
    });
    $('#line_num > input').on('input', event => {
        window.myLine.lineNum = event.target.value;
    });
    $('#psd_num > input').on('input', event => {
        window.myLine.psdNum = event.target.value;
    });
    $('#panel_type_diag')[0].MDCDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action === 'close') {
            return;
        }
        window.myLine.infoPanelType = event.detail.action;
    });
}
