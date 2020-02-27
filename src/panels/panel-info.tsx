import * as React from 'react';

export default function PanelInfo(props) {
    return (
        <div>
            <h3>Rail Map Generator V3</h3>
            <p>by @wongchito and @thekingofcity</p>
            <a href="https://github.com/wongchito/RailMapGenerator/issues">Feedback</a>
            <p>Notice: Due to copyright, licensing and other legal restrictions, Rail Map Generator uses Noto Serif CJK and Vegur instead of MTRSung and Myriad Pro respectively for MTR-style maps. If you have obtained the license of either font, please feel free to edit the relevant code chunk of the exported SVG file.</p>
            <p>All flag emojis shown on Windows platforms are designed by <a href="https://openmoji.org/">OpenMoji</a> – the open-source emoji and icon project. License: <a href="https://creativecommons.org/licenses/by-sa/4.0/#">CC BY-SA 4.0</a></p>
        </div>
    )
}