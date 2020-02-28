import * as React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import { Grid, Card, List, ListItem, ListItemIcon, Icon, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

import { RMGParam } from '../../types';
import { describeParams, getTransText, getParams, getBase64FontFace, test } from '../../utils';

import TemplateDialog from './template-diag';

export default class PanelSave extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let TranslatedSaveLists = withTranslation()(SaveLists);
        return (
            <Grid container spacing={3} justify="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <TranslatedSaveLists />
                </Grid>
            </Grid>
        );
    }
}

const allStyles = {
    gzmtr: 'Guangzhou Metro', 
    mtr: 'MTR', 
    shmetro: 'Shanghai Metro (Alpha)'
}

const allLangs = {
    en: 'English', 
    'zh-Hans': '中文（简体）',
    'zh-HK': '中文（香港）'
}

interface SaveListsProps {
    t: any;
    i18n: any;
}

interface SaveListsState {
    style: string;
    lang: string;
    templateDialogOpened: boolean;
    importDialogOpened: boolean;
    importDialogContent: RMGParam | {};
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
            importDialogOpened: false, 
            importDialogContent: {}, 
            exportDialogOpened: false,
            previewDialogOpened: false,
            previewDialogCanvas: '',
            styleDialogOpened: false, 
            langDialogOpened: false
        }

        this.templateDialogClose = this.templateDialogClose.bind(this);

        this.saveClick = this.saveClick.bind(this);

        this.uploadInputChange = this.uploadInputChange.bind(this);
        this.importDialogClose = this.importDialogClose.bind(this);

        this.exportDialogClose = this.exportDialogClose.bind(this);
        this.previewDialogClose = this.previewDialogClose.bind(this);

        this.styleDialogClose = this.styleDialogClose.bind(this);
    }

    templateDialogClose(action: string) {
        if (action === 'close') {
            this.setState({templateDialogOpened: false});
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
        let link = $('<a>', {
            href: 'data:application/json;base64,'+btoa(unescape(encodeURIComponent(localStorage.rmgParam))), 
            download: 'rmg_param.json'
        });
        link[0].click();
    }

    uploadInputChange(param: RMGParam) {
        this.setState({
            importDialogOpened: true, 
            importDialogContent: param
        });
    }

    importDialogClose(action: string) {
        if (action === 'close') {
            ($('#upload-param')[0] as HTMLInputElement).value = '';
            this.setState({importDialogOpened: false});
            return;
        }
        if (action === 'accept') {
            localStorage.rmgParam = JSON.stringify(this.state.importDialogContent);
            location.reload(true);
        }
    }

    exportDialogClose(action: string) {
        if (action === 'close') {
            this.setState({exportDialogOpened: false});
            return;
        }
        this.setState({
            exportDialogOpened: false, 
            previewDialogOpened: true, 
            previewDialogCanvas: action
        });
    }

    previewDialogClose(action: string) {
        if (action === 'close') {
            this.setState({
                previewDialogOpened: false,
                previewDialogCanvas: ''
            });
        }
    }

    styleDialogClose(action: string) {
        if (action === 'close' || action === this.state.style) {
            this.setState({styleDialogOpened: false});
        } else {
            this.setState({
                style: action, 
                styleDialogOpened: false
            });

            window.urlParams.set('style', action);
            window.gtag('event', 'set', {
                event_category: 'style', 
                event_label: action
            });
            window.location.href = '?' + window.urlParams.toString();
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <List component="nav">
                        <ListItem button onClick={() => this.setState({templateDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>note_add</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.new.button')} />
                        </ListItem>
                        <ListItem button onClick={() => $('#upload-param').click()}>
                            <ListItemIcon>
                                <Icon>folder_open</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.open.button')} />
                        </ListItem>
                        <ListItem button onClick={this.saveClick}>
                            <ListItemIcon>
                                <Icon>save</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.save')} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({exportDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>cloud_download</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.export.button')} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List component="nav">
                        <ListItem button onClick={() => this.setState({styleDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>style</Icon>
                            </ListItemIcon>
                            <ListItemText 
                                primary={this.props.t('file.style.button')} 
                                secondary={this.props.t('file.style.'+this.state.style)} />
                        </ListItem>
                        <ListItem button onClick={() => this.setState({langDialogOpened: true})}>
                            <ListItemIcon>
                                <Icon>language</Icon>
                            </ListItemIcon>
                            <ListItemText primary={this.props.t('file.lang.button')} secondary={allLangs[this.props.i18n.language]} />
                        </ListItem>
                    </List>
                </Card>

                <TemplateDialog open={this.state.templateDialogOpened} onClose={this.templateDialogClose} />
                <UploadInput onChange={this.uploadInputChange} />
                <ImportDialog open={this.state.importDialogOpened} onClose={this.importDialogClose} content={this.state.importDialogContent} />
                <ExportDialog open={this.state.exportDialogOpened} onClose={this.exportDialogClose} />
                <TranslatedPreviewDialog 
                    open={this.state.previewDialogOpened} 
                    onClose={this.previewDialogClose} 
                    canvas={this.state.previewDialogCanvas} />
                <StyleDialog open={this.state.styleDialogOpened} onClose={this.styleDialogClose} />
                <LangDialog open={this.state.langDialogOpened} onClose={() => this.setState({langDialogOpened: false})} />
            </div>
        );
    }
}

interface UploadInputProps {
    onChange: (param: RMGParam) => void;
}

class UploadInput extends React.Component<UploadInputProps> {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event.target.files[0]);
        let filePromise = new Promise((resolve: (event: ProgressEvent<FileReader>) => void) => {
            let reader = new FileReader();
            reader.onloadend = resolve;
            reader.readAsText(event.target.files[0]);
        });
        filePromise
            .then(e => JSON.parse(e.target.result as string))
            .then(param => this.props.onChange(param));
    }

    render() {
        return <input type="file" accept="application/json" 
            style={{display: 'none'}} id="upload-param" onChange={this.handleChange} />
    }
}

interface ImportDialogProps {
    onClose: (action: string) => void;
    open: boolean;
    content: {} | RMGParam;
}

class ImportDialog extends React.Component<ImportDialogProps> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog onClose={() => this.props.onClose('close')} aria-labelledby="simple-dialog-title" open={this.props.open}>
                <DialogTitle>Your Configuration</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {Object.keys(this.props.content).length === 0 ? 'empty' : describeParams(this.props.content as RMGParam)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.onClose('close')} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.props.onClose('accept')} color="primary" autoFocus>
                        Import
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

interface ExportDialogProps {
    onClose: (action: string) => void;
    open: boolean;
}

function ExportDialog(props: ExportDialogProps) {
    const { t } = useTranslation();
    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('file.export.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    <ListItem button 
                        onClick={() => props.onClose('destination')} 
                        key="destination" 
                        disabled={!['mtr', 'shmetro'].includes(window.urlParams.get('style'))}>
                        <ListItemText primary={t('file.export.destination')} />
                    </ListItem>
                    <ListItem button 
                        onClick={() => props.onClose('runin')} 
                        key="runin" 
                        disabled={!['gzmtr', 'shmetro'].includes(window.urlParams.get('style'))}>
                        <ListItemText primary={t('file.export.runin')} />
                    </ListItem>
                    <ListItem button 
                        onClick={() => props.onClose('railmap')} key="railmap">
                        <ListItemText primary={t('file.export.railmap')} />
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>
    );
}

interface PreviewDialogProps {
    t: any;
    onClose: (action: string) => void;
    open: boolean;
    canvas: string;
}

interface PreviewDialogState {
    svgEl: SVGSVGElement;
    svgLoadFinished: boolean;
}

class PreviewDialog extends React.Component<PreviewDialogProps, PreviewDialogState> {
    constructor(props) {
        super(props);

        this.state = {
            svgEl: $('<svg>')[0] as Element as SVGSVGElement, 
            svgLoadFinished: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(action: string) {
        if (action === 'png') {
            test($('#preview_diag svg'));
        } else if (action === 'svg') {
            let svgContent = $('#preview_diag svg');

            var link = document.createElement('a');
            link.href = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgContent[0].outerHTML)));
            link.download = 'rmg_export.svg';
            link.click();
        }
        this.props.onClose('close');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.canvas === this.props.canvas) return;
        if (this.props.canvas === '') {
            this.setState({
                svgEl: $('<svg>')[0] as Element as SVGSVGElement, 
                svgLoadFinished: false
            });
            return;
        }
        
        let [thisSVGWidth, thisSVGHeight] = [
            this.props.canvas=='railmap' ? getParams().svg_width : getParams().svg_dest_width, 
            getParams().svg_height
        ];
        let MAX_WIDTH = Math.min($(window).width(), 1412) - 64 - 24*2;
        let MAX_HEIGHT = $(window).height() - 64 - 64 - 52 - 8*2;
        let scaleFactor = Math.min(MAX_WIDTH/thisSVGWidth, MAX_HEIGHT/thisSVGHeight);

        let el = $(`div#svgs #${this.props.canvas}`).clone().attr({
            viewBox: `0 0 ${thisSVGWidth} ${thisSVGHeight}`,
            width: thisSVGWidth * scaleFactor, 
            height: thisSVGHeight * scaleFactor
        }).css({
            all: 'initial'
        });

        let cssTxt = ['share', this.props.canvas]
            .map(tag => {
                return Array.from(
                    (($(`link#css_${tag}`)[0] as HTMLLinkElement).sheet as CSSStyleSheet).cssRules
                ).map(rule => rule.cssText).join(' ');
            });
        el.prepend(...cssTxt.map(txt => $('<style>').text(txt)))
            .prepend(document.querySelector('style#global').outerHTML)
            .find('[style="display: none;"]').remove();

        if (window.urlParams.get('style') === 'mtr') {
            getBase64FontFace(el[0] as Element as SVGSVGElement)
            .then(async response => {
                let uris = await Promise.all(response);
                el.prepend($('<style>').text(uris.join(' ')));

                this.setState({
                    svgEl: el[0] as Element as SVGSVGElement
                });

                document.fonts.ready.then(() => {
                    this.setState({
                        svgLoadFinished: true
                    })
                })
            });
        } else {
            this.setState({
                svgEl: el[0] as Element as SVGSVGElement, 
                svgLoadFinished: true
            });
        }
        
    }

    render() {
        return (
            <Dialog onClose={() => this.props.onClose('close')} aria-labelledby="simple-dialog-title" open={this.props.open} maxWidth={false} id="preview_diag">
                <DialogTitle >{this.props.t('file.preview.title')}</DialogTitle>
                <DialogContent dangerouslySetInnerHTML={{__html: this.state.svgEl.outerHTML}}>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.props.onClose('close')} color="primary" autoFocus>
                        {this.props.t('dialog.cancel')}
                    </Button>
                    <Button onClick={() => this.handleClick('png')} color="primary" disabled={!this.state.svgLoadFinished}>
                        {this.props.t('file.preview.png')}
                    </Button>
                    <Button onClick={() => this.handleClick('svg')} color="primary" disabled={!this.state.svgLoadFinished}>
                        {this.props.t('file.preview.svg')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const TranslatedPreviewDialog = withTranslation()(PreviewDialog);

interface StyleDialogProps {
    onClose: (style: string) => void;
    open: boolean;
}

function StyleDialog(props: StyleDialogProps) {
    const {t, i18n} = useTranslation();

    return (
        <Dialog onClose={() => props.onClose('close')} open={props.open}>
            <DialogTitle>{t('file.style.title')}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {Object.keys(allStyles).map(key => (
                        <ListItem button onClick={() => props.onClose(key)} key={key}>
                            <ListItemText primary={t('file.style.'+key)} />
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
    const {t, i18n} = useTranslation();

    const handleClick = (lang) => {
        if (lang === window.urlParams.get('lang')) {
            props.onClose();
        } else {
            i18n.changeLanguage(lang);
            window.urlParams.set('lang', lang);
            history.pushState({url:window.location.href}, null, '?' + window.urlParams.toString());
            window.gtag('event', 'set', {
                event_category: 'language', 
                event_label: window.urlParams.get('lang')
            });
            document.documentElement.setAttribute('lang',lang);
            document.title = t('title');
            props.onClose();
            // window.location.href = '?' + window.urlParams.toString();
        }
    }

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