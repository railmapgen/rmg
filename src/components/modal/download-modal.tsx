import React, { useEffect, useState } from 'react';
import {
    Button,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { canvasConfig, CanvasType, RmgStyle } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import JSZip from 'jszip';
import { setCurrentStation } from '../../redux/param/action';
import { cloneSvgCanvas, test } from '../../util/export-utils';
import { downloadAs, downloadBlobAs, isSafari } from '../../util/utils';
import { useTranslation } from 'react-i18next';
import { waitForMs } from '../../utils';
import { setLoadingProgress, stopLoading } from '../../redux/app/app-slice';

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

    const canvasOptions = canvasConfig[style].reduce<Record<string, string>>(
        (acc, cur) => {
            if (canvasToShow.includes(cur)) {
                return { ...acc, [cur]: t('CanvasType.' + cur) };
            } else {
                return { ...acc };
            }
        },
        { '': t('DownloadModal.pleaseSelect') }
    );

    const scaleOptions = [25, 33, 50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500].reduce<
        Record<number, string>
    >(
        (acc, cur) => ({
            ...acc,
            [cur]: `${cur}%`,
        }),
        {}
    );

    const formatOptions = {
        png: t('DownloadModal.png'),
        svg: t('DownloadModal.svg'),
    };

    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('DownloadModal.canvas'),
            value: canvasToDownload,
            options: canvasOptions,
            disabledOptions: [''],
            onChange: value => setCanvasToDownload(value as CanvasType),
            minW: 'full',
        },
        {
            type: 'switch',
            label: t('DownloadModal.transparent'),
            isChecked: isTransparent,
            onChange: setIsTransparent,
            oneLine: true,
            minW: 'full',
        },
        {
            type: 'switch',
            label: t('DownloadModal.showBorder'),
            isChecked: isShowBorder,
            onChange: setIsShowBorder,
            oneLine: true,
            minW: 'full',
        },
        {
            type: 'select',
            label: t('DownloadModal.scale'),
            value: scale,
            options: scaleOptions,
            onChange: value => setScale(value as number),
        },
        {
            type: 'select',
            label: t('DownloadModal.format'),
            value: format,
            options: formatOptions,
            onChange: value => setFormat(value as string),
        },
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

            const filename = `rmg.${stnId}.${stationList[stnId].name[0]}.${stationList[stnId].name[1]}`.replaceAll(
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

        // revert to original station
        dispatch(setCurrentStation(currentStationId));
        dispatch(stopLoading());
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('DownloadModal.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <RmgFields fields={fields} />
                </ModalBody>

                <ModalFooter>
                    <HStack>
                        <Button
                            colorScheme="primary"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload('current')}
                            disabled={!canvasToDownload}
                        >
                            {t('DownloadModal.downloadOne')}
                        </Button>
                        {style !== RmgStyle.GZMTR && (
                            <Button
                                colorScheme="primary"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload('all')}
                                disabled={!canvasToDownload}
                            >
                                {t('DownloadModal.downloadAll')}
                            </Button>
                        )}
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
