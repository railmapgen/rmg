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
        const cssStyle = rule.style as any;
        return (
            cssStyle.fontFamily.replace(/^"(.+)"$/, '$1') === font.family && cssStyle.unicodeRange === font.unicodeRange
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
                .replace(/[\s]/g, '')
        )
    ).join('');

    const fontFaceList = await document.fonts.load('80px GenYoMin TW, Vegur', uniqueCharacters);
    const cssRules = Array.from(
        (document.querySelector<HTMLLinkElement>('link#css_share')!.sheet!.cssRules[0] as CSSImportRule).styleSheet
            .cssRules
    ) as CSSFontFaceRule[];
    const distinctCssRules = fontFaceList.reduce<CSSFontFaceRule[]>((acc, cur) => {
        const matchedRule = matchCssRuleByFontFace(cssRules, cur);
        if (matchedRule) {
            const existence = acc.find(rule => {
                const ruleStyle = rule.style as any;
                const matchedStyle = matchedRule.style as any;
                return (
                    ruleStyle.fontFamily === matchedStyle.fontFamily &&
                    ruleStyle.unicodeRange === matchedStyle.unicodeRange
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
                const ruleStyleSrc = (cssRule.style as any).src;
                const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
                const url = isSafari
                    ? ruleStyleSrc.replace(/^url\(([\S]+)\).*$/, '$1')
                    : process.env.PUBLIC_URL + '/styles/' + ruleStyleSrc.match(/^url\("([\S*]+)"\)/)?.[1];

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
