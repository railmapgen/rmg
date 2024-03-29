import { RmgCard, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useEffect, useState } from 'react';
import { ColineColours, ColineInfo } from '../../../constants/constants';
import ThemeButton from '../theme-button';
import { HStack, IconButton } from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { openPaletteAppClip } from '../../../redux/app/app-slice';
import { Theme } from '@railmapgen/rmg-palette-resources';

interface ColineCardProps {
    colineInfo: ColineInfo;
    routeOptions: Record<string, string>;
    onUpdateRoute?: (route: string) => void;
    onUpdateColourInfo?: (colourInfo: ColineColours) => void;
    onDelete?: (colourIndex: number) => void;
}

export default function ColineCard(props: ColineCardProps) {
    const { colineInfo, routeOptions, onUpdateRoute, onUpdateColourInfo, onDelete } = props;
    const { t } = useTranslation();

    const dispatch = useRootDispatch();
    const { paletteAppClipOutput } = useRootSelector(state => state.app);

    const [isThemeRequested, setIsThemeRequested] = useState(false);

    useEffect(() => {
        if (isThemeRequested && paletteAppClipOutput) {
            onUpdateColourInfo?.([...paletteAppClipOutput, colineInfo.colors[0][4], colineInfo.colors[0][5]]);
            setIsThemeRequested(false);
        }
    }, [paletteAppClipOutput?.toString()]);

    const fields1: RmgFieldsField[] = [
        {
            type: 'select',
            label: 'Route',
            value: [colineInfo.from, colineInfo.to].join(','),
            options: routeOptions,
            onChange: value => onUpdateRoute?.(value as string),
        },
    ];

    const fields2: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('Colour'),
            component: (
                <ThemeButton
                    theme={[
                        colineInfo.colors[0][0],
                        colineInfo.colors[0][1],
                        colineInfo.colors[0][2],
                        colineInfo.colors[0][3],
                    ]}
                    onClick={() => {
                        setIsThemeRequested(true);
                        dispatch(openPaletteAppClip(colineInfo.colors[0].slice(0, 4) as Theme));
                    }}
                />
            ),
        },
        {
            type: 'input',
            label: t('Chinese name'),
            value: colineInfo.colors[0][4],
            minW: 120,
            onChange: value =>
                onUpdateColourInfo?.([
                    colineInfo.colors[0][0],
                    colineInfo.colors[0][1],
                    colineInfo.colors[0][2],
                    colineInfo.colors[0][3],
                    value,
                    colineInfo.colors[0][5],
                ]),
        },
        {
            type: 'input',
            label: t('English name'),
            value: colineInfo.colors[0][5],
            minW: 120,
            onChange: value =>
                onUpdateColourInfo?.([
                    colineInfo.colors[0][0],
                    colineInfo.colors[0][1],
                    colineInfo.colors[0][2],
                    colineInfo.colors[0][3],
                    colineInfo.colors[0][4],
                    value,
                ]),
        },
    ];

    return (
        <RmgCard direction="column">
            <RmgFields fields={fields1} minW="full" />
            <HStack spacing={0.5}>
                <RmgFields fields={fields2} />

                <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Delete colour for route"
                    onClick={() => onDelete?.(0)}
                    icon={<MdDelete />}
                />
            </HStack>
        </RmgCard>
    );
}
