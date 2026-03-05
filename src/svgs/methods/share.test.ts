import { drawLine, getStnState } from './share';

// Diamond topology used in getStnState tests:
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

// Dead-end topology:
//
//  <-- a ---|
//           c --- d ----
//  <-- b ---|

const DEAD_END_ROUTES: string[][] = [
    ['linestart', 'b', 'c', 'd', 'lineend'],
    ['linestart', 'a', 'c', 'd', 'lineend'],
];

describe('getStnState', () => {
    it('Can calculate states on simple line (direction r)', () => {
        const routes = [['linestart', 'A', 'B', 'C', 'lineend']];
        const states = getStnState('B', routes, 'r');
        expect(states['A']).toBe(-1);
        expect(states['B']).toBe(0);
        expect(states['C']).toBe(1);
    });

    it('Can calculate states on simple line (direction l)', () => {
        const routes = [['linestart', 'A', 'B', 'C', 'lineend']];
        const states = getStnState('B', routes, 'l');
        expect(states['A']).toBe(1);
        expect(states['B']).toBe(0);
        expect(states['C']).toBe(-1);
    });

    it('Can promote parallel branch when current is on sibling branch (direction r)', () => {
        const states = getStnState('D', TWO_BRANCH_ROUTES, 'r');
        expect(states['B']).toBe(-1);
        expect(states['C']).toBe(-1);
        expect(states['D']).toBe(0);
        expect(states['E']).toBe(1);
        expect(states['G']).toBe(1);
        expect(states['H']).toBe(1);
    });

    it('Can promote parallel branch when current is on sibling branch (direction l)', () => {
        const states = getStnState('D', TWO_BRANCH_ROUTES, 'l');
        expect(states['B']).toBe(1);
        expect(states['C']).toBe(1);
        expect(states['D']).toBe(0);
        expect(states['E']).toBe(-1);
        expect(states['G']).toBe(1);
        expect(states['H']).toBe(1);
    });

    it('Can calculate states at bifurcation point — both branches ahead', () => {
        const states = getStnState('B', TWO_BRANCH_ROUTES, 'r');
        expect(states['A']).toBe(-1);
        expect(states['B']).toBe(0);
        expect(states['C']).toBe(1);
        expect(states['D']).toBe(1);
        expect(states['E']).toBe(1);
        expect(states['F']).toBe(1);
        expect(states['G']).toBe(1);
        expect(states['H']).toBe(1);
    });

    it('Can calculate states at merge point — both branches behind', () => {
        const states = getStnState('E', TWO_BRANCH_ROUTES, 'r');
        expect(states['A']).toBe(-1);
        expect(states['B']).toBe(-1);
        expect(states['C']).toBe(-1);
        expect(states['D']).toBe(-1);
        expect(states['E']).toBe(0);
        expect(states['F']).toBe(1);
        expect(states['G']).toBe(-1);
        expect(states['H']).toBe(-1);
    });

    it('Does not promote dead-end parallel branch when junction is behind current', () => {
        const states = getStnState('a', DEAD_END_ROUTES, 'l');
        expect(states['a']).toBe(0);
        expect(states['c']).toBe(-1);
        expect(states['d']).toBe(-1);
        expect(states['b']).toBe(-1);
    });

    it('Can promote dead-end parallel branch when junction is ahead of current', () => {
        const states = getStnState('a', DEAD_END_ROUTES, 'r');
        expect(states['a']).toBe(0);
        expect(states['c']).toBe(1);
        expect(states['d']).toBe(1);
        expect(states['b']).toBe(1);
    });
});

describe('drawLine', () => {
    it('Can color promoted parallel branch stations', () => {
        const stnStates: { [k: string]: -1 | 0 | 1 } = { B: -1, G: 1, H: 1, E: 1 };
        const { main, pass } = drawLine(['linestart', 'B', 'G', 'H', 'E', 'lineend'], stnStates);
        expect(main).toContain('G');
        expect(main).toContain('H');
        expect(main).toContain('E');
        expect(pass).toContain('B');
    });

    it('Does not generate gray stub when entire branch is state=1', () => {
        const stnStates: { [k: string]: -1 | 0 | 1 } = { X: 1, Y: 1, Z: 1 };
        const { main, pass } = drawLine(['linestart', 'X', 'Y', 'Z', 'lineend'], stnStates);
        expect(main).toEqual(['X', 'Y', 'Z']);
        expect(pass).toHaveLength(0);
    });

    it('Current station (state=0) appears in both main and pass as overlap point', () => {
        const stnStates: { [k: string]: -1 | 0 | 1 } = { B: -1, G: 0, H: 1, E: 1 };
        const { main, pass } = drawLine(['linestart', 'B', 'G', 'H', 'E', 'lineend'], stnStates);
        expect(pass).toContain('B');
        expect(pass).toContain('G');
        expect(main).toContain('G');
        expect(main).toContain('H');
        expect(main).toContain('E');
    });

    it('Returns empty main and full pass when entire branch is state=-1', () => {
        const stnStates: { [k: string]: -1 | 0 | 1 } = { B: -1, G: -1, H: -1, E: -1 };
        const { main, pass } = drawLine(['linestart', 'B', 'G', 'H', 'E', 'lineend'], stnStates);
        expect(main).toHaveLength(0);
        expect(pass).toEqual(['B', 'G', 'H', 'E']);
    });
});
