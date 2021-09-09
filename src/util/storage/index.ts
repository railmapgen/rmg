import StorageLocalStorage from './storageLocalStorage';
import StorageService from './storageService';

export default async function getRmgStorage(): Promise<StorageService> {
    if (!window.indexedDB) {
        console.log('IndexedDB not supported');
        return new StorageLocalStorage();
    }

    return await new Promise<StorageService>(resolve => {
        try {
            const request = window.indexedDB.open('indexeddb_feature_detection', 1);

            request.onerror = err => {
                console.log('IndexedDB can NOT be accessed:', err);
                console.log('Fallback to LocalStorage');
                resolve(new StorageLocalStorage());
            };

            request.onsuccess = () => {
                console.log('IndexedDB can be accessed');
                // TODO: toggle on indexedDB
                // resolve(new StorageIndexedDB());
                resolve(new StorageLocalStorage());
            };
        } catch (error) {
            console.warn('Error while opening IndexedDB:', error);
            resolve(new StorageLocalStorage());
        }
    });
}
