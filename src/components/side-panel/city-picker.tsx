import React from 'react';
import RmgAutoComplete from '../common/rmg-auto-complete';
import { CityCode, CityEntry, cityList } from '../../constants/city-config';
import { LanguageCode } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { Image } from '@chakra-ui/react';

interface CityPickerProps {
    defaultValueId?: CityCode;
    onChange?: (val: CityCode) => void;
}

export default function CityPicker(props: CityPickerProps) {
    const { defaultValueId, onChange } = props;

    const { i18n } = useTranslation();

    const data = cityList;
    const currentItem = defaultValueId ? data.find(item => item.id === defaultValueId) : undefined;

    const displayValue = (item: CityEntry): string => {
        return i18n.languages.map(lng => item.name[lng as LanguageCode]).find(name => name !== undefined)!!;
    };

    const getFlagEmojiCodePoints = (countryCode: string): string[] => {
        if (
            countryCode.toUpperCase() === 'TW' &&
            [LanguageCode.ChineseSimp, LanguageCode.ChineseCN].includes(i18n.language as LanguageCode)
        ) {
            return ['1F3F4'];
        }

        const chars = countryCode.toUpperCase().split('');
        if (chars.length === 2) {
            // normal country
            return chars.map(char => ((char.codePointAt(0) || 0) + 0x1f1a5).toString(16).toUpperCase());
        } else if (chars.length === 5) {
            // GBENG, GBSCT
            return [
                '1F3F4',
                ...chars.map(char => ((char.codePointAt(0) || 0) + 0xe0020).toString(16).toUpperCase()),
                'E007F',
            ];
        } else {
            return [];
        }
    };

    const displayHandler = (item: CityEntry) => {
        const flagEmojiCodePoints = getFlagEmojiCodePoints(item.country);
        const flagEmoji = String.fromCodePoint(...(flagEmojiCodePoints?.map(cp => parseInt(cp, 16)) || []));

        const name = i18n.languages.map(lng => item.name[lng as LanguageCode]).find(name => name !== undefined);

        return (
            <>
                {['Win32', 'Win64'].includes(navigator.platform) ? (
                    <Image
                        src={process.env.PUBLIC_URL + `/images/flags/${flagEmojiCodePoints.join('-')}.svg`}
                        alt={`Flag of ${item.country}`}
                        h={17}
                        mr={1}
                    />
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
