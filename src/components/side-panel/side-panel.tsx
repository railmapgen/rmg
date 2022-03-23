import React from 'react';
import { useAppSelector } from '../../redux';
import { setSidePanelMode } from '../../redux/app/action';
import { useDispatch } from 'react-redux';
import { Alert, AlertIcon, CloseButton, Flex } from '@chakra-ui/react';
import { SidePanelMode } from '../../constants/constants';
import StationSidePanel from './station-side-panel/station-side-panel';
import StyleSidePanel from './style-side-panel/style-side-panel';
import ColineSidePanel from './coline-side-panel/coline-side-panel';

const SIDE_PANEL_WIDTH = 320;

export default function SidePanel() {
    const dispatch = useDispatch();

    const { sidePanelMode, selectedStation } = useAppSelector(state => state.app);
    const name = useAppSelector(state => state.param.stn_list[selectedStation]?.name);

    const mode: { [key in SidePanelMode]: { name: string; component?: JSX.Element } } = {
        [SidePanelMode.STATION]: { name: name?.[0] + ' - ' + name?.[1], component: <StationSidePanel /> },
        [SidePanelMode.STYLE]: { name: 'Edit style', component: <StyleSidePanel /> },
        [SidePanelMode.COLINE]: { name: 'Edit sharing track', component: <ColineSidePanel /> },
        [SidePanelMode.CLOSE]: { name: 'Close', component: undefined },
    };

    const handleClose = () => {
        dispatch(setSidePanelMode(SidePanelMode.CLOSE));
    };

    return (
        <Flex
            as="section"
            height="100%"
            maxW={sidePanelMode !== SidePanelMode.CLOSE ? SIDE_PANEL_WIDTH : 0}
            visibility={sidePanelMode !== SidePanelMode.CLOSE ? 'initial' : 'hidden'}
            position="relative"
            boxShadow="lg"
            shrink={0}
            direction="column"
            transition="0.3s"
        >
            <Flex direction="column" w={SIDE_PANEL_WIDTH} h="100%">
                <Alert status="info" variant="solid" size="xs" flexShrink={0} pl={3} pr={1} pb={0} pt={0}>
                    <AlertIcon />
                    {mode[sidePanelMode].name}
                    <CloseButton ml="auto" onClick={handleClose} />
                </Alert>

                {mode[sidePanelMode]?.component}
            </Flex>
        </Flex>
    );
}
