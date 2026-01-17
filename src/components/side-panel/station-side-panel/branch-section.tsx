import classes from '../side-panel.module.css';
import { BranchStyle, Direction } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { updateStationBranchFirstStation } from '../../../redux/param/action';
import { useTranslation } from 'react-i18next';
import { RMLabelledSegmentedControl, RMSection, RMSectionBody, RMSectionHeader } from '@railmapgen/mantine-components';
import { Fieldset, Group, NativeSelect, Switch, Text, Title } from '@mantine/core';
import clsx from 'clsx';

export default function BranchSection() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const selectedStation = useRootSelector(state => state.app.selectedStation);
    const stationList = useRootSelector(state => state.param.stn_list);
    const { parents, children, branch } = stationList[selectedStation];

    const getFirstStationOptions = (direction: Direction) => {
        return (direction === Direction.left ? parents : children).map(id => ({
            value: id,
            label: stationList[id].localisedName.zh + '/' + stationList[id].localisedName.en,
        }));
    };

    const positionOptions = [
        { value: 'upper', label: t('StationSidePanel.branch.upper') },
        { value: 'lower', label: t('StationSidePanel.branch.lower') },
    ];

    const getFields = (direction: Direction) => {
        const branchInfo = branch?.[direction];
        if (!branchInfo) return <></>;
        return (
            <Group gap="xs">
                <Switch size="xs" label={t('Through')} checked={branchInfo[0] === BranchStyle.through} />
                <NativeSelect
                    size="xs"
                    label={t('StationSidePanel.branch.firstStation')}
                    value={branchInfo[1]}
                    data={getFirstStationOptions(direction)}
                    onChange={({ currentTarget: { value } }) =>
                        dispatch(updateStationBranchFirstStation(selectedStation, direction, value))
                    }
                    flex={1}
                />
                <RMLabelledSegmentedControl
                    size="xs"
                    label={t('StationSidePanel.branch.position')}
                    value={(direction === Direction.left ? parents : children)[0] === branchInfo[1] ? 'upper' : 'lower'}
                    data={positionOptions}
                />
            </Group>
        );
    };

    return (
        <RMSection>
            <RMSectionHeader>
                <Title order={3} size="h4">
                    {t('Branches')}
                </Title>
            </RMSectionHeader>

            <RMSectionBody className={clsx(classes['section-body'], classes.fields)}>
                <Fieldset legend={t('Branch on the left')}>
                    {parents.length === 2 ? (
                        getFields(Direction.left)
                    ) : (
                        <Text fs="italic" style={{ textAlign: 'center' }}>
                            {t('No branches found')}
                        </Text>
                    )}
                </Fieldset>

                <Fieldset legend={t('Branch on the right')}>
                    {children.length === 2 ? (
                        getFields(Direction.right)
                    ) : (
                        <Text fs="italic" style={{ textAlign: 'center' }}>
                            {t('No branches found')}
                        </Text>
                    )}
                </Fieldset>
            </RMSectionBody>
        </RMSection>
    );
}
