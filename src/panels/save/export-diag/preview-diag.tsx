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

    const [svgEl, setSvgEl] = React.useState((document.createElement('svg') as Element) as SVGSVGElement);
    const [isLoaded, setIsLoaded] = React.useState(false);

    const contentEl = React.useRef<HTMLDivElement>();

    React.useEffect(() => {
        if (props.canvas === '') {
            setSvgEl((document.createElement('svg') as Element) as SVGSVGElement);
            setIsLoaded(false);
            return;
        }
        let [thisSVGWidth, thisSVGHeight] = ['--rmg-svg-width', '--rmg-svg-height']
            .map(
                key =>
                    (document.querySelector(`svg#${props.canvas}`) as SVGSVGElement).style
                        .getPropertyValue(key)
                        .match(/\d+/g)[0]
            )
            .map(Number);

        let MAX_WIDTH = Math.min(window.innerWidth, 1412) - 64 - 24 * 2;
        let MAX_HEIGHT = window.innerHeight - 64 - 64 - 52 - 8 * 2;
        let scaleFactor = Math.min(MAX_WIDTH / thisSVGWidth, MAX_HEIGHT / thisSVGHeight);

        let elem = document.querySelector(`svg#${props.canvas}`).cloneNode(true) as SVGSVGElement;
        elem.viewBox.baseVal.width = thisSVGWidth;
        elem.viewBox.baseVal.height = thisSVGHeight;
        elem.setAttribute('width', (thisSVGWidth * scaleFactor).toString());
        elem.setAttribute('height', (thisSVGHeight * scaleFactor).toString());
        elem.style.setProperty('all', 'initial');

        let cssTxt = ['share', props.canvas].map(tag => {
            return Array.from(
                (Array.from(document.querySelectorAll('link')).filter(l => l.id === 'css_' + tag)[0]
                    ?.sheet as CSSStyleSheet).cssRules
            )
                .map(rule => rule.cssText)
                .join(' ');
        });

        cssTxt.forEach(txt => {
            let s = document.createElement('style');
            s.innerText = txt;
            elem.prepend(s);
        });

        if (window.urlParams.get('style') === 'mtr') {
            import(/* webpackChunkName: "panelPreviewMTR" */ './mtr-helper').then(({ getBase64FontFace }) => {
                getBase64FontFace(elem).then(async response => {
                    let uris = await Promise.all(response);
                    let s = document.createElement('style');
                    s.innerText = uris.join(' ');
                    elem.prepend(s);

                    setSvgEl(elem);
                    document.fonts.ready.then(() => setIsLoaded(true));
                });
            });
        } else {
            setSvgEl(elem);
            setIsLoaded(true);
        }
    }, [props.canvas]);

    const handleClose = (action: string) => () => {
        let svgEl = contentEl.current.querySelector('svg');
        if (action === 'png') {
            test(svgEl);
        } else if (action === 'svg') {
            var link = document.createElement('a');
            link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl.outerHTML)));
            link.download = 'rmg.' + new Date().toISOString() + '.svg';
            link.click();
        }
        props.onClose('close');
    };

    return (
        <Dialog onClose={handleClose('close')} open={props.open} maxWidth={false}>
            <DialogTitle>{t('file.preview.title')}</DialogTitle>
            <DialogContent dangerouslySetInnerHTML={{ __html: svgEl.outerHTML }} ref={contentEl} />
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
