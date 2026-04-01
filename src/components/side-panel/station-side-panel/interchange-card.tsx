import classes from './interchange-card.module.css';
import { ReactNode, useEffect, useId, useState } from 'react';
import { ExtendedInterchangeInfo, FACILITIES, RmgStyle } from '../../../constants/constants';
import { MdOutlineAdd, MdOutlineContentCopy, MdOutlineDeleteOutline } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { openPaletteAppClip } from '../../../redux/app/app-slice';
import { ActionIcon, Box, Fieldset, Flex, Group, Input, NativeSelect, Text } from '@mantine/core';
import { RMThemeButton } from '@railmapgen/mantine-components';

interface InterchangeCardProps {
    title: string;
    interchangeList: ExtendedInterchangeInfo[];
    beforeChildren?: ReactNode;
    onAdd?: (info: ExtendedInterchangeInfo) => void;
    onDelete?: (index: number) => void;
    onUpdate?: (index: number, info: ExtendedInterchangeInfo) => void;
}

export default function InterchangeCard(props: InterchangeCardProps) {
    const { title, interchangeList, beforeChildren, onAdd, onDelete, onUpdate } = props;

    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const [indexRequestedTheme, setIndexRequestedTheme] = useState<number>();

    const { paletteAppClipOutput } = useRootSelector(state => state.app);
    const { style, theme, stn_list: stationList } = useRootSelector(state => state.param);

    const cardId = useId();

    useEffect(() => {
        if (indexRequestedTheme !== undefined && paletteAppClipOutput) {
            onUpdate?.(indexRequestedTheme, { ...interchangeList[indexRequestedTheme], theme: paletteAppClipOutput });
            setIndexRequestedTheme(undefined);
        }
    }, [paletteAppClipOutput?.toString()]);

    const usedNameList = Object.values(stationList).reduce<[string[], string[]]>(
        (acc, cur) => {
            const [zhAcc, enAcc] = acc;
            return [
                [
                    ...new Set(
                        zhAcc.concat(cur.transfer.groups.map(it => it.lines?.map(line => line.name[0]) ?? []).flat())
                    ),
                ],
                [
                    ...new Set(
                        enAcc.concat(cur.transfer.groups.map(it => it.lines?.map(line => line.name[1]) ?? []).flat())
                    ),
                ],
            ];
        },
        [[], []]
    );

    const facilityOptions = [
        { value: '', label: t('None') },
        ...Object.entries(FACILITIES)
            .filter(([p]) => !['railway'].includes(p))
            .map(([f, name]) => ({ value: f, label: t(name) })),
    ];

    return (
        <Fieldset className={classes.card} legend={title}>
            {beforeChildren}

            {interchangeList.length === 0 && (
                <Group className={classes['empty-stack']} gap="xs" data-testid={`interchange-card-stack`}>
                    <Text fs="italic">{t('StationSidePanel.interchange.noInterchanges')}</Text>

                    <ActionIcon
                        size="sm"
                        variant="filled"
                        aria-label={t('StationSidePanel.interchange.add')}
                        title={t('StationSidePanel.interchange.add')}
                        onClick={() => onAdd?.({ theme: [theme[0], '', '#aaaaaa', MonoColour.white], name: ['', ''] })}
                    >
                        <MdOutlineAdd />
                    </ActionIcon>
                </Group>
            )}

            {interchangeList.map((it, i) => {
                const interchangeTheme = it.theme ?? [theme[0], '', '#aaaaaa', MonoColour.white];
                return (
                    <Flex key={i} className={classes.stack} data-testid={`interchange-card-stack-${i}`}>
                        <Group gap="xs">
                            <RMThemeButton
                                bg={interchangeTheme[2]}
                                fg={interchangeTheme[3]}
                                aria-label={t('Colour')}
                                title={t('Colour')}
                                onClick={() => {
                                    setIndexRequestedTheme(i);
                                    dispatch(openPaletteAppClip(interchangeTheme));
                                }}
                            >
                                Aa
                            </RMThemeButton>
                            <Input.Wrapper size="xs" label={i === 0 && t('Chinese name')} style={{ minWidth: 85 }}>
                                <Input
                                    size="xs"
                                    value={it.name[0]}
                                    list={`${cardId}-${i}-zh-list`}
                                    onChange={({ currentTarget: { value } }) =>
                                        onUpdate?.(i, { ...it, name: [value, it.name[1]] })
                                    }
                                />
                                <datalist id={`${cardId}-${i}-zh-list`}>
                                    {usedNameList[0].map((value, j) => (
                                        <option key={j}>{value}</option>
                                    ))}
                                </datalist>
                            </Input.Wrapper>
                            <Input.Wrapper size="xs" label={i === 0 && t('English name')}>
                                <Input
                                    size="xs"
                                    value={it.name[1]}
                                    list={`${cardId}-${i}-en-list`}
                                    onChange={({ currentTarget: { value } }) =>
                                        onUpdate?.(i, { ...it, name: [it.name[0], value] })
                                    }
                                />
                                <datalist id={`${cardId}-${i}-en-list`}>
                                    {usedNameList[1].map((value, j) => (
                                        <option key={j}>{value}</option>
                                    ))}
                                </datalist>
                            </Input.Wrapper>
                            {style === RmgStyle.MTR && (
                                <NativeSelect
                                    size="xs"
                                    label={i === 0 && t('Line icon')}
                                    value={it.facility}
                                    data={facilityOptions}
                                />
                            )}
                        </Group>
                        <Flex>
                            {onAdd && i === interchangeList.length - 1 ? (
                                <ActionIcon
                                    size="sm"
                                    variant="filled"
                                    aria-label={t('StationSidePanel.interchange.copy')}
                                    title={t('StationSidePanel.interchange.copy')}
                                    onClick={() => onAdd?.(interchangeList.slice(-1)[0])} // duplicate last leg
                                >
                                    <MdOutlineContentCopy />
                                </ActionIcon>
                            ) : (
                                <Box />
                            )}

                            {onDelete && (
                                <ActionIcon
                                    size="sm"
                                    variant="outline"
                                    aria-label={t('StationSidePanel.interchange.remove')}
                                    title={t('StationSidePanel.interchange.remove')}
                                    onClick={() => onDelete?.(i)}
                                >
                                    <MdOutlineDeleteOutline />
                                </ActionIcon>
                            )}
                        </Flex>
                    </Flex>
                );
            })}
        </Fieldset>
    );
}
