import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { canvasConfig, RmgStyle } from '../../../constants/constants';
import {
    setBranchSpacingPct,
    setDirectionIndicatorX,
    setDirectionIndicatorY,
    setPaddingPercentage,
    setSvgHeight,
    setSvgWidth,
    setYPercentage,
} from '../../../redux/param/action';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { MdAdd, MdArrowDropDown, MdArrowDropUp, MdArrowLeft, MdArrowRight, MdRemove } from 'react-icons/md';

export default function LayoutSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const {
        style: rmgStyle,
        svgWidth,
        svg_height,
        y_pc,
        branchSpacingPct,
        padding,
        direction_gz_x,
        direction_gz_y,
        loop,
    } = useRootSelector(state => state.param);

    const fields: RmgFieldsField[] = [
        ...canvasConfig[rmgStyle].map<RmgFieldsField>(canvas => ({
            type: 'input',
            label: t(`StyleSidePanel.layout.${canvas}Width`),
            value: svgWidth[canvas].toString(),
            onChange: val => dispatch(setSvgWidth(Number(val), canvas)),
        })),
        {
            type: 'input',
            label: t('StyleSidePanel.layout.canvasHeight'),
            value: svg_height.toString(),
            onChange: val => dispatch(setSvgHeight(Number(val))),
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.layout.verticalPosition'),
            value: y_pc,
            min: 0,
            max: 100,
            onChange: val => dispatch(setYPercentage(val)),
            leftIcon: <MdArrowDropUp />,
            rightIcon: <MdArrowDropDown />,
            hidden: ![RmgStyle.MTR, RmgStyle.GZMTR].includes(rmgStyle),
        },
        {
            type: 'slider',
            label: !loop ? t('Branch spacing') : t('StyleSidePanel.layout.branchSpacingLoop'),
            value: branchSpacingPct,
            min: 0,
            max: loop ? 50 : 100,
            onChange: val => dispatch(setBranchSpacingPct(val)),
            leftIcon: <MdRemove />,
            rightIcon: <MdAdd />,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.layout.padding'),
            value: padding,
            min: 0,
            max: 50,
            onChange: val => dispatch(setPaddingPercentage(val)),
            leftIcon: <MdRemove />,
            rightIcon: <MdAdd />,
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.layout.directionGzX'),
            value: direction_gz_x,
            min: 0,
            max: 100,
            onChange: val => dispatch(setDirectionIndicatorX(val)),
            leftIcon: <MdArrowLeft />,
            rightIcon: <MdArrowRight />,
            hidden: ![RmgStyle.GZMTR].includes(rmgStyle),
        },
        {
            type: 'slider',
            label: t('StyleSidePanel.layout.directionGzY'),
            value: direction_gz_y,
            min: 0,
            max: 100,
            onChange: val => dispatch(setDirectionIndicatorY(val)),
            leftIcon: <MdArrowDropUp />,
            rightIcon: <MdArrowDropDown />,
            hidden: ![RmgStyle.GZMTR].includes(rmgStyle),
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StyleSidePanel.layout.title')}
            </Heading>

            <RmgFields fields={fields} minW={130} />
        </Box>
    );
}
