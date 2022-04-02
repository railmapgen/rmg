import { RmgCard, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import React from 'react';
import { ColineInfo } from '../../../constants/constants';

interface ColineCardProps {
    colineInfo: ColineInfo;
    routeOptions: Record<string, string>;
}

export default function ColineCard(props: ColineCardProps) {
    const { colineInfo, routeOptions } = props;

    const fields1: RmgFieldsField[] = [
        {
            type: 'select',
            label: 'Route',
            value: [colineInfo.from, colineInfo.to].join(','),
            options: routeOptions,
        },
    ];

    return (
        <RmgCard>
            <RmgFields fields={fields1} />
        </RmgCard>
    );
}
