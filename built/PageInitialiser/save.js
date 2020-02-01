import { getParams, getTransText, test, describeParams } from '../utils.js';
import { RMGLine } from '../Line/Line.js';
export function common() {
    // mdc intances 
    const [templateDialog, importDialog, exportDialog, previewDialog, styleDialog, langDialog] = ['#template_diag', '#import_diag', '#export_diag', '#preview_diag', '#style_diag', '#lang_diag']
        .map(selector => $(selector)[0].MDCDialog);
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
                    href: 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(localStorage.rmgParam))),
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
                styleDialog.open();
                break;
            case 1:
                langDialog.open();
                break;
        }
    });
    $.getJSON('templates/template_list.json', data => {
        var lang = window.urlParams.get('lang');
        data.forEach(d => {
            $('#template_diag ul').append($('<li>', {
                class: "mdc-list-item",
                'data-mdc-dialog-action': d.filename,
                'data-mdc-auto-init': 'MDCRipple'
            }).append($('<span>', { class: "mdc-list-item__text" }).text(getTransText(d.desc, lang))));
        });
        $('#template_diag li:first-child').attr('tabindex', 0);
        window.mdc.autoInit();
    });
    templateDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {
            return;
        }
        $.getJSON(`templates/${event.detail.action}.json`, data => {
            localStorage.rmgParam = JSON.stringify(data);
            location.reload(true);
        });
    });
    exportDialog.listen('MDCDialog:closed', event => {
        switch (event.detail.action) {
            case 'close':
                break;
            case 'svg1':
                $(previewDialog.root_).attr('for', 'destination');
                previewDialog.open();
                break;
            case 'svg2':
                $(previewDialog.root_).attr('for', 'railmap');
                previewDialog.open();
                break;
        }
    });
    $(window).on('resize', _ => {
        resizeSVGPreview();
        // $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width()-32}px;`);
    });
    const resizeSVGPreview = () => {
        var svgId = $('preview_diag').attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId == 'destination' ? getParams().svg_dest_width : getParams().svg_width,
            getParams().svg_height
        ];
        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH / thisSVGWidth, MAX_HEIGHT / thisSVGHeight);
        $(previewDialog.root_)
            .find('svg')
            .attr({
            width: thisSVGWidth * scaleFactor,
            height: thisSVGHeight * scaleFactor
        });
        $(previewDialog.root_)
            .find('.mdc-dialog__surface')
            .attr('style', `max-width:${MAX_WIDTH + 50}px;`);
    };
    previewDialog.listen('MDCDialog:opened', event => {
        var svgId = $(event.target).attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId == 'destination' ? getParams().svg_dest_width : getParams().svg_width,
            getParams().svg_height
        ];
        $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width() - 32}px;`);
        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH / thisSVGWidth, MAX_HEIGHT / thisSVGHeight);
        $(event.target).find('.mdc-dialog__content')
            .append($('#' + $(event.target).attr('for')).clone().attr({
            style: 'all:initial;',
            viewBox: `0 0 ${thisSVGWidth} ${thisSVGHeight}`,
            width: thisSVGWidth * scaleFactor,
            height: thisSVGHeight * scaleFactor
        }));
        $(event.target).find('svg [style="display: none;"]').remove();
    });
    previewDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action === 'close') {
            $(event.target).removeAttr('for').find('.mdc-dialog__content').empty();
            return;
        }
        if (event.detail.action === 'png') {
            test($(event.target).removeAttr('for').find('svg'));
            $(event.target).find('.mdc-dialog__content').empty();
            return;
        }
        if (event.detail.action === 'svg') {
            var link = document.createElement('a');
            var svgContent = $(event.target).find('.mdc-dialog__content svg').prepend($('style#svg_share').clone());
            link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
            link.download = 'rmg_export.svg';
            link.click();
            $(event.target).removeAttr('for').find('.mdc-dialog__content').empty();
        }
    });
    let importedFile;
    $('#upload_file')
        .on('change', event => {
        console.log(event.target.files[0]);
        let reader = new FileReader();
        reader.onload = function (e) {
            console.log(e.target);
            importedFile = JSON.parse(e.target.result);
            $(importDialog.root_)
                .find('.mdc-dialog__content')
                .html(describeParams(importedFile));
            importDialog.open();
        };
        reader.readAsText(event.target.files[0]);
    });
    importDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {
            $('#upload_file')[0].value = '';
            return;
        }
        RMGLine.clearSVG();
        localStorage.rmgParam = JSON.stringify(importedFile);
        location.reload(true);
    });
    styleDialog.listen('MDCDialog:closed', event => {
        switch (event.detail.action) {
            case 'close':
            case window.urlParams.get('style'):
                return;
            default:
                window.urlParams.set('style', event.detail.action);
                window.location.href = '?' + window.urlParams.toString();
        }
    });
    langDialog.listen('MDCDialog:closed', event => {
        if (event.detail.action == 'close') {
            return;
        }
        var nextLang = event.detail.action;
        localStorage.rmgLang = nextLang;
        if (nextLang == window.urlParams.get('lang')) {
            return;
        }
        else {
            window.urlParams.set('lang', nextLang);
            window.location.href = '?' + window.urlParams.toString();
        }
    });
}
