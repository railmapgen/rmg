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

export const getBase64FontFace = async (svgEl: SVGSVGElement): Promise<string[]> => {
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
            try {
                const url =
                    process.env.PUBLIC_URL + '/styles/' + (cssRule.style as any).src.match(/^url\("([\S*]+)"\)/)?.[1];
                const fontResp = await fetch(url);
                const fontDataUri = await readBlobAsDataURL(await fontResp.blob());
                return cssRule.cssText.replace(/src:[ \w('",\-:/.)]+;/g, `src: url('${fontDataUri}'); `);
            } catch (err) {
                console.error(err);
                return '';
            }
        })
    );
};
