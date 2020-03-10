import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, createStyles, Grow, ExpansionPanel, ExpansionPanelSummary, Tooltip, Icon, Typography, ExpansionPanelDetails } from '@material-ui/core';

const useStyles = makeStyles(theme => (
    createStyles({
        icon: {
            minWidth: 48,
            color: theme.palette.action.active,
        },
        heading: {
            flexBasis: '50%',
            flexShrink: 0,
            color: theme.palette.text.primary,
        },
        secondaryHeading: {
            color: theme.palette.text.secondary,
        }
    })
))

interface Props {
    in: boolean;
    growTimeout: number;
    expanded: boolean;
    onChange: (event: React.ChangeEvent<{}>, expanded: boolean) => void;
    icon: string;
    heading: string;
    secondaryHeading?: React.ReactNode;
    children?: React.ReactNode;
}

const StyledExpansionPanel = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <Grow in={props.in} style={{ transformOrigin: '0 0 1' }} timeout={props.growTimeout}>
            <ExpansionPanel expanded={props.expanded} onChange={props.onChange}>
                <ExpansionPanelSummary
                    expandIcon={
                        <Tooltip title={props.expanded ? t('expansion.collapse') : t('expansion.expand')}>
                            <Icon>expand_more</Icon>
                        </Tooltip>
                    }
                >
                    <Icon className={classes.icon}>{props.icon}</Icon>
                    <Typography className={classes.heading}>{props.heading}</Typography>
                    <Typography className={classes.secondaryHeading}>{props.secondaryHeading}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                    {props.children}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Grow>
    );
}

export default StyledExpansionPanel;