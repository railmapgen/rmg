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
import { ParamConfig } from '../../constants/constants';

interface ParamConfigEditModalProps {
    config?: ParamConfig;
    onClose: () => void;
    onUpdate: (config: ParamConfig) => void;
}

export default function ParamConfigEditModal(props: ParamConfigEditModalProps) {
    const { config, onClose, onUpdate } = props;
    const { t } = useTranslation();

    const [name, setName] = useState(config?.name ?? '');

    useEffect(() => {
        if (config) {
            setName(config.name ?? '');
        }
    }, [config]);

    const fields: RmgFieldsField[] = [
        {
            type: 'input',
            label: t('Project name'),
            value: name,
            onChange: setName,
            debouncedDelay: 0,
        },
    ];

    const handleSubmit = () => {
        if (config) {
            if ((config.name ?? '') !== name) {
                onUpdate({ ...config, name });
            }
        }
    };

    return (
        <Modal isOpen={!!config} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Edit project info')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="primary" onClick={handleSubmit}>
                        {t('Confirm')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
