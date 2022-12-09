import { vi } from 'vitest';
import { getAbsoluteUrl } from './export-utils';
import * as Utils from './utils';

const isSafariSpy = vi.spyOn(Utils, 'isSafari');
const originalEnv = process.env;

describe('ExportUtils', () => {
    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv, PUBLIC_URL: 'https://railmapgen.github.io/rmg' };
    });

    describe('ExportUtils - getAbsolutePath', () => {
        it('Can extract absolute CSS url for Safari', () => {
            const mockCssRule = {
                style: {
                    src: 'url("https://railmapgen.github.io/rmg/cdn/GenYoMin-TW-SB.woff2") format("woff2")',
                },
            };
            isSafariSpy.mockReturnValue(true);

            expect(getAbsoluteUrl(mockCssRule as any)).toBe(
                'https://railmapgen.github.io/rmg/cdn/GenYoMin-TW-SB.woff2'
            );
        });

        it('Can extract absolute CSS url for non Safari browsers', () => {
            const mockCssRule = {
                style: {
                    src: 'url("../cdn/GenYoMin-TW-SB.woff2") format("woff2")',
                },
            };
            isSafariSpy.mockReturnValue(false);

            expect(getAbsoluteUrl(mockCssRule as any)).toContain('/styles/../cdn/GenYoMin-TW-SB.woff2');
        });
    });
});
