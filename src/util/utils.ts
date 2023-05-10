export const downloadAs = (filename: string, type: string, data: any) => {
    const blob = new Blob([data], { type });
    downloadBlobAs(filename, blob);
};

export const downloadBlobAs = (filename: string, blob: Blob) => {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File) => {
    return new Promise((resolve: (text: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsText(file);
    });
};

export const isSafari = () => {
    return navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
};

export const getRelativeTime = (timestamp?: number): string[] => {
    if (timestamp) {
        const deltaSeconds = new Date().getTime() - timestamp;
        if (deltaSeconds < 60 * 1000) {
            return ['Just now'];
        } else if (deltaSeconds < 2 * 60 * 1000) {
            return ['1', 'minute ago'];
        } else if (deltaSeconds < 60 * 60 * 1000) {
            return [Math.floor(deltaSeconds / 1000 / 60).toString(), 'minutes ago'];
        } else if (deltaSeconds < 2 * 60 * 60 * 1000) {
            return ['1', 'hour ago'];
        } else if (deltaSeconds < 24 * 60 * 60 * 1000) {
            return [Math.floor(deltaSeconds / 1000 / 60 / 60).toString(), 'hours ago'];
        } else if (deltaSeconds < 48 * 60 * 60 * 1000) {
            return ['1', 'day ago'];
        } else {
            return [Math.floor(deltaSeconds / 1000 / 60 / 60 / 24).toString(), 'days ago'];
        }
    } else {
        return ['Unknown'];
    }
};

export const waitForMs = (ms: number) => {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
};
