import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AppRoot from './app-root';

export default function AppRouter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const paramId = searchParams.get('w');

    console.log('searchParam: w=' + paramId);

    return <AppRoot />;
}
