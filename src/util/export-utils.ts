import { CanvasType, RmgStyle } from '../constants/constants';
import { isSafari } from './utils';

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

    if (rmgStyle === RmgStyle.MTR) {
        try {
            const uris = await getBase64FontFace(elem);
            const s = document.createElement('style');
            s.textContent = uris.join('\n');
            elem.prepend(s);
        } catch (err) {
            alert('Failed to fonts. Fonts in the exported PNG will be missing.');
            console.error(err);
        }
    }

    return elem;
};

/**
 * Convert a `Blob` into Base64 data URL.
 * @param blob
 */
const readBlobAsDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve: (value: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

const matchCssRuleByFontFace = (rules: CSSFontFaceRule[], font: FontFace): CSSFontFaceRule | undefined => {
    return rules.find(rule => {
        const cssStyle = rule.style;
        return (
            cssStyle.getPropertyValue('font-family').replace(/^"(.+)"$/, '$1') === font.family &&
            cssStyle.getPropertyValue('unicode-range') === font.unicodeRange
        );
    });
};

export const getBase64FontFace = async (svgEl: SVGSVGElement): Promise<string[]> => {
    const uniqueCharacters = Array.from(
        new Set(
            [
                ...svgEl.querySelectorAll<SVGElement>('.rmg-name__zh'),
                ...svgEl.querySelectorAll<SVGElement>('.rmg-name__en'),
            ]
                .map(el => el.innerHTML)
                .join('')
                .replace(/\s/g, '')
        )
    ).join('');

    const fontFaceList = await document.fonts.load('80px GenYoMin TW, Vegur', uniqueCharacters);
    const cssRules = Array.from(
        (document.querySelector<HTMLLinkElement>('link#css_share')?.sheet?.cssRules?.[0] as CSSImportRule).styleSheet
            .cssRules
    ) as CSSFontFaceRule[];
    const distinctCssRules = fontFaceList.reduce<CSSFontFaceRule[]>((acc, cur) => {
        const matchedRule = matchCssRuleByFontFace(cssRules, cur);
        if (matchedRule) {
            const existence = acc.find(rule => {
                const ruleStyle = rule.style;
                const matchedStyle = matchedRule.style;
                return (
                    ruleStyle.getPropertyValue('font-family') === matchedStyle.getPropertyValue('font-family') &&
                    ruleStyle.getPropertyValue('unicode-range') === matchedStyle.getPropertyValue('unicode-range')
                );
            });
            return existence ? acc : acc.concat(matchedRule);
        } else {
            return acc;
        }
    }, []);

    return await Promise.all(
        distinctCssRules.map(async cssRule => {
            try {
                const fontResp = await fetch(getAbsoluteUrl(cssRule));
                const fontDataUri = await readBlobAsDataURL(await fontResp.blob());
                return cssRule.cssText.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${fontDataUri}'); `);
            } catch (err) {
                console.error(err);
                return '';
            }
        })
    );
};

export const getAbsoluteUrl = (cssRule: CSSFontFaceRule) => {
    const ruleStyleSrc = (cssRule.style as any).src;
    return isSafari()
        ? ruleStyleSrc.replace(/^url\("(\S+)"\).*$/, '$1')
        : import.meta.env.BASE_URL + 'styles/' + ruleStyleSrc.match(/^url\("([\S*]+)"\)/)?.[1];
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
