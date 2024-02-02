import { CanvasType, RmgStyle } from '../constants/constants';
import { STYLE_CONFIG } from '../svgs/config';
import rmgRuntime from '@railmapgen/rmg-runtime';

const searchSrcRegex = /url\("([\S*]+)"\)/;

export const cloneSvgCanvas = async (
    canvas: CanvasType,
    rmgStyle: RmgStyle,
    isTransparent?: boolean,
    isShowBorder?: boolean,
    scale?: number
): Promise<SVGSVGElement> => {
    const svg: SVGSVGElement | null = document.querySelector(`svg#${canvas}`);
    if (!svg) {
        throw new Error('Requested canvas SVG element not found');
    }

    const thisSVGHeight = Number(svg.style.getPropertyValue('--rmg-svg-height').match(/\d+/g)?.[0]);
    const elem = svg.cloneNode(true) as SVGSVGElement;
    elem.setAttribute('height', ((thisSVGHeight * (scale || 100)) / 100).toString());
    elem.style.setProperty('all', 'initial');

    ['share']
        .map(tag =>
            [
                ...(
                    [...document.querySelectorAll('link')].filter(l => l.id === 'css_' + tag)[0]?.sheet as CSSStyleSheet
                ).cssRules,
            ]
                .map(rule => rule.cssText)
                .join(' ')
        )
        .forEach(txt => {
            const s = document.createElement('style');
            s.textContent = txt;
            elem.prepend(s);
        });

    elem.querySelector('rect#canvas-border')?.setAttribute('stroke', isShowBorder ? 'black' : 'none');
    elem.querySelector('rect#canvas-bg')?.setAttribute('fill', isTransparent ? 'none' : 'white');

    try {
        const fonts = STYLE_CONFIG[rmgStyle].fonts ?? [];
        const cssPromises = await Promise.allSettled(fonts.map(rmgRuntime.getFontCSS));
        const csss = cssPromises
            .filter((promise): promise is PromiseFulfilledResult<string> => promise.status === 'fulfilled')
            .map(promise => promise.value);
        const s = document.createElement('style');
        s.textContent = csss.join('\n');
        elem.prepend(s);
    } catch (err) {
        console.warn('Failed to fonts. Fonts in the exported PNG will be missing.', err);
    }

    return elem;
};

export const test = async (svgEl: SVGSVGElement, scale: number, isWait: boolean): Promise<Blob> => {
    const svgW = svgEl.viewBox.baseVal.width;
    const svgH = svgEl.viewBox.baseVal.height;

    // svgEl.removeAttribute('height');

    const canvas = document.querySelectorAll('canvas')[0];
    canvas.width = Number(svgW) * window.devicePixelRatio * scale;
    canvas.height = Number(svgH) * window.devicePixelRatio * scale;

    svgEl.setAttribute('width', canvas.width.toString());
    svgEl.setAttribute('height', canvas.height.toString());

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // bypass Chrome min font size (to be improved)

    svgEl
        .querySelectorAll('.rmg-name__en.rmg-name__gzmtr--next2-dest')
        .forEach(el => el.setAttribute('font-size', '8.5px'));

    // svgEl
    //     .querySelectorAll('text:not([font-size]), tspan:not([font-size])')
    //     .forEach((el) => el.setAttribute('font-size', window.getComputedStyle(el).fontSize));

    svgEl.querySelectorAll('text, tspan').forEach(el => {
        const elStyle = window.getComputedStyle(el);
        el.setAttribute('font-family', elStyle.fontFamily);
        el.setAttribute('fill', elStyle.fill);
        el.setAttribute('dominant-baseline', elStyle.dominantBaseline);
        el.setAttribute('text-anchor', elStyle.textAnchor || '');
        // el.removeAttribute('class');
    });

    // https://stackoverflow.com/questions/46399223/async-await-in-image-loading/52851789
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            setTimeout(
                () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject('Canvas blob is null');
                        }
                    }, 'image/png');
                },
                isWait ? 2000 : 0
            );
        };
        img.onerror = reject;
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl.outerHTML)));
    });
};
