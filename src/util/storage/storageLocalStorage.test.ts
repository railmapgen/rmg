import StorageLocalStorage from './storageLocalStorage';

const storage = new StorageLocalStorage();
const mockFilename = 'test-file';
const mockFileContent = 'test content';

describe('Unit tests for LocalStorage implementation', () => {
    beforeAll(async () => {
        await storage.init();
    });

    afterEach(() => {
        window.localStorage.removeItem(mockFilename);
    });

    it('Can write to storage', async () => {
        await storage.writeFile(mockFilename, mockFileContent);
        expect(window.localStorage.getItem(mockFilename)).toBe(mockFileContent);
    });

    it('Can read from storage', async () => {
        window.localStorage.setItem(mockFilename, mockFileContent);
        const content = await storage.readFile(mockFilename);
        expect(content).toBe(mockFileContent);
    });

    it('Can delete from storage', async () => {
        window.localStorage.setItem(mockFilename, mockFileContent);
        await storage.deleteFile(mockFilename);
        expect(window.localStorage.getItem(mockFilename)).toBeNull();
    });
});
