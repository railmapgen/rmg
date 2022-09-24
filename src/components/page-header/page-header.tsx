import React from 'react';
import HeaderActions from './header-actions';
import { setCanvasScale, setCanvasToShow } from '../../redux/app/app-slice';
import { AllCanvas, canvasConfig, CanvasType, RmgStyle } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgButtonGroup, RmgFields, RmgFieldsField, RmgPageHeader } from '@railmapgen/rmg-components';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { setStyle } from '../../redux/param/action';
import { useNavigate } from 'react-router-dom';

export default function PageHeader() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useRootDispatch();

    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const rmgStyle = useRootSelector(state => state.param.style);

    const styleSelections = Object.values(RmgStyle).map(style => ({
        label: t('RmgStyle.' + style),
        value: style,
    }));

    const canvasSelections = [AllCanvas, ...canvasConfig[rmgStyle]].map(canvas => ({
        label: t('CanvasType.' + canvas),
        value: canvas,
    }));

    const handleStyleChange = (style: RmgStyle) => {
        navigate('/' + style);
        dispatch(setStyle(style));
    };

    const fields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('Style'),
            component: (
                <RmgButtonGroup selections={styleSelections} defaultValue={rmgStyle} onChange={handleStyleChange} />
            ),
        },
        {
            type: 'custom',
            label: t('View'),
            component: (
                <RmgButtonGroup
                    selections={canvasSelections}
                    defaultValue={canvasToShow}
                    onChange={canvas => dispatch(setCanvasToShow(canvas as CanvasType | typeof AllCanvas))}
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
            minW: 160,
        },
    ];

    return (
        <RmgPageHeader>
            <RmgFields fields={fields} />

            <HeaderActions />
        </RmgPageHeader>
    );
}
