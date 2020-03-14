import * as React from 'react';
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
} from '@material-ui/core';

import { getTransText2 } from '../../utils';

import TemplateDialog from './template-diag';
import UploadListItem from './upload-item';
import ExportDialog from './export-diag';

export default props => {
    let TranslatedSaveLists = withTranslation()(SaveLists);

    return (
        <Grid container spacing={3} justify="center" alignItems="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <TranslatedSaveLists />
            </Grid>
        </Grid>
    );
};

const allStyles = {
    gzmtr: 'Guangzhou Metro',
    mtr: 'MTR',
    shmetro: 'Shanghai Metro (Alpha)',
};

const allLangs = {
    en: 'English',
    'zh-Hans': '中文（简体）',
    'zh-HK': '中文（香港）',
};

interface SaveListsProps {
    t: any;
    i18n: any;
}

interface SaveListsState {
    style: string;
    lang: string;
    templateDialogOpened: boolean;
    exportDialogOpened: boolean;
    previewDialogOpened: boolean;
    previewDialogCanvas: string;
    styleDialogOpened: boolean;
    langDialogOpened: boolean;
}

class SaveLists extends React.Component<SaveListsProps, SaveListsState> {
    constructor(props) {
        super(props);

        this.state = {
            style: window.urlParams.get('style'),
            lang: window.urlParams.get('lang'),
            templateDialogOpened: false,
            exportDialogOpened: false,
            previewDialogOpened: false,
            previewDialogCanvas: '',
            styleDialogOpened: false,
            langDialogOpened: false,
        };

        this.templateDialogClose = this.templateDialogClose.bind(this);

        this.saveClick = this.saveClick.bind(this);

        this.exportDialogClose = this.exportDialogClose.bind(this);
        this.previewDialogClose = this.previewDialogClose.bind(this);

        this.styleDialogClose = this.styleDialogClose.bind(this);
    }

    templateDialogClose(action: string) {
        if (action === 'close') {
            this.setState({ templateDialogOpened: false });
            return;
        }

        fetch(`templates/${action}.json`)
            .then(response => response.json())
            .then(data => {
                localStorage.rmgParam = JSON.stringify(data);
                location.reload(true);
            });
    }

    saveClick() {
        let link = document.createElement('a');
        link.href = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(localStorage.rmgParam)));
        link.download = 'rmg.param.' + new Date().toISOString() + '.json';
        link.click();
    }

    exportDialogClose(action: string) {
        if (action === 'close') {
            this.setState({ exportDialogOpened: false });
            return;
        }
        this.setState({
            exportDialogOpened: false,
            previewDialogOpened: true,
            previewDialogCanvas: action,
        });
    }

    previewDialogClose(action: string) {
        if (action === 'close') {
            this.setState({
                previewDialogOpened: false,
                previewDialogCanvas: '',
            });
        }
    }

    styleDialogClose(action: string) {
        if (action === 'close' || action === this.state.style) {
            this.setState({ styleDialogOpened: false });
        } else {
            this.setState({
                style: action,
                styleDialogOpened: false,
            });

            window.urlParams.set('style', action);
            window.gtag('event', 'set', {
                event_category: 'style',
                event_label: action,
            });
            window.location.href = '?' + window.urlParams.toString();
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <List component="nav">
                        <ListItem button onClick={() => this.setState({ templateDialogOpened: true })}>
                            <ListItemIcon>
                                <Icon>note_add</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.new.button')} />
                        </ListItem>
                        <UploadListItem />
                        <ListItem button onClick={this.saveClick}>
                            <ListItemIcon>
                                <Icon>save</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.save')} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({ exportDialogOpened: true })}>
                            <ListItemIcon>
                                <Icon>cloud_download</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.export.button')} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List component="nav">
                        <ListItem button onClick={() => this.setState({ styleDialogOpened: true })}>
                            <ListItemIcon>
                                <Icon>style</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('file.style.button')}
                                secondary={this.props.t('file.style.' + this.state.style)}
                            />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({ langDialogOpened: true })}>
                            <ListItemIcon>
                                <Icon>translate</Icon>
                            </ListItemIcon>
                            <ListItemText
                                primary={this.props.t('file.lang.button')}
                                secondary={getTransText2(allLangs, this.props.i18n.languages)}
                            />
                        </ListItem>
                    </List>
                </Card>

                <TemplateDialog open={this.state.templateDialogOpened} onClose={this.templateDialogClose} />

                <ExportDialog open={this.state.exportDialogOpened} onClose={this.exportDialogClose} />
                {/* <TranslatedPreviewDialog 
                    open={this.state.previewDialogOpened} 
                    onClose={this.previewDialogClose} 
                    canvas={this.state.previewDialogCanvas} /> */}
                <StyleDialog open={this.state.styleDialogOpened} onClose={this.styleDialogClose} />
                <LangDialog
                    open={this.state.langDialogOpened}
                    onClose={() => this.setState({ langDialogOpened: false })}
                />
            </div>
        );
    }
}

interface StyleDialogProps {
    onClose: (style: string) => void;
    open: boolean;
}

function StyleDialog(props: StyleDialogProps) {
    const { t, i18n } = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('file.style.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allStyles).map(key => (
                        <ListItem button onClick={() => props.onClose(key)} key={key}>
                            <ListItemText primary={t('file.style.' + key)} />
                        </ListItem>
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
            // window.urlParams.set('lang', lang);
            // history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());
            window.gtag('event', 'set', {
                event_category: 'language',
                event_label: lang,
            });
            document.documentElement.setAttribute('lang', lang);
            props.onClose();
            // window.location.href = '?' + window.urlParams.toString();
        }
    };

    return (
        <Dialog onClose={props.onClose} open={props.open}>
            <DialogTitle>{t('file.lang.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allLangs).map(key => (
                        <ListItem button onClick={() => handleClick(key)} key={key}>
                            <ListItemText primary={allLangs[key]} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}
