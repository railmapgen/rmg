import React, { Fragment, ReactNode } from 'react';
import RmgLabel from './rmg-label';
import RmgDebouncedInput from './rmg-debounced-input';
import { Flex, InputProps, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import RmgDebouncedTextarea from './rmg-debounced-textarea';

type inputField = {
    type: 'input';
    value: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    variant?: InputProps['type'];
};

type textareaField = {
    type: 'textarea';
    value: string;
    placeholder?: string;
    onChange?: (value: string) => void;
};

type sliderField = {
    type: 'slider';
    value: number;
    min: number;
    max: number;
    onChange?: (value: number) => void;
};

type selectField = {
    type: 'select';
    value?: string;
    options: Record<string, string>; // { value: displayText }
    onChange?: (value: string) => void;
};

type customField = {
    type: 'custom';
    component: ReactNode;
};

export type RmgFieldsField = (inputField | textareaField | sliderField | selectField | customField) & {
    label: string;
    minW?: `${number}px` | number | 'full';
    hidden?: boolean;
};

interface RmgFieldsProps {
    fields: RmgFieldsField[];
    noLabel?: boolean;
}

export default function RmgFields(props: RmgFieldsProps) {
    const { fields, noLabel } = props;

    return (
        <Flex wrap="wrap">
            {fields.map((field, i) => {
                if (field.hidden) {
                    return <Fragment key={i} />;
                }
                return (
                    <RmgLabel
                        key={i}
                        label={field.label}
                        flex={1}
                        minW={field.minW === 'full' ? undefined : field.minW || 100}
                        w={field.minW === 'full' ? '100%' : undefined}
                        flexBasis={field.minW === 'full' ? '100%' : undefined}
                        noLabel={noLabel}
                    >
                        {(field => {
                            switch (field.type) {
                                case 'input':
                                    return (
                                        <RmgDebouncedInput
                                            placeholder={field.placeholder}
                                            defaultValue={field.value}
                                            type={field.variant}
                                            onDebouncedChange={field.onChange}
                                        />
                                    );
                                case 'textarea':
                                    return (
                                        <RmgDebouncedTextarea
                                            placeholder={field.placeholder}
                                            defaultValue={field.value}
                                            onDebouncedChange={field.onChange}
                                        />
                                    );
                                case 'slider':
                                    return (
                                        <Slider
                                            defaultValue={field.value}
                                            min={field.min}
                                            max={field.max}
                                            onChangeEnd={field.onChange}
                                        >
                                            <SliderTrack>
                                                <SliderFilledTrack />
                                            </SliderTrack>
                                            <SliderThumb />
                                        </Slider>
                                    );
                                case 'select':
                                    return (
                                        <Select
                                            variant="flushed"
                                            size="sm"
                                            h={6}
                                            defaultValue={field.value}
                                            onChange={({ target: { value } }) => field.onChange?.(value)}
                                        >
                                            {Object.entries(field.options).map(([value, displayText]) => (
                                                <option key={value} value={value}>
                                                    {displayText}
                                                </option>
                                            ))}
                                        </Select>
                                    );
                                case 'custom':
                                    return field.component;
                                default:
                                    return <div />;
                            }
                        })(field)}
                    </RmgLabel>
                );
            })}
        </Flex>
    );
}
