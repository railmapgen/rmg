import { FILE_NOT_FOUND } from './storageService';

export default class StorageLocalStorage {
    private currentBusyFilename: false | string;

    constructor() {
        this.currentBusyFilename = false;
    }

    async init() {
        console.warn('Using localStorage, please update your browser');

        if (!window.localStorage) {
            alert('Local storage is not available! Please upgrade to a newer browser!');
            throw new Error('LocalStorage unavailable');
        }

        try {
            window.localStorage.setItem('storage_test', '1');
            window.localStorage.removeItem('storage_test');
        } catch (e) {
            alert(
                "Local storage is not accessible! Please modify your browser's settings or try with another browser!"
            );
            throw new Error('LocalStorage no write permission');
        }
    }

    async writeFile(filename: string, contents: string) {
        if (this.currentBusyFilename === filename) {
            console.warn('Attempt to write', filename, 'while write process is not finished!');
        }

        this.currentBusyFilename = filename;
        window.localStorage.setItem(filename, contents);
        this.currentBusyFilename = false;
    }

    async readFile(filename: string) {
        if (this.currentBusyFilename === filename) {
            console.warn('Attempt to read', filename, 'while write process is not finished!');
        }

        const contents = window.localStorage.getItem(filename);
        if (!contents) {
            throw new Error(FILE_NOT_FOUND);
        }
        return contents;
    }

    async deleteFile(filename: string) {
        if (this.currentBusyFilename === filename) {
            console.warn('Attempt to delete', filename, 'while write process is not finished!');
        }

        this.currentBusyFilename = filename;
        window.localStorage.removeItem(filename);
        this.currentBusyFilename = false;
    }
}
