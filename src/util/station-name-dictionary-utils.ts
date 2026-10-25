import apm from '@railmapgen/rmg-templates-resources/templates/gzmtr/apm.json';
import gf from '@railmapgen/rmg-templates-resources/templates/gzmtr/gf.json';
import gz1 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz1.json';
import gz13 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz13.json';
import gz14 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz14.json';
import gz18 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz18.json';
import gz2 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz2.json';
import gz21 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz21.json';
import gz22 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz22.json';
import gz3 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz3.json';
import gz4 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz4.json';
import gz5 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz5.json';
import gz6 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz6.json';
import gz7 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz7.json';
import gz8 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz8.json';
import gz9 from '@railmapgen/rmg-templates-resources/templates/gzmtr/gz9.json';
import thp1 from '@railmapgen/rmg-templates-resources/templates/gzmtr/thp1.json';
import thz1 from '@railmapgen/rmg-templates-resources/templates/gzmtr/thz1.json';
import mtr505 from '@railmapgen/rmg-templates-resources/templates/mtr/505.json';
import ael from '@railmapgen/rmg-templates-resources/templates/mtr/ael.json';
import drl from '@railmapgen/rmg-templates-resources/templates/mtr/drl.json';
import eal from '@railmapgen/rmg-templates-resources/templates/mtr/eal.json';
import isl from '@railmapgen/rmg-templates-resources/templates/mtr/isl.json';
import ktl from '@railmapgen/rmg-templates-resources/templates/mtr/ktl.json';
import sile from '@railmapgen/rmg-templates-resources/templates/mtr/sile.json';
import tcl from '@railmapgen/rmg-templates-resources/templates/mtr/tcl.json';
import tkl from '@railmapgen/rmg-templates-resources/templates/mtr/tkl.json';
import tml from '@railmapgen/rmg-templates-resources/templates/mtr/tml.json';
import twl from '@railmapgen/rmg-templates-resources/templates/mtr/twl.json';
import sh1 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh1.json';
import sh10 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh10.json';
import sh11 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh11.json';
import sh12 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh12.json';
import sh13 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh13.json';
import sh14 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh14.json';
import sh15 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh15.json';
import sh16 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh16.json';
import sh17 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh17.json';
import sh18 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh18.json';
import sh2 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh2.json';
import sh3 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh3.json';
import sh34 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh3&4.json';
import sh4 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh4.json';
import sh5 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh5.json';
import sh6 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh6.json';
import sh7 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh7.json';
import sh8 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh8.json';
import sh9 from '@railmapgen/rmg-templates-resources/templates/shmetro/sh9.json';
import { RmgStyle } from '../constants/constants';

interface TemplateData {
    stn_list?: Record<string, { name?: unknown; interchange?: unknown }>;
    line_name?: unknown;
}

type CandidateCounts = Map<string, Map<string, number>>;

const hasHan = (value: string) => /[\u3400-\u9FFF\uF900-\uFAFF]/.test(value);

const normalizeLookupName = (name: string) => name.normalize('NFC').replace(/\\/g, '').replace(/\s+/g, '').trim();

const cleanEnglishName = (name: string) => name.replace(/\\/g, ' ').replace(/\s+/g, ' ').trim();

const asTranslationPair = (value: unknown): [string, string] | undefined => {
    if (!Array.isArray(value) || typeof value[0] !== 'string' || typeof value[1] !== 'string') return undefined;

    const chinese = value[0].trim();
    const english = cleanEnglishName(value[1]);
    if (!chinese || !english || hasHan(english) || !/[A-Za-z0-9]/.test(english)) return undefined;

    return [chinese, english];
};

const addTranslation = (candidates: CandidateCounts, pair: [string, string] | undefined) => {
    if (!pair) return;

    const [chinese, english] = pair;
    const key = normalizeLookupName(chinese);
    if (!key) return;

    const translations = candidates.get(key) ?? new Map<string, number>();
    translations.set(english, (translations.get(english) ?? 0) + 1);
    candidates.set(key, translations);
};

const addInterchangeTranslations = (value: unknown, candidates: CandidateCounts) => {
    if (!Array.isArray(value)) return;

    // 模板中的换乘项为 [...Theme, 中文线路名, 英文线路名]。
    if (value.length >= 6 && typeof value[4] === 'string' && typeof value[5] === 'string') {
        addTranslation(candidates, asTranslationPair([value[4], value[5]]));
    }

    value.forEach(item => addInterchangeTranslations(item, candidates));
};

const collectTranslations = (templates: TemplateData[]) => {
    const candidates: CandidateCounts = new Map();

    templates.forEach(template => {
        addTranslation(candidates, asTranslationPair(template.line_name));
        Object.values(template.stn_list ?? {}).forEach(station => {
            addTranslation(candidates, asTranslationPair(station.name));
            addInterchangeTranslations(station.interchange, candidates);
        });
    });

    return candidates;
};

const selectTranslation = (translations: Map<string, number>) => {
    const highestFrequency = Math.max(...translations.values());
    const finalists = [...translations.entries()].filter(([, frequency]) => frequency === highestFrequency);

    // 同一城市模板偶尔存在缩写或拼写差异。优先采用更完整、分词更明确的官方写法。
    return finalists.sort(([a], [b]) => {
        const wordCountDifference = b.split(/\s+/).length - a.split(/\s+/).length;
        return wordCountDifference || b.length - a.length;
    })[0][0];
};

const toTranslationMap = (candidates: CandidateCounts) =>
    new Map([...candidates].map(([chinese, translations]) => [chinese, selectTranslation(translations)]));

const gzmtrTemplates: TemplateData[] = [
    apm,
    gf,
    gz1,
    gz13,
    gz14,
    gz18,
    gz2,
    gz21,
    gz22,
    gz3,
    gz4,
    gz5,
    gz6,
    gz7,
    gz8,
    gz9,
    thp1,
    thz1,
];

const mtrTemplates: TemplateData[] = [mtr505, ael, drl, eal, isl, ktl, sile, tcl, tkl, tml, twl];

const shmetroTemplates: TemplateData[] = [
    sh1,
    sh10,
    sh11,
    sh12,
    sh13,
    sh14,
    sh15,
    sh16,
    sh17,
    sh18,
    sh2,
    sh3,
    sh34,
    sh4,
    sh5,
    sh6,
    sh7,
    sh8,
    sh9,
];

const allCandidates = collectTranslations([...gzmtrTemplates, ...mtrTemplates, ...shmetroTemplates]);
const styleTranslations: Partial<Record<RmgStyle, Map<string, string>>> = {
    [RmgStyle.GZMTR]: toTranslationMap(collectTranslations(gzmtrTemplates)),
    [RmgStyle.MTR]: toTranslationMap(collectTranslations(mtrTemplates)),
    [RmgStyle.SHMetro]: toTranslationMap(collectTranslations(shmetroTemplates)),
    [RmgStyle.SHSuburbanRailway]: toTranslationMap(collectTranslations(shmetroTemplates)),
};

// 仅在所有城市资料给出一致译名时跨样式复用，避免把“坑口”误译成香港的 Hang Hau。
const unambiguousTranslations = new Map(
    [...allCandidates].flatMap(([chinese, translations]) =>
        translations.size === 1 ? [[chinese, translations.keys().next().value] as const] : []
    )
);

/**
 * 从随应用离线打包的 RMG 官方模板中查找英文名称。
 * 未收录或译名不可靠时返回 undefined，由调用方按站点回退到拼音。
 */
export const getOfflineEnglishName = (name: string, style: RmgStyle) => {
    const key = normalizeLookupName(name);
    if (!key) return undefined;

    return styleTranslations[style]?.get(key) ?? unambiguousTranslations.get(key);
};
