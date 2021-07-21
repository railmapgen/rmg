export default function autoSaveScheduler() {
    setInterval(async () => {
        await window.rmgStorage.writeFile('rmgParamRedux', JSON.stringify(window.rmgStore.getState().param));
        console.log('Parameter auto saved!');
    }, 60 * 1000);
}
