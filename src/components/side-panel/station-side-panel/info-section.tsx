import { Box, Heading } from '@chakra-ui/react';
import {
    toggleStationSecondaryName,
    updateStationName,
    updateStationNum,
    updateStationSecondaryName,
} from '../../../redux/param/action';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { RmgStyle } from '../../../constants/constants';
import { RmgButtonGroup, RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';

export default function InfoSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    console.log('InfoSection:: Rendering for', selectedStation);
    const style = useRootSelector(state => state.param.style);
    const { num, localisedName, currentLocalisedSecondaryName } = useRootSelector(
        state => state.param.stn_list[selectedStation]
    );

    const fields: RmgFieldsField[] = [
        {
            type: 'input',
            label: t('StationSidePanel.info.num'),
            value: num,
            placeholder: '01',
            onChange: (value: string) => dispatch(updateStationNum(selectedStation, value)),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: t('Chinese name'),
            value: localisedName.zh ?? '',
            onChange: (value: string) => dispatch(updateStationName(selectedStation, 'zh', value)),
        },
        {
            type: 'input',
            label: t('English name'),
            value: localisedName.en ?? '',
            onChange: (value: string) => dispatch(updateStationName(selectedStation, 'en', value)),
        },
        {
            type: 'custom',
            label: t('Secondary names'),
            component: (
                <RmgButtonGroup
                    selections={
                        [
                            { label: t('Yes'), value: true },
                            { label: t('No'), value: false },
                        ] as { label: string; value: boolean }[]
                    }
                    defaultValue={!!currentLocalisedSecondaryName}
                    onChange={flag => dispatch(toggleStationSecondaryName(selectedStation, flag))}
                />
            ),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: t('StationSidePanel.info.zhSecondary'),
            value: currentLocalisedSecondaryName?.zh ?? '',
            placeholder: '1号航站楼',
            onChange: (value: string) => dispatch(updateStationSecondaryName(selectedStation, 'zh', value)),
            hidden: !currentLocalisedSecondaryName || ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: t('StationSidePanel.info.enSecondary'),
            value: currentLocalisedSecondaryName?.en ?? '',
            placeholder: 'Terminal 1',
            onChange: (value: string) => dispatch(updateStationSecondaryName(selectedStation, 'en', value)),
            hidden: !currentLocalisedSecondaryName || ![RmgStyle.GZMTR].includes(style),
        },
    ];

    return (
        <Box p={1}>
            <Heading as="h5" size="sm">
                {t('StationSidePanel.info.title')}
            </Heading>

            <RmgFields fields={fields} minW={130} />
        </Box>
    );
}
