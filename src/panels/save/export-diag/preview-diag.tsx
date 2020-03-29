import React, { useEffect, useState } from 'react';
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
} from '@material-ui/core';

import { test } from './utils';
import { CanvasContext } from '../../../context';

const useStyles = makeStyles(theme =>
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

    const handleShowBorder = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        svgEl.querySelector('rect#canvas-bg')?.setAttribute('stroke', checked ? 'black' : 'none');
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
                    key =>
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
                .map(tag =>
                    [
                        ...([...document.querySelectorAll('link')].filter(l => l.id === 'css_' + tag)[0]
                            ?.sheet as CSSStyleSheet).cssRules,
                    ]
                        .map(rule => rule.cssText)
                        .join(' ')
                )
                .forEach(txt => {
                    let s = document.createElement('style');
                    s.innerText = txt;
                    elem.prepend(s);
                });

            elem.querySelector('rect#canvas-bg')?.setAttribute('stroke', showBorder ? 'black' : 'none');
            elem.querySelector('rect#canvas-bg')?.setAttribute('fill', isTransparent ? 'none' : 'white');

            if (rmgStyle === 'mtr') {
                import(/* webpackChunkName: "panelPreviewMTR" */ './mtr-helper')
                    .then(({ getBase64FontFace }) =>
                        getBase64FontFace(elem)
                            .then(async response => {
                                let uris = await Promise.all(response);
                                let s = document.createElement('style');
                                s.innerText = uris.join(' ');
                                elem.prepend(s);
                            })
                            .catch(err => {
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
                    <DialogContent classes={{ root: classes.contentRoot }}>
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
                                        ].map(ratio => (
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
                                        onChange={e => setFormat(e.target.value as string)}
                                        style={{ width: 65 }}
                                        disabled={!isLoaded}
                                    >
                                        <option value="png">PNG</option>
                                        <option value="svg">SVG (Web Use)</option>
                                    </Select>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" onClick={handleClose('close')} color="primary" autoFocus>
                            {t('dialog.cancel')}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClose('download')}
                            color="primary"
                            disabled={!isLoaded}
                        >
                            {t('file.preview.download')}
                        </Button>
                    </DialogActions>
                </div>
            </div>
        </Dialog>
    );
};
