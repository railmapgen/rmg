import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@chakra-ui/react';

type ButtonGroupSelection<T> = {
    label: string;
    value: T;
    disabled?: boolean;
};

type RmgButtonGroupSingleSelectProps<T> = {
    selections: ButtonGroupSelection<T>[];
    defaultValue: T;
    onChange?: (value: T) => void;
    multiSelect?: false;
};

type RmgButtonGroupMultiSelectProps<T> = {
    selections: ButtonGroupSelection<T>[];
    defaultValue: T[];
    onChange?: (value: T[]) => void;
    multiSelect: true;
};

type RmgButtonGroupProps<T> = RmgButtonGroupSingleSelectProps<T> | RmgButtonGroupMultiSelectProps<T>;

export default function RmgButtonGroup<T extends string | boolean>(props: RmgButtonGroupProps<T>) {
    const { selections, defaultValue, onChange, multiSelect } = props;

    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        defaultValue.toString() && setValue(defaultValue);
    }, [defaultValue.toString()]);

    const handleToggle = (val: T) => {
        if (multiSelect) {
            const prevValue = value as T[];
            const nextValue = prevValue.includes(val) ? prevValue.filter(v => v !== val) : [...prevValue, val];

            setValue(nextValue);
            (onChange as RmgButtonGroupMultiSelectProps<T>['onChange'])?.(nextValue);
        } else {
            setValue(val);
            (onChange as RmgButtonGroupSingleSelectProps<T>['onChange'])?.(val);
        }
    };

    return (
        <ButtonGroup size="xs" isAttached colorScheme="teal" variant="outline">
            {selections.map((selection, i) => {
                const isSelected =
                    (typeof value === 'object' && value.includes(selection.value)) || value === selection.value;

                // TODO: fix overlapped/missing border
                const mr = i !== selections.length - 1 && !isSelected ? '-px' : undefined;

                return (
                    <Button
                        key={selection.value.toString()}
                        role="checkbox"
                        aria-checked={isSelected}
                        variant={isSelected ? 'solid' : 'outline'}
                        mr={mr}
                        isDisabled={selection.disabled}
                        onClick={() => handleToggle(selection.value)}
                    >
                        {selection.label}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
}

interface RmgBooleanButtonGroupProps {
    defaultValue: boolean;
    onChange?: (value: boolean) => void;
}

export const RmgBooleanButtonGroup = (props: RmgBooleanButtonGroupProps) => {
    const selections = [
        {
            label: 'Yes',
            value: true,
        },
        {
            label: 'No',
            value: false,
        },
    ];

    return <RmgButtonGroup selections={selections} {...props} />;
};
