import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import { test } from './utils';

interface Props {
    onClose: (action: string) => void;
    open: boolean;
    canvas: string;
}

export default (props: Props) => {
    const { t } = useTranslation();

    const [svgEl, setSvgEl] = React.useState(($('<svg>')[0] as Element) as SVGSVGElement);
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        if (props.canvas === '') {
            setSvgEl(($('<svg>')[0] as Element) as SVGSVGElement);
            setIsLoaded(false);
            return;
        }
        let [thisSVGWidth, thisSVGHeight] = [
            $(`svg#${props.canvas}`)
                .css('--rmg-svg-width')
                .match(/\d+/g),
            $(`svg#${props.canvas}`)
                .css('--rmg-svg-height')
                .match(/\d+/g),
        ].map(Number);
        let MAX_WIDTH = Math.min($(window).width(), 1412) - 64 - 24 * 2;
        let MAX_HEIGHT = $(window).height() - 64 - 64 - 52 - 8 * 2;
        let scaleFactor = Math.min(MAX_WIDTH / thisSVGWidth, MAX_HEIGHT / thisSVGHeight);

        let el = $(`svg#${props.canvas}`)
            .clone()
            .attr({
                viewBox: `0 0 ${thisSVGWidth} ${thisSVGHeight}`,
                width: thisSVGWidth * scaleFactor,
                height: thisSVGHeight * scaleFactor,
            })
            .css({
                all: 'initial',
            });

        let cssTxt = ['share', props.canvas].map(tag => {
            return Array.from((($(`link#css_${tag}`)[0] as HTMLLinkElement).sheet as CSSStyleSheet).cssRules)
                .map(rule => rule.cssText)
                .join(' ');
        });
        el.prepend(...cssTxt.map(txt => $('<style>').text(txt)))
            .prepend(document.querySelector('style#global').outerHTML)
            .find('[style="display: none;"]')
            .remove();

        if (window.urlParams.get('style') === 'mtr') {
            import(/* webpackChunkName: "panelPreviewMTR" */ './mtr-helper').then(({ getBase64FontFace }) => {
                getBase64FontFace((el[0] as Element) as SVGSVGElement).then(async response => {
                    let uris = await Promise.all(response);
                    el.prepend($('<style>').text(uris.join(' ')));

                    setSvgEl((el[0] as Element) as SVGSVGElement);

                    document.fonts.ready.then(() => {
                        setIsLoaded(true);
                    });
                });
            });
        } else {
            setSvgEl((el[0] as Element) as SVGSVGElement);
            setIsLoaded(true);
        }
    }, [props.canvas]);

    const handleClose = (action: string) => () => {
        if (action === 'png') {
            test($('#preview_diag svg'));
        } else if (action === 'svg') {
            let svgContent = $('#preview_diag svg');

            var link = document.createElement('a');
            link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
            link.download = 'rmg_export.svg';
            link.click();
        }
        props.onClose('close');
    };

    return (
        <Dialog onClose={handleClose('close')} open={props.open} maxWidth={false} id="preview_diag">
            <DialogTitle>{t('file.preview.title')}</DialogTitle>
            <DialogContent dangerouslySetInnerHTML={{ __html: svgEl.outerHTML }} />
            <DialogActions>
                <Button onClick={handleClose('close')} color="primary" autoFocus>
                    {t('dialog.cancel')}
                </Button>
                <Button onClick={handleClose('png')} color="primary" disabled={!isLoaded}>
                    {t('file.preview.png')}
                </Button>
                <Button onClick={handleClose('svg')} color="primary" disabled={!isLoaded}>
                    {t('file.preview.svg')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
