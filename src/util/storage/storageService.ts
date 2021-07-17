export const FILE_NOT_FOUND = 'FILE_NOT_FOUND';

export default interface StorageService {
    init: () => Promise<void>;

    writeFile: (filename: string, contents: string) => Promise<void>;

    readFile: (filename: string) => Promise<string>;

    deleteFile: (filename: string) => Promise<void>;
}
