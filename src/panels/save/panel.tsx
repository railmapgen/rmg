import React, { useState, useContext } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import {
    Grid,
    Card,
    List,
    ListItem,
    ListItemIcon,
    Icon,
    ListItemText,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    LinearProgress,
} from '@material-ui/core';

import { getTransText2 } from '../../utils';

import UploadListItem from './upload-item';
import ExportDialog from './export-diag';
import { CanvasContext } from '../../context';
import { Link } from 'react-router-dom';

const TemplateDialog = React.lazy(() => import(/* webpackChunkName: "panelSaveTemplateDialog" */ './template-diag'));

export default function PanelSave() {
    let TranslatedSaveLists = withTranslation()(SaveLists);

    return (
        <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <TranslatedSaveLists />
            </Grid>
        </Grid>
    );
}

const allLangs = {
    en: 'English',
    'zh-Hans': '中文（简体）',
    'zh-HK': '中文（香港）',
};

const SaveLists = () => {
    const { t, i18n } = useTranslation();

    const { rmgStyle } = useContext(CanvasContext);

    const [isTempDialogOpen, setIsTempDialogOpen] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);
    const [isLangDialogOpen, setIsLangDialogOpen] = useState(false);

    const saveClick = () => {
        let link = document.createElement('a');
        link.href = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(localStorage.rmgParam)));
        link.download = 'rmg.param.' + new Date().toISOString() + '.json';
        link.click();
    };

    const exportDialogClose = (action: string) => {
        setIsExportDialogOpen(false);
    };

    const styleDialogClose = (action: 'close' | ProvidedStyles) => {
        if (action === 'close' || action === rmgStyle) {
        } else {
            // setStyle(action);
            // setIsStyleDialogOpen(false);

            window.gtag('event', 'set', {
                event_category: 'style',
                event_label: action,
            });
            // window.location.href = process.env.PUBLIC_URL + '/' + action;
        }
        setIsStyleDialogOpen(false);

        // TODO: how about integrity check?
        // e.g. when user switch from guangzhou mtr to shanghai metro
        // the info_panel_type will be invaild
        // do we need to set info_panel_type to default or prompt up a dialog 
    };

    return (
        <div>
            <Card>
                <List component="nav">
                    <ListItem button onClick={() => setIsTempDialogOpen(true)}>
                        <ListItemIcon>
                            <Icon>note_add</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('file.new.button')} />
                    </ListItem>
                    <UploadListItem />
                    <ListItem button onClick={saveClick}>
                        <ListItemIcon>
                            <Icon>save</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('file.save')} />
                    </ListItem>
                    <ListItem button onClick={() => setIsExportDialogOpen(true)}>
                        <ListItemIcon>
                            <Icon>cloud_download</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('file.export.button')} />
                    </ListItem>
                </List>
                <Divider />
                <List component="nav">
                    <ListItem button onClick={() => setIsStyleDialogOpen(true)}>
                        <ListItemIcon>
                            <Icon>style</Icon>
                        </ListItemIcon>
                        <ListItemText primary={t('file.style.button')} secondary={t('file.style.' + rmgStyle)} />
                    </ListItem>
                    <ListItem button onClick={() => setIsLangDialogOpen(true)}>
                        <ListItemIcon>
                            <Icon>translate</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={t('file.lang.button')}
                            secondary={getTransText2(allLangs, i18n.languages)}
                        />
                    </ListItem>
                </List>
            </Card>

            <React.Suspense fallback={<LinearProgress />}>
                <TemplateDialog open={isTempDialogOpen} onClose={() => setIsTempDialogOpen(false)} />
            </React.Suspense>

            <ExportDialog open={isExportDialogOpen} onClose={exportDialogClose} />

            <StyleDialog open={isStyleDialogOpen} onClose={styleDialogClose} />
            <LangDialog open={isLangDialogOpen} onClose={() => setIsLangDialogOpen(false)} />
        </div>
    );
};

interface StyleDialogProps {
    onClose: (style: 'close' | ProvidedStyles) => void;
    open: boolean;
}

function StyleDialog(props: StyleDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('file.style.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {(['gzmtr', 'mtr', 'shmetro'] as ProvidedStyles[]).map(key => (
                        <Link to={'/' + key} key={key} style={{ textDecoration: 'none', color: 'unset' }}>
                            <ListItem button onClick={() => props.onClose(key)}>
                                <ListItemText primary={t('file.style.' + key)} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

interface LangDialogProps {
    onClose: () => void;
    open: boolean;
}

function LangDialog(props: LangDialogProps) {
    const { t, i18n } = useTranslation();

    const handleClick = (lang: string) => {
        if (lang === i18n.language) {
            props.onClose();
        } else {
            i18n.changeLanguage(lang).then(t => (document.title = t('title')));
            // history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());
            window.gtag('event', 'set', {
                event_category: 'language',
                event_label: lang,
            });
            document.documentElement.setAttribute('lang', lang);
            props.onClose();
        }
    };

    return (
        <Dialog onClose={props.onClose} open={props.open}>
            <DialogTitle>{t('file.lang.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {(Object.keys(allLangs) as (keyof typeof allLangs)[]).map(key => (
                        <ListItem button onClick={() => handleClick(key)} key={key}>
                            <ListItemText primary={allLangs[key]} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}
