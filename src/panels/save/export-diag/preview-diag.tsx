import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Switch,
    makeStyles,
    createStyles,
    Select,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Checkbox,
    Typography,
} from '@material-ui/core';

import { test } from './utils';
import { CanvasContext } from '../../../context';

const useStyles = makeStyles((theme) =>
    createStyles({
        contentWrapper: {
            display: 'flex',
            overflow: 'hidden',
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column',
            },
        },
        contentCanvas: {
            flex: 1,
        },
        contentControl: {
            flexGrow: 0,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 250,
        },
        contentRoot: {
            padding: 'unset',
            '&:first-child': {
                paddingTop: 'unset',
            },
        },
        contentControlContent: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        formControlRoot: {
            margin: 0,
        },
    })
);

interface Props {
    onClose: (action: string) => void;
    open: boolean;
    canvas: string;
}

export default (props: Props) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const { rmgStyle } = React.useContext(CanvasContext);

    const [svgEl, setSvgEl] = useState((document.createElement('svg') as Element) as SVGSVGElement);
    const [isLoaded, setIsLoaded] = useState(false);

    const [showBorder, setShowBorder] = useState(false);
    const [isTransparent, setIsTransparent] = useState(false);
    const [scale, setScale] = useState(1);
    const [format, setFormat] = useState('png');

    const [isAccept, setIsAccept] = useState(false);
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);

    const handleShowBorder = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        svgEl.querySelector('rect#canvas-border')?.setAttribute('stroke', checked ? 'black' : 'none');
        setShowBorder(checked);
    };

    const handleTransparent = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        svgEl.querySelector('rect#canvas-bg')?.setAttribute('fill', checked ? 'none' : 'white');
        setIsTransparent(checked);
    };

    const handleScaleChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
        let nextScale = event.target.value as number;
        svgEl.setAttribute('height', ((Number(svgEl.getAttribute('height')) / scale) * nextScale).toString());
        setScale(nextScale);
    };

    const contentEl = React.useRef<HTMLDivElement | null>(null);

    useEffect(
        () => {
            if (props.canvas === '') {
                setSvgEl((document.createElement('svg') as Element) as SVGSVGElement);
                setIsLoaded(false);
                return;
            }
            let [, thisSVGHeight] = ['--rmg-svg-width', '--rmg-svg-height']
                .map(
                    (key) =>
                        (document.querySelector(`svg#${props.canvas}`) as SVGSVGElement).style
                            .getPropertyValue(key)
                            .match(/\d+/g)![0]
                )
                .map(Number);

            // let MAX_WIDTH = Math.min(window.innerWidth, 1412) - 64 - 24 * 2;
            // let MAX_HEIGHT = window.innerHeight - 64 - 64 - 52 - 8 * 2;
            // let scaleFactor = Math.min(MAX_WIDTH / thisSVGWidth, MAX_HEIGHT / thisSVGHeight);

            let elem = document.querySelector(`svg#${props.canvas}`)!.cloneNode(true) as SVGSVGElement;
            // elem.setAttribute('width', (thisSVGWidth * scaleFactor).toString());
            elem.setAttribute('height', (thisSVGHeight * scale).toString());
            elem.style.setProperty('all', 'initial');

            ['share', props.canvas]
                .map((tag) =>
                    [
                        ...([...document.querySelectorAll('link')].filter((l) => l.id === 'css_' + tag)[0]
                            ?.sheet as CSSStyleSheet).cssRules,
                    ]
                        .map((rule) => rule.cssText)
                        .join(' ')
                )
                .forEach((txt) => {
                    let s = document.createElement('style');
                    s.textContent = txt;
                    elem.prepend(s);
                });

            elem.querySelector('rect#canvas-border')?.setAttribute('stroke', showBorder ? 'black' : 'none');
            elem.querySelector('rect#canvas-bg')?.setAttribute('fill', isTransparent ? 'none' : 'white');

            if (rmgStyle === 'mtr') {
                import(/* webpackChunkName: "panelPreviewMTR" */ './mtr-helper')
                    .then(({ getBase64FontFace }) =>
                        getBase64FontFace(elem)
                            .then(async (response) => {
                                let uris = await Promise.all(response);
                                let s = document.createElement('style');
                                s.textContent = uris.join(' ');
                                elem.prepend(s);
                            })
                            .catch((err) => {
                                alert('Failed to fonts. Fonts in the exported PNG will be missing.');
                                console.error(err);
                            })
                    )
                    .then(() => {
                        setSvgEl(elem);
                        document.fonts.ready.then(() => setIsLoaded(true));
                    });
            } else {
                setSvgEl(elem);
                setIsLoaded(true);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.canvas]
    );

    const handleClose = (action: 'close' | 'download') => () => {
        if (action === 'close') {
            props.onClose('close');
        } else {
            let svgEl = contentEl.current!.querySelector('svg') as SVGSVGElement;
            if (format === 'png') {
                test(svgEl, scale);
            } else if (format === 'svg') {
                svgEl.removeAttribute('height');
                var link = document.createElement('a');
                link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgEl.outerHTML)));
                link.download = 'rmg.' + new Date().toISOString() + '.svg';
                link.click();
            }
            props.onClose('close');
        }
    };

    return (
        <Dialog onClose={handleClose('close')} open={props.open} maxWidth={false}>
            <DialogTitle>{t('file.preview.title')}</DialogTitle>
            <div className={classes.contentWrapper}>
                <DialogContent
                    dangerouslySetInnerHTML={{ __html: svgEl.outerHTML }}
                    ref={contentEl}
                    className={classes.contentCanvas}
                    classes={{ root: classes.contentRoot }}
                />
                <div className={classes.contentControl}>
                    <DialogContent classes={{ root: classes.contentRoot }} className={classes.contentControlContent}>
                        <List component="div" disablePadding>
                            <ListItem>
                                <ListItemText primary={t('file.preview.transparent')} />
                                <ListItemSecondaryAction>
                                    <Switch
                                        color="primary"
                                        checked={isTransparent}
                                        onChange={handleTransparent}
                                        disabled={!isLoaded}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="middle" />
                            <ListItem>
                                <ListItemText primary={t('file.preview.border')} />
                                <ListItemSecondaryAction>
                                    <Switch
                                        color="primary"
                                        checked={showBorder}
                                        onChange={handleShowBorder}
                                        disabled={!isLoaded}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="middle" />
                            <ListItem>
                                <ListItemText primary={t('file.preview.scale')} />
                                <ListItemSecondaryAction>
                                    <Select native value={scale} onChange={handleScaleChange} disabled={!isLoaded}>
                                        {[
                                            0.25,
                                            0.33,
                                            0.5,
                                            0.67,
                                            0.75,
                                            0.8,
                                            0.9,
                                            1,
                                            1.1,
                                            1.25,
                                            1.5,
                                            1.75,
                                            2,
                                            2.5,
                                            3,
                                            4,
                                            5,
                                        ].map((ratio) => (
                                            <option key={ratio} value={ratio}>
                                                {(ratio * 100).toFixed(0) + '%'}
                                            </option>
                                        ))}
                                    </Select>
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider variant="middle" />
                            <ListItem>
                                <ListItemText primary={t('file.preview.format')} />
                                <ListItemSecondaryAction>
                                    <Select
                                        native
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value as string)}
                                        style={{ width: 65 }}
                                        disabled={!isLoaded}
                                    >
                                        <option value="png">PNG</option>
                                        <option value="svg">SVG (Web Use)</option>
                                    </Select>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                        <ListItem style={{ padding: 0 }}>
                            <Checkbox
                                color="primary"
                                size="small"
                                checked={isAccept}
                                onChange={(_, checked) => setIsAccept(checked)}
                            />
                            <Typography variant="body2">
                                {t('file.preview.terms.accept')}
                                <Typography
                                    component="a"
                                    color="primary"
                                    variant="body2"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setIsTermsDialogOpen(true)}
                                >
                                    {t('file.preview.terms.tandc')}
                                </Typography>
                            </Typography>

                            <TermsDialog open={isTermsDialogOpen} onClose={() => setIsTermsDialogOpen(false)} />
                        </ListItem>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleClose('close')} color="primary" autoFocus>
                            {t('dialog.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClose('download')}
                            color="primary"
                            disabled={!isLoaded || !isAccept}
                        >
                            {t('file.preview.download')}
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};

const TermsDialog = (props: { open: boolean; onClose: () => void }) => {
    const { t } = useTranslation();
    return useMemo(
        () => (
            <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>{t('file.preview.terms.tandc')}</DialogTitle>
                <DialogContent dividers>
                    <Typography component="p">
                        The downloaded image may be modified, published, or used for other purposes, under the following
                        conditions.
                    </Typography>
                    <Typography component="ol">
                        <Typography component="li">
                            The layout of the elements on the sign or rail map, is designed by{' '}
                            <Typography component="a" color="primary" href="http://www.gzmtr.com" target="_blank">
                                Guangzhou Metro Corporation
                            </Typography>
                            ,{' '}
                            <Typography component="a" color="primary" href="http://www.mtr.com.hk" target="_blank">
                                MTR Corporation
                            </Typography>{' '}
                            or{' '}
                            <Typography component="a" color="primary" href="http://www.shmetro.com" target="_blank">
                                Shanghai Shentong Metro Group
                            </Typography>
                            , depending on your selection. You shall grant appropriate permit or license from the
                            relevant company above before using the downloaded image for commercial purposes, if it is
                            required to do so.
                        </Typography>
                        <Typography component="li">
                            The elements including shapes and lines on the image are drawn by{' '}
                            <Typography
                                component="a"
                                color="primary"
                                href="https://github.com/wongchito"
                                target="_blank"
                            >
                                Chito Wong
                            </Typography>{' '}
                            and{' '}
                            <Typography
                                component="a"
                                color="primary"
                                href="https://github.com/thekingofcity"
                                target="_blank"
                            >
                                thekingofcity
                            </Typography>
                            , based on the design standards or rules of the companies listed above. You may use them for
                            any purposes, but it is recommended to state the name and the link of software alongside.
                        </Typography>
                        <Typography component="li">
                            The fonts of the Chinese characters in MTR style are provided by{' '}
                            <Typography
                                component="a"
                                color="primary"
                                href="https://www.google.com/get/noto/help/cjk/"
                                target="_blank"
                            >
                                Google Inc.
                            </Typography>{' '}
                            while all others fonts are rendered from local files. You shall grant appropriate permit or
                            license from the manufacturers before using the downloaded image for commercial purposes.
                        </Typography>
                    </Typography>
                    <Typography component="p">
                        We reserve the rights, without notice, to modify, add, or remove these terms.
                    </Typography>
                    <Typography component="p">本條款及細則暫只提供英文版，敬請原諒。</Typography>
                    <Typography component="p" variant="body2">
                        Last modified: 6 Apr 2020, 12:39 UTC
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="primary" onClick={props.onClose}>
                        {t('dialog.close')}
                    </Button>
                </DialogActions>
            </Dialog>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.open]
    );
};
