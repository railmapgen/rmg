import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import RmgFields, { RmgFieldsFields } from '../../common/rmg-fields';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../redux';
import { canvasConfig, RmgStyle } from '../../../constants/constants';
import {
    setBranchSpacing,
    setDirectionIndicatorX,
    setDirectionIndicatorY,
    setPaddingPercentage,
    setSvgHeight,
    setSvgWidth,
    setYPercentage,
} from '../../../redux/param/action';

export default function LayoutSection() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        style: rmgStyle,
        svgWidth,
        svg_height,
        y_pc,
        branch_spacing,
        padding,
        direction_gz_x,
        direction_gz_y,
    } = useAppSelector(state => state.param);

    const svgSizeFields: RmgFieldsFields[] = [
        ...canvasConfig[rmgStyle].map<RmgFieldsFields>(canvas => ({
            type: 'input',
            label: t(`StyleSidePanel.${canvas}Width`),
            value: svgWidth[canvas].toString(),
            onChange: val => dispatch(setSvgWidth(Number(val), canvas)),
        })),
        {
            type: 'input',
            label: t('StyleSidePanel.canvasHeight'),
            value: svg_height.toString(),
            onChange: val => dispatch(setSvgHeight(Number(val))),
        },
    ];

    const componentPositionFields: RmgFieldsFields[] = [
        {
            type: 'slider',
            label: t('StyleSidePanel.verticalPosition'),
            value: y_pc,
            min: 0,
            max: 100,
            onChange: val => dispatch(setYPercentage(val)),
            enabledStyles: [RmgStyle.MTR, RmgStyle.GZMTR],
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.branchSpacing'),
            value: branch_spacing,
            min: 0,
            max: 100,
            onChange: val => dispatch(setBranchSpacing(val)),
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.padding'),
            value: padding,
            min: 0,
            max: 100,
            onChange: val => dispatch(setPaddingPercentage(val)),
        },
    ];

    const directionPositionFields: RmgFieldsFields[] = [
        {
            type: 'slider',
            label: 'Direction horizontal position',
            value: direction_gz_x,
            min: 0,
            max: 100,
            onChange: val => dispatch(setDirectionIndicatorX(val)),
            enabledStyles: [RmgStyle.GZMTR],
        },
        {
            type: 'slider',
            label: 'Direction vertical position',
            value: direction_gz_y,
            min: 0,
            max: 100,
            onChange: val => dispatch(setDirectionIndicatorY(val)),
            enabledStyles: [RmgStyle.GZMTR],
        },
    ];

    return (
        <Box>
            <Heading as="h5" size="sm">
                Layout
            </Heading>

            <RmgFields fields={svgSizeFields} />
            <RmgFields fields={componentPositionFields} />
            <RmgFields fields={directionPositionFields} />
        </Box>
    );
}
