import { MDCList } from '@material/list';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';

export function common() {
    // instantiating mdc
    const pidsList = new MDCList($('#pids_list')[0]);
    const [durationField, framerateField] = 
        ['#duration', '#framerate'].map(selector => new MDCTextField($('#panel_pids').find(selector)[0]));
    $('#panel_pids .mdc-list li').map((_,el) => new MDCRipple(el));

    // init values
    // initial values for durationField and framerateField?
    // durationField.value = '00:01:02:24';

    // add event listeners
    pidsList.listen('MDCList:action', (event: CustomEvent) => {
        switch (event.detail.index) {
            case 2:
                console.log('start');
                break;
            case 3:
                console.log('end');
                break;
            case 4:
                console.log('timetable');
                break;
        }
    });

    ($(durationField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => {
            // maybe on change is more appropriate?
            console.log(event.target.value);
        });
}
