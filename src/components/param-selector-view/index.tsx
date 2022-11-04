import React, { useRef, useState } from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { useSearchParams } from 'react-router-dom';
import { Button, Container, Heading, HStack, SystemStyleObject, useOutsideClick, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdAdd, MdOpenInBrowser } from 'react-icons/md';
import { nanoid } from 'nanoid';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, LocalStorageKey } from '../../constants/constants';
import { useRootDispatch } from '../../redux';
import { removeParam } from '../../redux/app/app-slice';
import ParamSelector from '../param-selector-view/param-selector';

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

    const [searchParams, setSearchParams] = useSearchParams();
    const urlParamId = searchParams.get('project');

    const dispatch = useRootDispatch();
    const [selectedParam, setSelectedParam] = useState<string>();
    const selectorRef = useRef<HTMLDivElement>(null);

    useOutsideClick({ ref: selectorRef, handler: () => setSelectedParam(undefined) });

    const handleNew = () => {
        setSearchParams({ project: nanoid() });
        rmgRuntime.event(Events.NEW_PARAM, {});
    };

    const handleOpen = () => {
        if (selectedParam) {
            setSearchParams({ project: selectedParam });
            rmgRuntime.event(Events.OPEN_PARAM, {});
        }
    };

    const handleDelete = (id: string) => {
        setSelectedParam(undefined);
        dispatch(removeParam(id));
        window.localStorage.removeItem(LocalStorageKey.PARAM_BY_ID + id);
        rmgRuntime.event(Events.REMOVE_PARAM, {});
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
                            selectedParam={selectedParam}
                            onParamSelect={setSelectedParam}
                            onParamRemove={handleDelete}
                        />

                        <VStack>
                            <Button leftIcon={<MdAdd />} onClick={handleNew}>
                                {t('Blank project')}
                            </Button>
                            <Button
                                leftIcon={<MdOpenInBrowser />}
                                onClick={handleOpen}
                                isDisabled={selectedParam === undefined}
                            >
                                {t('Open project')}
                            </Button>
                        </VStack>
                    </HStack>
                </RmgCard>
            </Container>
        </RmgPage>
    );
}
