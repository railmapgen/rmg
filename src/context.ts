import { createContext } from 'react';

interface IParamContext {
    dispatch: (action: any) => void;
    branches: string[][];
    routes: string[][];
    deps: string;
    tpo: string[];
}

export const ParamContext = createContext<IParamContext>({} as IParamContext);
