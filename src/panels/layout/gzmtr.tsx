import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RMGLineGZ } from '../../Line/LineGZ';
import { Slider } from '@material-ui/core';
import StyledExpansionPanel from './styled-expansion-panel';
import { ParamContext } from '../../context';

interface Props {
    expanded: false | number;
    onChange: (index: number) => (event, isExpanded: boolean) => void;
}

const LayoutGZMTR = (props: Props) => {
    const { t } = useTranslation();

    const { param, dispatch } = React.useContext(ParamContext);

    const [isGrow, setIsGrow] = React.useState(false);
    React.useEffect(() => {
        setIsGrow(true);
        return () => setIsGrow(false);
    }, []);

    const directionGZPanel = React.useMemo(() => (
        <StyledExpansionPanel in={isGrow} growTimeout={1000}
            expanded={props.expanded === 4} onChange={props.onChange(4)}
            icon="open_with" heading={t('layout.directionGZ.title')}>
            <Slider
                value={param.direction_gz_x}
                onChange={(_, value: number) => dispatch({ type: 'SET_DIRECTION_GZ_X', value })}
                step={0.01}
                marks={[
                    { value: 0, label: t('layout.directionGZ.left') },
                    { value: 100, label: t('layout.directionGZ.right') }
                ]}
                valueLabelDisplay="auto" />
            <Slider
                value={param.direction_gz_y}
                onChange={(_, value: number) => dispatch({ type: 'SET_DIRECTION_GZ_Y', value })}
                step={0.01}
                marks={[
                    { value: 0, label: t('layout.directionGZ.top') },
                    { value: 100, label: t('layout.directionGZ.bottom') }
                ]}
                valueLabelDisplay="auto" />
        </StyledExpansionPanel>
    ), [props.expanded, isGrow, param.direction_gz_x, param.direction_gz_y]);

    return (
        <>
            {directionGZPanel}
        </>
    );
}

export default LayoutGZMTR;