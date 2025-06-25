import { useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import LayoutSection from './layout-section';
import DesignSection from './design-section';
import LoopSection from './loop-section';
import GZMTRNoteSection from './gzmtr-note-section';
import { Divider, Stack } from '@mantine/core';

export default function StyleSidePanel() {
    const { style } = useRootSelector(state => state.param);

    return (
        <Stack gap="xs">
            <LayoutSection />

            <Divider />

            <DesignSection />

            {[RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) && (
                <>
                    <Divider />

                    <LoopSection />
                </>
            )}

            {style === RmgStyle.GZMTR && (
                <>
                    <Divider />

                    <GZMTRNoteSection />
                </>
            )}
        </Stack>
    );
}
