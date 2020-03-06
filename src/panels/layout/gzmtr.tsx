import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RMGLineGZ } from '../../Line/LineGZ';
import { Slider } from '@material-ui/core';
import StyledExpansionPanel from './styled-expansion-panel';

interface Props {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;

    directionGZX: number;
    directionGZY: number;
    paramUpdate: (key, data) => void;
}

const LayoutGZMTR = (props: Props) => {
    const { t } = useTranslation();

    const [isGrow, setIsGrow] = React.useState(false);
    React.useEffect(() => {
        setIsGrow(true);
        return () => setIsGrow(false);
    }, []);


    const directionGZXChange = (_, value: number) => {
        props.paramUpdate('direction_gz_x', value);
        (window.myLine as RMGLineGZ).directionGZX = value;
    }

    const directionGZYChange = (_, value: number) => {
        props.paramUpdate('direction_gz_y', value);
        (window.myLine as RMGLineGZ).directionGZY = value;
    }

    const directionGZPanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={1000}
            expanded={props.expanded === 4} onChange={props.onChange(4)}
            icon="open_with" heading={t('layout.directionGZ.title')}>
            <Slider
                value={props.directionGZX}
                onChange={directionGZXChange}
                step={0.01}
                marks={[
                    { value: 0, label: t('layout.directionGZ.left') },
                    { value: 100, label: t('layout.directionGZ.right') }
                ]}
                valueLabelDisplay="auto" />
            <Slider
                value={props.directionGZY}
                onChange={directionGZYChange}
                step={0.01}
                marks={[
                    { value: 0, label: t('layout.directionGZ.top') },
                    { value: 100, label: t('layout.directionGZ.bottom') }
                ]}
                valueLabelDisplay="auto" />
        </StyledExpansionPanel>
    ), [props.expanded, props.directionGZX, props.directionGZY, isGrow]);

    return (
        <>
            {directionGZPanel}
        </>
    );
}

export default LayoutGZMTR;