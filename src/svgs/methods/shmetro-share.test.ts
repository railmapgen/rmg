import { ShortDirection, StationDict, StationInfo } from '../../constants/constants';
import { getStnStateShmetro } from './shmetro-share';

// Diamond topology used in getStnStateShmetro tests:
//
//         C -- D
//        /       \
//  A -- B         E -- F
//        \       /
//         G -- H
//
// routes[0]: linestart → A → B → C → D → E → F → lineend
// routes[1]: linestart → A → B → G → H → E → F → lineend

const TWO_BRANCH_ROUTES: string[][] = [
    ['linestart', 'A', 'B', 'C', 'D', 'E', 'F', 'lineend'],
    ['linestart', 'A', 'B', 'G', 'H', 'E', 'F', 'lineend'],
];

// Left-opening dead-end topology:
//
//  <-- a --- j --- c -->
//            /
//  <-- b ----
//
// routes[0]: linestart → a → j → c → lineend
// routes[1]: linestart → b → j → c → lineend

const LEFT_DEAD_END_ROUTES: string[][] = [
    ['linestart', 'a', 'j', 'c', 'lineend'],
    ['linestart', 'b', 'j', 'c', 'lineend'],
];

// Right-opening dead-end topology:
//
//  <-- c --- j --- a -->
//            \
//             ---- b -->
//
// routes[0]: linestart → c → j → a → lineend
// routes[1]: linestart → c → j → b → lineend

const RIGHT_DEAD_END_ROUTES: string[][] = [
    ['linestart', 'c', 'j', 'a', 'lineend'],
    ['linestart', 'c', 'j', 'b', 'lineend'],
];

const createStationDict = (routes: string[][]): StationDict => {
    const adjacency = routes.reduce(
        (acc, route) => {
            route.forEach((stnId, index) => {
                acc[stnId] ??= { parents: new Set<string>(), children: new Set<string>() };

                if (index > 0) {
                    acc[stnId].parents.add(route[index - 1]);
                }

                if (index < route.length - 1) {
                    acc[stnId].children.add(route[index + 1]);
                }
            });

            return acc;
        },
        {} as Record<string, { parents: Set<string>; children: Set<string> }>
    );

    return Object.entries(adjacency).reduce<StationDict>((acc, [stnId, { parents, children }]) => {
        const stationInfo: StationInfo = {
            localisedName: { zh: stnId, en: stnId },
            num: stnId,
            parents: [...parents],
            children: [...children],
            transfer: { tick_direc: ShortDirection.right, paid_area: true, groups: [{ lines: [] }] },
            services: [],
            loop_pivot: false,
            one_line: false,
            int_padding: 355,
            character_spacing: 20,
        };

        acc[stnId] = stationInfo;
        return acc;
    }, {});
};

const TWO_BRANCH_STN_LIST = createStationDict(TWO_BRANCH_ROUTES);
const LEFT_DEAD_END_STN_LIST = createStationDict(LEFT_DEAD_END_ROUTES);
const RIGHT_DEAD_END_STN_LIST = createStationDict(RIGHT_DEAD_END_ROUTES);

type ShmetroState = -1 | 0 | 1;
type ShmetroExpectedStates = Record<string, ShmetroState>;
type DeadEndCase = {
    currentId: string;
    direction: 'l' | 'r';
    expected: ShmetroExpectedStates;
};
type DeadEndScenario = {
    name: string;
    routes: string[][];
    stnList: StationDict;
    cases: DeadEndCase[];
};

const DEAD_END_SCENARIOS: DeadEndScenario[] = [
    {
        name: 'left-opening dead-end topology',
        routes: LEFT_DEAD_END_ROUTES,
        stnList: LEFT_DEAD_END_STN_LIST,
        cases: [
            { currentId: 'c', direction: 'l', expected: { a: 1, b: 1, j: 1, c: 0 } },
            { currentId: 'c', direction: 'r', expected: { a: -1, b: -1, j: -1, c: 0 } },
            { currentId: 'a', direction: 'l', expected: { a: 0, b: -1, j: -1, c: -1 } },
            { currentId: 'a', direction: 'r', expected: { a: 0, b: 1, j: 1, c: 1 } },
            { currentId: 'b', direction: 'l', expected: { a: -1, b: 0, j: -1, c: -1 } },
            { currentId: 'b', direction: 'r', expected: { a: 1, b: 0, j: 1, c: 1 } },
        ],
    },
    {
        name: 'right-opening dead-end topology',
        routes: RIGHT_DEAD_END_ROUTES,
        stnList: RIGHT_DEAD_END_STN_LIST,
        cases: [
            { currentId: 'c', direction: 'l', expected: { a: -1, b: -1, j: -1, c: 0 } },
            { currentId: 'c', direction: 'r', expected: { a: 1, b: 1, j: 1, c: 0 } },
            { currentId: 'a', direction: 'l', expected: { a: 0, b: 1, j: 1, c: 1 } },
            { currentId: 'a', direction: 'r', expected: { a: 0, b: -1, j: -1, c: -1 } },
            { currentId: 'b', direction: 'l', expected: { a: 1, b: 0, j: 1, c: 1 } },
            { currentId: 'b', direction: 'r', expected: { a: -1, b: 0, j: -1, c: -1 } },
        ],
    },
];

const expectStates = (states: Record<string, ShmetroState>, expected: ShmetroExpectedStates) => {
    Object.entries(expected).forEach(([stnId, state]) => {
        expect(states[stnId]).toBe(state);
    });
};

describe('getStnStateShmetro', () => {
    it('Can promote the other branch in diamond topology', () => {
        const states = getStnStateShmetro('D', TWO_BRANCH_ROUTES, TWO_BRANCH_STN_LIST, 'r');
        expectStates(states, {
            B: -1,
            C: -1,
            D: 0,
            E: 1,
            G: 1,
            H: 1,
        });
    });

    it('Can promote parallel branch when current is on sibling branch (direction l)', () => {
        const states = getStnStateShmetro('D', TWO_BRANCH_ROUTES, TWO_BRANCH_STN_LIST, 'l');
        expectStates(states, {
            B: 1,
            C: 1,
            D: 0,
            E: -1,
            G: 1,
            H: 1,
        });
    });

    it('Can calculate states at bifurcation point — both branches ahead', () => {
        const states = getStnStateShmetro('B', TWO_BRANCH_ROUTES, TWO_BRANCH_STN_LIST, 'r');
        expectStates(states, {
            A: -1,
            B: 0,
            C: 1,
            D: 1,
            E: 1,
            F: 1,
            G: 1,
            H: 1,
        });
    });

    it('Can calculate states at merge point — both branches behind', () => {
        const states = getStnStateShmetro('E', TWO_BRANCH_ROUTES, TWO_BRANCH_STN_LIST, 'r');
        expectStates(states, {
            A: -1,
            B: -1,
            C: -1,
            D: -1,
            E: 0,
            F: 1,
            G: -1,
            H: -1,
        });
    });

    describe.each(DEAD_END_SCENARIOS)('Dead-end scenarios: $name', ({ routes, stnList, cases }) => {
        it.each(cases)(
            'Can mark stations correctly at $currentId when direction is $direction',
            ({ currentId, direction, expected }) => {
                const states = getStnStateShmetro(currentId, routes, stnList, direction);
                expectStates(states, expected);
            }
        );
    });
});
