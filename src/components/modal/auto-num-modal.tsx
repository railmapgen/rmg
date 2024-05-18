import { useEffect, useState } from 'react';
import {
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
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { Events, RmgStyle } from '../../constants/constants';
import { isColineBranch } from '../../redux/param/coline-action';
import { autoNumbering } from '../../redux/param/action';
import rmgRuntime from '@railmapgen/rmg-runtime';

interface AutoNumModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AutoNumModal(props: AutoNumModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list: stationList } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    const [where, setWhere] = useState(selectedBranch);
    const [from, setFrom] = useState('1');
    const [maxLength, setMaxLength] = useState('2');
    const [sort, setSort] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        setWhere(selectedBranch);
    }, [selectedBranch]);

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('AutoNumModal.where'),
            value: where,
            options: {
                ...branches.reduce(
                    (acc, cur, idx) => ({
                        ...acc,
                        [idx]:
                            idx === 0
                                ? t('AutoNumModal.main')
                                : style !== RmgStyle.SHMetro || !isColineBranch(cur, stationList)
                                  ? t('AutoNumModal.branch') + ' ' + idx
                                  : t('AutoNumModal.external') + ' ' + idx,
                    }),
                    {}
                ),
            },
            onChange: value => setWhere(value as number),
        },
        {
            type: 'input',
            label: t('AutoNumModal.from'),
            value: from,
            validator: value => !isNaN(Number(value)),
            onChange: setFrom,
            debouncedDelay: 0,
        },
        {
            type: 'input',
            label: t('AutoNumModal.maxLength'),
            validator: value => !isNaN(Number(value)),
            value: maxLength,
            onChange: setMaxLength,
            debouncedDelay: 0,
        },
        {
            type: 'select',
            label: t('AutoNumModal.sort'),
            value: sort,
            options: {
                asc: t('AutoNumModal.asc'),
                desc: t('AutoNumModal.desc'),
            },
            onChange: value => setSort(value as 'asc' | 'desc'),
        },
    ];

    const handleSubmit = () => {
        dispatch(autoNumbering(where, Number(from), Number(maxLength), sort));
        onClose();
        rmgRuntime.event(Events.AUTO_NUMBERING, {});
    };

    const isSubmitDisabled = !from || !maxLength || isNaN(Number(from)) || isNaN(Number(maxLength));

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('AutoNumModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="primary" isDisabled={isSubmitDisabled} onClick={handleSubmit}>
                        {t('Confirm')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
