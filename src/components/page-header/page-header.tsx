import React from 'react';
import HeaderActions from './header-actions';
import { setCanvasScale, setCanvasToShow } from '../../redux/app/app-slice';
import { canvasConfig, CanvasType, RmgStyle } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgFields, RmgFieldsField, RmgMultiSelect, RmgPageHeader } from '@railmapgen/rmg-components';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { setStyle } from '../../redux/param/action';

export default function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const rmgStyle = useRootSelector(state => state.param.style);

    const styleSelections = Object.values(RmgStyle).reduce<Partial<Record<RmgStyle, string>>>(
        (acc, cur) => ({
            ...acc,
            [cur]: t('RmgStyle.' + cur),
        }),
        {}
    );

    const canvasSelections = canvasConfig[rmgStyle].map(canvas => ({
        label: t('CanvasType.' + canvas),
        value: canvas,
    }));

    const handleStyleChange = (style: RmgStyle) => {
        dispatch(setStyle(style));
    };

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('Style'),
            value: rmgStyle,
            options: styleSelections,
            onChange: value => handleStyleChange(value as RmgStyle),
        },
        {
            type: 'custom',
            label: t('View'),
            component: (
                <RmgMultiSelect
                    displayValue={t('Select canvas')}
                    selections={canvasSelections}
                    defaultValue={canvasToShow}
                    onChange={value => dispatch(setCanvasToShow(value as CanvasType[]))}
                />
            ),
        },
        {
            type: 'slider',
            label: t('Canvas scale'),
            value: canvasScale,
            min: 0.1,
            max: 2,
            step: 0.1,
            onChange: value => dispatch(setCanvasScale(value)),
            leftIcon: <MdZoomOut />,
            rightIcon: <MdZoomIn />,
        },
    ];

    return (
        <RmgPageHeader>
            <RmgFields fields={fields} minW={160} />

            <HeaderActions />
        </RmgPageHeader>
    );
}
