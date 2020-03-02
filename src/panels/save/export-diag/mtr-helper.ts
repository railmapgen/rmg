/**
 * Helper function for filtering out the `CSSFontFaceRule` which renders the input character by matching character form and unicode range. 
 * @param char string with one Chinese character
 * @param charForm code indicating country-variant Noto Serif font
 */
const getRFFHelper = async (char: string, charForm: 'SC' | 'TC' | 'JP' | 'KR'): Promise<string> => {
    // console.log(char, charForm)
    return document.fonts
        .load('80px Noto Serif '+charForm, char)
        .then(f => {
            let ur = f[0].unicodeRange;
            return Array.from(
                ((<HTMLStyleElement>$('head > style#googlefonts')[0]).sheet as CSSStyleSheet)
                    .cssRules)
                .filter(rule => rule.cssText.includes('Noto Serif '+charForm))
                .filter(rule => rule.cssText.includes(ur))[0].cssText
        })
}

/**
 * Get `cssText` of `CSSFontFaceRule` which renders the input character. 
 * @param char string with one Chinese character
 */
const getRenderedFontFace = async (char: string): Promise<string[]> => {
    if (char === '门') {return Promise.all([getRFFHelper(char, 'SC')]);}
    return Promise.all([getRFFHelper(char, 'KR')])
        .catch(() => {
            return Promise.all([getRFFHelper(char, 'JP')])
                .catch(() => {
                    return Promise.all([getRFFHelper(char, 'TC'), getRFFHelper(char, 'SC')])
                        .catch(() => {
                            return Promise.all([getRFFHelper(char, 'SC')])
                        })
                })
        })
}

/**
 * Convert a `Blob` into Base64 data URL. 
 * @param blob 
 */
const readBlobAsDataURL = (blob: Blob) => {
    return new Promise((resolve: (value: string) => void) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            resolve((reader.result as string));
        };
        reader.readAsDataURL(blob);
    });
};

/**
 * Get `CSSFontFaceRule` whose source is Base64 URL for all Chinese characters in a `SVGSVGElement`. 
 * @param svgEl `SVGSVGElement` to be exported
 */
export const getBase64FontFace = async (svgEl: SVGSVGElement) => {
    let src = 'https://fonts.googleapis.com/css?family=Noto+Serif+KR:600|Noto+Serif+JP:600|Noto+Serif+TC:600|Noto+Serif+SC:600%26display=swap';
    return fetch(src)
        .then(response => response.text())
        .then(async csstext => {
            $('head').append($('<style>', {type:'text/css', id:'googlefonts'}).text(csstext));

            let txt = Array.from(new Set($(svgEl).find('.rmg-name__zh').text().replace(/[\d\s]/g, '')));
            return Promise.all(txt.map(getRenderedFontFace))
                .then(rules => <string[]>[].concat(...rules))
                .then(rules => Array.from(new Set(rules)))
                .then(rules => {
                    return rules.map(async rule => {
                        return fetch(rule.match(/https:[\w:/.-]+.woff2/g)[0])
                            .then(response => response.blob())
                            .then(readBlobAsDataURL)
                            .then(uri => rule.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${uri}'); `));
                    })
                })
        })
}