import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { MdCached, MdFilter1 } from 'react-icons/md';
import AutoNumModal from '../../modal/auto-num-modal';
import { useAppDispatch, useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { reverseStations } from '../../../redux/param/action';

export default function ActionSection() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const style = useAppSelector(state => state.param.style);

    const [isAutoNumModalOpen, setIsAutoNumModalOpen] = useState(false);

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

                        '&:not(:first-child)': {
                            marginTop: 2,
                        },
                    },
                }}
            >
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
                    onClick={() => dispatch(reverseStations(style === RmgStyle.SHMetro))}
                >
                    {style === RmgStyle.SHMetro
                        ? t('BranchSidePanel.action.flip')
                        : t('BranchSidePanel.action.reverse')}
                </Button>
            </Flex>

            <AutoNumModal isOpen={isAutoNumModalOpen} onClose={() => setIsAutoNumModalOpen(false)} />
        </Box>
    );
}
