import classes from './page-header.module.css';
import HeaderActions from './header-actions';
import { setCanvasScale } from '../../redux/app/app-slice';
import { RmgStyle } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setStyle } from '../../redux/param/param-slice';
import { RMLabelledSlider, RMPageHeader } from '@railmapgen/mantine-components';
import { ActionIcon, Box, Group, Menu, NativeSelect, Popover, Slider } from '@mantine/core';
import { MdOutlineCheck, MdOutlineStyle, MdOutlineZoomIn, MdOutlineZoomOut } from 'react-icons/md';

export default function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { canvasScale } = useRootSelector(state => state.app);
    const rmgStyle = useRootSelector(state => state.param.style);

    const styleSelections = Object.values(RmgStyle).map(value => ({ value, label: t('RmgStyle.' + value) }));

    const handleStyleChange = (value: RmgStyle) => {
        dispatch(setStyle(value));
    };

    return (
        <RMPageHeader>
            <Group flex={1} gap="xs" align="flex-end">
                <NativeSelect
                    visibleFrom="xs"
                    label={t('Style')}
                    value={rmgStyle}
                    data={styleSelections}
                    onChange={({ currentTarget: { value } }) => handleStyleChange(value as RmgStyle)}
                />

                <Box visibleFrom="xs">
                    <RMLabelledSlider
                        fieldLabel={t('Canvas scale')}
                        size="sm"
                        defaultValue={canvasScale}
                        min={0.1}
                        max={2}
                        step={0.01}
                        onChangeEnd={value => dispatch(setCanvasScale(value))}
                        withExternalControls
                        leftIcon={<MdOutlineZoomOut />}
                        leftIconLabel={t('Zoom out')}
                        rightIcon={<MdOutlineZoomIn />}
                        rightIconLabel={t('Zoom in')}
                        style={{ minWidth: 150 }}
                    />
                </Box>

                <ActionIcon.Group hiddenFrom="xs">
                    <Menu>
                        <Menu.Target>
                            <ActionIcon
                                variant="default"
                                className={classes['mobile-action-icon']}
                                aria-label={t('Style')}
                                title={t('Style')}
                            >
                                <MdOutlineStyle />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {styleSelections.map(({ value, label }) => (
                                <Menu.Item
                                    key={value}
                                    value={value}
                                    onClick={() => handleStyleChange(value)}
                                    leftSection={rmgStyle === value ? <MdOutlineCheck /> : undefined}
                                >
                                    {label}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>
                    <Popover>
                        <Popover.Target>
                            <ActionIcon
                                variant="default"
                                className={classes['mobile-action-icon']}
                                aria-label={t('Canvas scale')}
                            >
                                <MdOutlineZoomIn />
                            </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Slider
                                size="sm"
                                defaultValue={canvasScale}
                                min={0.1}
                                max={2}
                                step={0.01}
                                onChangeEnd={value => dispatch(setCanvasScale(value))}
                                style={{ minWidth: 150 }}
                            />
                        </Popover.Dropdown>
                    </Popover>
                </ActionIcon.Group>

                <HeaderActions />
            </Group>
        </RMPageHeader>
    );
}
