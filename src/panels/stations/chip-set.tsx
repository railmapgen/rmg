import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, makeStyles, Avatar, Icon, createStyles, useMediaQuery } from '@material-ui/core';
import { StationInfo } from '../../types';

const useStyles = makeStyles(theme => {
    return createStyles({
        root: {
            backgroundColor: theme.palette.background.paper, 
            height: 55, 
            borderRadius: 8, 
            boxShadow: theme.shadows[1]
        },
        rootSize: {
            margin: 8, 
            width: 'calc((100% - 96px) / 6)', 
        }, 
        rootSizeTablet: {
            margin: 6, 
            width: 'calc((100% - 48px) / 4)', 
        }, 
        rootSizeMobile: {
            margin: 6, 
            width: 'calc((100% - 24px) / 2)', 
        }, 
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
        addChipLabel: {
            fontWeight: 500, 
            fontSize: '1rem', 
            lineHeight: '1.2rem', 
            textAlign: 'center', 
            width: '100%', 
        }, 
        stnChipLabel: {
            width: '100%'
        }
    });
})

interface StationChipSetProps {
    stnList: {
        [stnId: string]: StationInfo;
    };
    tpo: string[];
    onSelection: (stnId: string) => void;
    addStationClick: () => void;
}

export default function StationChipSet(props: StationChipSetProps) {
    const {t, i18n} = useTranslation();
    const isTablet = useMediaQuery('(max-width: 839px) and (min-width: 480px)');
    const isMobile = useMediaQuery('(max-width: 480px)');
    const classes = useStyles();

    // const tpo = React.useMemo(() => props.tpo, [props.tpo.toString()]);
    // const {tpo, stnList} = React.useMemo(() => props, [JSON.stringify(props.stnList)])

    return (
        <div>
            <Chip
                key="add_stn"
                icon={<Avatar style={{backgroundColor: 'unset'}}><Icon>add_box</Icon></Avatar>}
                label={t('stations.add.button')}
                className={
                    `${classes.root} ${
                        isMobile ? classes.rootSizeMobile : (isTablet ? classes.rootSizeTablet : classes.rootSize)
                    }`
                }
                classes={{label: classes.addChipLabel}}
                onClick={props.addStationClick}
            />
            {props.tpo.map((stnId,i) => {
                let label = (
                    <span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextZH}`}>
                            {props.stnList[stnId]?.name[0] || ''}
                        </span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextEN}`}>
                            {props.stnList[stnId]?.name[1].replace('\\','\r\n') || ''}
                        </span>
                    </span>
                );
                return (
                    <Chip 
                        key={stnId} 
                        icon={window.urlParams.get('style')==='gzmtr' && 
                            <Avatar style={{backgroundColor: 'unset'}}>{props.stnList[stnId]?.num || '00'}</Avatar>}
                        label={label}
                        onClick={() => props.onSelection(stnId)}
                        classes={{label: classes.stnChipLabel}}
                        className={
                            `${classes.root} ${
                                isMobile ? classes.rootSizeMobile : (isTablet ? classes.rootSizeTablet : classes.rootSize)
                            }`
                        } />
                )
            })}
        </div>
    )
}