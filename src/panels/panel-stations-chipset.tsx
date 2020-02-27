import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, makeStyles, Avatar, Icon } from '@material-ui/core';
import { StationInfo } from '../types';

const useStyles = makeStyles({
    stnChipText: {
        display: 'block',
        textAlign: 'center' as 'center'
    },
    stnChipTextZH: {
        fontSize: 18, 
        fontFamily: 'Helvetica, Noto Serif KR, Noto Serif JP, Noto Serif TC, Noto Serif SC, serif', 
        fontWeight: 600,
        lineHeight: '1.2rem',
    }, 
    stnChipTextEN: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '.75rem', 
        lineHeight: '.9rem', 
        whiteSpace: 'pre' as 'pre', 
        overflow: 'hidden'
    }, 
})

interface StationChipSetProps {
    stnList: {
        [stnId: string]: StationInfo;
    };
    onSelection: (stnId: string) => void;
    addStationClick: () => void;
}

export default function StationChipSet(props: StationChipSetProps) {
    const {t, i18n} = useTranslation();
    const classes = useStyles();
    return (
        <div>
            <Chip
                key="add_stn"
                icon={<Icon>add_box</Icon>}
                label={t('stations.add.button')}
                className={'stn-chip'}
                classes={{label: 'stn-chip__label'}}
                onClick={props.addStationClick}
            />
            {window.myLine.tpo.map(stnId => {
                let label = (
                    <span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextZH}`}>
                            {props.stnList[stnId].name[0]}
                        </span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextEN}`}>
                            {props.stnList[stnId].name[1].replace('\\','\r\n')}
                        </span>
                    </span>
                );
                return (
                    <Chip 
                        key={stnId} 
                        icon={window.urlParams.get('style')==='gzmtr' && 
                            <Avatar style={{backgroundColor: 'unset'}}>{props.stnList[stnId].num}</Avatar>}
                        label={label}
                        onClick={() => props.onSelection(stnId)}
                        className={'stn-chip'} />
                )
            })}
        </div>
    )
}