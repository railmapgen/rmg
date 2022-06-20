import React from 'react';
import { Flex } from '@chakra-ui/react';
import HeaderActions from './header-actions';
import RmgButtonGroup from '../common/rmg-button-group';
import { selectCanvas, zoomToScale } from '../../redux/app/app-slice';
import { AllCanvas, canvasConfig, CanvasType } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

export default function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { canvasToShow, canvasScale } = useRootSelector(state => state.app);
    const style = useRootSelector(state => state.param.style);

    const canvasSelections = [AllCanvas, ...canvasConfig[style]].map(canvas => ({
        label: t('CanvasType.' + canvas),
        value: canvas,
    }));

    const fields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('Canvas to show'),
            component: (
                <RmgButtonGroup
                    selections={canvasSelections}
                    defaultValue={canvasToShow}
                    onChange={canvas => dispatch(selectCanvas(canvas as CanvasType | typeof AllCanvas))}
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
            onChange: value => dispatch(zoomToScale(value)),
            leftIcon: <MdZoomOut />,
            rightIcon: <MdZoomIn />,
            minW: 160,
        },
    ];

    return (
        <Flex align="center" wrap="wrap" pl={2} pr={3} py={1}>
            <RmgFields fields={fields} />

            <HeaderActions />
        </Flex>
    );
}
