import { useTranslation } from 'react-i18next';
import { FACILITIES, RmgStyle, Services, TEMP } from '../../../constants/constants';
import { RmgButtonGroup, RmgFieldsField } from '@railmapgen/rmg-components';

interface UseStationEditFieldsProps {
    style: RmgStyle;
    values: {
        services: Services[];
        facility: string;
        loop_pivot?: boolean;
        one_line: boolean;
        int_padding?: number;
        character_spacing?: number;
        underConstruction?: boolean | TEMP;
    };
    handlers: {
        onServicesChange: (val: Services[]) => void;
        onFacilityChange: (val: string | number) => void;
        onLoopPivotChange?: (val: boolean) => void;
        onOneLineChange: (val: boolean) => void;
        onIntPaddingChange: (val: number) => void;
        onCharacterSpacingChange: (val: number) => void;
        onUnderConstructionChange: (val: boolean | TEMP) => void;
        // Optional global apply handlers (only for single station mode)
        onApplyIntPaddingToAll?: () => void;
        onApplyCharacterSpacingToAll?: () => void;
    };
    loop?: boolean;
}

// Constants for configuration
const SERVICE_ALLOW_CONFIG: Record<string, Services[]> = {
    [RmgStyle.GZMTR]: [Services.express, Services.direct], // Only express and direct services allowed for Guangzhou Metro
    default: Object.values(Services), // All services allowed by default (e.g. for SHMetro)
};

const FACILITY_ALLOW_CONFIG: Record<string, string[]> = {
    [RmgStyle.MTR]: ['airport', 'hsr', 'disney', 'np360'],
    [RmgStyle.SHMetro]: ['airport', 'hsr', 'railway', 'disney'],
    default: Object.keys(FACILITIES),
};

export const useStationEditFields = (props: UseStationEditFieldsProps): RmgFieldsField[] => {
    const { t } = useTranslation();
    const { style, values, handlers, loop } = props;

    // Filter available train services based on current style
    const allowedServices = SERVICE_ALLOW_CONFIG[style] || SERVICE_ALLOW_CONFIG.default;
    const serviceSelections = Object.values(Services).map(service => ({
        label: t('StationSidePanel.more.' + service),
        value: service,
        disabled: !allowedServices.includes(service),
    }));

    // Filter available facilities (like toilets, elevators) based on current style
    const allowedFacilities = FACILITY_ALLOW_CONFIG[style] || FACILITY_ALLOW_CONFIG.default;
    const facilityOptions = Object.fromEntries([
        ['', t('None')],
        ...Object.entries(FACILITIES)
            .filter(([f]) => allowedFacilities.includes(f))
            .map(([f, name]) => [f, t(name)]),
    ]);

    const fields: RmgFieldsField[] = [
        {
            type: 'custom',
            label: t('StationSidePanel.more.service'),
            component: (
                <RmgButtonGroup
                    selections={serviceSelections}
                    defaultValue={values.services}
                    onChange={handlers.onServicesChange}
                    multiSelect
                />
            ),
            hidden: ![RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style),
        },
        {
            type: 'select',
            label: t('StationSidePanel.more.facility'),
            value: values.facility,
            options: facilityOptions,
            onChange: handlers.onFacilityChange,
            hidden: ![RmgStyle.MTR, RmgStyle.SHMetro].includes(style),
        },
        // Loop Pivot (Specific to loop lines)
        ...(handlers.onLoopPivotChange
            ? ([
                  {
                      type: 'switch',
                      label: t('StationSidePanel.more.pivot'),
                      isChecked: values.loop_pivot ?? false,
                      onChange: handlers.onLoopPivotChange,
                      hidden: ![RmgStyle.GZMTR, RmgStyle.SHMetro].includes(style) || !loop,
                      oneLine: true,
                      minW: 'full',
                  },
              ] as RmgFieldsField[])
            : []),
        {
            type: 'switch',
            label: t('StationSidePanel.more.oneLine'),
            isChecked: values.one_line,
            onChange: handlers.onOneLineChange,
            hidden: ![RmgStyle.SHMetro].includes(style),
            oneLine: true,
            minW: 'full',
        },
        {
            type: 'input',
            label: t('StationSidePanel.more.intPadding'),
            value: values.int_padding?.toString() || '',
            validator: val => !isNaN(Number(val)),
            onChange: val => handlers.onIntPaddingChange(Number(val)),
            hidden: ![RmgStyle.SHMetro].includes(style),
            debouncedDelay: 300,
        },
        // Global apply for int_padding (Single station only)
        // When the handler is provided, it will be appended as an additional field
        ...(handlers.onApplyIntPaddingToAll
            ? ([
                  {
                      type: 'custom',
                      label: t('StationSidePanel.more.intPaddingApplyGlobal'),
                      component: (
                          <RmgButtonGroup
                              selections={[{ label: t('StationSidePanel.more.apply'), value: '', disabled: false }]}
                              defaultValue=""
                              onChange={handlers.onApplyIntPaddingToAll}
                          />
                      ),
                      oneLine: true,
                      hidden: ![RmgStyle.SHMetro].includes(style),
                  },
              ] as RmgFieldsField[])
            : []),
        {
            type: 'input',
            label: t('StationSidePanel.more.characterSpacing'),
            value: values.character_spacing?.toString() || '',
            validator: val => !isNaN(Number(val)),
            onChange: val => handlers.onCharacterSpacingChange(Number(val)),
            hidden: ![RmgStyle.SHSuburbanRailway].includes(style),
            debouncedDelay: 300,
        },
        // Global apply for character_spacing (Single station only)
        ...(handlers.onApplyCharacterSpacingToAll
            ? ([
                  {
                      type: 'custom',
                      label: t('StationSidePanel.more.intPaddingApplyGlobal'),
                      component: (
                          <RmgButtonGroup
                              selections={[{ label: t('StationSidePanel.more.apply'), value: '', disabled: false }]}
                              defaultValue=""
                              onChange={handlers.onApplyCharacterSpacingToAll}
                          />
                      ),
                      oneLine: true,
                      hidden: ![RmgStyle.SHSuburbanRailway].includes(style),
                  },
              ] as RmgFieldsField[])
            : []),
        {
            type: 'custom',
            label: t('Under construction'),
            component: (
                <RmgButtonGroup
                    selections={
                        [
                            { label: t('No'), value: false },
                            { label: t('Temporary'), value: 'temp' },
                            { label: t('Yes'), value: true },
                        ] as { label: string; value: boolean | TEMP }[]
                    }
                    defaultValue={values.underConstruction ?? false}
                    onChange={handlers.onUnderConstructionChange}
                />
            ),
            hidden: ![RmgStyle.GZMTR].includes(style),
        },
    ];

    return fields;
};
