import { vi } from 'vitest';
import { waitForFontReady } from './utils';

describe('MTRUtils', () => {
    describe('MTRUtils - font', () => {
        const setFontFaceSet = (...familyList: string[]) => {
            (Document.prototype as any).fonts = {
                ready: Promise.resolve(familyList.map(family => ({ family }))),
            };
        };

        const mockResolve = vi.fn();
        const mockReject = vi.fn();

        it('Can reject font ready promise if GenYoMin is not loaded after 3 attempts', () =>
            new Promise<void>(done => {
                setFontFaceSet('Arial');
                waitForFontReady()
                    .then(mockResolve)
                    .catch(mockReject)
                    .finally(() => {
                        expect(mockResolve).toBeCalledTimes(0);
                        expect(mockReject).toBeCalledTimes(1);
                        done();
                    });
            }));

        it('Can reject font ready promise if GenYoMin is not loaded', () =>
            new Promise<void>(done => {
                setFontFaceSet('Arial', 'GenYoMin TW');
                waitForFontReady()
                    .then(mockResolve)
                    .catch(mockReject)
                    .finally(() => {
                        expect(mockResolve).toBeCalledTimes(1);
                        expect(mockReject).toBeCalledTimes(0);
                        done();
                    });
            }));
    });
});
