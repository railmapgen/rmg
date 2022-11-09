import React, { useEffect, useRef, useState } from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useSearchParams } from 'react-router-dom';
import { Container, Heading, HStack, SystemStyleObject, useOutsideClick, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, LocalStorageKey, ParamConfig } from '../../constants/constants';
import ParamSelector from '../param-selector-view/param-selector';
import { getParamRegistry } from '../../util/param-manager-utils';
import SelectorActions from './selector-actions';

const paramSelectorCardStyle: SystemStyleObject = {
    flexDirection: 'column',
    p: 2,

    h3: {
        m: 2,
    },

    '& > div': {
        m: 2,
        flexWrap: 'wrap',

        '& > div:last-of-type': {
            alignSelf: 'flex-end',

            '& button': {
                w: '100%',
            },
        },
    },
};

export default function ParamSelectorView() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const urlParamId = searchParams.get('project');

    const [paramRegistry, setParamRegistry] = useState<ParamConfig[]>([]);
    const [selectedParam, setSelectedParam] = useState<string>();
    const selectorRef = useRef<HTMLDivElement>(null);

    const toast = useToast();

    useEffect(() => {
        // init paramRegistry state once
        setParamRegistry(getParamRegistry());
    }, []);

    useOutsideClick({ ref: selectorRef, handler: () => setSelectedParam(undefined) });

    const handleDelete = (id: string) => {
        window.localStorage.removeItem(LocalStorageKey.PARAM_BY_ID + id);
        window.localStorage.removeItem(LocalStorageKey.PARAM_CONFIG_BY_ID + id);

        setSelectedParam(undefined);
        setParamRegistry(getParamRegistry());

        rmgRuntime.event(Events.REMOVE_PARAM, {});
    };

    const handleError = (message: string) => {
        toast({ description: message, status: 'error', duration: 10000, isClosable: true });
    };

    return (
        <RmgPage justifyContent="center">
            {urlParamId && <RmgLoader isIndeterminate />}
            <Container>
                <RmgCard sx={paramSelectorCardStyle}>
                    <Heading as="h3" size="lg">
                        {t('Saved projects')}
                    </Heading>

                    <HStack ref={selectorRef}>
                        <ParamSelector
                            paramRegistry={paramRegistry}
                            selectedParam={selectedParam}
                            onParamSelect={setSelectedParam}
                            onParamRemove={handleDelete}
                        />

                        <SelectorActions
                            selectedParam={selectedParam}
                            disableNew={paramRegistry.length >= 10}
                            onError={handleError}
                        />
                    </HStack>
                </RmgCard>
            </Container>
        </RmgPage>
    );
}
