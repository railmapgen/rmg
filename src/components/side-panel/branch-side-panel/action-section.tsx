import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading, HStack } from '@chakra-ui/react';
import { MdCached, MdFilter1, MdRotateLeft, MdRotateRight } from 'react-icons/md';
import AutoNumModal from '../../modal/auto-num-modal';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { Direction, Events, RmgStyle } from '../../../constants/constants';
import { reverseStations, rotateStations } from '../../../redux/param/action';
import ConnectDisconnectCard from './connect-disconnect-card';
import rmgRuntime from '@railmapgen/rmg-runtime';

export default function ActionSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { style, loop } = useRootSelector(state => state.param);
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const [isAutoNumModalOpen, setIsAutoNumModalOpen] = useState(false);

    const handleReverseStations = () => {
        dispatch(reverseStations(style === RmgStyle.SHMetro));
        rmgRuntime.event(Events.REVERSE_STATIONS, { style });
    };

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('BranchSidePanel.action.title')}
            </Heading>

            <Flex
                wrap="wrap"
                sx={{
                    p: 1,

                    '&> *': {
                        flexShrink: 0,
                        flexBasis: '100%',

                        '&:not(:first-of-type), &:not(button)': {
                            marginTop: 2,
                        },
                    },
                }}
            >
                {selectedBranch !== 0 && style !== RmgStyle.SHMetro && (
                    <>
                        <Heading as="h6" size="xs">
                            {t('Branch left end')}
                        </Heading>
                        <ConnectDisconnectCard direction={Direction.left} />
                        <Heading as="h6" size="xs">
                            {t('Branch right end')}
                        </Heading>
                        <ConnectDisconnectCard direction={Direction.right} />
                    </>
                )}

                {style === RmgStyle.GZMTR && (
                    <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<MdFilter1 />}
                        alignSelf="flex-end"
                        onClick={() => setIsAutoNumModalOpen(true)}
                    >
                        {t('BranchSidePanel.action.autoNum')}
                    </Button>
                )}

                <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<MdCached />}
                    alignSelf="flex-end"
                    onClick={handleReverseStations}
                >
                    {style === RmgStyle.SHMetro
                        ? t('BranchSidePanel.action.flip')
                        : t('BranchSidePanel.action.reverse')}
                </Button>

                {loop && style === RmgStyle.GZMTR && (
                    <HStack>
                        <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<MdRotateLeft />}
                            onClick={() => dispatch(rotateStations(false))}
                            flex={1}
                        >
                            {t('Rotate anticlockwise')}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<MdRotateRight />}
                            onClick={() => dispatch(rotateStations(true))}
                            flex={1}
                        >
                            {t('Rotate clockwise')}
                        </Button>
                    </HStack>
                )}
            </Flex>

            <AutoNumModal isOpen={isAutoNumModalOpen} onClose={() => setIsAutoNumModalOpen(false)} />
        </Box>
    );
}
