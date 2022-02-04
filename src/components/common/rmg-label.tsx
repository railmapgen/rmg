import React, { ReactNode } from 'react';
import { FormControl, FormControlProps, FormLabel, useStyleConfig } from '@chakra-ui/react';

interface RmgLabelProps extends FormControlProps {
    label: string;
    children: ReactNode;
    noLabel?: boolean;
}

export default function RmgLabel(props: RmgLabelProps) {
    const { label, children, width, noLabel, ...others } = props;

    const styles = useStyleConfig('RmgLabel');

    return (
        <FormControl sx={styles} {...others}>
            {!noLabel && <FormLabel size="xs">{label}</FormLabel>}

            {children}
        </FormControl>
    );
}
