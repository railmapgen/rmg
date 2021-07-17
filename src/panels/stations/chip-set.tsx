import React, { useContext } from 'react';
import { Avatar, Chip, createStyles, makeStyles, useMediaQuery } from '@material-ui/core';
import { ParamContext } from '../../context';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { RmgStyle, StationDict, StationInfo } from "../../constants/constants";

const useStyles = makeStyles(theme => {
    return createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            height: 55,
            borderRadius: 8,
            boxShadow: theme.shadows[1],
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
            textAlign: 'center',
        },
        stnChipTextZH: {
            fontSize: 18,
            fontWeight: 500,
            lineHeight: '1.2rem',
        },
        stnChipTextEN: {
            fontSize: '.75rem',
            lineHeight: '.9rem',
            whiteSpace: 'pre',
            overflow: 'hidden',
        },
        addChipLabel: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: '1.2rem',
            textAlign: 'center',
            width: '100%',
        },
        stnChipLabel: {
            width: '100%',
        },
    });
});

interface StationChipSetProps {
    stnList: StationDict;
    onSelection: (stnId: string) => () => void;
    addStationClick: () => void;
}

const StationChipSet = React.memo(
    (props: StationChipSetProps) => {
        const rmgStyle = useSelector((store: RootState) => store.app.rmgStyle);
        const { tpo } = useContext(ParamContext);

        const isTablet = useMediaQuery('(max-width: 839px) and (min-width: 480px)');
        const isMobile = useMediaQuery('(max-width: 480px)');
        const classes = useStyles();

        return (
            <div>
                {tpo.map((stnId, i) => {
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
                            icon={
                                rmgStyle !== RmgStyle.GZMTR ? (
                                    <></>
                                ) : (
                                    <Avatar style={{ backgroundColor: 'unset' }}>
                                        {props.stnList[stnId]?.num || '00'}
                                    </Avatar>
                                )
                            }
                            label={label}
                            onClick={props.onSelection(stnId)}
                            classes={{ label: classes.stnChipLabel }}
                            className={`${classes.root} ${
                                isMobile ? classes.rootSizeMobile : isTablet ? classes.rootSizeTablet : classes.rootSize
                            }`}
                        />
                    );
                })}
            </div>
        );
    },
    (prevProps, nextProps) => {
        const getDeps = (stnList: { [stnId: string]: StationInfo }) =>
            Object.keys(stnList).reduce(
                (acc, cur) =>
                    acc +
                    cur +
                    ((...k: (keyof StationInfo)[]) => (o: StationInfo) =>
                        k.reduce((a, c) => a + JSON.stringify(o[c]), ''))(
                        'name',
                        'num'
                    )(stnList[cur]),
                ''
            );

        return getDeps(prevProps.stnList) === getDeps(nextProps.stnList);
    }
);

export default StationChipSet;
