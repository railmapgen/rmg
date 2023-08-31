import ColourUtil from '../../theme/colour-util';
import { MdCircle } from 'react-icons/md';
import { IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@railmapgen/rmg-palette-resources';

interface ThemeButtonProps {
    theme?: Theme;
    onClick?: () => void;
}

export default function ThemeButton(props: ThemeButtonProps) {
    const { theme, onClick } = props;

    const { t } = useTranslation();

    return (
        <IconButton
            size="xs"
            aria-label={t('Colour')}
            mt="0.45px"
            color={theme?.[3]}
            bg={theme?.[2]}
            _hover={{ bg: ColourUtil.fade(theme?.[2] ?? '#aaaaaa', 0.7) }}
            icon={<MdCircle />}
            onClick={onClick}
        />
    );
}
