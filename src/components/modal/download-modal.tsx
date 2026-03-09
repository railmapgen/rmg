import classes from './common-modal.module.css';
import { useEffect, useState } from 'react';
import { canvasConfig, CanvasType, Events, RmgStyle } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import JSZip from 'jszip';
import { setCurrentStation } from '../../redux/param/param-slice';
import { cloneSvgCanvas, test } from '../../util/export-utils';
import { downloadAs, downloadBlobAs, isSafari, waitForMs } from '../../util/utils';
import { useTranslation } from 'react-i18next';
import { setLoadingProgress, stopLoading } from '../../redux/app/app-slice';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { Button, Group, Modal, NativeSelect, Stack, Switch } from '@mantine/core';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DownloadModal(props: DownloadModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    const dispatch = useRootDispatch();

    const [canvasToDownload, setCanvasToDownload] = useState('');
    const [isTransparent, setIsTransparent] = useState(false);
    const [isShowBorder, setIsShowBorder] = useState(false);
    const [scale, setScale] = useState(100);
    const [format, setFormat] = useState('png');

    const canvasToShow = useRootSelector(state => state.app.canvasToShow);
    const {
        style,
        stn_list: stationList,
        current_stn_idx: currentStationId,
        line_name: lineName,
    } = useRootSelector(state => state.param);

    useEffect(() => {
        // reset canvas to download if on-screen canvas changed
        if (canvasToDownload !== '' && !canvasToShow.includes(canvasToDownload as CanvasType)) {
            setCanvasToDownload('');
        }
    }, [canvasToShow]);

    const canvasOptions = [
        { value: '', label: t('Please select...'), disabled: true },
        ...canvasConfig[style]
            .filter(canvas => canvasToShow.includes(canvas))
            .map(canvas => ({ value: canvas, label: t('CanvasType.' + canvas) })),
    ];

    const scaleOptions = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500].map(pct => ({
        value: String(pct),
        label: `${pct}%`,
    }));

    const formatOptions = [
        { value: 'png', label: t('DownloadModal.png') },
        { value: 'svg', label: t('DownloadModal.svg') },
    ];

    const handleDownload = async (option: 'current' | 'all') => {
        dispatch(setLoadingProgress(0));
        const stationIdListToDownload =
            option === 'current'
                ? [currentStationId]
                : Object.keys(stationList).filter(id => !['linestart', 'lineend'].includes(id));

        const zip = new JSZip();

        for (const index in stationIdListToDownload) {
            dispatch(setLoadingProgress(((Number(index) + 1) / stationIdListToDownload.length) * 100));

            const stnId = stationIdListToDownload[index];
            // wait for svg elements updated for station A before we dispatch the current station to B.
            dispatch(setCurrentStation(stnId));
            await waitForMs(500);

            const elem = await cloneSvgCanvas(
                canvasToDownload as CanvasType,
                style,
                isTransparent,
                isShowBorder,
                scale
            );

            // append svg to the document so the bbox will be loaded correctly
            // (but not for gzmtr and have no idea why)
            document.body.appendChild(elem);

            const filename = `rmg.${stnId}.${stationList[stnId].localisedName.en}`.replaceAll(
                /\\|\/|\||\*|:|\?|<|>|"/g,
                '_'
            ); // forbidden characters on windows \ / : * ? " < > |
            if (format === 'png') {
                const isWait = isSafari() && index === '0';
                const blob = await test(elem, scale / 100, isWait);

                if (stationIdListToDownload.length > 1) {
                    // batch download and split base64 for this
                    // https://stackoverflow.com/questions/31305485/export-resized-image-in-canvas-to-new-jszip-package
                    zip.file(`${filename}.png`, blob);
                } else {
                    downloadBlobAs(`${filename}.png`, blob);
                }
            } else if (format === 'svg') {
                elem.removeAttribute('height');
                const data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(elem.outerHTML)));

                if (stationIdListToDownload.length > 1) {
                    zip.file(`${filename}.svg`, data.split('base64,')[1], { base64: true });
                } else {
                    downloadAs(filename + '.svg', 'image/svg+xml', elem.outerHTML);
                }
            }

            // don't forget to release it after use
            document.body.removeChild(elem);
        }

        // generate the zip for batch download
        if (stationIdListToDownload.length > 1) {
            const zipData = await zip.generateAsync({ type: 'blob' });
            const filename = `rmg.${lineName[0]}.${lineName[1]}.zip`.replaceAll(' ', '_');
            downloadBlobAs(filename, zipData);
        }

        // event
        rmgRuntime.event(Events.DOWNLOAD_IMAGES, { canvasToDownload, style, option, format });

        // revert to original station
        dispatch(setCurrentStation(currentStationId));
        dispatch(stopLoading());
        onClose();
    };

    return (
        <Modal opened={isOpen} onClose={onClose} size="md" title={t('DownloadModal.title')}>
            <Stack>
                <Stack className={classes.body}>
                    <NativeSelect
                        label={t('DownloadModal.canvas')}
                        value={canvasToDownload}
                        data={canvasOptions}
                        onChange={({ currentTarget: { value } }) => setCanvasToDownload(value)}
                    />
                    <Switch
                        label={t('DownloadModal.transparent')}
                        checked={isTransparent}
                        onChange={({ currentTarget: { checked } }) => setIsTransparent(checked)}
                    />
                    <Switch
                        label={t('DownloadModal.showBorder')}
                        checked={isShowBorder}
                        onChange={({ currentTarget: { checked } }) => setIsShowBorder(checked)}
                    />
                    <NativeSelect
                        label={t('DownloadModal.scale')}
                        value={scale}
                        data={scaleOptions}
                        onChange={({ currentTarget: { value } }) => setScale(Number(value))}
                    />
                    <NativeSelect
                        label={t('DownloadModal.format')}
                        value={format}
                        data={formatOptions}
                        onChange={({ currentTarget: { value } }) => setFormat(value)}
                    />
                </Stack>

                <Group className={classes.footer}>
                    <Button onClick={() => handleDownload('current')} disabled={!canvasToDownload}>
                        {t('DownloadModal.downloadOne')}
                    </Button>
                    {style !== RmgStyle.GZMTR && (
                        <Button variant="default" onClick={() => handleDownload('all')} disabled={!canvasToDownload}>
                            {t('DownloadModal.downloadAll')}
                        </Button>
                    )}
                </Group>
            </Stack>
        </Modal>
    );
}
