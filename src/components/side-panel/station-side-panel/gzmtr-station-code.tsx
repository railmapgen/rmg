import classes from './gzmtr-station-code.module.css';
import { ColourHex } from '@railmapgen/rmg-palette-resources';

interface GzmtrStationCodeProps {
    lineNumber: string;
    stationNumber: string;
    lineColour: ColourHex;
}

export default function GzmtrStationCode(props: GzmtrStationCodeProps) {
    const { lineNumber, stationNumber, lineColour } = props;

    return (
        <div className={classes.root} style={{ ['--gzmtr-station-code-border-color' as any]: lineColour }}>
            <span>{lineNumber}</span>
            <span>{stationNumber}</span>
        </div>
    );
}
