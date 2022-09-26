import React from 'react';
import { Alert, AlertIcon, AlertStatus, CloseButton, Link } from '@chakra-ui/react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { useRootDispatch, useRootSelector } from '../../redux';
import { closeGlobalAlert } from '../../redux/app/app-slice';

export default function GlobalAlerts() {
    const dispatch = useRootDispatch();

    const globalAlerts = useRootSelector(state => state.app.globalAlerts);

    const handleLinkOpen = (url: string, linkedApp: boolean) => {
        if (linkedApp) {
            if (rmgRuntime.isStandaloneWindow()) {
                window.open(`/${url}`, '_blank');
            } else {
                rmgRuntime.openApp(url);
            }
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <>
            {Object.entries(globalAlerts).map(([status, { message, url, linkedApp }]) => (
                <Alert key={status} status={status as AlertStatus} variant="solid" size="xs" pl={3} pr={1} py={0}>
                    <AlertIcon />
                    {url ? <Link onClick={() => handleLinkOpen(url, linkedApp)}>{message}</Link> : message}
                    <CloseButton ml="auto" onClick={() => dispatch(closeGlobalAlert(status as AlertStatus))} />
                </Alert>
            ))}
        </>
    );
}
