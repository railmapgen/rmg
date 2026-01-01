import classes from './connect-disconnect-card.module.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Direction, Events } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setGlobalAlert } from '../../../redux/app/app-slice';
import {
    connect2MainLine,
    disconnectFromMainLine,
    getBranchType,
    getPossibleDirection,
    getPossibleStations,
} from '../../../redux/param/connect-disconnect-branch';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Card, Group, Select, TextInput } from '@mantine/core';

interface ConnectDisconnectCardProps {
    direction: Direction;
}

export default function ConnectDisconnectCard(props: ConnectDisconnectCardProps) {
    const { direction } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { branches } = useRootSelector(state => state.helper);
    const selectedBranch = useRootSelector(state => state.app.selectedBranch);
    const { style, stn_list } = useRootSelector(state => state.param);

    const [isEditing, setIsEditing] = useState(false);
    const [selection, setSelection] = useState('');

    const trimedBranch = branches[selectedBranch].filter(id => !['linestart', 'lineend'].includes(id));
    const branchEndId = direction === Direction.left ? trimedBranch[0] : trimedBranch.slice(-1)[0];
    const branchEndInfo = stn_list[branchEndId];

    const possibleStations = dispatch(getPossibleStations(selectedBranch));
    const branchType = dispatch(getBranchType(selectedBranch));
    const possibleDirection = dispatch(getPossibleDirection(selectedBranch));

    const isConnectable = branchType === 1 && !branches[0].includes(branchEndId);
    const isDisconnectable = possibleDirection.includes(direction);

    const options = [
        { value: '', label: t('Please select...'), disabled: true },
        ...possibleStations.map(value => ({
            value,
            label: stn_list[value]?.localisedName.zh + '/' + stn_list[value]?.localisedName.en,
        })),
    ];

    const handleConnect = () => {
        const result = dispatch(connect2MainLine(selection, selectedBranch));
        if (result) {
            setIsEditing(false);
        } else {
            dispatch(setGlobalAlert({ status: 'error', message: t('Unable to connect to main line.') }));
        }
        rmgRuntime.event(Events.CONNECT_BRANCH, { style, success: result });
    };

    const handleDisconnect = () => {
        const result = dispatch(disconnectFromMainLine(direction, selectedBranch));
        if (!result) {
            dispatch(setGlobalAlert({ status: 'error', message: t('Unable to disconnect from main line.') }));
        }
        rmgRuntime.event(Events.DISCONNECT_BRANCH, { style, success: result });
    };

    return (
        <Card className={classes.card} withBorder>
            <Group gap="xs">
                <TextInput
                    label={t('Station name')}
                    value={branchEndInfo.localisedName.zh + '/' + branchEndInfo.localisedName.en}
                    readOnly
                />

                {isEditing ? (
                    <Button variant="default" onClick={() => setIsEditing(false)}>
                        {t('Cancel')}
                    </Button>
                ) : isConnectable ? (
                    <Button onClick={() => setIsEditing(true)}>{t('Connect to main line')}</Button>
                ) : (
                    <Button onClick={handleDisconnect} disabled={!isDisconnectable}>
                        {t('Disconnect from main line')}
                    </Button>
                )}
            </Group>

            {isEditing && (
                <Group gap="xs">
                    <Select
                        label={t('Target station')}
                        value={selection}
                        data={options}
                        onChange={value => value && setSelection(value)}
                    />
                    <Button onClick={handleConnect} disabled={!selection}>
                        {t('Confirm')}
                    </Button>
                </Group>
            )}
        </Card>
    );
}
