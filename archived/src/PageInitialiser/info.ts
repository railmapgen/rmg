export function common() {
    $('#panel_info .mdc-card__actions #report').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator/issues', '_blank');
    });
    $('#panel_info .mdc-card__action-icons [title="Star"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator', '_blank');
    });
    $('#panel_info .mdc-card__action-icons [title="Fork"]').on('click', () => {
        window.open('https://github.com/wongchito/RailMapGenerator/fork', '_blank');
    });
}