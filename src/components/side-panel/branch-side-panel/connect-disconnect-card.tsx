import { Button, Flex } from '@chakra-ui/react';
import { RmgCard, RmgDebouncedInput, RmgLabel, RmgSelect } from '@railmapgen/rmg-components';
import React, { useState } from 'react';
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

    const options = possibleStations.reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: stn_list[cur]?.name.join(' - '),
        }),
        { '': t('Please select...') }
    );

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
        <RmgCard direction="column">
            <Flex alignItems="center">
                <RmgLabel label={t('Station name')} flex={1}>
                    <RmgDebouncedInput defaultValue={branchEndInfo.name.join(' ')} isDisabled={true} />
                </RmgLabel>

                {isEditing ? (
                    <Button mx={1} size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        {t('Cancel')}
                    </Button>
                ) : isConnectable ? (
                    <Button mx={1} size="sm" variant="solid" colorScheme="primary" onClick={() => setIsEditing(true)}>
                        {t('Connect to main line')}
                    </Button>
                ) : (
                    <Button
                        mx={1}
                        size="sm"
                        variant="solid"
                        colorScheme="primary"
                        onClick={handleDisconnect}
                        isDisabled={!isDisconnectable}
                    >
                        {t('Disconnect from main line')}
                    </Button>
                )}
            </Flex>

            {isEditing && (
                <Flex alignItems="center">
                    <RmgLabel label={t('Target station')} flex={1}>
                        <RmgSelect
                            defaultValue={selection}
                            options={options}
                            disabledOptions={['']}
                            onChange={({ target: { value } }) => setSelection(value)}
                        />
                    </RmgLabel>

                    <Button
                        mx={1}
                        size="sm"
                        variant="solid"
                        colorScheme="primary"
                        onClick={handleConnect}
                        isDisabled={!selection}
                    >
                        {t('Confirm')}
                    </Button>
                </Flex>
            )}
        </RmgCard>
    );
}
