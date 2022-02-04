import React from 'react';
import ColourUtil from '../../theme/colour-util';
import { MdCircle } from 'react-icons/md';
import { IconButton } from '@chakra-ui/react';
import { Theme } from '../../constants/constants';

interface ThemeButtonProps {
    theme: Theme;
    onClick?: () => void;
}

export default function ThemeButton(props: ThemeButtonProps) {
    const { theme, onClick } = props;

    return (
        <IconButton
            size="xs"
            aria-label="Theme colour"
            mt="0.45px"
            color={theme[3]}
            bg={theme[2]}
            _hover={{ bg: ColourUtil.fade(theme[2], 0.7) }}
            icon={<MdCircle />}
            onClick={onClick}
        />
    );
}
