import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import { MdFilter1 } from 'react-icons/md';
import AutoNumModal from '../../modal/auto-num-modal';
import { useAppSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';

export default function ActionSection() {
    const { t } = useTranslation();

    const style = useAppSelector(state => state.param.style);

    const [isAutoNumModalOpen, setIsAutoNumModalOpen] = useState(false);

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('BranchSidePanel.action.title')}
            </Heading>

            <HStack>
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
            </HStack>

            <AutoNumModal isOpen={isAutoNumModalOpen} onClose={() => setIsAutoNumModalOpen(false)} />
        </Box>
    );
}
