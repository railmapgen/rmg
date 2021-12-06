import React, { ReactNode } from 'react';
import { FormControl, FormControlProps, FormLabel } from '@chakra-ui/react';

interface RmgLabelProps extends FormControlProps {
    label: string;
    children: ReactNode;
    noLabel?: boolean;
}

export default function RmgLabel(props: RmgLabelProps) {
    const { label, children, width, noLabel, ...others } = props;

    return (
        <FormControl m={1} w="unset" {...others}>
            {!noLabel && (
                <FormLabel
                    overflow="hidden"
                    size="xs"
                    fontSize={12}
                    mr={0}
                    mb={-0.5}
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                >
                    {label}
                </FormLabel>
            )}

            {children}
        </FormControl>
    );
}
