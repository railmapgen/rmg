import { MDCList } from '@material/list';
import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';
import { MDCDialog } from '@material/dialog';
import { MDCSelect } from '@material/select';
import { getParams } from '../utils';

export function common() {
    // instantiating mdc
    const pidsList = new MDCList($('#pids_list')[0]);
    const pidsTimetableList = new MDCList($('#pids_timetable_list')[0])
    const [durationField, framerateField] = 
        ['#duration', '#framerate'].map(selector => new MDCTextField($('#panel_pids').find(selector)[0]));
    const rangeDialog = new MDCDialog($('#panel_pids #range_diag')[0]);
    const timetableDialog = new MDCDialog($('#panel_pids #timetable_diag')[0]);
    const [startSelect, endSelect] = 
        ['start', 'end'].map(selector => new MDCSelect($('#panel_pids #range_diag').find('#pids_'+selector)[0]));
    $('#panel_pids .mdc-list li').map((_,el) => new MDCRipple(el));

    // init values
    durationField.value = '00:00:10:00'; // TODO: read from param
    framerateField.value = '24'; // TODO: read from param

    let stnList = getParams().stn_list;
    window.myLine.tpo.forEach(stnId => {
        $('#pids_start__selection, #pids_end__selection').append(
            $('<li>', {'data-value':stnId})
            .addClass('mdc-list-item')
            .text(window.urlParams.get('style')==='gzmtr' ? 
                `${stnList[stnId].num}: ${stnList[stnId].name.join()}` :
                stnList[stnId].name.join())
        );
    });

    // add event listeners
    pidsList.listen('MDCList:action', (event: CustomEvent) => {
        switch (event.detail.index) {
            case 2:
                rangeDialog.open();
                break;
            case 3:
                // Todo: add list automatically
                // _refreshTimetable()
                timetableDialog.open();
                break;
        }
    });

    function _refreshTimetable() {
        $('#pids_timetable_list').empty()
        window.myPids.timetableStnName.map(stnId => {
            $('#pids_timetable_list').append(
                $('<li>', { 'data-value': stnId })
                    .addClass('mdc-list-item')
                    .text(window.urlParams.get('style') === 'gzmtr' ?
                        `${stnList[stnId].num}: ${stnList[stnId].name.join()}` :
                        stnList[stnId].name.join())
            )
        }
        )
    }

    ($(durationField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => {
            window.myPids.duration = event.target.value;
        });

    ($(framerateField.root_).find('input') as JQuery<HTMLInputElement>)
        .on('input', event => {
            window.myPids.frameRate = event.target.value;
        });

    // TODO: should selection of startSelect affect endSelect or vice versa?
    // if yes, consider adding event listener to hide selections
    // startSelect.listen('MDCSelect:change', event => {
    //     $('#pids_end__selection li').eq(?).hide();
    // })

    rangeDialog.listen('MDCDialog:closed', () => {
        console.log(startSelect.value, endSelect.value);
    });
}
