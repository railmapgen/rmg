import { useEffect, useRef, useState } from 'react';
import { RmgCard, RmgLoader, RmgPage } from '@railmapgen/rmg-components';
import { Container, Flex, Heading, SystemStyleObject, useOutsideClick, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Events, LocalStorageKey, ParamConfig } from '../../constants/constants';
import ParamSelector from '../param-selector-view/param-selector';
import { getParamRegistry } from '../../util/param-manager-utils';
import SelectorActions from './selector-actions';
import useRootSearchParams from '../../hooks/use-root-search-params';
import { updateTitle } from '../../util/metadata-utils';

const paramSelectorCardStyle: SystemStyleObject = {
    flexDirection: 'column',
    p: 2,

    h3: {
        m: 2,
    },

    '& > div': {
        m: 2,
        flexWrap: 'wrap',
        flexDirection: { base: 'column', md: 'row' },
    },
};

interface ParamSelectorViewProps {
    downloading?: string;
}

export default function ParamSelectorView(props: ParamSelectorViewProps) {
    const { downloading } = props;
    const { t } = useTranslation();

    const [searchParams] = useRootSearchParams();
    const urlParamId = searchParams.get('project');

    const [paramRegistry, setParamRegistry] = useState<ParamConfig[]>([]);
    const [selectedParam, setSelectedParam] = useState<string>();
    const selectorRef = useRef<HTMLDivElement>(null);

    const toast = useToast();

    useEffect(() => {
        updateTitle(t('Manage projects'));
    }, []);

    useEffect(() => {
        // init paramRegistry state on mount and when external project is downloaded
        setParamRegistry(getParamRegistry());
    }, [downloading]);

    useOutsideClick({ ref: selectorRef, handler: () => setSelectedParam(undefined) });

    const handleUpdate = (config: ParamConfig) => {
        const { id, name, lastModified } = config;
        if (id) {
            rmgRuntime.storage.set(LocalStorageKey.PARAM_CONFIG_BY_ID + id, JSON.stringify({ name, lastModified }));

            setSelectedParam(undefined);
            setParamRegistry(getParamRegistry());

            rmgRuntime.event(Events.UPDATE_PARAM_CONFIG, {});
        }
    };

    const handleDelete = (id: string) => {
        rmgRuntime.storage.remove(LocalStorageKey.PARAM_BY_ID + id);
        rmgRuntime.storage.remove(LocalStorageKey.PARAM_CONFIG_BY_ID + id);

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

                    <Flex ref={selectorRef}>
                        <ParamSelector
                            paramRegistry={paramRegistry}
                            downloading={downloading}
                            selectedParam={selectedParam}
                            onParamSelect={setSelectedParam}
                            onParamRemove={handleDelete}
                            onParamUpdate={handleUpdate}
                        />

                        <SelectorActions
                            selectedParam={selectedParam}
                            disableNew={paramRegistry.length >= 10}
                            onError={handleError}
                        />
                    </Flex>
                </RmgCard>
            </Container>
        </RmgPage>
    );
}
