import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux';
import { Alert, AlertIcon, AlertStatus, CloseButton, Link } from '@chakra-ui/react';
import { closeGlobalAlert } from '../../redux/app/action';

export default function GlobalAlerts() {
    const dispatch = useDispatch();

    const globalAlerts = useAppSelector(state => state.app.globalAlerts);

    return (
        <>
            {Object.entries(globalAlerts).map(([status, { message, url }]) => (
                <Alert key={status} status={status as AlertStatus} variant="solid" size="xs" pl={3} pr={1} py={0}>
                    <AlertIcon />
                    {url ? (
                        <Link href={url} target="_blank">
                            {message}
                        </Link>
                    ) : (
                        message
                    )}
                    <CloseButton ml="auto" onClick={() => dispatch(closeGlobalAlert(status as AlertStatus))} />
                </Alert>
            ))}
        </>
    );
}
