import React, { useRef, useState } from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useSearchParams } from 'react-router-dom';
import { getParamMap } from '../../util/param-manager-utils';
import { nanoid } from 'nanoid';
import { Button, Container, Flex, Heading, HStack, useOutsideClick, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function ParamSelectorView() {
    const { t } = useTranslation();

    const [searchParams, setSearchParams] = useSearchParams();
    const urlParamId = searchParams.get('project');

    const [selectedParam, setSelectedParam] = useState<string>();
    const selectorRef = useRef<HTMLDivElement>(null);

    useOutsideClick({ ref: selectorRef, handler: () => setSelectedParam(undefined) });

    const paramMap = getParamMap();

    const handleStart = () => {
        setSearchParams({ project: selectedParam ?? nanoid() });
    };

    return (
        <RmgPage justifyContent="center">
            {urlParamId && <RmgLoader isIndeterminate />}
            <Container>
                <RmgCard direction="column">
                    <Heading as="h3" size="lg" m={2}>
                        {t('Saved projects')}
                    </Heading>

                    <HStack ref={selectorRef} m={2} flexWrap="wrap">
                        <Flex direction="column" w={300} h={200}>
                            {Object.keys(paramMap).map(id => (
                                <Button
                                    colorScheme={selectedParam === id ? 'primary' : undefined}
                                    variant={selectedParam === id ? 'solid' : 'ghost'}
                                    size="sm"
                                    key={id}
                                    onClick={() => setSelectedParam(id)}
                                >
                                    {t('Project ID')}: {id}
                                </Button>
                            ))}
                        </Flex>

                        <VStack flex={1} alignItems="flex-end" alignSelf="flex-end">
                            <Button onClick={handleStart}>
                                {selectedParam ? t('Open project') : t('New project')}
                            </Button>
                        </VStack>
                    </HStack>
                </RmgCard>
            </Container>
        </RmgPage>
    );
}
