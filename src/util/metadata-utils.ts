import rmgRuntime from '@railmapgen/rmg-runtime';

export const updateTitle = (title: string) => {
    document.title = title;
    setTimeout(() => {
        rmgRuntime.updateAppMetadata({ title });
    }, 200);
};
