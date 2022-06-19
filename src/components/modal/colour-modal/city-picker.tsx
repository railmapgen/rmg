import React from 'react';
import { RmgAutoComplete } from '@railmapgen/rmg-components';
import { CityCode, CityEntry, cityList, countryList } from '@railmapgen/rmg-palette-resources';
import { LanguageCode } from '../../../constants/constants';
import { useTranslation } from 'react-i18next';
import FlagSvgEmoji from './flag-svg-emoji';

interface CityPickerProps {
    defaultValueId?: CityCode;
    onChange?: (val: CityCode) => void;
}

export default function CityPicker(props: CityPickerProps) {
    const { defaultValueId, onChange } = props;

    const { i18n } = useTranslation();

    const currentItem = defaultValueId ? cityList.find(item => item.id === defaultValueId) : undefined;

    const displayValue = (item: CityEntry): string => {
        return i18n.languages.map(lng => item.name[lng as LanguageCode]).find(name => name !== undefined)!!;
    };

    const displayHandler = (item: CityEntry) => {
        const isCensorTWFlag =
            item.country === 'TW' &&
            [LanguageCode.ChineseSimp, LanguageCode.ChineseCN].includes(i18n.languages[0] as LanguageCode);
        const isWindowsClient = ['Win32', 'Win64'].includes(navigator.platform);
        // const isWindowsClient = true; // uncomment this line for Windows testing

        const name = i18n.languages.map(lng => item.name[lng as LanguageCode]).find(name => name !== undefined);
        const flagSvg = countryList.find(country => country.id === item.country)?.flagSvg;
        const flagEmoji = countryList.find(country => country.id === item.country)?.flagEmoji;

        return (
            <>
                {isCensorTWFlag ? (
                    <span>🏴&nbsp;</span>
                ) : isWindowsClient ? (
                    <FlagSvgEmoji countryCode={item.country} svgFilename={flagSvg} />
                ) : (
                    <span>{flagEmoji}&nbsp;</span>
                )}
                {name}
            </>
        );
    };

    const predicate = (item: CityEntry, input: string): boolean => {
        return Object.values(item.name).some(name => name.includes(input));
    };

    const data = cityList.slice().sort((a, b) => {
        if (a.id === CityCode.Other) {
            return 1;
        } else if (b.id === CityCode.Other) {
            return -1;
        } else {
            return displayValue(a).localeCompare(displayValue(b), i18n.languages[0]);
        }
    });

    return (
        <RmgAutoComplete
            data={data}
            displayValue={displayValue}
            displayHandler={displayHandler}
            predicate={predicate}
            defaultValue={currentItem}
            onChange={item => onChange?.(item.id)}
        />
    );
}
