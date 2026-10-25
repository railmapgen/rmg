// 上海地铁 SVG 画布：浦江线过滤效果。
import React from 'react';

/**
 * 浦江线白色经过线的轮廓滤镜。
 */
const PujiangLineDefs = () =>
    React.useMemo(
        () => (
            <filter
                id="pujiang_outline"
                colorInterpolationFilters="sRGB"
                // 待办：在保证滤镜正常工作的同时移除绝对值处理
                filterUnits="userSpaceOnUse"
                x="0"
                y="-1000"
                width="5000"
                height="2000"
            >
                {/* 将经过线的灰色替换为白色。
                https://stackoverflow.com/questions/41639049/replace-one-color-using-svg-filters */}
                <feComponentTransfer in="SourceGraphic">
                    <feFuncR
                        type="discrete"
                        tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                    />
                    <feFuncG
                        type="discrete"
                        tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                    />
                    <feFuncB
                        type="discrete"
                        tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                    />
                </feComponentTransfer>
                <feColorMatrix
                    type="matrix"
                    values="1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            1 1 1 1 -3"
                    result="selectedColor"
                />

                {/* 围绕经过线绘制轮廓。
                https://stackoverflow.com/questions/49693471/svg-border-outline-for-group-of-elements
                同时参阅 #181，了解为何不直接描边经过线元素。 */}
                <feMorphology operator="erode" in="selectedColor" radius="0" result="e1" />
                <feMorphology operator="erode" in="selectedColor" radius="1" result="e2" />
                <feComposite in="e1" in2="e2" operator="xor" result="uncoloredOutline" />
                {/* 由于经过线为白色，需要把轮廓重新着色为黑色。 */}
                <feFlood floodColor="rgb(0,0,0)" />
                <feComposite operator="in" in2="uncoloredOutline" result="outline" />
                {/* 将轮廓作用于白色而非灰色经过线。 */}
                <feComposite in="outline" in2="selectedColor" operator="over" result="result" />
                {/* 把带轮廓的白色经过线叠加到原线路。 */}
                <feComposite in="result" in2="SourceGraphic" operator="over" />
            </filter>
        ),
        []
    );

PujiangLineDefs.displayName = 'PujiangLineDefs';

export default PujiangLineDefs;
