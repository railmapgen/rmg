import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { useRootDispatch, useRootSelector } from '../../redux';
import { addStation, getNewBranchAllowedEnds, verifyNewBranchEnds } from '../../redux/param/add-station-action';
import { Events, RmgStyle } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Group, Modal, NativeSelect, Stack } from '@mantine/core';
import { RMLabelledSegmentedControl } from '@railmapgen/mantine-components';

interface NewBranchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewBranchModal(props: NewBranchModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const [where, setWhere] = useState<'new' | 'ext'>('new');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [position, setPosition] = useState<'upper' | 'lower'>('upper');

    const [fromError, setFromError] = useState('');
    const [toError, setToError] = useState('');

    const { style, stn_list: stationList } = useRootSelector(state => state.param);

    useEffect(() => {
        // reset whenever modal is closed
        if (!isOpen) {
            setWhere('new');
            setFrom('');
            setTo('');
        }
    }, [isOpen]);

    const getStationOptions = (stationIdList: string[]) => {
        return [
            { value: '', label: t('Please select...'), disabled: true },
            ...stationIdList.map(id => ({
                value: id,
                label:
                    id === 'linestart'
                        ? `(${t('LEFT END')})`
                        : id === 'lineend'
                          ? `(${t('RIGHT END')})`
                          : stationList[id]?.localisedName.zh + '/' + stationList[id]?.localisedName.en,
            })),
        ];
    };

    const newBranchEndStationOptions = getStationOptions(dispatch(getNewBranchAllowedEnds()));

    const handleSelectWhere = (value: 'new' | 'ext') => {
        setWhere(value);
        setFrom('');
        setTo('');
        setFromError('');
        setToError('');
    };

    const handleSelectFrom = (value: string) => {
        setFrom(value);
        setFromError('');

        if (value && to) {
            setToError(dispatch(verifyNewBranchEnds(value, to)));
        }
    };

    const handleSelectTo = (value: string) => {
        setTo(value);
        setToError('');

        if (from && value) {
            setFromError(dispatch(verifyNewBranchEnds(from, value)));
        }
    };

    const handleSubmit = () => {
        let result: false | string;
        if (where === 'ext') {
            // SHMetro specific - treat lower branch as external line
            result = dispatch(addStation('new', from, to, 'lower'));
        } else {
            if (style === RmgStyle.SHMetro) {
                result = dispatch(addStation('new', from, to, 'upper'));
            } else {
                result = dispatch(addStation('new', from, to, position));
            }
        }

        if (result) {
            onClose();
            rmgRuntime.event(Events.ADD_BRANCH, { style, where });
        }
    };

    const isSubmitDisabled = Boolean(!from || !to || fromError || toError);

    return (
        <Modal opened={isOpen} onClose={onClose} title={t('NewBranchModal.title')}>
            <Stack>
                <Group className={classes.body} align="flex-start">
                    <NativeSelect
                        label={t('NewBranchModal.where')}
                        value={where}
                        data={[
                            { value: 'new', label: t('NewBranchModal.new') },
                            { value: 'ext', label: t('NewBranchModal.ext'), disabled: style !== RmgStyle.SHMetro },
                        ]}
                        onChange={({ currentTarget: { value } }) => handleSelectWhere(value as 'new' | 'ext')}
                        className={classes['mw-full']}
                    />
                    <NativeSelect
                        label={t('NewBranchModal.from')}
                        value={from}
                        data={newBranchEndStationOptions}
                        onChange={({ currentTarget: { value } }) => handleSelectFrom(value)}
                        error={fromError}
                    />
                    <NativeSelect
                        label={t('NewBranchModal.to')}
                        value={to}
                        data={newBranchEndStationOptions}
                        onChange={({ currentTarget: { value } }) => handleSelectTo(value)}
                        error={toError}
                    />
                    {where === 'new' && style !== RmgStyle.SHMetro && (
                        <RMLabelledSegmentedControl
                            label={t('NewBranchModal.position')}
                            value={position}
                            data={[
                                { value: 'upper', label: t('NewBranchModal.upper') },
                                { value: 'lower', label: t('NewBranchModal.lower') },
                            ]}
                            onChange={value => setPosition(value as 'upper' | 'lower')}
                            classNames={{ root: classes['mw-full'] }}
                        />
                    )}
                </Group>

                <Group className={classes.footer}>
                    <Button
                        title={isSubmitDisabled ? fromError || toError : t('Confirm')}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                    >
                        {t('Confirm')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
