import React from 'react';
import {
    Avatar,
    Button,
    Flex,
    Heading,
    Icon,
    Link,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    OrderedList,
    Tag,
    TagLabel,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';

const CONTRIBUTORS_LIST = [
    'jealousyge',
    'Jay20081229',
    'clearng-kly',
    'Dingdong2334',
    '52PD',
    'linchen1965',
    'C1P918R',
    'AnDanJune\nUnderline',
    'GrassRabbit\n1410',
    'xiany114514',
    'Andy1782010',
    'Thomastzc',
    'Tianxiu11111',
];

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal(props: HelpModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('Help and support')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Heading as="h5" size="sm" mb={2}>
                        {t('Terms and conditions')}
                    </Heading>

                    <OrderedList>
                        <ListItem>
                            The layout of the elements on the signage or rail map, is designed by{' '}
                            <Link color="teal.500" href="https://www.gzmtr.com/" isExternal={true}>
                                Guangzhou Metro Group <Icon as={MdOpenInNew} />
                            </Link>
                            {', '}
                            <Link color="teal.500" href="https://www.mtr.com.hk/" isExternal={true}>
                                MTR Corporation <Icon as={MdOpenInNew} />
                            </Link>
                            {' or '}
                            <Link color="teal.500" href="https://www.shmetro.com/" isExternal={true}>
                                Shanghai Shentong Metro Group <Icon as={MdOpenInNew} />
                            </Link>
                            , depending on your selection. You shall grant appropriate permit or license from the
                            relevant company above before using the generated images for commercial purposes, if it is
                            required to do so.
                            <br />
                            標誌版或路線圖之元素之佈局，基於你所選擇之風格，為
                            <Link color="teal.500" href="https://www.gzmtr.com/" isExternal={true}>
                                廣州地鐵集團公司 <Icon as={MdOpenInNew} />
                            </Link>
                            ，
                            <Link color="teal.500" href="https://www.mtr.com.hk/" isExternal={true}>
                                港鐵公司 <Icon as={MdOpenInNew} />
                            </Link>
                            或
                            <Link color="teal.500" href="https://www.shmetro.com/" isExternal={true}>
                                上海申通地鐵集團 <Icon as={MdOpenInNew} />
                            </Link>
                            所設計。在產生之圖像用作商業用途前，你應向相關公司取得適當之許可證或授權。
                        </ListItem>
                        <ListItem>
                            The elements including shapes and lines on the image are drawn by{' '}
                            <Link color="teal.500" href="https://www.github.com/wongchito" isExternal={true}>
                                Chito Wong <Icon as={MdOpenInNew} />
                            </Link>
                            {' and '}
                            <Link color="teal.500" href="https://www.github.com/thekingofcity" isExternal={true}>
                                thekingofcity <Icon as={MdOpenInNew} />
                            </Link>
                            , based on the design standards or rules of the companies listed above. You may use them for
                            any purposes, but it is recommended to state the name and the link of software alongside.
                            <br />
                            圖像之元素，包括圖形及線條，均由
                            <Link color="teal.500" href="https://www.github.com/wongchito" isExternal={true}>
                                Chito Wong <Icon as={MdOpenInNew} />
                            </Link>
                            及
                            <Link color="teal.500" href="https://www.github.com/thekingofcity" isExternal={true}>
                                thekingofcity <Icon as={MdOpenInNew} />
                            </Link>
                            基於上述公司之設計標準或準則繪製。你可將其用於任何目的，但我們建議你於使用同時附以我們之名字以及該軟件之連結。
                        </ListItem>
                        <ListItem>
                            Due to copyright, licensing and other legal restrictions, Rail Map Generator uses{' '}
                            <Link color="teal.500" href="https://github.com/ButTaiwan/genyo-font" isExternal={true}>
                                GenYoMin provided by ButTaiwan <Icon as={MdOpenInNew} />
                            </Link>
                            , and Vegur instead of MTRSung and Myriad Pro respectively to display and generate MTR-style
                            signage. You shall grant appropriate permit or license from the manufacturers before using
                            those generated images for commercial purposes.
                            <br />
                            由於著作權及其他法律限制，鐵路路線圖產生器使用
                            <Link color="teal.500" href="https://github.com/ButTaiwan/genyo-font" isExternal={true}>
                                由ButTaiwan提供之源樣明體 <Icon as={MdOpenInNew} />
                            </Link>
                            ，以及Vegur，以代替港鐵樣式標誌牌所使用之地鐵宋及Myriad
                            Pro。在產生之圖像用作商業用途前，你應向字型生產廠商取得適當之許可證或授權。
                        </ListItem>
                        <ListItem>
                            The exported images in PNG or SVG format may be modified, published, or used for other
                            purposes, under the conditions above.
                            <br />
                            輸出之PNG或SVG種類之圖像可基於上述條款，用於修改、發行或其他用途。
                        </ListItem>
                        <ListItem>
                            All flag emojis shown on Windows platforms are designed by{' '}
                            <Link color="teal.500" href="https://openmoji.org/" isExternal={true}>
                                OpenMoji <Icon as={MdOpenInNew} />
                            </Link>{' '}
                            – the open-source emoji and icon project. License:
                            <Link
                                color="teal.500"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                                isExternal={true}
                            >
                                CC BY-SA 4.0 <Icon as={MdOpenInNew} />
                            </Link>
                            <br />
                            於Windows作業系統上顯示之旗幟Emoji為
                            <Link color="teal.500" href="https://openmoji.org/" isExternal={true}>
                                OpenMoji <Icon as={MdOpenInNew} />
                            </Link>
                            所設計。許可證：
                            <Link
                                color="teal.500"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                                isExternal={true}
                            >
                                CC BY-SA 4.0 <Icon as={MdOpenInNew} />
                            </Link>
                        </ListItem>
                        <ListItem>
                            We reserve the rights, without prior notice, to modify, add, or remove these terms. The
                            Chinese translation is for reference only. In case of any discrepancy between the English
                            version and the Chinese version, the English version shall prevail.
                            <br />
                            我們保留修改、新增或移除上述條款之權利，而無需另行通知。中文譯本僅供參考，文義如與英文有歧異，概以英文本為準。
                        </ListItem>
                    </OrderedList>

                    <Heading as="h5" size="sm" mt={3} mb={2}>
                        {t('Contributors')}
                    </Heading>

                    <Heading as="h6" size="xs" my={1}>
                        {t('Core contributors')}
                    </Heading>

                    <VStack>
                        <Tag size="lg" minW="80%">
                            <Avatar src="https://github.com/wongchito.png" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel>
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    Chito Wong
                                </Text>
                                <Text fontSize="sm">Project initiator</Text>
                                <Text fontSize="sm">Author of MTR and Guangzhou Metro styles</Text>
                            </TagLabel>
                        </Tag>
                        <Tag size="lg" minW="80%">
                            <Avatar src="https://github.com/thekingofcity.png" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel>
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    thekingofcity
                                </Text>
                                <Text fontSize="sm">Author of Shanghai Metro style</Text>
                                <Text fontSize="sm">Desktop version (Electron) maintaner</Text>
                            </TagLabel>
                        </Tag>
                    </VStack>

                    <Heading as="h6" size="xs" my={1}>
                        {t('Other contributors')}
                    </Heading>

                    <Flex wrap="wrap">
                        {CONTRIBUTORS_LIST.map(contributor => (
                            <Tag key={contributor} size="lg" mb={1} mr={1}>
                                <Avatar
                                    src={`https://github.com/${contributor.replaceAll('\n', '')}.png`}
                                    size="xs"
                                    ml={-1}
                                    mr={2}
                                />
                                <TagLabel>{contributor}</TagLabel>
                            </Tag>
                        ))}
                    </Flex>

                    <Text>
                        {t('Visit')}{' '}
                        <Link
                            color="teal.500"
                            href="https://github.com/railmapgen/rmg/wiki/How-to-add-color-palette-and-line-templates"
                            isExternal={true}
                        >
                            {t('Contribution Wiki')} <Icon as={MdOpenInNew} />
                        </Link>
                        {t(', open an issue and join us today!')}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="teal"
                        onClick={() => window.open('https://github.com/railmapgen/rmg', '_blank')}
                    >
                        {t('Visit GitHub')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
