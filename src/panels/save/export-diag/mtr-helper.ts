/**
 * Helper function for filtering out the `CSSFontFaceRule` which renders the input character by matching character form and unicode range.
 * @param char string with one Chinese character
 * @param charForm code indicating country-variant Noto Serif font
 */
const getRFFHelper = async (char: string, charForm: 'SC' | 'TC' | 'JP' | 'KR') => {
    const [f] = await document.fonts.load('80px Noto Serif ' + charForm, char);
    if (f)
        for (let rule of [
            ...((document.querySelector('style#googlefonts') as HTMLStyleElement).sheet as CSSStyleSheet).cssRules,
        ])
            if (rule.cssText.includes('Noto Serif ' + charForm) && rule.cssText.includes(f.unicodeRange))
                return rule.cssText;

    throw Error(`Can't render ${char} with Noto Serif ${charForm}`);
};

/**
 * Get `cssText` of `CSSFontFaceRule` which renders the input character.
 * @param char string with one Chinese character
 */
const getRenderedFontFace = async (char: string): Promise<string[] | string> => {
    if (char === '门') return getRFFHelper(char, 'SC');

    return Promise.resolve(getRFFHelper(char, 'KR')).catch(() =>
        Promise.resolve(getRFFHelper(char, 'JP')).catch(async () => {
            // Render with TC and SC together due to weird response
            const results = await Promise.allSettled([getRFFHelper(char, 'TC'), getRFFHelper(char, 'SC')]);
            let rules = results.reduce(
                (acc, res) => (res.status === 'fulfilled' ? acc.concat(res.value) : acc),
                [] as string[]
            );
            if (!rules.length) console.warn(char + ': not found');
            return rules;
        })
    );
    // return Promise.all([getRFFHelper(char, 'KR')]).catch(() =>
    //     Promise.all([getRFFHelper(char, 'JP')]).catch(() =>
    //         Promise.all([getRFFHelper(char, 'TC'), getRFFHelper(char, 'SC')]).catch(() =>
    //             Promise.all([getRFFHelper(char, 'SC')]).catch(() => {
    //                 console.warn(char + ': not found');
    //                 return [];
    //             })
    //         )
    //     )
    // );
};

/**
 * Convert a `Blob` into Base64 data URL.
 * @param blob
 */
const readBlobAsDataURL = (blob: Blob) =>
    new Promise((resolve: (value: string) => void) => {
        let reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });

/**
 * Get `CSSFontFaceRule` whose source is Base64 URL for all Chinese characters in a `SVGSVGElement`.
 * @param svgEl `SVGSVGElement` to be exported
 */
export const getBase64FontFace = (svgEl: SVGSVGElement) =>
    fetch(
        'https://fonts.googleapis.com/css?family=Noto+Serif+KR:600|Noto+Serif+JP:600|Noto+Serif+TC:600|Noto+Serif+SC:600%26display=swap'
    )
        .then(response => response.text())
        .then(async csstext => {
            let s = document.createElement('style');
            s.type = 'text/css';
            s.id = 'googlefonts';
            s.textContent = csstext;
            document.head.append(s);

            let txt = [
                ...new Set(
                    [...(svgEl.querySelectorAll('.rmg-name__zh') as NodeListOf<SVGTextElement | SVGTSpanElement>)]
                        .map(el => el.innerHTML)
                        .join('')
                        .replace(/[\d\w\s]/g, '')
                ),
            ];

            let rules = await Promise.all(txt.map(getRenderedFontFace));
            s.remove();

            return [...new Set(([] as string[]).concat(...rules))].map(rule =>
                fetch(rule.match(/https:[\w:/.-]+.woff2/g)![0])
                    .then(response => response.blob())
                    .then(readBlobAsDataURL)
                    .then(uri => rule.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${uri}'); `))
                    .catch(err => {
                        console.warn(err);
                        return '';
                    })
            );
        });
