import { FILE_NOT_FOUND } from './storageService';

export default class StorageIndexedDB<StorageService> {
    private database: IDBDatabase | null;
    private currentBusyFilename: false | string;

    constructor() {
        this.database = null;
        this.currentBusyFilename = false;
    }

    async init() {
        console.log('Using IndexedDB');
        const dbPromise: Promise<IDBDatabase> = new Promise((resolve, reject) => {
            const request = window.indexedDB.open('app_storage', 1);

            request.onerror = event => {
                console.error('IDB error:', event);
                reject('IndexedDB access error');
            };

            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = () => {
                const database = request.result;
                const objectStore = database.createObjectStore('files', { keyPath: 'filename' });
                objectStore.createIndex('filename', 'filename', { unique: true });

                objectStore.transaction.onerror = e => {
                    console.log('IDB transaction error:', e);
                    reject('IndexedDB transaction error during migration, check console output.');
                };

                objectStore.transaction.oncomplete = e => {
                    console.log('Object store completely initialised');
                    resolve(database);
                };
            };
        });

        this.database = await dbPromise;
    }

    writeFile(filename: string, contents: string) {
        if (this.currentBusyFilename === filename) {
            console.warn('Attempt to write', filename, 'while write process is not finished!');
        }
        if (!this.database) {
            return Promise.reject('StorageIndexedDB not ready');
        }

        this.currentBusyFilename = filename;
        const transaction = this.database.transaction(['files'], 'readwrite');

        return new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => {
                this.currentBusyFilename = false;
                resolve();
            };

            transaction.onerror = error => {
                this.currentBusyFilename = false;
                console.error('Error while writing', filename, ':', error);
                reject(error);
            };

            const store = transaction.objectStore('files');
            store.put({ filename, contents });
        });
    }

    readFile(filename: string) {
        if (!this.database) {
            return Promise.reject('StorageIndexedDB not ready');
        }

        this.currentBusyFilename = filename;
        const transaction = this.database.transaction(['files'], 'readonly');

        return new Promise<string>((resolve, reject) => {
            const store = transaction.objectStore('files');
            const request = store.get(filename);

            request.onsuccess = () => {
                this.currentBusyFilename = false;
                if (!request.result) {
                    reject(FILE_NOT_FOUND);
                    return;
                }
                resolve(request.result.contents);
            };

            request.onerror = error => {
                this.currentBusyFilename = false;
                console.error('Error while reading', filename, ':', error);
                reject(error);
            };
        });
    }

    deleteFile(filename: string) {
        if (this.currentBusyFilename === filename) {
            console.warn('Attempt to delete', filename, 'while write process is not finished!');
        }
        if (!this.database) {
            return Promise.reject('Storage not ready');
        }

        this.currentBusyFilename = filename;
        const transaction = this.database.transaction(['files'], 'readwrite');

        return new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => {
                this.currentBusyFilename = false;
                resolve();
            };

            transaction.onerror = error => {
                this.currentBusyFilename = false;
                console.error('Error while deleting', filename, ':', error);
                reject(error);
            };

            const store = transaction.objectStore('files');
            store.delete(filename);
        });
    }
}
