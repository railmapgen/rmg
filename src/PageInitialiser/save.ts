import { getParams, getTransText, test, describeParams, getBase64FontFace } from '../utils';
import { RMGParam } from '../types';
import { RMGLine } from '../Line/Line';
import { MDCDialog } from '@material/dialog';
import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';

declare global {
    interface Window {
        urlParams?: URLSearchParams;
    }
}

export function common() {    
    // mdc intances 
    const [templateDialog, importDialog, exportDialog, previewDialog, styleDialog, langDialog] = 
        ['#template_diag', '#import_diag', '#export_diag', '#preview_diag', '#style_diag', '#lang_diag']
            .map(selector => MDCDialog.attachTo($(selector)[0]));
    const [saveList0, saveList1] = $('#panel_save .mdc-list').map((_,el) => MDCList.attachTo(el)).get();
    $('#panel_save .mdc-list li').map((_,el) => new MDCRipple(el));

    saveList0.listen('MDCList:action', (event: CustomEvent) => {
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
        
    saveList1.listen('MDCList:action', (event: any) => {
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
        $('#theme_line__selection li').map((_,el) => new MDCRipple(el));
    });

    templateDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        if (event.detail.action == 'close') {return;}
        
        $.getJSON(`templates/${event.detail.action}.json`, data => {
            localStorage.rmgParam = JSON.stringify(data);
            location.reload(true);
        });
    });

    exportDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        if (event.detail.action === 'close') {return;}
        $('#preview_diag').attr('for', event.detail.action);
        previewDialog.open();
    });

    $(window).on('resize', _ => {
        resizeSVGPreview();
        // $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width()-32}px;`);
    });
    const resizeSVGPreview = () => {
        var svgId = $('preview_diag').attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId=='railmap' ? getParams().svg_width : getParams().svg_dest_width, 
            getParams().svg_height
        ]

        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH/thisSVGWidth, MAX_HEIGHT/thisSVGHeight);

        $('#preview_diag')
            .find('svg')
            .attr({
                width: thisSVGWidth * scaleFactor, 
                height: thisSVGHeight * scaleFactor
            });

        $('#preview_diag')
            .find('.mdc-dialog__surface')
            .attr('style', `max-width:${MAX_WIDTH+50}px;`);
    }
    previewDialog.listen('MDCDialog:opened', event => {
        var svgId = $(event.target).attr('for');
        var [thisSVGWidth, thisSVGHeight] = [
            svgId=='railmap' ? getParams().svg_width : getParams().svg_dest_width, 
            getParams().svg_height
        ]

        $('#preview_diag .mdc-dialog__surface').attr('style', `max-width:${$(window).width()-32}px;`);

        var MAX_WIDTH = $(window).width() - 32 - 50;
        var MAX_HEIGHT = $(window).height() - 60 - 53 - 60;
        var scaleFactor = Math.min(MAX_WIDTH/thisSVGWidth, MAX_HEIGHT/thisSVGHeight);

        $(event.target).find('.mdc-dialog__content')
            .append(
                $('#'+$(event.target).attr('for')).clone().attr({
                    
                    viewBox: `0 0 ${thisSVGWidth} ${thisSVGHeight}`, 
                    width: thisSVGWidth * scaleFactor, 
                    height: thisSVGHeight * scaleFactor
                }).css({
                    all: 'initial'
                })
            );

        let cssTxt = ['share', $(event.target as HTMLElement).find('svg')[0].id]
            .map(tag => {
                return Array.from(
                    ((<HTMLLinkElement>$(`link#css_${tag}`)[0]).sheet as CSSStyleSheet).cssRules
                ).map(rule => rule.cssText).join(' ');
            });
        $(event.target).find('svg')
            .prepend(...cssTxt.map(txt => $('<style>').text(txt)))
            .prepend(document.querySelector('style#global').outerHTML);
        
        $(event.target).find('svg [style="display: none;"]').remove();
        if (window.urlParams.get('style') === 'mtr') {
            getBase64FontFace($(event.target).find('svg')[0] as SVGSVGElement)
                .then(response => {
                    Promise.all(response)
                        .then(uris => {
                            $(event.target).find('svg').prepend($('<style>').text(uris.join(' ')));
                        })
                        .then(() => {
                            // (<any>document).fonts.ready.then(() => {
                            //     console.log('fonts loaded?');
                                (<HTMLButtonElement>$('#preview_diag button[data-mdc-dialog-action="png"]')[0]).disabled = false;
                            // });
                        });
                });
        } else {
            (<HTMLButtonElement>$('#preview_diag button[data-mdc-dialog-action="png"]')[0]).disabled = false;
        }
    });
    previewDialog.listen('MDCDialog:closing', (event: CustomEvent) => {
        $('head > style#googlefonts').remove();
        (<HTMLButtonElement>$('#preview_diag button[data-mdc-dialog-action="png"]')[0]).disabled = true;
        if (event.detail.action === 'close') {
            $(event.target).removeAttr('for').find('.mdc-dialog__content > svg').remove();
            return;
        }

        if (event.detail.action === 'png') {
            test($(event.target).removeAttr('for').find('svg') as JQuery<Element>);
            $(event.target).find('.mdc-dialog__content > svg').remove();
            return;
        }

        if (event.detail.action === 'svg') {
            // Prepend css stylesheet to svg
            let svgContent = $(event.target as HTMLElement).find('.mdc-dialog__content svg');

            var link = document.createElement('a');
            link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
            link.download = 'rmg_export.svg';
            link.click();
    
            $(event.target).removeAttr('for').find('.mdc-dialog__content > svg').empty();
        }
    });

    let importedFile: RMGParam;
    ($('#upload_file') as JQuery<HTMLInputElement>)
        .on('change', event => {
            console.log(event.target.files[0]);
            let reader = new FileReader();
            reader.onload = function(e) {
                console.log(e.target);
                importedFile = JSON.parse(e.target.result as unknown as string);
                $('#import_diag')
                    .find('.mdc-dialog__content')
                    .html(describeParams(importedFile));
                importDialog.open();
            };
            reader.readAsText(event.target.files[0]);
        });
    importDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        if (event.detail.action == 'close') {
            ($('#upload_file')[0] as HTMLInputElement).value = '';
            return;
        }

        RMGLine.clearSVG();
        localStorage.rmgParam = JSON.stringify(importedFile);
        location.reload(true);
    });

    styleDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        switch (event.detail.action) {
            case 'close': 
            case window.urlParams.get('style'):
                return;
            default:
                window.urlParams.set('style', event.detail.action);
                window.gtag('event', 'set', {
                    event_category: 'style', 
                    event_label: window.urlParams.get('style')
                });
                window.location.href = '?' + window.urlParams.toString();
        }
    });

    langDialog.listen('MDCDialog:closed', (event: CustomEvent) => {
        if (event.detail.action == 'close') {return;}
        var nextLang = event.detail.action;
        localStorage.rmgLang = nextLang;
        if (nextLang == window.urlParams.get('lang')) {
            return;
        } else {
            window.urlParams.set('lang', nextLang);
            window.gtag('event', 'set', {
                event_category: 'language', 
                event_label: window.urlParams.get('lang')
            });
            window.location.href = '?' + window.urlParams.toString();
        }
    })
}