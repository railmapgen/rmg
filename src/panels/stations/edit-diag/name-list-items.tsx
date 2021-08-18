import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItem, ListItemIcon, TextField, makeStyles, createStyles } from '@material-ui/core';
import { Name } from '../../../constants/constants';

const useStyles = makeStyles(() =>
    createStyles({
        listItemIcon: {
            width: '1em',
            fontSize: '1.5rem',
            textAlign: 'center',
        },
    })
);

interface Props {
    onUpdate: (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: Name;
}

const NameListItems = (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return React.useMemo(
        () => (
            <>
                <ListItem>
                    <ListItemIcon>
                        <span className={classes.listItemIcon}>文</span>
                    </ListItemIcon>
                    <TextField
                        style={{ width: '100%' }}
                        variant="outlined"
                        label={t('stations.edit.name.nameZH')}
                        onChange={props.onUpdate(0)}
                        value={props.name[0]}
                        autoFocus
                    />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <span className={classes.listItemIcon}>A</span>
                    </ListItemIcon>
                    <TextField
                        style={{ width: '100%' }}
                        variant="outlined"
                        label={t('stations.edit.name.nameEN')}
                        onChange={props.onUpdate(1)}
                        value={props.name[1]}
                        helperText={t('stations.edit.name.nameENHelper')}
                    />
                </ListItem>
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.name.toString()]
    );
};

export default NameListItems;
