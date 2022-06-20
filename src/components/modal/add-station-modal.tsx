import React, { useEffect, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgStyle, SidePanelMode } from '../../constants/constants';
import { isColineBranch } from '../../redux/param/coline-action';
import { useTranslation } from 'react-i18next';
import { addStationToExistingBranch } from '../../redux/param/add-station-action';
import { setSelectedStation, setSidePanelMode } from '../../redux/app/app-slice';

interface AddStationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddStationModal(props: AddStationModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const [where, setWhere] = useState(selectedBranch);
    const [preposition, setPreposition] = useState<'before' | 'after'>('before');
    const [pivot, setPivot] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        setWhere(selectedBranch);
    }, [selectedBranch]);

    useEffect(() => {
        if (!isOpen) {
            setError(false);
        }
    }, [isOpen]);

    const selectableStations = branches[Number(where)]?.slice(1, -1) ?? [];

    const getStationOptions = (stationIdList: string[]): Record<string, string> => {
        return stationIdList.reduce(
            (acc, cur) => ({
                ...acc,
                [cur]: stationList[cur]?.name.join(' - '),
            }),
            { '': t('AddStationModal.pleaseSelect') }
        );
    };

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('AddStationModal.where'),
            value: where,
            options: {
                ...branches.reduce(
                    (acc, cur, idx) => ({
                        ...acc,
                        [idx]:
                            idx === 0
                                ? t('AddStationModal.main')
                                : style !== RmgStyle.SHMetro || !isColineBranch(cur, stationList)
                                ? t('AddStationModal.branch') + ' ' + idx
                                : t('AddStationModal.external') + ' ' + idx,
                    }),
                    {}
                ),
            },
            onChange: value => handleSelectWhere(value as number),
            minW: 'full',
        },
        {
            type: 'select',
            label: t('AddStationModal.preposition'),
            value: preposition,
            options: {
                before: t('AddStationModal.before'),
                after: t('AddStationModal.after'),
            },
            onChange: value => setPreposition(value as 'before' | 'after'),
        },
        {
            type: 'select',
            label: t('AddStationModal.pivot'),
            value: pivot,
            options: getStationOptions(selectableStations),
            disabledOptions: [''],
            onChange: value => setPivot(value as string),
        },
    ];

    const handleSelectWhere = (value: number) => {
        setWhere(value);
        setPivot('');
    };

    const handleSubmit = () => {
        const result = dispatch(addStationToExistingBranch(where, preposition, pivot));
        if (result) {
            onClose();

            dispatch(setSelectedStation(result));
            dispatch(setSidePanelMode(SidePanelMode.STATION));
        } else {
            console.log('false here');
            setError(true);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                {error && (
                    <Alert status="error" variant="solid" size="xs">
                        <AlertIcon />
                        {t('AddStationModal.error')}
                    </Alert>
                )}
                <Box position="relative">
                    <ModalHeader>{t('AddStationModal.title')}</ModalHeader>
                    <ModalCloseButton />
                </Box>

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="teal" onClick={handleSubmit} disabled={!pivot}>
                        {t('AddStationModal.submit')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
