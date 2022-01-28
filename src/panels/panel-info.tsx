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
import packageJson from '../../package.json';

const useStyles = makeStyles(() =>
    createStyles({
        panel: {
            maxWidth: 500,
            display: 'flex',
            flexDirection: 'column',
            '& .MuiTypography-root': {
                margin: '8px 0',
                textAlign: 'justify',
            },
        },
        root: {
            display: 'flex',
            alignItems: 'center',
            width: '500px',
            margin: '8px 0',
            flexWrap: 'wrap',
            flexDirection: 'row',
        },
        logo: {
            height: 100,
            width: 100,
            margin: 6,
        },
        cardHeader: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            marginLeft: 10,
        },
        detailGrid: {
            display: 'grid',
            gridTemplateColumns: '115px 115px 115px 115px',
            margin: 6,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
        },
        detailColumn: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        detailRow: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: 20,
        },
        coreContributorAvatar: {
            height: 100,
            width: 100,
            margin: 6,
        },
        colorAndLineContributorAvatar: {
            height: 80,
            width: 80,
            margin: 6,
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
                <div className={classes.detailRow}>
                    <CardMedia className={classes.logo} image={process.env.PUBLIC_URL + '/logo512.png'} />
                    <CardContent>
                        <Typography component="h6" variant="h6">
                            {t('info.title')} {packageJson.version}
                        </Typography>
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
                    </CardContent>
                </div>
            </Card>

            <Card className={classes.root}>
                <div className={classes.cardHeader}>
                    <Typography component="h5" variant="h5">
                        {t('info.core.title')}
                    </Typography>
                </div>
                <div className={classes.detailRow}>
                    <CardMedia className={classes.coreContributorAvatar} image="https://github.com/wongchito.png" />
                    <CardContent>
                        <Typography component="h6" variant="h6">
                            Chito Wong
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('info.core.wongchito.first')}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('info.core.wongchito.second')}
                        </Typography>
                    </CardContent>
                </div>
                <div className={classes.detailRow}>
                    <CardMedia className={classes.coreContributorAvatar} image="https://github.com/thekingofcity.png" />
                    <CardContent>
                        <Typography component="h6" variant="h6">
                            thekingofcity
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('info.core.thekingofcity.first')}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary">
                            {t('info.core.thekingofcity.second')}
                        </Typography>
                    </CardContent>
                </div>
            </Card>

            <Card className={classes.root}>
                <div className={classes.cardHeader}>
                    <Typography component="h5" variant="h5">
                        {t('info.colorAndLine.title')}
                    </Typography>
                </div>
                <div className={classes.detailGrid}>
                    {[
                        '52PD',
                        'linchen1965',
                        'C1P918R',
                        'AnDanJune\nUnderline',
                        'GrassRabbit\n1410',
                        'xiany114514',
                        'Andy1782010',
                        'Thomastzc',
                        'Tianxiu11111',
                        'Dingdong2334',
                    ].map(name => (
                        <div className={classes.detailColumn}>
                            <CardMedia
                                className={classes.colorAndLineContributorAvatar}
                                image={`https://github.com/${name.replaceAll('\n', '')}.png`}
                            />
                            <Typography variant="subtitle1" color="textSecondary">
                                {name}
                            </Typography>
                        </div>
                    ))}
                </div>
                <div className={classes.cardHeader}>
                    <Typography variant="subtitle2" color="textSecondary">
                        {t('info.colorAndLine.note.first')}
                        <Typography
                            component="a"
                            variant="subtitle2"
                            color="textSecondary"
                            href="https://github.com/wongchito/RailMapGenerator/wiki/How-to-add-color-palette-and-line-templates"
                        >
                            {t('info.colorAndLine.note.second')}
                        </Typography>
                        {t('info.colorAndLine.note.third')}
                    </Typography>
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
