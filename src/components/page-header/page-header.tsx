import React from 'react';
import { Flex } from '@chakra-ui/react';
import HeaderActions from './header-actions';
import RmgButtonGroup from '../common/rmg-button-group';
import { selectCanvas } from '../../redux/app/action';
import { AllCanvas, canvasConfig, CanvasType } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux';
import { RmgLabel } from '@railmapgen/rmg-components';

export default function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const canvasToShow = useAppSelector(state => state.app.canvasToShow);
    const style = useAppSelector(state => state.param.style);

    const canvasSelections = [AllCanvas, ...canvasConfig[style]].map(canvas => ({
        label: t('CanvasType.' + canvas),
        value: canvas,
    }));

    return (
        <Flex align="center" wrap="wrap" pl={2} pr={3}>
            <RmgLabel label={t('Canvas to show')}>
                <RmgButtonGroup
                    selections={canvasSelections}
                    defaultValue={canvasToShow}
                    onChange={canvas => dispatch(selectCanvas(canvas as CanvasType | typeof AllCanvas))}
                />
            </RmgLabel>

            <HeaderActions />
        </Flex>
    );
}
