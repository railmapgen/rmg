import { Anchor, Button, Group, List, Modal, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpModal(props: HelpModalProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    return (
        <Modal opened={isOpen} onClose={onClose} size="xl" title={t('Help and support')}>
            <Title order={3} size="h6">
                {t('Terms and conditions')}
            </Title>

            <List type="ordered" withPadding spacing="xs" styles={{ itemWrapper: { marginRight: '24px' } }}>
                <List.Item>
                    The layout of the elements on the signage or rail map, is designed by{' '}
                    <Anchor href="https://www.gzmtr.com/" target="_blank" rel="noopener noreferrer">
                        Guangzhou Metro Group <MdOpenInNew />
                    </Anchor>
                    {', '}
                    <Anchor href="https://www.mtr.com.hk/" target="_blank" rel="noopener noreferrer">
                        MTR Corporation <MdOpenInNew />
                    </Anchor>
                    {' or '}
                    <Anchor href="https://www.shmetro.com/" target="_blank" rel="noopener noreferrer">
                        Shanghai Shentong Metro Group <MdOpenInNew />
                    </Anchor>
                    , depending on your selection. You shall grant appropriate permit or license from the relevant
                    company above before using the generated images for commercial purposes, if it is required to do so.
                    <br />
                    標誌版或路線圖之元素之佈局，基於你所選擇之風格，為
                    <Anchor href="https://www.gzmtr.com/" target="_blank" rel="noopener noreferrer">
                        廣州地鐵集團公司 <MdOpenInNew />
                    </Anchor>
                    ，
                    <Anchor href="https://www.mtr.com.hk/" target="_blank" rel="noopener noreferrer">
                        港鐵公司 <MdOpenInNew />
                    </Anchor>
                    或
                    <Anchor href="https://www.shmetro.com/" target="_blank" rel="noopener noreferrer">
                        上海申通地鐵集團 <MdOpenInNew />
                    </Anchor>
                    所設計。在產生之圖像用作商業用途前，你應向相關公司取得適當之許可證或授權。
                </List.Item>
                <List.Item>
                    The elements including shapes and lines on the image are drawn by{' '}
                    <Anchor href="https://www.github.com/wongchito" target="_blank" rel="noopener noreferrer">
                        Chito Wong <MdOpenInNew />
                    </Anchor>
                    {' and '}
                    <Anchor href="https://www.github.com/thekingofcity" target="_blank" rel="noopener noreferrer">
                        thekingofcity <MdOpenInNew />
                    </Anchor>
                    , based on the design standards or rules of the companies listed above. You may use them for any
                    purposes, but it is recommended to state the name and the link of software alongside.
                    <br />
                    圖像之元素，包括圖形及線條，均由
                    <Anchor href="https://www.github.com/wongchito" target="_blank" rel="noopener noreferrer">
                        Chito Wong <MdOpenInNew />
                    </Anchor>
                    及
                    <Anchor href="https://www.github.com/thekingofcity" target="_blank" rel="noopener noreferrer">
                        thekingofcity <MdOpenInNew />
                    </Anchor>
                    基於上述公司之設計標準或準則繪製。你可將其用於任何目的，但我們建議你於使用同時附以我們之名字以及該軟件之連結。
                </List.Item>
                <List.Item>
                    Due to copyright, licensing and other legal restrictions, Rail Map Generator uses{' '}
                    <Anchor href="https://github.com/ButTaiwan/genyo-font" target="_blank" rel="noopener noreferrer">
                        GenYoMin provided by ButTaiwan <MdOpenInNew />
                    </Anchor>
                    , and Vegur instead of MTRSung and Myriad Pro respectively to display and generate MTR-style
                    signage. You shall grant appropriate permit or license from the manufacturers before using those
                    generated images for commercial purposes.
                    <br />
                    由於著作權及其他法律限制，鐵路路線圖產生器使用
                    <Anchor href="https://github.com/ButTaiwan/genyo-font" target="_blank" rel="noopener noreferrer">
                        由ButTaiwan提供之源樣明體 <MdOpenInNew />
                    </Anchor>
                    ，以及Vegur，以代替港鐵樣式標誌牌所使用之地鐵宋及Myriad
                    Pro。在產生之圖像用作商業用途前，你應向字型生產廠商取得適當之許可證或授權。
                </List.Item>
                <List.Item>
                    The exported images in PNG or SVG format may be modified, published, or used for other purposes,
                    under the conditions above.
                    <br />
                    輸出之PNG或SVG種類之圖像可基於上述條款，用於修改、發行或其他用途。
                </List.Item>
                <List.Item>
                    We reserve the rights, without prior notice, to modify, add, or remove these terms. The Chinese
                    translation is for reference only. In case of any discrepancy between the English version and the
                    Chinese version, the English version shall prevail.
                    <br />
                    我們保留修改、新增或移除上述條款之權利，而無需另行通知。中文譯本僅供參考，文義如與英文有歧異，概以英文本為準。
                </List.Item>
            </List>

            <Group mt="xs">
                <Button
                    component="a"
                    ml="auto"
                    href="https://github.com/railmapgen/rmg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('Visit GitHub')}
                </Button>
            </Group>
        </Modal>
    );
}
