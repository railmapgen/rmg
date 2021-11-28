/**
 * Helper function for filtering out the `CSSFontFaceRule` which renders the input character by matching character form and unicode range.
 * @param char string with one Chinese character
 * @param charForm code indicating country-variant Noto Serif font
 */
const getRFFHelper = async (char: string, charForm: 'SC' | 'TC' | 'JP' | 'KR'): Promise<string> => {
    const [f] = await document.fonts.load('80px Noto Serif ' + charForm, char);
    if (f) {
        const styleEl = document.querySelector<HTMLStyleElement>('style#googlefonts');
        const styleSheet = styleEl!.sheet;
        const cssText = [...styleSheet!.cssRules].find(cssRule => {
            const cssText = cssRule.cssText;
            return cssText.includes('Noto Serif ' + charForm) && cssText.includes(f.unicodeRange);
        })?.cssText;
        if (cssText) {
            return cssText;
        }
    }

    throw Error(`Can't render ${char} with Noto Serif ${charForm}`);
};

/**
 * Get `cssText` of `CSSFontFaceRule` which renders the input character.
 * @param char string with one Chinese character
 */
const getRenderedFontFace = async (char: string): Promise<string[] | string> => {
    if (char === '门') {
        return await getRFFHelper(char, 'SC');
    }

    try {
        return await getRFFHelper(char, 'KR');
    } catch (_) {
        try {
            return await getRFFHelper(char, 'JP');
        } catch (_) {
            // Render with TC and SC together due to weird response
            const results = await Promise.allSettled([getRFFHelper(char, 'TC'), getRFFHelper(char, 'SC')]);
            const rules = results.reduce(
                (acc, res) => (res.status === 'fulfilled' ? acc.concat(res.value) : acc),
                [] as string[]
            );
            if (!rules.length) {
                console.warn(char + ': not found');
            }
            return rules;
        }
    }
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

/**
 * Get `CSSFontFaceRule` whose source is Base64 URL for all Chinese characters in a `SVGSVGElement`.
 * @param svgEl `SVGSVGElement` to be exported
 */
export const getBase64FontFace = async (svgEl: SVGSVGElement): Promise<string[]> => {
    try {
        const response = await fetch(
            'https://fonts.googleapis.com/css' +
                '?family=Noto+Serif+KR:600|Noto+Serif+JP:600|Noto+Serif+TC:600|Noto+Serif+SC:600%26display=swap'
        );
        const cssText = await response.text(); // constructed with multiple @font-face

        const s = document.createElement('style');
        s.id = 'googlefonts';
        s.textContent = cssText;
        document.head.prepend(s);

        const distinctCharList = [
            ...new Set(
                [...(svgEl.querySelectorAll('.rmg-name__zh') as NodeListOf<SVGTextElement | SVGTSpanElement>)]
                    .map(el => el.innerHTML)
                    .join('')
                    .replace(/[\d\w\s]/g, '')
            ),
        ];

        const rules = await Promise.all(distinctCharList.map(getRenderedFontFace));
        s.remove();

        return await Promise.all(
            [...new Set(([] as string[]).concat(...rules))].map(async rule => {
                try {
                    const fontResp = await fetch(rule.match(/https:[\w:/.-]+.woff2/g)![0]);
                    const fontDataUri = await readBlobAsDataURL(await fontResp.blob());
                    return rule.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${fontDataUri}'); `);
                } catch (err) {
                    console.warn(err);
                    return '';
                }
            })
        );
    } catch (err) {
        throw err;
    }
};

export const getBase64FontFace2 = async (svgEl: SVGSVGElement) => {
    const uniqueCharacters = Array.from(
        new Set(
            [...(svgEl.querySelectorAll('.rmg-name__zh') as NodeListOf<SVGTextElement | SVGTSpanElement>)]
                .map(el => el.innerHTML)
                .join('')
                .replace(/[\d\w\s]/g, '')
        )
    ).join('');

    const fontFaceList = await document.fonts.load('80px GenYoMin TW', uniqueCharacters);
    const unicodeRanges = fontFaceList.map(fontFace => fontFace.unicodeRange); // no duplicated ranges

    const filteredCssRules = (
        Array.from(
            (document.querySelector<HTMLLinkElement>('link#css_share')!.sheet!.cssRules[0] as CSSImportRule).styleSheet
                .cssRules
        ) as CSSFontFaceRule[]
    ).filter(cssRule => unicodeRanges.includes((cssRule.style as any).unicodeRange));

    return await Promise.all(
        filteredCssRules.map(async cssRule => {
            const url =
                process.env.PUBLIC_URL + '/styles/' + (cssRule.style as any).src.match(/^url\("([\S*]+)"\)/)?.[1];
            const fontResp = await fetch(url);
            const fontDataUri = await readBlobAsDataURL(await fontResp.blob());
            return cssRule.cssText.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${fontDataUri}'); `);
        })
    );
};
