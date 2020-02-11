import { getParams, putParams, countryCode2Emoji, getTransText, rgb2Hex, Name } from '../utils';
import { CityEntry, LineEntry } from '../utils';
import { RMGLineGZ } from '../Line/LineGZ';
import { MDCList } from '@material/list';
import { MDCDialog } from '@material/dialog';
import { MDCSelect } from '@material/select';
import { MDCTextField } from '@material/textfield';
import { MDCSwitch } from '@material/switch';
import { MDCRipple } from '@material/ripple';

export function common() {
    // mdc instances
    const designList = MDCList.attachTo($('#design_list')[0]);
    const [themeDialog, lineNameDialog] = 
        ['#design_theme_diag', '#line_name_diag'].map(selector => MDCDialog.attachTo($(selector)[0]));
    const [themeCitySelect, themeLineSelect] = 
        ['#theme_city', '#theme_line'].map(selector => new MDCSelect($(selector)[0]));
    // const themeCitySelect = new MDCSelect($('#theme_city')[0]);
    // const themeLineSelect = new MDCSelect($('#theme_line')[0]);
    const [lineNameZHTextField, lineNameENTextField] = 
        ['#name_zh', '#name_en'].map(selector => MDCTextField.attachTo($('#line_name_diag').find(selector)[0]));
    const platformNumTextField = MDCTextField.attachTo($('#platform_num')[0]);
    $('#panel_design .mdc-list li').map((_,el) => new MDCRipple(el));

    // helper functions
    const getDirectionText = (direc: 'l' | 'r') => {
        return $('#design_list')
            .find(`li#direc p#${direc}`)
            .text();
    };

    // init values
    Promise.resolve(getParams())
        .then(param => {
            $('#design_list')
                .find('li#name .mdc-list-item__secondary-text')
                .text(param.line_name.join());
            lineNameZHTextField.value = param.line_name[0];
            lineNameENTextField.value = param.line_name[1];

            $('#design_list')
                .find('li#direc .mdc-list-item__secondary-text')
                .text(getDirectionText(param.direction));

            platformNumTextField.value = param.platform_num;
        });
    
    $.getJSON('data/city_list.json', (data: CityEntry[]) => {
        let lang = window.urlParams.get('lang');
        data.forEach(c => {
            $('#theme_city__selection').append(
                $('<li>', {
                    class: 'mdc-list-item', 
                    'data-value': c.id
                }).text(countryCode2Emoji(c.country) + getTransText(c.name, lang))
            );
        });

        $('#theme_city__selection li').map((_,el) => new MDCRipple(el));

        var [themeCity] = getParams().theme
        var cityIdx = $(`#theme_city__selection > [data-value="${themeCity}"]`).index();
        themeCitySelect.selectedIndex = cityIdx;
    });

    // add event listeners
    designList.listen('MDCList:action', (event: CustomEvent) => {
        switch (event.detail.index) {
            case 0:
                themeDialog.open();
                break;
            case 1:
                lineNameDialog.open();
                break;
            case 2:
                if (getParams().direction == 'r') {
                    console.log('right to left');
                    window.myLine.direction = 'l';
                    $('#design_list').find('li#direc .mdc-list-item__secondary-text').text(getDirectionText('l'));
                } else {
                    console.log('left to right');
                    window.myLine.direction = 'r';
                    $('#design_list').find('li#direc .mdc-list-item__secondary-text').text(getDirectionText('r'));
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

    themeCitySelect.listen("MDCSelect:change", (event: CustomEvent) => {
        let city = event.detail.value;
        $('#theme_line__selection').empty();
        $.getJSON(`data/${city}.json`, (data: LineEntry[]) => {
            var lang = window.urlParams.get('lang');
            data.forEach(l => {
                $('#theme_line__selection').append(
                    $('<li>', {
                        class: 'mdc-list-item',
                        'data-value': l.id
                    }).append(
                        $('<span>').css({
                            background: l.colour, 
                            color: l.fg || '#fff'
                        }).text('\u00a0' + getTransText(l.name, lang) + '\u00a0')
                    )
                );
            });

            $('#theme_line__selection li').map((_,el) => new MDCRipple(el));

            var param = getParams();
            param.theme[0] = city;
            putParams(param);

            var lineIdx = $(`#theme_line__selection > [data-value="${param.theme[1]}"]`).index();
            themeLineSelect.selectedIndex = lineIdx==-1 ? 0 : lineIdx;
        });
    });

    themeLineSelect.listen("MDCSelect:change", (event: CustomEvent) => {
        let lineIdx = event.detail.index;

        var param = getParams();
        param.theme[1] = event.detail.value;
        putParams(param);

        window.myLine.themeLine = event.detail.value;
        window.myLine.themeColour = ['background-color', 'color']
            .map(prop => $('#theme_line__selection span').eq(lineIdx).css(prop))
            .map(rgb2Hex);

        $('#design_list')
            .find('li#theme .mdc-list-item__secondary-text')
            .html(
                $('#theme_city__selection li').eq(themeCitySelect.selectedIndex).text() +
                ' ' +
                $('#theme_line__selection li').eq(lineIdx).html().trim()
            );
    });

    lineNameDialog.listen('MDCDialog:opened', event => {
        [lineNameZHTextField, lineNameENTextField].map(textfield => textfield.layout());
    });

    $('#line_name_diag')
        .find('.mdc-text-field')
        .on('input', () => {
            let lineNames = [lineNameZHTextField, lineNameENTextField].map(textfield => textfield.value) as Name;
            window.myLine.lineNames = lineNames;
            $('#design_list')
                    .find('li#name .mdc-list-item__secondary-text')
                    .text(lineNames.join());
        });

    ($(platformNumTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => window.myLine.platformNum = event.target.value);
}

export function mtr() {
    // mdc instances
    const designListMTRList = MDCList.attachTo($('#design_list_mtr')[0]);
    const charDialog = MDCDialog.attachTo($('#design_char_diag')[0]);
    const legacySwitch = new MDCSwitch($('#legacy')[0]);

    // helper functions
    const getCharText = (char: string) => {
        return $('#design_char_diag')
            .find('li')
            .filter((_, el: HTMLElement) => el.dataset.mdcDialogAction === char)
            .find('span')
            .text()
    };

    // init values
    Promise.resolve(getParams())
        .then(param => {
            // $('#design_list_mtr')
            //     .find('li#char .mdc-list-item__secondary-text')
            //     .text(getCharText(param.char_form));
            $('#design_char_diag')[0].dispatchEvent(new CustomEvent('MDCDialog:closed', { detail: {action: param.char_form}}));
            // charDialog.close(param.char_form);
            legacySwitch.checked = param.dest_legacy;
        });
    
    // add event listeners
    designListMTRList.listen('MDCList:action', (event: CustomEvent) => {
        switch (event.detail.index) {
            case 0:
                window.myLine.txtFlip = !getParams().txt_flip;
                break;
            case 1:
                charDialog.open();
                break;
        }
    });

    charDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        let char = event.detail.action;
        if (char == 'close') {return;}

        window.myLine.charForm = char;
        $('#design_list_mtr')
            .find('li#char .mdc-list-item__secondary-text')
            .text(getCharText(char));
    });

    ($(legacySwitch.root_).find('input') as JQuery<HTMLInputElement>)
        .on('change', event => window.myLine.destLegacy = event.target.checked);
}

export function gzmtr() {
    // mdc instances
    const designListGZMTRList = MDCList.attachTo($('#design_list_gzmtr')[0]);
    const panelTypeDialog = MDCDialog.attachTo($('#panel_type_diag')[0]);
    const [psdNumTextField, lineNumTextField] = 
        ['#psd_num', '#line_num'].map(selector => MDCTextField.attachTo($(selector)[0]));

    // init values
    Promise.resolve(getParams())
        .then(param => {
            psdNumTextField.value = param.psd_num;
            lineNumTextField.value = param.line_num;
        });

    // add event listeners
    designListGZMTRList.listen('MDCList:action', (event: CustomEvent) => {
        switch (event.detail.index) {
            case 1:
                panelTypeDialog.open();
                break;
        }
    });

    ($(lineNumTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => (<RMGLineGZ>window.myLine).lineNum = event.target.value);

    ($(psdNumTextField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => (<RMGLineGZ>window.myLine).psdNum = event.target.value);

    panelTypeDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        if (event.detail.action === 'close') {return;}
        (<RMGLineGZ>window.myLine).infoPanelType = event.detail.action;
    });
}