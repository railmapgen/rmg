import React, { ChangeEvent, forwardRef, Ref, useEffect, useRef } from 'react';
import { Textarea, TextareaProps, useMergeRefs } from '@chakra-ui/react';

interface RmgDebouncedTextareaProps extends TextareaProps {
    onDebouncedChange?: (value: string) => void;
}

const RmgDebouncedTextareaInner = (props: RmgDebouncedTextareaProps, ref: Ref<HTMLTextAreaElement>) => {
    const { onDebouncedChange, defaultValue, onChange, ...others } = props;

    const inputElRef = useRef<HTMLTextAreaElement>(null);
    const refs = useMergeRefs(inputElRef, ref);

    const timeoutRef = useRef<number>();

    useEffect(() => {
        if (inputElRef.current) {
            inputElRef.current.value = defaultValue?.toString() || '';
        }
    }, [defaultValue]);

    const handleChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => {
        window.clearTimeout(timeoutRef.current);

        timeoutRef.current = window.setTimeout(() => {
            onDebouncedChange?.(value);
        }, 500);
    };

    return <Textarea ref={refs} variant="flushed" size="sm" resize="none" onChange={handleChange} {...others} />;
};

const RmgDebouncedTextarea = forwardRef(RmgDebouncedTextareaInner);

export default RmgDebouncedTextarea;
