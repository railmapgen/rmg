import DestinationMTR from './destination-mtr';
import { render } from '../../test-utils';
import { createTestStore, mockSimpleStationList } from '../../setupTests';
import { getRoutes } from '../../redux/helper/graph-theory-util';
import rootReducer, { RootStore } from '../../redux';
import { setCurrentStation } from '../../redux/param/param-slice';
import { screen } from '@testing-library/react';

const realStore = rootReducer.getState();
let mockStore: RootStore;

const mockGetBBox = vi.fn().mockReturnValue({ width: 0 });
(SVGElement.prototype as any).getBBox = mockGetBBox;

describe('DestinationMTR', () => {
    beforeEach(() => {
        mockStore = createTestStore({
            param: {
                ...realStore.param,
                stn_list: mockSimpleStationList,
            },
            helper: {
                ...realStore.helper,
                routes: getRoutes(mockSimpleStationList),
            },
        });
    });

    it('#643 Only platform number is shown in terminal station', () => {
        mockStore.dispatch(setCurrentStation('stn0'));
        render(
            <svg>
                <DestinationMTR />
            </svg>,
            { store: mockStore }
        );

        expect(screen.queryByTestId('mtr-arrow')).not.toBeInTheDocument();
        expect(screen.getByTestId('mtr-platform')).toBeInTheDocument();
        expect(screen.queryByTestId('mtr-destination')).not.toBeInTheDocument();
    });

    it('#643 Arrow, platform number and destination are shown in non-terminal station', () => {
        mockStore.dispatch(setCurrentStation('stn1'));
        render(
            <svg>
                <DestinationMTR />
            </svg>,
            { store: mockStore }
        );

        expect(screen.getByTestId('mtr-arrow')).toBeInTheDocument();
        expect(screen.getByTestId('mtr-platform')).toBeInTheDocument();
        const destination = screen.getByTestId('mtr-destination');
        expect(destination).toBeInTheDocument();
        expect(destination).toHaveTextContent(/往車站0/);
        expect(destination).toHaveTextContent(/to Station 0/);
    });
});
