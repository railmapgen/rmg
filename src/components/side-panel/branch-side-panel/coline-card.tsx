import { useEffect, useState } from 'react';
import { ColineColours, ColineInfo } from '../../../constants/constants';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { openPaletteAppClip } from '../../../redux/app/app-slice';
import { Theme } from '@railmapgen/rmg-palette-resources';
import { ActionIcon, Card, Group, NativeSelect, TextInput } from '@mantine/core';
import { RMThemeButton } from '@railmapgen/mantine-components';

interface ColineCardProps {
    colineInfo: ColineInfo;
    routeOptions: { value: string; label: string }[];
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

    return (
        <Card withBorder>
            <Group gap="xs" align="flex-end">
                <NativeSelect
                    label={t('Route')}
                    value={[colineInfo.from, colineInfo.to].join(',')}
                    data={routeOptions}
                    onChange={({ currentTarget: { value } }) => onUpdateRoute?.(value)}
                    style={{ width: '100%', flexBasis: '100%' }}
                />
                <RMThemeButton
                    bg={colineInfo.colors[0][2]}
                    fg={colineInfo.colors[0][3]}
                    aria-label={t('Colour')}
                    title={t('Colour')}
                    onClick={() => {
                        setIsThemeRequested(true);
                        dispatch(openPaletteAppClip(colineInfo.colors[0].slice(0, 4) as Theme));
                    }}
                    style={{ minWidth: 30, flex: 'none' }}
                >
                    Aa
                </RMThemeButton>
                <TextInput
                    label={t('Chinese name')}
                    value={colineInfo.colors[0][4]}
                    onChange={({ currentTarget: { value } }) =>
                        onUpdateColourInfo?.([
                            colineInfo.colors[0][0],
                            colineInfo.colors[0][1],
                            colineInfo.colors[0][2],
                            colineInfo.colors[0][3],
                            value,
                            colineInfo.colors[0][5],
                        ])
                    }
                />
                <TextInput
                    label={t('English name')}
                    value={colineInfo.colors[0][5]}
                    onChange={({ currentTarget: { value } }) =>
                        onUpdateColourInfo?.([
                            colineInfo.colors[0][0],
                            colineInfo.colors[0][1],
                            colineInfo.colors[0][2],
                            colineInfo.colors[0][3],
                            colineInfo.colors[0][4],
                            value,
                        ])
                    }
                />
                <ActionIcon
                    variant="filled"
                    aria-label={t('Delete colour for route')}
                    title={t('Delete colour for route')}
                    onClick={() => onDelete?.(0)}
                    style={{ flex: 'none' }}
                >
                    <MdOutlineDeleteOutline />
                </ActionIcon>
            </Group>
        </Card>
    );
}
