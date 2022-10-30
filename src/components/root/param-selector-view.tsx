import React from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useSearchParams } from 'react-router-dom';
import { getParamMap } from '../../util/param-manager-utils';
import { nanoid } from 'nanoid';
import { Button, Container, Heading } from '@chakra-ui/react';

export default function ParamSelectorView() {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlParamId = searchParams.get('w');

    const handleStart = () => {
        const paramMap = getParamMap();
        const paramIds = Object.keys(paramMap);
        console.log('initParamStore():: Param with ID in localStorage:', paramIds);

        const paramId = paramIds[0] ?? nanoid();
        setSearchParams({ w: paramId });
    };

    return (
        <RmgPage justifyContent="center">
            {urlParamId && <RmgLoader isIndeterminate />}
            <Container>
                <RmgCard direction="column">
                    <Heading as="h2" size="xl">
                        Saved works
                    </Heading>

                    <Button onClick={handleStart}>Open</Button>
                </RmgCard>
            </Container>
        </RmgPage>
    );
}
