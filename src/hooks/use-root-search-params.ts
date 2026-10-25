// 根路由查询参数 Hook：封装 React Router 的搜索参数读写。
import { useSearchParams } from 'react-router-dom';
import rmgRuntime from '@railmapgen/rmg-runtime';

export default function useRootSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSet = (searchParamInit: Record<string, string>) => {
        setSearchParams(searchParamInit);

        const isBackToHome = Object.keys(searchParamInit).length === 0;
        const hash = isBackToHome ? '/' : '/?' + new URLSearchParams(searchParamInit);

        rmgRuntime.updateAppMetadata({ hash });
    };

    return [searchParams, handleSet] as [typeof searchParams, typeof handleSet];
}
