import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    makeStyles,
    createStyles,
    CardActions,
    Button,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
    createStyles({
        panel: {
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '& .MuiTypography-root': {
                margin: '8px 0',
                textAlign: 'justify',
            },
        },
        root: {
            display: 'flex',
            alignItems: 'center',
            width: 'fit-content',
            margin: '8px 0',
        },
        media: {
            height: 120,
            width: 120,
            margin: 6,
        },
        detail: {
            display: 'flex',
            flexDirection: 'column',
        },
        action: {
            justifyContent: 'flex-end',
        },
        typography: {
            margin: '8px 0',
        },
    })
);

export default memo(function PanelInfo() {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <div className={classes.panel}>
            <Card className={classes.root}>
                <CardMedia className={classes.media} image={process.env.PUBLIC_URL + '/logo512.png'} />
                <div className={classes.detail}>
                    <CardContent>
                        <Typography component="h6" variant="h6">
                            {t('info.title')}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            @wongchito and @thekingofcity
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.action}>
                        <Button size="small" color="primary" href="https://github.com/wongchito/RailMapGenerator">
                            GitHub
                        </Button>
                        <Button
                            size="small"
                            color="primary"
                            href="https://github.com/wongchito/RailMapGenerator/issues"
                        >
                            {t('info.feedback')}
                        </Button>
                    </CardActions>
                </div>
            </Card>

            <Typography variant="body2" color="textPrimary">
                {t('info.notice')}
            </Typography>

            <Typography variant="body2" color="textPrimary">
                All flag emojis shown on Windows platforms are designed by{' '}
                <Typography component="a" variant="body2" color="primary" href="https://openmoji.org/">
                    OpenMoji
                </Typography>{' '}
                – the open-source emoji and icon project. License:{' '}
                <Typography
                    component="a"
                    variant="body2"
                    color="primary"
                    href="https://creativecommons.org/licenses/by-sa/4.0/#"
                >
                    CC BY-SA 4.0
                </Typography>
            </Typography>
        </div>
    );
});
