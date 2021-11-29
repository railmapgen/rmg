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

const getDistinctCssRules = (rules: (CSSFontFaceRule | undefined)[]): CSSFontFaceRule[] => {
    return rules.reduce<CSSFontFaceRule[]>((acc, cur) => {
        if (cur) {
            const existence = acc.find(rule => {
                const ruleStyle = rule.style as any;
                const curStyle = cur.style as any;
                return ruleStyle.fontFamily === curStyle.fontFamily && ruleStyle.unicodeRange === curStyle.unicodeRange;
            });
            return existence ? acc : acc.concat(cur);
        } else {
            return acc;
        }
    }, []);
};

export const getBase64FontFace = async (svgEl: SVGSVGElement): Promise<string[]> => {
    const uniqueCharacters = Array.from(
        new Set(
            [...svgEl.querySelectorAll<SVGElement>('.rmg-name__zh')]
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

    return await Promise.all(
        getDistinctCssRules(fontFaceList.map(font => matchCssRuleByFontFace(cssRules, font))).map(async cssRule => {
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
