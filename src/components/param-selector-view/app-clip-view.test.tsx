import { createParamInLocalStorage, createTestStore } from '../../setupTests';
import { render } from '../../test-utils';
import AppClipView from './app-clip-view';
import { fireEvent, screen, waitFor } from '@testing-library/react';

describe('AppClipView', () => {
    it('Can broadcast selected param as expected', async () => {
        createParamInLocalStorage('test-id');
        render(<AppClipView />, { store: createTestStore(), route: '/import?parentId=test-id' });

        // mock broadcast channel receiver
        const messages: any[] = [];
        const receiver = new BroadcastChannel('rmg-bridge--test-id');
        receiver.onmessage = message => {
            messages.push(message.data);
        };

        // select project
        fireEvent.click(screen.getByRole('button', { name: /test-id/ }));
        expect(screen.getByRole('button', { name: /test-id/ })).toHaveAttribute('aria-pressed', 'true');

        // click import
        fireEvent.click(screen.getByRole('button', { name: 'Import' }));
        await waitFor(() => expect(messages).toHaveLength(1));
        expect(messages).toContainEqual(expect.objectContaining({ event: 'IMPORT' }));

        // deselect project
        expect(screen.getByRole('button', { name: /test-id/ })).toHaveAttribute('aria-pressed', 'false');
    });
});
