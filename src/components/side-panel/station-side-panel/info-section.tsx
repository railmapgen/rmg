import { Box, Heading } from '@chakra-ui/react';
import { updateStationName, updateStationNum, updateStationSecondaryName } from '../../../redux/param/action';
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
    const { num, name, secondaryName } = useRootSelector(state => state.param.stn_list[selectedStation]);

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
            value: name[0],
            onChange: (value: string) => dispatch(updateStationName(selectedStation, [value, name[1]])),
        },
        {
            type: 'input',
            label: t('English name'),
            value: name[1],
            onChange: (value: string) => dispatch(updateStationName(selectedStation, [name[0], value])),
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
                    defaultValue={!!secondaryName}
                    onChange={flag =>
                        dispatch(updateStationSecondaryName(selectedStation, flag ? ['', ''] : undefined))
                    }
                />
            ),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: t('StationSidePanel.info.zhSecondary'),
            value: secondaryName ? secondaryName[0] : '',
            placeholder: '1号航站楼',
            onChange: (value: string) =>
                dispatch(updateStationSecondaryName(selectedStation, [value, secondaryName ? secondaryName[1] : ''])),
            hidden: !secondaryName || ![RmgStyle.GZMTR].includes(style),
        },
        {
            type: 'input',
            label: t('StationSidePanel.info.enSecondary'),
            value: secondaryName ? secondaryName[1] : '',
            placeholder: 'Terminal 1',
            onChange: (value: string) =>
                dispatch(updateStationSecondaryName(selectedStation, [secondaryName ? secondaryName[0] : '', value])),
            hidden: !secondaryName || ![RmgStyle.GZMTR].includes(style),
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
