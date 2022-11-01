import React from 'react';
import { render } from '../../test-utils';
import ParamSelectorView from './param-selector-view';
import rootReducer from '../../redux';
import { createMockAppStore } from '../../setupTests';
import { initParam } from '../../redux/param/util';
import { LocalStorageKey, RmgStyle } from '../../constants/constants';
import { LanguageCode } from '@railmapgen/rmg-translate';
import { fireEvent, screen } from '@testing-library/react';

const realStore = rootReducer.getState();
const mockStore = createMockAppStore({ ...realStore });

const generateParamInLocalStorage = (id: string) => {
    const rmgParam = initParam(RmgStyle.MTR, LanguageCode.English);
    rmgParam.line_num = id;
    window.localStorage.setItem(LocalStorageKey.PARAM_BY_ID + id, JSON.stringify(rmgParam));
};

describe('ParamSelectorView', () => {
    it('Can render view with list of projects as expected', () => {
        generateParamInLocalStorage('test-1');
        generateParamInLocalStorage('test-2');

        render(<ParamSelectorView />, { store: mockStore, route: '/' });

        // display 2 projects for selecting
        expect(screen.getByRole('button', { name: 'Project ID: test-1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Project ID: test-2' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Project ID: test-2' }));
        fireEvent.click(screen.getByRole('button', { name: 'Open project' }));

        // TODO: assert open project with id = test-2
    });
});
