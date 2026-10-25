// TXT 车站列表转换测试：验证普通线路、换乘线路与环线拓扑。
import { ComponentType, createElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MonoColour } from '@railmapgen/rmg-palette-resources';
import { RmgStyle } from '../constants/constants';
import { reverseStations, setFullParam } from '../redux/param/action';
import { createTestStore } from '../setupTests';
import MainGZMTR from '../svgs/gzmtr/main-gzmtr';
import { convertStationListToParam, StationListImportError } from './station-list-import-utils';

describe('convertStationListToParam', () => {
    beforeAll(() => {
        Object.defineProperty(SVGElement.prototype, 'getBBox', {
            configurable: true,
            value: () => ({ x: 0, y: 0, width: 20, height: 20 }),
        });
    });

    it('converts a linear station list with automatic codes and default interchange themes', () => {
        const param = convertStationListToParam('\uFEFF甲站 1号线 2号线\n\n乙站 3号线\n丙站\n', 'zh-Hans');

        expect(param.style).toBe(RmgStyle.GZMTR);
        expect(param.loop).toBe(false);

        const firstId = param.stn_list.linestart.children[0];
        const secondId = param.stn_list[firstId].children[0];
        const thirdId = param.stn_list[secondId].children[0];

        expect(param.stn_list[firstId]).toMatchObject({
            localisedName: { zh: '甲站', en: 'Jiazhan' },
            num: '01',
            parents: ['linestart'],
            children: [secondId],
        });
        expect(Object.keys(param.stn_list)).toHaveLength(5);
        expect(param.stn_list[secondId].num).toBe('02');
        expect(param.stn_list[thirdId].num).toBe('03');
        expect(param.stn_list[thirdId].children).toEqual(['lineend']);
        expect(param.current_stn_idx).toBe(firstId);

        const interchanges = param.stn_list[firstId].transfer.groups[0].lines;
        expect(interchanges?.map(line => line.name)).toEqual([
            ['1号线', 'Line 1'],
            ['2号线', 'Line 2'],
        ]);
        expect(interchanges?.every(line => line.theme?.[2] === '#AAAAAA')).toBe(true);
        expect(interchanges?.every(line => line.theme?.[3] === MonoColour.white)).toBe(true);
    });

    it('deduplicates a repeated endpoint and creates a loop line', () => {
        const param = convertStationListToParam('甲站 1号线\n乙站\n丙站\n甲站 2号线\n', 'zh-Hans');

        expect(param.loop).toBe(true);
        expect(param.loop_info).toMatchObject({
            bank: true,
            left_and_right_factor: 0,
            bottom_factor: 1,
        });

        const firstId = param.stn_list.linestart.children[0];
        const secondId = param.stn_list[firstId].children[0];
        const thirdId = param.stn_list[secondId].children[0];

        expect(param.stn_list[thirdId].children).toEqual(['lineend']);
        expect(param.stn_list.lineend.parents).toEqual([thirdId]);
        expect(Object.values(param.stn_list).filter(station => station.localisedName.zh === '甲站')).toHaveLength(1);
        expect(param.stn_list[firstId].transfer.groups[0].lines?.map(line => line.name[0])).toEqual(['1号线', '2号线']);
    });

    it('keeps a repeated interior station as a separate stop', () => {
        const param = convertStationListToParam('甲站\n乙站\n丙站\n乙站\n', 'zh-Hans');

        expect(param.loop).toBe(false);
        expect(Object.values(param.stn_list).filter(station => station.localisedName.zh === '乙站')).toHaveLength(2);
    });

    it('uses official offline English names when available', () => {
        const param = convertStationListToParam('广州东站\n烈士陵园\n', 'zh-Hans');
        const firstId = param.stn_list.linestart.children[0];
        const secondId = param.stn_list[firstId].children[0];

        expect(param.stn_list[firstId].localisedName.en).toBe('Guangzhou East Railway Station');
        expect(param.stn_list[secondId].localisedName.en).toBe("Martyrs' Park");
    });

    it('falls back to pinyin only for the station that has no reliable translation', () => {
        const param = convertStationListToParam('烈士陵园\n新庄\n', 'zh-Hans');
        const firstId = param.stn_list.linestart.children[0];
        const secondId = param.stn_list[firstId].children[0];

        expect(param.stn_list[firstId].localisedName.en).toBe("Martyrs' Park");
        expect(param.stn_list[secondId].localisedName.en).toBe('Xinzhuang');
    });

    it('uses the selected style when the same Chinese name has different English names', () => {
        const gzmtrParam = convertStationListToParam('坑口\n新庄\n', 'zh-Hans', RmgStyle.GZMTR);
        const mtrParam = convertStationListToParam('坑口\n新庄\n', 'zh-Hans', RmgStyle.MTR);
        const gzmtrFirstId = gzmtrParam.stn_list.linestart.children[0];
        const mtrFirstId = mtrParam.stn_list.linestart.children[0];

        expect(gzmtrParam.stn_list[gzmtrFirstId].localisedName.en).toBe('Kengkou');
        expect(mtrParam.stn_list[mtrFirstId].localisedName.en).toBe('Hang Hau');
    });

    it('translates traditional Chinese station names and uses unambiguous cross-style entries', () => {
        const param = convertStationListToParam('中環\n人民广场\n', 'zh-Hant', RmgStyle.MTR);
        const firstId = param.stn_list.linestart.children[0];
        const secondId = param.stn_list[firstId].children[0];

        expect(param.stn_list[firstId].localisedName.en).toBe('Central');
        expect(param.stn_list[secondId].localisedName.en).toBe("People's Square");
    });

    it('rejects a loop with fewer than three unique stations', () => {
        expect(() => convertStationListToParam('甲站\n甲站\n', 'zh-Hans')).toThrow(StationListImportError);
    });

    it('can reverse and render an imported line', () => {
        const param = convertStationListToParam('甲站 1号线\n乙站\n丙站\n', 'zh-Hans');
        const store = createTestStore();

        store.dispatch(setFullParam(param));
        expect(() => store.dispatch(reverseStations())).not.toThrow();

        const StoreProvider = Provider as ComponentType<{ store: typeof store }>;
        const { container } = render(
            createElement(StoreProvider, { store }, createElement('svg', null, createElement(MainGZMTR)))
        );
        expect(container.querySelector('svg > #main')).not.toBeNull();
    });
});
