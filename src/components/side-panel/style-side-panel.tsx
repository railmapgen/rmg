import { Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import EditableStack, { EditableField } from './editable-stack';
import { useAppSelector } from '../../redux';
import { useDispatch } from 'react-redux';
import {
    setBranchSpacing,
    setPaddingPercentage,
    setSvgHeight,
    setSvgWidth,
    setYPercentage,
} from '../../redux/param/action';
import { canvasConfig } from '../../constants/constants';
import { useTranslation } from 'react-i18next';

export default function StyleSidePanel() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        style: rmgStyle,
        svgWidth,
        svg_height,
        y_pc,
        branch_spacing,
        padding,
    } = useAppSelector(state => state.param);

    const svgSizeFields: EditableField[] = [
        ...canvasConfig[rmgStyle].map<EditableField>(canvas => ({
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

    const componentPositionFields: EditableField[] = [
        {
            type: 'slider',
            label: t('StyleSidePanel.verticalPosition'),
            value: y_pc,
            min: 0,
            max: 100,
            onChange: val => dispatch(setYPercentage(val)),
            minW: 180,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.branchSpacing'),
            value: branch_spacing,
            min: 0,
            max: 100,
            onChange: val => dispatch(setBranchSpacing(val)),
            minW: 180,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.padding'),
            value: padding,
            min: 0,
            max: 100,
            onChange: val => dispatch(setPaddingPercentage(val)),
            minW: 180,
        },
    ];

    return (
        <Flex direction="column" p={1}>
            <EditableStack fields={svgSizeFields} />

            <Divider />

            <EditableStack fields={componentPositionFields} />

            <Divider />
        </Flex>
    );
}
