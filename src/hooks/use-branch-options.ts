import { useTranslation } from 'react-i18next';
import { useRootSelector } from '../redux';
import { RmgStyle } from '../constants/constants';
import { isColineBranch } from '../redux/param/coline-action';
import { ComboboxItem } from '@mantine/core';

export default function useBranchOptions(): ComboboxItem[] {
    const { t } = useTranslation();
    const { style, stn_list: stationList, loop } = useRootSelector(state => state.param);
    const branches = useRootSelector(state => state.helper.branches);

    return branches.map((branch, i) => {
        if (i === 0) {
            return {
                value: i.toString(),
                label: loop ? t('Loop line') : t('GridTabs.main'),
            };
        } else {
            if (style !== RmgStyle.SHMetro || !isColineBranch(branch, stationList)) {
                return {
                    value: i.toString(),
                    label: t('GridTabs.branch') + ' ' + i,
                    disabled: loop,
                };
                // {loop && (
                //   <MdWarning
                //     style={{ marginLeft: 5 }}
                //     title={t('Branches are not supported in the loop line.')}
                //   />
                // )}
            } else {
                return { value: i.toString(), label: t('GridTabs.external') + ' ' + i };
            }
        }
    });
}
