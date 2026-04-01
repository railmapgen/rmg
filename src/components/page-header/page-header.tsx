import HeaderActions from './header-actions';
import { setCanvasScale } from '../../redux/app/app-slice';
import { RmgStyle } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setStyle } from '../../redux/param/param-slice';
import { RMLabelledSlider, RMPageHeader } from '@railmapgen/mantine-components';
import { Group, NativeSelect } from '@mantine/core';
import { ChangeEvent } from 'react';
import { MdOutlineZoomIn, MdOutlineZoomOut } from 'react-icons/md';

export default function PageHeader() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { canvasScale } = useRootSelector(state => state.app);
    const rmgStyle = useRootSelector(state => state.param.style);

    const styleSelections = Object.values(RmgStyle).map(value => ({ value, label: t('RmgStyle.' + value) }));

    const handleStyleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStyle(event.currentTarget.value as RmgStyle));
    };

    return (
        <RMPageHeader>
            <Group flex={1} gap="xs" align="flex-end">
                <NativeSelect label={t('Style')} value={rmgStyle} data={styleSelections} onChange={handleStyleChange} />
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

                <HeaderActions />
            </Group>
        </RMPageHeader>
    );
}
