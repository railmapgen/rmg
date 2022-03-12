import React, { useEffect, useState } from 'react';
import { ColourHex, LanguageCode, MonoColour, PaletteEntry } from '../../../constants/constants';
import RmgAutoComplete from '../../common/rmg-auto-complete';
import { CityCode } from '@railmapgen/rmg-palette-resources';
import { useTranslation } from 'react-i18next';
import { RmgLineBadge } from '@railmapgen/rmg-components';

const usePalette = (cityCode?: CityCode) => {
    const [paletteList, setPaletteList] = useState<PaletteEntry[]>([]);

    useEffect(() => {
        import(/* webpackChunkName: "palettes" */ `@railmapgen/rmg-palette-resources/palettes/${cityCode}.js`)
            .then(module => setPaletteList(module.default))
            .catch(() => setPaletteList([]));
    }, [cityCode]);

    return paletteList;
};

interface ColourPickerProps {
    city?: CityCode;
    defaultValueId?: string;
    onChange?: (lineCode: string, bg: ColourHex, fg: MonoColour) => void;
}

export default function ColourPicker(props: ColourPickerProps) {
    const { city, defaultValueId, onChange } = props;

    const { i18n } = useTranslation();

    const paletteList = usePalette(city);

    const currentItem = defaultValueId ? paletteList.find(palette => palette.id === defaultValueId) : undefined;

    const displayValue = (item: PaletteEntry): string => {
        return i18n.languages.map(lng => item.name[lng as LanguageCode]).find(name => name !== undefined)!!;
    };

    const displayHandler = (item: PaletteEntry) => {
        const displayName = displayValue(item);

        return <RmgLineBadge name={displayName} fg={item.fg || MonoColour.white} bg={item.colour} />;
    };

    const predicate = (item: PaletteEntry, input: string): boolean => {
        return Object.values(item.name).some(name => name.includes(input));
    };

    return (
        <RmgAutoComplete
            data={paletteList}
            displayValue={displayValue}
            displayHandler={displayHandler}
            predicate={predicate}
            defaultValue={currentItem}
            onChange={item => onChange?.(item.id, item.colour, item.fg || MonoColour.white)}
        />
    );
}
