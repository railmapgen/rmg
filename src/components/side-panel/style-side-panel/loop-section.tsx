import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setLoop } from '../../../redux/param/param-slice';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { MdSettings } from 'react-icons/md';
import { SidePanelMode } from '../../../constants/constants';
import { setSelectedBranch, setSidePanelMode } from '../../../redux/app/app-slice';

export default function LoopSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { loop } = useRootSelector(state => state.param);

    const fields: RmgFieldsField[] = [
        {
            type: 'switch',
            label: t('StyleSidePanel.loop.isLoop'),
            isChecked: loop,
            onChange: checked => dispatch(setLoop(checked)),
            minW: 'full',
            oneLine: true,
        },
    ];

    const handleOpenMoreSettings = () => {
        dispatch(setSelectedBranch(0));
        dispatch(setSidePanelMode(SidePanelMode.BRANCH));
    };

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('Loop line')}
            </Heading>

            <RmgFields fields={fields} />
            <Flex p={1}>
                <Button size="sm" variant="outline" leftIcon={<MdSettings />} onClick={handleOpenMoreSettings} flex={1}>
                    {t('More settings')}
                </Button>
            </Flex>
        </Box>
    );
}
