import { waitForMs } from '../../util/utils';

export const waitForFontReady = async () => {
    let retryAttempt = 3;

    while (retryAttempt--) {
        // #274 ready font fact set may not contain GenYoMin when first resolved
        const fontFaceSet = await document.fonts.ready;
        const it = fontFaceSet.values();
        while (true) {
            const next = it.next();
            if (next.done) {
                break;
            }

            if (next.value.family === 'GenYoMin TW') {
                return;
            }
        }

        console.log('GenYoMin is NOT ready. Retry attempts remaining: ' + retryAttempt + ' ...');
        await waitForMs(500);
    }

    throw new Error('Failed to load GenYoMin after 3 attempts');
};
