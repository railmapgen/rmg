import { vi } from 'vitest';
import { getAbsoluteUrl } from './export-utils';
import * as Utils from './utils';

const isSafariSpy = vi.spyOn(Utils, 'isSafari');

describe('ExportUtils', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    describe('ExportUtils - getAbsolutePath', () => {
        it.skip('Can extract absolute CSS url for Safari', () => {
            const mockCssRule = {
                style: {
                    src: 'local(GenYoMin TW), local(GenYoMinTW-SB), url("https://railmapgen.github.io/fonts/GenYoMin-TW-SB.woff2") format("woff2")',
                },
            };
            isSafariSpy.mockReturnValue(true);

            expect(getAbsoluteUrl(mockCssRule as any)).toBe('https://railmapgen.github.io/fonts/GenYoMin-TW-SB.woff2');
        });

        it('Can extract absolute CSS url for non Safari browsers', () => {
            const mockCssRule = {
                style: {
                    src: 'local(GenYoMin TW), local(GenYoMinTW-SB), url("../fonts/GenYoMin-TW-SB.woff2") format("woff2")',
                },
            };
            isSafariSpy.mockReturnValue(false);

            expect(getAbsoluteUrl(mockCssRule as any)).toBe('/styles/../fonts/GenYoMin-TW-SB.woff2');
        });
    });
});
