import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function BranchSection() {
    const { t } = useTranslation();

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('BranchSidePanel.branch.title')}
            </Heading>
        </Box>
    );
}
