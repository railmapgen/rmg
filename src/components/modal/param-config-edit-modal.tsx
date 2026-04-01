import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParamConfig } from '../../constants/constants';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';

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

    const handleSubmit = () => {
        if (config) {
            if ((config.name ?? '') !== name) {
                onUpdate({ ...config, name });
            }
        }
    };

    return (
        <Modal opened={!!config} onClose={onClose} title={t('Edit project info')}>
            <Stack>
                <Group className={classes.body}>
                    <TextInput
                        label={t('Project name')}
                        value={name}
                        onChange={({ currentTarget: { value } }) => setName(value)}
                    />
                </Group>

                <Group className={classes.footer}>
                    <Button onClick={handleSubmit}>{t('Confirm')}</Button>
                </Group>
            </Stack>
        </Modal>
    );
}
