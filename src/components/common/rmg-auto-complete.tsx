import {
    Box,
    Button,
    Flex,
    Popover,
    PopoverAnchor,
    PopoverBody,
    PopoverContent,
    useOutsideClick,
} from '@chakra-ui/react';
import { RmgDebouncedInput } from '@railmapgen/rmg-components';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

interface RmgAutoCompleteProps<T> {
    data: T[];
    displayValue: (item: T) => string;
    displayHandler?: (item: T) => ReactElement | string | number;
    predicate: (item: T, input: string) => boolean;
    defaultValue?: T;
    onChange?: (item: T) => void;
    isInvalid?: boolean; // inherit from chakra input
}

export default function RmgAutoComplete<T extends { id: string }>(props: RmgAutoCompleteProps<T>) {
    const { data, displayValue, displayHandler, predicate, defaultValue, onChange, isInvalid } = props;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState(defaultValue ? displayValue(defaultValue) : '');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useOutsideClick({ ref: wrapperRef, handler: () => setIsDropdownOpen(false) });

    useEffect(
        () => {
            if (defaultValue) {
                setInputValue(displayValue(defaultValue));
            } else {
                setInputValue('');
            }
        },
        // force update input field when data is changed
        // to prevent last selected text remains on the field if defaultValue are undefined before and after
        [JSON.stringify(data), JSON.stringify(defaultValue)]
    );

    const handleSelect = (item: T) => {
        setInputValue(displayValue(item));
        setIsDropdownOpen(false);
        onChange?.(item);
    };

    return (
        <Box ref={wrapperRef}>
            <Popover placement="bottom-start" isOpen={isDropdownOpen} autoFocus={false}>
                <PopoverAnchor>
                    <RmgDebouncedInput
                        defaultValue={inputValue}
                        onDebouncedChange={val => setInputValue(val)}
                        onFocus={() => setIsDropdownOpen(true)}
                        isInvalid={isInvalid}
                    />
                </PopoverAnchor>

                <PopoverContent w="unset" minW={200}>
                    <PopoverBody p={0}>
                        <Flex direction="column" maxH={270} overflowY="auto">
                            {data
                                .filter(item => predicate(item, inputValue))
                                .map(item => (
                                    <Button
                                        key={item.id}
                                        size="sm"
                                        variant="ghost"
                                        justifyContent="flex-start"
                                        flexShrink={0}
                                        role="menuitem"
                                        onClick={() => handleSelect(item)}
                                    >
                                        {displayHandler ? displayHandler(item) : displayValue(item)}
                                    </Button>
                                ))}
                        </Flex>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
}
