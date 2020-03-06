import * as React from 'react';
import { Chip, makeStyles, Avatar, createStyles, useMediaQuery } from '@material-ui/core';
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
            textAlign: 'center'
        },
        stnChipTextZH: {
            fontSize: 18,
            fontFamily: 'Helvetica, Arial, Noto Serif KR, Noto Serif JP, Noto Serif TC, Noto Serif SC, HiraMinProN-W6, serif',
            fontWeight: 600,
            lineHeight: '1.2rem',
        },
        stnChipTextEN: {
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '.75rem',
            lineHeight: '.9rem',
            whiteSpace: 'pre',
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
    onSelection: (stnId: string) => () => void;
    addStationClick: () => void;
}

const StationChipSet = React.memo((props: StationChipSetProps) => {
    
    const isTablet = useMediaQuery('(max-width: 839px) and (min-width: 480px)');
    const isMobile = useMediaQuery('(max-width: 480px)');
    const classes = useStyles();

    return (
        <div>
            {props.tpo.map((stnId, i) => {
                let label = (
                    <span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextZH}`}>
                            {props.stnList[stnId]?.name[0] || ''}
                        </span>
                        <span className={`${classes.stnChipText} ${classes.stnChipTextEN}`}>
                            {props.stnList[stnId]?.name[1].replace('\\', '\r\n') || ''}
                        </span>
                    </span>
                );
                return (
                    <Chip
                        key={stnId}
                        icon={window.urlParams.get('style') !== 'gzmtr' ? <></> :
                            <Avatar style={{ backgroundColor: 'unset' }}>{props.stnList[stnId]?.num || '00'}</Avatar>}
                        label={label}
                        onClick={props.onSelection(stnId)}
                        classes={{ label: classes.stnChipLabel }}
                        className={
                            `${classes.root} ${
                            isMobile ? classes.rootSizeMobile : (isTablet ? classes.rootSizeTablet : classes.rootSize)
                            }`
                        } />
                )
            })}
        </div>
    )
}, (prevProps, nextProps) => {
    if (prevProps.tpo.toString() !== nextProps.tpo.toString()) {
        return false;
    } else {
        let prevDeps = {};
        let nextDeps = {};
        Object.keys(nextProps.stnList).forEach(stnId => {
            let { name, num } = nextProps.stnList[stnId];
            nextDeps[stnId] = { name, num };
        });
        Object.keys(prevProps.stnList).forEach(stnId => {
            let { name, num } = prevProps.stnList[stnId];
            prevDeps[stnId] = { name, num };
        });
        return JSON.stringify(prevDeps) === JSON.stringify(nextDeps);
    }
});

export default StationChipSet;
