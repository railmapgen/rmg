import { getParams, putParams, countryCode2Emoji, getTransText, rgb2Hex } from '../utils.js';
export function common() {
    // mdc instances
    const designList = $('#design_list')[0].MDCList;
    const [themeDialog, lineNameDialog] = ['#design_theme_diag', '#line_name_diag'].map(selector => $(selector)[0].MDCDialog);
    const [themeCitySelect, themeLineSelect] = ['#theme_city', '#theme_line'].map(selector => $(selector)[0].MDCSelect);
    const [lineNameZHTextField, lineNameENTextField] = ['#name_zh', '#name_en'].map(selector => $(lineNameDialog.root_).find(selector)[0].MDCTextField);
    const platformNumTextField = $('#platform_num')[0].MDCTextField;
    // helper functions
    const getDirectionText = (direc) => {
        return $(designList.root_)
            .find(`li#direc p#${direc}`)
            .text();
    };
    // init values
    Promise.resolve(getParams())
        .then(param => {
        $(designList.root_)
            .find('li#name .mdc-list-item__secondary-text')
            .text(param.line_name.join());
        lineNameZHTextField.value = param.line_name[0];
        lineNameENTextField.value = param.line_name[1];
        $(designList.root_)
            .find('li#direc .mdc-list-item__secondary-text')
            .text(getDirectionText(param.direction));
        platformNumTextField.value = param.platform_num;
    });
    $.getJSON('data/city_list.json', (data) => {
        let lang = window.urlParams.get('lang');
        data.forEach(c => {
            $('#theme_city__selection').append($('<li>', {
                class: 'mdc-list-item',
                'data-value': c.id
            }).text(countryCode2Emoji(c.country) + getTransText(c.name, lang)));
        });
        var [themeCity] = getParams().theme;
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        themeCitySelect.selectedIndex = cityIdx;
    });
    // add event listeners
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
                    window.myLine.direction = 'l';
                    $(designList.root_).find('li#direc .mdc-list-item__secondary-text').text(getDirectionText('l'));
                }
                else {
                    window.myLine.direction = 'r';
                    $(designList.root_).find('li#direc .mdc-list-item__secondary-text').text(getDirectionText('r'));
                }
                break;
            case 4:
                window.myLine.reverseStns();
                break;
        }
    });
    themeDialog.listen('MDCDialog:opened', () => {
        [themeCitySelect, themeLineSelect].map(select => select.layout());
    });
    themeCitySelect.listen("MDCSelect:change", (event) => {
        let city = event.detail.value;
        $('#theme_line__selection').empty();
        $.getJSON(`data/${city}.json`, (data) => {
            var lang = window.urlParams.get('lang');
            data.forEach(l => {
                $('#theme_line__selection').append($('<li>', {
                    class: 'mdc-list-item',
                    'data-value': l.id
                }).append($('<span>').css({
                    background: l.colour,
                    color: l.fg || '#fff'
                }).text('\u00a0' + getTransText(l.name, lang) + '\u00a0')));
            });
            var param = getParams();
            param.theme[0] = city;
            putParams(param);
            var lineIdx = $(`#theme_line__selection > [data-value="${param.theme[1]}"]`).index();
            themeLineSelect.selectedIndex = lineIdx == -1 ? 0 : lineIdx;
        });
    });
    themeLineSelect.listen("MDCSelect:change", event => {
        let lineIdx = event.detail.index;
        var param = getParams();
        param.theme[1] = lineIdx;
        putParams(param);
        window.myLine.themeLine = event.detail.value;
        window.myLine.themeColour = ['background-color', 'color']
            .map(prop => $('#theme_line__selection span').eq(lineIdx).css(prop))
            .map(rgb2Hex);
        $(designList.root_)
            .find('li#theme .mdc-list-item__secondary-text')
            .html($('#theme_city__selection li').eq(themeCitySelect.selectedIndex).text() +
            ' ' +
            $('#theme_line__selection li').eq(lineIdx).html().trim());
    });
    lineNameDialog.listen('MDCDialog:opened', event => {
        [lineNameZHTextField, lineNameENTextField].map(textfield => textfield.layout());
    });
    $(lineNameDialog.root_)
        .find('.mdc-text-field')
        .on('input', () => {
        let lineNames = [lineNameZHTextField, lineNameENTextField].map(textfield => textfield.value);
        window.myLine.lineNames = lineNames;
        $(designList.root_)
            .find('li#name .mdc-list-item__secondary-text')
            .text(lineNames.join());
    });
    $(platformNumTextField.root_).find('input')
        .on('input', event => window.myLine.platformNum = event.target.value);
}
export function mtr() {
    // mdc instances
    const designListMTRList = $('#design_list_mtr')[0].MDCList;
    const charDialog = $('#design_char_diag')[0].MDCDialog;
    const legacySwitch = $('#legacy')[0].MDCSwitch;
    // helper functions
    const getCharText = (char) => {
        return $(charDialog.root_)
            .find('li')
            .filter((_, el) => el.dataset.mdcDialogAction === char)
            .find('span')
            .text();
    };
    // init values
    Promise.resolve(getParams())
        .then(param => {
        $(designListMTRList.root_)
            .find('li#char .mdc-list-item__secondary-text')
            .text(getCharText(param.char_form));
        legacySwitch.checked = param.dest_legacy;
    });
    // add event listeners
    designListMTRList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 0:
                window.myLine.txtFlip = !getParams().txt_flip;
                break;
            case 1:
                charDialog.open();
                break;
        }
    });
    charDialog.listen('MDCDialog:closed', event => {
        let char = event.detail.action;
        if (char == 'close') {
            return;
        }
        window.myLine.charForm = char;
        $(designListMTRList.root_)
            .find('li#char .mdc-list-item__secondary-text')
            .text(getCharText(char));
    });
    $(legacySwitch.root_).find('input')
        .on('change', event => window.myLine.destLegacy = event.target.checked);
}
export function gzmtr() {
    // mdc instances
    const panelTypeDialog = $('#panel_type_diag')[0].MDCDialog;
    const [psdNumTextField, lineNumTextField] = ['#psd_num', '#line_num'].map(selector => $(selector)[0].MDCTextField);
    // init values
    Promise.resolve(getParams())
        .then(param => {
        psdNumTextField.value = param.psd_num;
        lineNumTextField.value = param.line_num;
    });
    // add event listeners
    $('#design_list_gzmtr')[0].MDCList.listen('MDCList:action', event => {
        switch (event.detail.index) {
            case 1:
                panelTypeDialog.open();
                break;
        }
    });
    $(lineNumTextField.root_).find('input')
        .on('input', event => window.myLine.lineNum = event.target.value);
    $(psdNumTextField.root_).find('input')
        .on('input', event => window.myLine.psdNum = event.target.value);
    panelTypeDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action === 'close') {
            return;
        }
        window.myLine.infoPanelType = event.detail.action;
    });
}
