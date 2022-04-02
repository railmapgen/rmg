import { RmgCard, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import React, { useState } from 'react';
import { ColineInfo, InterchangeInfo, Theme } from '../../../constants/constants';
import ThemeButton from '../theme-button';
import ColourModal from '../../modal/colour-modal/colour-modal';

interface ColineCardProps {
    colineInfo: ColineInfo;
    routeOptions: Record<string, string>;
    onUpdateRoute?: (route: string) => void;
    onUpdateColourInfo?: (colourInfo: InterchangeInfo) => void;
}

export default function ColineCard(props: ColineCardProps) {
    const { colineInfo, routeOptions, onUpdateRoute, onUpdateColourInfo } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);

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
            label: 'Colour',
            component: (
                <ThemeButton
                    theme={[
                        colineInfo.colors[0][0],
                        colineInfo.colors[0][1],
                        colineInfo.colors[0][2],
                        colineInfo.colors[0][3],
                    ]}
                    onClick={() => setIsModalOpen(true)}
                />
            ),
        },
        {
            type: 'input',
            label: 'Chinese name',
            value: colineInfo.colors[0][4],
            minW: '115px',
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
            label: 'English name',
            value: colineInfo.colors[0][5],
            minW: '115px',
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
            <RmgFields fields={fields2} />

            <ColourModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultTheme={colineInfo.colors[0].slice(0, 4) as Theme}
                onUpdate={theme => onUpdateColourInfo?.([...theme, colineInfo.colors[0][4], colineInfo.colors[0][5]])}
            />
        </RmgCard>
    );
}
