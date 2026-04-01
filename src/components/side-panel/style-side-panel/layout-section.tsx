import classes from '../side-panel.module.css';
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
} from '../../../redux/param/param-slice';
import {
    MdOutlineAdd,
    MdOutlineArrowDropDown,
    MdOutlineArrowDropUp,
    MdOutlineArrowLeft,
    MdOutlineArrowRight,
    MdOutlineRemove,
} from 'react-icons/md';
import { RMLabelledSlider, RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Group, NumberInput, Title } from '@mantine/core';
import clsx from 'clsx';

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

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('StyleSidePanel.layout.title')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Group gap="xs">
                    {...canvasConfig[rmgStyle].map(canvas => (
                        <NumberInput
                            key={canvas}
                            label={t(`StyleSidePanel.layout.${canvas}Width`)}
                            value={svgWidth[canvas]}
                            onChange={value => dispatch(setSvgWidth({ width: Number(value), canvas }))}
                        />
                    ))}
                    <NumberInput
                        label={t('StyleSidePanel.layout.canvasHeight')}
                        value={svg_height}
                        onChange={value => dispatch(setSvgHeight(Number(value)))}
                    />
                </Group>
                <Group gap="xs">
                    {[RmgStyle.MTR, RmgStyle.GZMTR].includes(rmgStyle) && (
                        <RMLabelledSlider
                            fieldLabel={t('StyleSidePanel.layout.verticalPosition')}
                            defaultValue={y_pc}
                            min={0}
                            max={100}
                            step={0.01}
                            onChangeEnd={value => dispatch(setYPercentage(value))}
                            withExternalControls
                            leftIcon={<MdOutlineArrowDropUp />}
                            leftIconLabel={t('Move up')}
                            rightIcon={<MdOutlineArrowDropDown />}
                            rightIconLabel={t('Move down')}
                        />
                    )}
                    <RMLabelledSlider
                        fieldLabel={
                            !loop
                                ? t('Branch spacing')
                                : rmgStyle === RmgStyle.GZMTR
                                  ? t('StyleSidePanel.layout.loopSpacing')
                                  : t('StyleSidePanel.layout.branchSpacingLoop')
                        }
                        defaultValue={branchSpacingPct}
                        min={0}
                        max={loop ? 50 : 100}
                        step={0.01}
                        onChangeEnd={value => dispatch(setBranchSpacingPct(value))}
                        withExternalControls
                        leftIcon={<MdOutlineRemove />}
                        leftIconLabel={t('Decrease')}
                        rightIcon={<MdOutlineAdd />}
                        rightIconLabel={t('Increase')}
                    />
                    <RMLabelledSlider
                        fieldLabel={t('StyleSidePanel.layout.padding')}
                        defaultValue={padding}
                        min={0}
                        max={50}
                        step={0.01}
                        onChangeEnd={value => dispatch(setPaddingPercentage(value))}
                        withExternalControls
                        leftIcon={<MdOutlineRemove />}
                        leftIconLabel={t('Decrease')}
                        rightIcon={<MdOutlineAdd />}
                        rightIconLabel={t('Increase')}
                    />
                </Group>
                {rmgStyle === RmgStyle.GZMTR && (
                    <Group gap="xs">
                        <RMLabelledSlider
                            fieldLabel={t('StyleSidePanel.layout.directionGzX')}
                            defaultValue={direction_gz_x}
                            min={0}
                            max={100}
                            step={0.01}
                            onChangeEnd={value => dispatch(setDirectionIndicatorX(value))}
                            withExternalControls
                            leftIcon={<MdOutlineArrowLeft />}
                            leftIconLabel={t('Move left')}
                            rightIcon={<MdOutlineArrowRight />}
                            rightIconLabel={t('Move right')}
                        />
                        <RMLabelledSlider
                            fieldLabel={t('StyleSidePanel.layout.directionGzY')}
                            defaultValue={direction_gz_y}
                            min={0}
                            max={100}
                            step={0.01}
                            onChangeEnd={value => dispatch(setDirectionIndicatorY(value))}
                            withExternalControls
                            leftIcon={<MdOutlineArrowDropUp />}
                            leftIconLabel={t('Move up')}
                            rightIcon={<MdOutlineArrowDropDown />}
                            rightIconLabel={t('Move down')}
                        />
                    </Group>
                )}
            </RMSectionBody>
        </RMSection>
    );
}
