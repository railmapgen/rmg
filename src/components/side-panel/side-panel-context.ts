import { Theme } from '../../constants/constants';
import { createContext, Dispatch, SetStateAction } from 'react';

interface ISidePanelContext {
    prevTheme?: Theme;
    setPrevTheme?: Dispatch<SetStateAction<Theme | undefined>>;
    nextTheme?: Theme;
    setNextTheme?: Dispatch<SetStateAction<Theme | undefined>>;
}

const SidePanelContext = createContext<ISidePanelContext>({});
export default SidePanelContext;
