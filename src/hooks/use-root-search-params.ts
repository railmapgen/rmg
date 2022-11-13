import { useSearchParams } from 'react-router-dom';
import rmgRuntime from '@railmapgen/rmg-runtime';

export default function useRootSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSet = (searchParamInit: Record<string, string>) => {
        setSearchParams(searchParamInit);

        if (Object.keys(searchParamInit)) {
            const urlSearchParams = new URLSearchParams(searchParamInit);
            rmgRuntime.updateUrl('/rmg/?' + urlSearchParams);
        } else {
            rmgRuntime.updateUrl('/rmg/');
        }
    };

    return [searchParams, handleSet] as [typeof searchParams, typeof handleSet];
}
